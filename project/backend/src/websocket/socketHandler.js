import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import logger from '../utils/logger.js';

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map();
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        
        if (!user || !user.is_active) {
          return next(new Error('Authentication error'));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      this.handleConnection(socket);
    });
  }

  handleConnection(socket) {
    const userId = socket.user.id;
    this.connectedUsers.set(userId, socket.id);
    
    logger.info('User connected via WebSocket', { 
      userId, 
      socketId: socket.id,
      role: socket.user.role 
    });

    // Join user to their personal room
    socket.join(`user_${userId}`);
    
    // Join admin users to admin room
    if (['admin', 'department_head'].includes(socket.user.role)) {
      socket.join('admin_room');
      
      if (socket.user.department) {
        socket.join(`dept_${socket.user.department}`);
      }
    }

    // Handle ticket subscription
    socket.on('subscribe_ticket', (ticketId) => {
      socket.join(`ticket_${ticketId}`);
      logger.info('User subscribed to ticket updates', { userId, ticketId });
    });

    // Handle ticket unsubscription
    socket.on('unsubscribe_ticket', (ticketId) => {
      socket.leave(`ticket_${ticketId}`);
      logger.info('User unsubscribed from ticket updates', { userId, ticketId });
    });

    // Handle typing indicators for ticket comments
    socket.on('typing_start', (data) => {
      socket.to(`ticket_${data.ticketId}`).emit('user_typing', {
        userId,
        userName: socket.user.name,
        ticketId: data.ticketId
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(`ticket_${data.ticketId}`).emit('user_stopped_typing', {
        userId,
        ticketId: data.ticketId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      this.connectedUsers.delete(userId);
      logger.info('User disconnected from WebSocket', { userId, socketId: socket.id });
    });
  }

  // Emit ticket status update to relevant users
  notifyTicketUpdate(ticket, update) {
    // Notify the citizen who created the ticket
    this.io.to(`user_${ticket.citizen_id}`).emit('ticket_updated', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      status: ticket.status,
      update
    });

    // Notify assigned user if any
    if (ticket.assigned_to) {
      this.io.to(`user_${ticket.assigned_to}`).emit('ticket_updated', {
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        status: ticket.status,
        update
      });
    }

    // Notify all users subscribed to this ticket
    this.io.to(`ticket_${ticket.id}`).emit('ticket_status_changed', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      old_status: update.old_status,
      new_status: ticket.status,
      updated_by: update.updated_by,
      notes: update.notes,
      timestamp: new Date()
    });
  }

  // Notify admins of new tickets
  notifyNewTicket(ticket) {
    this.io.to('admin_room').emit('new_ticket_created', {
      ticket_id: ticket.id,
      ticket_number: ticket.ticket_number,
      title: ticket.title,
      category: ticket.category,
      priority: ticket.priority,
      location: ticket.location,
      created_at: ticket.created_at
    });

    // Notify specific department if assigned
    if (ticket.assigned_department) {
      this.io.to(`dept_${ticket.assigned_department}`).emit('new_department_ticket', {
        ticket_id: ticket.id,
        ticket_number: ticket.ticket_number,
        title: ticket.title,
        priority: ticket.priority,
        department: ticket.assigned_department
      });
    }
  }

  // Send real-time notification to specific user
  sendNotificationToUser(userId, notification) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  // Broadcast system announcement
  broadcastAnnouncement(message, targetRole = null) {
    if (targetRole) {
      // Send to specific role
      this.io.sockets.sockets.forEach((socket) => {
        if (socket.user && socket.user.role === targetRole) {
          socket.emit('system_announcement', {
            message,
            timestamp: new Date(),
            type: 'announcement'
          });
        }
      });
    } else {
      // Send to all connected users
      this.io.emit('system_announcement', {
        message,
        timestamp: new Date(),
        type: 'announcement'
      });
    }
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }
}

export default SocketHandler;