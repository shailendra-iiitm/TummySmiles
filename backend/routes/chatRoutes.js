const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createOrGetChat,
  getChatHistory,
  sendMessage,
  sendMediaMessage,
  getAllChats,
  assignChat,
  updateChatStatus
} = require('../controllers/chatController');
const { authenticate } = require('../middlewares/authenticate');
const verifyRole = require('../middlewares/verifyeRole');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/chat-media/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, audio, and common file types
    const allowedTypes = /jpeg|jpg|png|gif|mp3|wav|ogg|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// User routes
router.post('/start', authenticate, createOrGetChat);
router.get('/history/:chatId', authenticate, getChatHistory);
router.post('/message', authenticate, sendMessage);
router.post('/send-media', authenticate, upload.single('media'), sendMediaMessage);
router.post('/send-media', authenticate, upload.single('audio'), sendMediaMessage);

// Admin routes
router.get('/admin/all', authenticate, verifyRole('admin'), getAllChats);
router.post('/admin/assign/:chatId', authenticate, verifyRole('admin'), assignChat);
router.put('/admin/status/:chatId', authenticate, verifyRole('admin'), updateChatStatus);

module.exports = router;
