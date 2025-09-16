import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TicketUpdate = sequelize.define('ticket_updates', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tickets',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'acknowledged', 'in_progress', 'resolved', 'rejected'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default TicketUpdate;