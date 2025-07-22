const SupportTicket = require('../models/SupportTicket');
const mongoose = require('mongoose');
const { sendTicketConfirmationEmail, sendTicketStatusUpdateEmail } = require('../utils/emailService');

// Create a new support ticket
const createSupportTicket = async (req, res) => {
  try {
    console.log('Creating support ticket with data:', req.body);
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    const { name, email, subject, category, message, priority = 'medium' } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !category || !message) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'All required fields must be provided' 
      });
    }

    console.log('Creating new SupportTicket instance');
    
    // Generate ticketId manually 
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = 'TS' + timestamp + randomString;
    console.log('Generated ticketId manually:', ticketId);
    
    // Create new ticket
    const ticket = new SupportTicket({
      ticketId,
      name,
      email,
      subject,
      category,
      message,
      priority,
      userId: req.user ? req.user._id : null
    });

    console.log('Saving ticket to database');
    await ticket.save();
    console.log('Ticket saved successfully:', ticket.ticketId);

    // Send confirmation email
    try {
      await sendTicketConfirmationEmail(email, name, ticket.ticketId, subject);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the ticket creation if email fails
    }

    res.status(201).json({
      message: 'Support ticket created successfully',
      ticketId: ticket.ticketId,
      ticket: {
        id: ticket._id,
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create support ticket',
      error: error.message,
      details: error.stack
    });
  }
};

// Track ticket by ticket ID (public route)
const trackTicketByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;
    console.log('Tracking ticket with ID:', ticketId);
    
    const ticket = await SupportTicket.findOne({ ticketId: ticketId })
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name email role')
      .select('-userId'); // Don't expose userId for public tracking

    console.log('Found ticket:', ticket ? ticket.ticketId : 'null');

    if (!ticket) {
      console.log('Ticket not found in database');
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found. Please check your ticket ID.' 
      });
    }

    console.log('Returning ticket data for:', ticket.ticketId);
    res.json({
      success: true,
      message: 'Ticket found successfully',
      ticket: {
        _id: ticket._id,
        ticketId: ticket.ticketId,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone || '',
        subject: ticket.subject,
        description: ticket.message, // Map 'message' field to 'description' for frontend
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        adminComments: ticket.adminComments || [],
        assignedTo: ticket.assignedTo,
        responses: ticket.responses || []
      }
    });

  } catch (error) {
    console.error('Error tracking ticket:', error);
    res.status(500).json({ 
      message: 'Failed to track ticket',
      error: error.message 
    });
  }
};

// Get all support tickets (Admin only)
const getAllSupportTickets = async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 20 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get tickets with filters and pagination
    const tickets = await SupportTicket.find(filter)
      .populate('userId', 'name email role')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalTickets = await SupportTicket.countDocuments(filter);
    const totalPages = Math.ceil(totalTickets / limit);

    res.json({
      tickets,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalTickets,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ 
      message: 'Failed to fetch support tickets',
      error: error.message 
    });
  }
};

// Get a specific support ticket by ID
const getSupportTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await SupportTicket.findOne({ 
      $or: [
        { _id: ticketId },
        { ticketId: ticketId }
      ]
    })
    .populate('userId', 'name email role')
    .populate('assignedTo', 'name email')
    .populate('responses.respondedBy', 'name email role');

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    // Check if user has access to this ticket
    if (req.user.role !== 'admin' && 
        req.user._id.toString() !== ticket.userId?.toString() && 
        req.user.email !== ticket.email) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);

  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ 
      message: 'Failed to fetch support ticket',
      error: error.message 
    });
  }
};

// Update support ticket status (Admin only)
const updateSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, assignedTo, response } = req.body;
    
    const ticket = await SupportTicket.findOne({
      $or: [
        { _id: ticketId },
        { ticketId: ticketId }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    const oldStatus = ticket.status;
    
    // Update fields if provided
    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    
    // Add response if provided
    if (response) {
      ticket.responses.push({
        message: response,
        respondedBy: req.user._id
      });
    }

    await ticket.save();

    // Populate the updated ticket
    await ticket.populate('userId', 'name email role');
    await ticket.populate('assignedTo', 'name email');
    await ticket.populate('responses.respondedBy', 'name email role');

    // Send status update email if status changed
    if (status && status !== oldStatus) {
      try {
        await sendTicketStatusUpdateEmail(
          ticket.email,
          ticket.name,
          ticket.ticketId,
          ticket.subject,
          oldStatus,
          status,
          response
        );
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't fail the update if email fails
      }
    }

    res.json({
      message: 'Support ticket updated successfully',
      ticket
    });

  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({ 
      message: 'Failed to update support ticket',
      error: error.message 
    });
  }
};

// Get support ticket statistics (Admin only)
const getSupportStats = async (req, res) => {
  try {
    // Get ticket counts by status
    const statusStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get ticket counts by priority
    const priorityStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get ticket counts by category
    const categoryStats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent tickets
    const recentTickets = await SupportTicket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate response times for resolved tickets
    const avgResponseTime = await SupportTicket.aggregate([
      {
        $match: { 
          status: { $in: ['resolved', 'closed'] },
          responses: { $exists: true, $ne: [] }
        }
      },
      {
        $project: {
          responseTime: {
            $subtract: [
              { $arrayElemAt: ['$responses.respondedAt', 0] },
              '$createdAt'
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTimeMs: { $avg: '$responseTime' }
        }
      }
    ]);

    const avgResponseHours = avgResponseTime.length > 0 
      ? Math.round(avgResponseTime[0].avgResponseTimeMs / (1000 * 60 * 60)) 
      : 0;

    res.json({
      statusStats: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      priorityStats: priorityStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      categoryStats: categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentTickets,
      avgResponseHours,
      totalTickets: await SupportTicket.countDocuments()
    });

  } catch (error) {
    console.error('Error fetching support statistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch support statistics',
      error: error.message 
    });
  }
};

// Get user's own support tickets
const getUserSupportTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;
    
    const tickets = await SupportTicket.find({
      $or: [
        { userId: userId },
        { email: userEmail }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('assignedTo', 'name email')
    .populate('responses.respondedBy', 'name email role');

    res.json(tickets);

  } catch (error) {
    console.error('Error fetching user support tickets:', error);
    res.status(500).json({ 
      message: 'Failed to fetch your support tickets',
      error: error.message 
    });
  }
};

module.exports = {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicket,
  getSupportStats,
  getUserSupportTickets,
  trackTicketByTicketId
};
