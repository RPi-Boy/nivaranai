import { Ticket } from '../models/index.js';

export const generateTicketNumber = async () => {
  const prefix = 'CMP';
  const timestamp = Date.now().toString().slice(-6);
  let ticketNumber = `${prefix}${timestamp}`;
  
  // Ensure uniqueness
  let counter = 1;
  while (await Ticket.findOne({ where: { ticket_number: ticketNumber } })) {
    ticketNumber = `${prefix}${timestamp}${counter.toString().padStart(2, '0')}`;
    counter++;
  }
  
  return ticketNumber;
};

export const formatResponse = (success, message, data = null, errors = null) => {
  const response = { success, message };
  if (data) response.data = data;
  if (errors) response.errors = errors;
  return response;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};