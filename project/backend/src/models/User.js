import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15]
    }
  },
  role: {
    type: DataTypes.ENUM('citizen', 'admin', 'department_head'),
    defaultValue: 'citizen'
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE
  },
  fcm_token: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;