import express from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest, userRegistrationSchema, loginSchema } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRequest(userRegistrationSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/fcm-token', authenticate, authController.updateFCMToken);
router.get('/profile', authenticate, authController.getProfile);

export default router;