const express = require('express');
const router = express.Router();
const {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  getSupportStats,
  getUserSupportTickets,
  trackTicketByTicketId
} = require('../controllers/supportController');
const { authenticate } = require('../middlewares/authenticate');
const verifyRole = require('../middlewares/verifyeRole');

// Test route to verify support routes are loaded
router.get('/test', (req, res) => {
  res.json({ message: 'Support routes are working!' });
});

// Debug route to list all tickets (for testing)
router.get('/debug/all', async (req, res) => {
  try {
    const tickets = await require('../models/SupportTicket').find({}).select('ticketId subject status createdAt');
    res.json({ 
      message: 'All tickets in database', 
      count: tickets.length,
      tickets: tickets 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public routes (no authentication required)
router.post('/ticket', createSupportTicket);
router.get('/track/:ticketId', trackTicketByTicketId);

// Protected routes (authentication required)
router.get('/my-tickets', authenticate, getUserSupportTickets);
router.get('/ticket/:ticketId', authenticate, getSupportTicketById);

// Admin only routes
router.get('/tickets', authenticate, verifyRole('admin'), getAllSupportTickets);
router.put('/ticket/:ticketId', authenticate, verifyRole('admin'), updateSupportTicket);
router.get('/stats', authenticate, verifyRole('admin'), getSupportStats);

module.exports = router;
