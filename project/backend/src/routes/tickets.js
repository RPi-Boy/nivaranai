import express from 'express';
import multer from 'multer';
import path from 'path';
import ticketController from '../controllers/ticketController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateRequest, ticketSchema, updateTicketSchema } from '../middleware/validation.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// Citizen routes
router.post('/', 
  authenticate, 
  upload.array('images', 5), 
  validateRequest(ticketSchema), 
  ticketController.createTicket
);

router.get('/my-tickets', authenticate, ticketController.getUserTickets);
router.get('/:id', authenticate, ticketController.getTicket);

// Admin routes
router.put('/:id/status', 
  authenticate, 
  authorize('admin', 'department_head'), 
  validateRequest(updateTicketSchema), 
  ticketController.updateTicketStatus
);

router.put('/:id/assign', 
  authenticate, 
  authorize('admin', 'department_head'), 
  ticketController.assignTicket
);

export default router;