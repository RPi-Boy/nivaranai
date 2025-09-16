import logger from '../utils/logger.js';

class NotificationService {
  constructor() {
    this.fcmServerKey = process.env.FCM_SERVER_KEY;
  }

  async sendPushNotification(fcmToken, title, body, data = {}) {
    try {
      // In a real implementation, you would use Firebase Admin SDK
      // This is a placeholder for the notification logic
      
      const payload = {
        to: fcmToken,
        notification: {
          title,
          body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png'
        },
        data
      };

      logger.info('Push notification sent', { fcmToken, title, body });
      
      // Simulate successful notification
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (error) {
      logger.error('Failed to send push notification', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  async notifyTicketCreated(user, ticket) {
    if (user.fcm_token) {
      await this.sendPushNotification(
        user.fcm_token,
        'Ticket Created Successfully',
        `Your complaint #${ticket.ticket_number} has been submitted and is being reviewed.`,
        {
          type: 'ticket_created',
          ticket_id: ticket.id,
          ticket_number: ticket.ticket_number
        }
      );
    }
  }

  async notifyTicketStatusUpdate(user, ticket, oldStatus, newStatus) {
    if (user.fcm_token) {
      const statusMessages = {
        acknowledged: 'Your complaint has been acknowledged by the authorities.',
        in_progress: 'Work has started on resolving your complaint.',
        resolved: 'Your complaint has been resolved. Thank you for your patience!',
        rejected: 'Your complaint has been reviewed and rejected.'
      };

      await this.sendPushNotification(
        user.fcm_token,
        'Ticket Status Updated',
        `Complaint #${ticket.ticket_number}: ${statusMessages[newStatus]}`,
        {
          type: 'status_update',
          ticket_id: ticket.id,
          ticket_number: ticket.ticket_number,
          old_status: oldStatus,
          new_status: newStatus
        }
      );
    }
  }

  async notifyAdminNewTicket(adminUsers, ticket) {
    const notifications = adminUsers.map(admin => {
      if (admin.fcm_token) {
        return this.sendPushNotification(
          admin.fcm_token,
          'New Ticket Assigned',
          `New ${ticket.priority} priority ticket: ${ticket.title}`,
          {
            type: 'new_assignment',
            ticket_id: ticket.id,
            ticket_number: ticket.ticket_number,
            priority: ticket.priority
          }
        );
      }
    });

    await Promise.all(notifications.filter(Boolean));
  }
}

export default new NotificationService();