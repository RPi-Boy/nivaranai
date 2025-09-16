import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ticket = sequelize.define('tickets', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ticket_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'water_leakage',
      'garbage_dump',
      'road_damage',
      'streetlight',
      'health_hazard',
      'traffic_signal',
      'other'
    ),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'acknowledged', 'in_progress', 'resolved', 'rejected'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    defaultValue: 'medium'
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false,
    validate: {
      isValidLocation(value) {
        if (!value.latitude || !value.longitude || !value.address) {
          throw new Error('Location must include latitude, longitude, and address');
        }
      }
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  assigned_department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  citizen_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  ai_classification: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  resolution_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimated_resolution: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default Ticket;