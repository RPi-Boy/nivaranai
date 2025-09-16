import { Op } from 'sequelize';
import { Ticket, User, TicketUpdate } from '../models/index.js';
import logger from '../utils/logger.js';

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const stats = await Promise.all([
        Ticket.count(),
        Ticket.count({ where: { status: 'pending' } }),
        Ticket.count({ where: { status: 'in_progress' } }),
        Ticket.count({ where: { status: 'resolved' } }),
        Ticket.count({ 
          where: { 
            created_at: { 
              [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) 
            } 
          } 
        })
      ]);

      const [total, pending, inProgress, resolved, todayCount] = stats;

      // Get category breakdown
      const categoryStats = await Ticket.findAll({
        attributes: [
          'category',
          [Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('id')), 'count']
        ],
        group: ['category']
      });

      // Get priority breakdown
      const priorityStats = await Ticket.findAll({
        attributes: [
          'priority',
          [Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('id')), 'count']
        ],
        group: ['priority']
      });

      res.json({
        success: true,
        data: {
          overview: {
            total,
            pending,
            in_progress: inProgress,
            resolved,
            today: todayCount
          },
          categories: categoryStats.map(stat => ({
            category: stat.category,
            count: parseInt(stat.dataValues.count)
          })),
          priorities: priorityStats.map(stat => ({
            priority: stat.priority,
            count: parseInt(stat.dataValues.count)
          }))
        }
      });
    } catch (error) {
      logger.error('Get dashboard stats failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard stats',
        error: error.message
      });
    }
  }

  async getAllTickets(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        category, 
        priority, 
        department,
        search,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      // Apply filters
      if (status) whereClause.status = status;
      if (category) whereClause.category = category;
      if (priority) whereClause.priority = priority;
      if (department) whereClause.assigned_department = department;
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { ticket_number: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Department filter for department heads
      if (req.user.role === 'department_head' && req.user.department) {
        whereClause.assigned_department = req.user.department;
      }

      const { count, rows: tickets } = await Ticket.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'citizen',
            attributes: ['id', 'name', 'email', 'phone']
          },
          {
            model: User,
            as: 'assignee',
            attributes: ['id', 'name', 'department']
          }
        ],
        order: [[sort_by, sort_order.toUpperCase()]],
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
      logger.error('Get all tickets failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get tickets',
        error: error.message
      });
    }
  }

  async getTicketDetails(req, res) {
    try {
      const { id } = req.params;

      const ticket = await Ticket.findByPk(id, {
        include: [
          {
            model: User,
            as: 'citizen',
            attributes: ['id', 'name', 'email', 'phone']
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
              attributes: ['id', 'name', 'role', 'department']
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

      // Check department access for department heads
      if (req.user.role === 'department_head' && 
          req.user.department !== ticket.assigned_department) {
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
      logger.error('Get ticket details failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get ticket details',
        error: error.message
      });
    }
  }

  async getDepartmentUsers(req, res) {
    try {
      const { department } = req.query;
      
      const whereClause = {
        role: { [Op.in]: ['admin', 'department_head'] },
        is_active: true
      };

      if (department) {
        whereClause.department = department;
      }

      const users = await User.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'department', 'role']
      });

      res.json({
        success: true,
        data: { users }
      });
    } catch (error) {
      logger.error('Get department users failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get department users',
        error: error.message
      });
    }
  }

  async getAnalytics(req, res) {
    try {
      const { period = '30d' } = req.query;
      
      let dateFilter;
      switch (period) {
        case '7d':
          dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          dateFilter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }

      // Resolution time analytics
      const resolvedTickets = await Ticket.findAll({
        where: {
          status: 'resolved',
          resolved_at: { [Op.gte]: dateFilter }
        },
        attributes: ['created_at', 'resolved_at', 'category', 'priority']
      });

      const resolutionTimes = resolvedTickets.map(ticket => ({
        category: ticket.category,
        priority: ticket.priority,
        resolution_time: Math.round(
          (new Date(ticket.resolved_at) - new Date(ticket.created_at)) / (1000 * 60 * 60)
        ) // hours
      }));

      // Average resolution time by category
      const avgResolutionByCategory = {};
      resolutionTimes.forEach(item => {
        if (!avgResolutionByCategory[item.category]) {
          avgResolutionByCategory[item.category] = [];
        }
        avgResolutionByCategory[item.category].push(item.resolution_time);
      });

      Object.keys(avgResolutionByCategory).forEach(category => {
        const times = avgResolutionByCategory[category];
        avgResolutionByCategory[category] = Math.round(
          times.reduce((a, b) => a + b, 0) / times.length
        );
      });

      res.json({
        success: true,
        data: {
          resolution_times: avgResolutionByCategory,
          total_resolved: resolvedTickets.length,
          period
        }
      });
    } catch (error) {
      logger.error('Get analytics failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics',
        error: error.message
      });
    }
  }
}

export default new AdminController();