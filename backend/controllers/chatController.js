const Chat = require('../models/Chat');
const User = require('../models/User');

// Generate unique chat ID
const generateChatId = () => {
  return 'CHAT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create or get existing chat
const createOrGetChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has an active chat
    let chat = await Chat.findOne({
      'participants.userId': userId,
      status: { $in: ['active'] }
    });

    if (!chat) {
      // Create new chat
      const chatId = generateChatId();
      chat = new Chat({
        chatId,
        participants: [{
          userId: user._id,
          name: user.name,
          role: user.role
        }],
        messages: [{
          senderName: 'System',
          senderRole: 'system',
          message: `Chat session started. Hello ${user.name}, how can we help you today?`,
          messageType: 'system'
        }]
      });

      await chat.save();
    }

    res.status(200).json({
      success: true,
      chat: {
        chatId: chat.chatId,
        status: chat.status,
        messages: chat.messages,
        lastActivity: chat.lastActivity
      }
    });
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    let chat;
    
    // If user is admin, they can access any chat
    if (user.role === 'admin') {
      chat = await Chat.findOne({ chatId });
    } else {
      // Regular users can only access chats they're participants in
      chat = await Chat.findOne({
        chatId,
        'participants.userId': userId
      });
    }

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json({
      success: true,
      chat: {
        chatId: chat.chatId,
        status: chat.status,
        messages: chat.messages,
        participants: chat.participants,
        lastActivity: chat.lastActivity
      }
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send message (REST endpoint for fallback)
const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    let chat = await Chat.findOne({ chatId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant or admin
    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = user.role === 'admin' || user.role === 'agent';

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: 'Access denied to this chat' });
    }

    // If admin is not a participant but is sending a message, add them as participant
    if (isAdmin && !isParticipant) {
      chat.participants.push({
        userId: user._id,
        name: user.name,
        role: user.role
      });
    }

    const newMessage = {
      senderId: user._id,
      senderName: user.name,
      senderRole: user.role,
      message,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Send media message (voice, images, files)
const sendMediaMessage = async (req, res) => {
  try {
    const { chatId, messageType, fileName } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let chat = await Chat.findOne({ chatId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant or admin
    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = user.role === 'admin' || user.role === 'agent';

    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: 'Access denied to this chat' });
    }

    // If admin is not a participant but is sending a message, add them as participant
    if (isAdmin && !isParticipant) {
      chat.participants.push({
        userId: user._id,
        name: user.name,
        role: user.role
      });
    }

    // Create media message
    let messageText = '';
    let mediaUrl = `/uploads/chat-media/${file.filename}`;

    switch (messageType) {
      case 'voice':
        messageText = '🎤 Voice message';
        break;
      case 'image':
      case 'camera':
        messageText = `🖼️ Image: ${fileName || file.originalname}`;
        break;
      default:
        messageText = `📎 File: ${fileName || file.originalname}`;
    }

    const newMessage = {
      senderId: user._id,
      senderName: user.name,
      senderRole: user.role,
      message: messageText,
      messageType: 'media',
      mediaType: messageType,
      mediaUrl: mediaUrl,
      fileName: fileName || file.originalname,
      fileSize: file.size,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Media sent successfully',
      newMessage,
      mediaUrl
    });
  } catch (error) {
    console.error('Error sending media:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all chats for admin
const getAllChats = async (req, res) => {
  try {
    const { status = 'active', page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const chats = await Chat.find(query)
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('participants.userId', 'name email')
      .populate('assignedTo.userId', 'name email');

    const totalChats = await Chat.countDocuments(query);

    res.status(200).json({
      success: true,
      chats: chats.map(chat => ({
        chatId: chat.chatId,
        status: chat.status,
        priority: chat.priority,
        participants: chat.participants,
        lastMessage: chat.messages[chat.messages.length - 1],
        messageCount: chat.messages.length,
        lastActivity: chat.lastActivity,
        assignedTo: chat.assignedTo,
        createdAt: chat.createdAt
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalChats / limit),
        totalChats,
        hasNext: page < Math.ceil(totalChats / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error getting all chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign chat to admin/agent
const assignChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { assignToUserId } = req.body;
    const adminId = req.user.id;

    const assignToUser = await User.findById(assignToUserId);
    if (!assignToUser || !['admin', 'agent'].includes(assignToUser.role)) {
      return res.status(400).json({ message: 'Invalid user to assign' });
    }

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add admin to participants if not already there
    const adminExists = chat.participants.some(p => p.userId.toString() === assignToUserId);
    if (!adminExists) {
      chat.participants.push({
        userId: assignToUser._id,
        name: assignToUser.name,
        role: assignToUser.role
      });
    }

    chat.assignedTo = {
      userId: assignToUser._id,
      name: assignToUser.name,
      assignedAt: new Date()
    };

    // Add system message about assignment
    chat.messages.push({
      senderId: adminId,
      senderName: 'System',
      senderRole: 'system',
      message: `Chat assigned to ${assignToUser.name}`,
      messageType: 'system'
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat assigned successfully'
    });
  } catch (error) {
    console.error('Error assigning chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update chat status
const updateChatStatus = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;
    const admin = await User.findById(adminId);

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const oldStatus = chat.status;
    chat.status = status;

    // Add system message about status change
    chat.messages.push({
      senderId: admin._id,
      senderName: admin.name,
      senderRole: admin.role,
      message: `Chat status changed from ${oldStatus} to ${status}`,
      messageType: 'system'
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat status updated successfully'
    });
  } catch (error) {
    console.error('Error updating chat status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrGetChat,
  getChatHistory,
  sendMessage,
  sendMediaMessage,
  getAllChats,
  assignChat,
  updateChatStatus
};
