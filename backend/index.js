const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const donorRoutes = require('./routes/donorRoutes');
const agentRoutes = require('./routes/agentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supportRoutes = require('./routes/supportRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
const Chat = require('./models/Chat');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      process.env.FRONTEND_URL_2 || 'http://localhost:5174',
      'http://localhost:3000',
      'https://tummy-smiles-fq0lm3w5h-shailendra-shukla.vercel.app',
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());

// Serve static files for media uploads
app.use('/uploads', express.static('uploads'));

// Dynamic CORS configuration for development and production
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL_2 || 'http://localhost:5174',
  'http://localhost:3000', // Additional local dev port
  'https://tummy-smiles-fq0lm3w5h-shailendra-shukla.vercel.app', // Your current Vercel deployment
];

// Add production frontend URLs if in production
if (process.env.NODE_ENV === 'production') {
  // Add your Vercel domain here when you deploy
  allowedOrigins.push('https://tummy-smiles-fq0lm3w5h-shailendra-shukla.vercel.app');
  allowedOrigins.push('https://tummysmiles.vercel.app'); // If you get a custom domain
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id.toString();
    socket.userName = user.name;
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

// Socket.io connection handling
io.use(authenticateSocket);

const activeUsers = new Map(); // Track active users

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userName} (${socket.userRole})`);
  
  // Add user to active users
  activeUsers.set(socket.userId, {
    socketId: socket.id,
    userName: socket.userName,
    userRole: socket.userRole,
    lastSeen: new Date()
  });

  // Broadcast online status to admins
  io.emit('userOnlineStatus', {
    userId: socket.userId,
    userName: socket.userName,
    status: 'online'
  });

  // Join chat room
  socket.on('joinChat', async (chatId) => {
    try {
      const chat = await Chat.findOne({
        chatId,
        'participants.userId': socket.userId
      });

      if (chat) {
        socket.join(chatId);
        socket.currentChatId = chatId;
        console.log(`${socket.userName} joined chat: ${chatId}`);
        
        // Notify others in the chat about user joining
        socket.to(chatId).emit('userJoinedChat', {
          userName: socket.userName,
          userRole: socket.userRole
        });
      }
    } catch (error) {
      console.error('Error joining chat:', error);
    }
  });

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, message } = data;
      
      let chat = await Chat.findOne({ chatId });

      if (!chat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }

      // Check if user is participant or admin
      const isParticipant = chat.participants.some(p => p.userId.toString() === socket.userId);
      const isAdmin = socket.userRole === 'admin' || socket.userRole === 'agent';

      if (!isParticipant && !isAdmin) {
        socket.emit('error', { message: 'Access denied to this chat' });
        return;
      }

      // If admin is not a participant but is sending a message, add them as participant
      if (isAdmin && !isParticipant) {
        chat.participants.push({
          userId: socket.userId,
          name: socket.userName,
          role: socket.userRole
        });
      }

      const newMessage = {
        senderId: socket.userId,
        senderName: socket.userName,
        senderRole: socket.userRole,
        message,
        timestamp: new Date()
      };

      console.log('Sending message with senderId:', socket.userId, 'senderName:', socket.userName, 'role:', socket.userRole);

      chat.messages.push(newMessage);
      await chat.save();

      // Emit message to all users in the chat
      io.to(chatId).emit('newMessage', {
        ...newMessage,
        chatId
      });

      // Notify admins about new message from users
      if (socket.userRole === 'donor' || socket.userRole === 'user') {
        const adminMessage = {
          type: 'newChatMessage',
          chatId,
          senderName: socket.userName,
          message,
          timestamp: new Date()
        };
        
        // Send to all connected admins
        Array.from(activeUsers.entries()).forEach(([userId, userData]) => {
          if (userData.userRole === 'admin') {
            io.to(userData.socketId).emit('adminNotification', adminMessage);
          }
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle admin joining chat
  socket.on('adminJoinChat', async (chatId) => {
    try {
      const chat = await Chat.findOne({ chatId });
      
      if (chat && ['admin', 'agent'].includes(socket.userRole)) {
        // Add admin to participants if not already there
        const adminExists = chat.participants.some(p => p.userId.toString() === socket.userId);
        if (!adminExists) {
          chat.participants.push({
            userId: socket.userId,
            name: socket.userName,
            role: socket.userRole
          });
          await chat.save();
        }

        socket.join(chatId);
        socket.currentChatId = chatId;
        
        // Notify user that admin joined
        socket.to(chatId).emit('adminJoinedChat', {
          adminName: socket.userName,
          message: `${socket.userName} joined the chat to assist you`
        });
      }
    } catch (error) {
      console.error('Error admin joining chat:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const { chatId, isTyping } = data;
    socket.to(chatId).emit('userTyping', {
      userName: socket.userName,
      isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userName}`);
    
    // Remove from active users
    activeUsers.delete(socket.userId);
    
    // Broadcast offline status
    io.emit('userOnlineStatus', {
      userId: socket.userId,
      userName: socket.userName,
      status: 'offline'
    });

    // Notify chat room about user leaving
    if (socket.currentChatId) {
      socket.to(socket.currentChatId).emit('userLeftChat', {
        userName: socket.userName,
        userRole: socket.userRole
      });
    }
  });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("Environment:", process.env.NODE_ENV || 'development');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log('Socket.io enabled for real-time chat');
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
