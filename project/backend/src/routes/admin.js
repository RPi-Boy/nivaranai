import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin/department_head role
router.use(authenticate);
router.use(authorize('admin', 'department_head'));

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/tickets', adminController.getAllTickets);
router.get('/tickets/:id', adminController.getTicketDetails);
router.get('/users', adminController.getDepartmentUsers);
router.get('/analytics', adminController.getAnalytics);

export default router;