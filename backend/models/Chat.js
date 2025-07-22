const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'donor', 'admin', 'agent'],
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function() {
        return this.senderRole !== 'system';
      }
    },
    senderName: {
      type: String,
      required: true
    },
    senderRole: {
      type: String,
      enum: ['user', 'donor', 'admin', 'agent', 'system'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageType: {
      type: String,
      enum: ['text', 'system'],
      default: 'text'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'resolved', 'closed'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    assignedAt: Date
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
chatSchema.index({ chatId: 1 });
chatSchema.index({ 'participants.userId': 1 });
chatSchema.index({ status: 1 });
chatSchema.index({ lastActivity: -1 });

// Update lastActivity on message addition
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
