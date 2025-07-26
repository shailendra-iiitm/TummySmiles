const mongoose = require('mongoose');

const moneyDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD']
  },
  donorName: {
    type: String,
    required: true
  },
  donorEmail: {
    type: String,
    required: true
  },
  donorPhone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    maxlength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  // Razorpay payment details
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String // card, netbanking, wallet, upi
  },
  failureReason: {
    type: String
  },
  receiptNumber: {
    type: String,
    unique: true
  }
}, { 
  timestamps: true 
});

// Generate receipt number before saving
moneyDonationSchema.pre('save', function(next) {
  if (this.isNew && !this.receiptNumber) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.receiptNumber = `TMNY${timestamp}${random}`;
  }
  next();
});

// Index for efficient queries
moneyDonationSchema.index({ donor: 1 });
moneyDonationSchema.index({ paymentStatus: 1 });
moneyDonationSchema.index({ createdAt: -1 });
moneyDonationSchema.index({ razorpayOrderId: 1 });
moneyDonationSchema.index({ receiptNumber: 1 });

module.exports = mongoose.model('MoneyDonation', moneyDonationSchema);
