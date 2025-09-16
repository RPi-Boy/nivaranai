import { Op } from 'sequelize';
import { Ticket, User, TicketUpdate } from '../models/index.js';
import aiService from '../services/aiService.js';
import notificationService from '../services/notificationService.js';
import logger from '../utils/logger.js';
import { generateTicketNumber } from '../utils/helpers.js';

class TicketController {
  async createTicket(req, res) {
    try {
      const { title, description, category, location } = req.body;
      const images = req.files ? req.files.map(file => file.filename) : [];

      // Generate unique ticket number
      const ticketNumber = await generateTicketNumber();

      // Create ticket
      const ticket = await Ticket.create({
        ticket_number: ticketNumber,
        title,
        description,
        category,
        location,
        images,
        citizen_id: req.user.id
      });

      // AI Classification (async)
      if (images.length > 0) {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${images[0]}`;
        
        aiService.classifyIssue(imageUrl, location, description)
          .then(async (classification) => {
            const priority = aiService.calculatePriority(
              classification.severity, 
              location, 
              description
            );

            await ticket.update({
              priority,
              assigned_department: classification.recommended_department,
              ai_classification: classification
            });

            // Notify relevant admins
            const adminUsers = await User.findAll({
              where: {
                role: { [Op.in]: ['admin', 'department_head'] },
                department: classification.recommended_department,
                is_active: true
              }
            });

            await notificationService.notifyAdminNewTicket(adminUsers, ticket);
          })
          .catch(error => {
            logger.error('AI classification failed for ticket', { 
              ticketId: ticket.id, 
              error: error.message 
            });
          });
      }

      // Notify citizen
      await notificationService.notifyTicketCreated(req.user, ticket);

      logger.info('Ticket created successfully', { 
        ticketId: ticket.id, 
        userId: req.user.id 
      });

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: {
          ticket: {
            id: ticket.id,
            ticket_number: ticket.ticket_number,
            title: ticket.title,
            status: ticket.status,
            priority: ticket.priority,
            created_at: ticket.created_at
          }
        }
      });
    } catch (error) {
      logger.error('Ticket creation failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to create ticket',
        error: error.message
      });
    }
  }

  async getTicket(req, res) {
    try {
      const { id } = req.params;
      
      const ticket = await Ticket.findOne({
        where: { 
          [Op.or]: [
            { id },
            { ticket_number: id }
          ]
        },
        include: [
          {
            model: User,
            as: 'citizen',
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'name', 'email', 'department']
          },
          {
            model: TicketUpdate,
            as: 'updates',
            include: [{
              model: User,
              as: 'updater',
              attributes: ['id', 'name', 'role']
            }],
            order: [['created_at', 'DESC']]
          }
        ]
      });

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }

      // Check permissions
      if (req.user.role === 'citizen' && ticket.citizen_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: { ticket }
      });
    } catch (error) {
      logger.error('Get ticket failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get ticket',
        error: error.message
      });
    }
  }

  async getUserTickets(req, res) {
    try {
      const { page = 1, limit = 10, status, category } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = { citizen_id: req.user.id };
      
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;

      const { count, rows: tickets } = await Ticket.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'assignee',
          attributes: ['name', 'department']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          tickets,
          pagination: {
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            limit: parseInt(limit)
          }
        }
      });
    } catch (error) {
      logger.error('Get user tickets failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get tickets',
        error: error.message
      });
    }
  }

  async updateTicketStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes, estimated_resolution } = req.body;

      const ticket = await Ticket.findByPk(id, {
        include: [{
          model: User,
          as: 'citizen',
          attributes: ['id', 'name', 'fcm_token']
        }]
      });

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }

      const oldStatus = ticket.status;
      
      // Update ticket
      const updateData = { status };
      if (status === 'resolved') {
        updateData.resolved_at = new Date();
        if (notes) updateData.resolution_notes = notes;
      }
      if (estimated_resolution) {
        updateData.estimated_resolution = new Date(estimated_resolution);
      }

      await ticket.update(updateData);

      // Create update record
      await TicketUpdate.create({
        ticket_id: ticket.id,
        updated_by: req.user.id,
        status,
        notes,
        is_public: true
      });

      // Notify citizen
      await notificationService.notifyTicketStatusUpdate(
        ticket.citizen, 
        ticket, 
        oldStatus, 
        status
      );

      logger.info('Ticket status updated', { 
        ticketId: ticket.id, 
        oldStatus, 
        newStatus: status,
        updatedBy: req.user.id 
      });

      res.json({
        success: true,
        message: 'Ticket status updated successfully',
        data: {
          ticket: {
            id: ticket.id,
            ticket_number: ticket.ticket_number,
            status: ticket.status,
            updated_at: ticket.updated_at
          }
        }
      });
    } catch (error) {
      logger.error('Update ticket status failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update ticket status',
        error: error.message
      });
    }
  }

  async assignTicket(req, res) {
    try {
      const { id } = req.params;
      const { assigned_to, department } = req.body;

      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Ticket not found'
        });
      }

      await ticket.update({
        assigned_to,
        assigned_department: department,
        status: ticket.status === 'pending' ? 'acknowledged' : ticket.status
      });

      // Create update record
      await TicketUpdate.create({
        ticket_id: ticket.id,
        updated_by: req.user.id,
        status: 'acknowledged',
        notes: `Ticket assigned to ${department}`,
        is_public: true
      });

      logger.info('Ticket assigned', { 
        ticketId: ticket.id, 
        assignedTo: assigned_to,
        department 
      });

      res.json({
        success: true,
        message: 'Ticket assigned successfully'
      });
    } catch (error) {
      logger.error('Assign ticket failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to assign ticket',
        error: error.message
      });
    }
  }
}

export default new TicketController();