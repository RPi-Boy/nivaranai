import sequelize from '../config/database.js';
import { User, Ticket, TicketUpdate } from '../models/index.js';
import logger from './logger.js';

const migrate = async () => {
  try {
    logger.info('Starting database migration...');
    
    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ force: false });
    logger.info('Database models synchronized successfully.');
    
    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { email: 'admin@nivaran.com' } });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@nivaran.com',
        password: 'admin123',
        role: 'admin',
        department: 'General Administration Department'
      });
      logger.info('Default admin user created.');
    }
    
    logger.info('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();