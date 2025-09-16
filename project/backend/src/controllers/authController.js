import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import logger from '../utils/logger.js';

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'citizen'
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      logger.info('User registered successfully', { userId: user.id, email });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      logger.error('Registration failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check password
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      logger.info('User logged in successfully', { userId: user.id, email });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
          },
          token
        }
      });
    } catch (error) {
      logger.error('Login failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  async updateFCMToken(req, res) {
    try {
      const { fcm_token } = req.body;
      
      await req.user.update({ fcm_token });
      
      res.json({
        success: true,
        message: 'FCM token updated successfully'
      });
    } catch (error) {
      logger.error('FCM token update failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to update FCM token',
        error: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      res.json({
        success: true,
        data: {
          user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            department: req.user.department,
            created_at: req.user.created_at
          }
        }
      });
    } catch (error) {
      logger.error('Get profile failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  }
}

export default new AuthController();