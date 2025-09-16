import Joi from 'joi';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const ticketSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().valid(
    'water_leakage',
    'garbage_dump', 
    'road_damage',
    'streetlight',
    'health_hazard',
    'traffic_signal',
    'other'
  ).required(),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    address: Joi.string().min(5).max(500).required()
  }).required()
});

export const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  role: Joi.string().valid('citizen', 'admin', 'department_head').default('citizen')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateTicketSchema = Joi.object({
  status: Joi.string().valid('pending', 'acknowledged', 'in_progress', 'resolved', 'rejected').required(),
  notes: Joi.string().max(1000).optional(),
  estimated_resolution: Joi.date().optional()
});