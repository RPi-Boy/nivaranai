import User from './User.js';
import Ticket from './Ticket.js';
import TicketUpdate from './TicketUpdate.js';

// Define associations
User.hasMany(Ticket, { foreignKey: 'citizen_id', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'citizen_id', as: 'citizen' });

User.hasMany(Ticket, { foreignKey: 'assigned_to', as: 'assigned_tickets' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Ticket.hasMany(TicketUpdate, { foreignKey: 'ticket_id', as: 'updates' });
TicketUpdate.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });

User.hasMany(TicketUpdate, { foreignKey: 'updated_by', as: 'updates' });
TicketUpdate.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

export { User, Ticket, TicketUpdate };