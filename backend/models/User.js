const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // allow null/optional emails
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['donor', 'admin', 'agent'],
    default: 'donor'
  },
  pincode: {
    type: String,
    required: function () {
      return this.role === 'donor' || this.role === 'agent';
    }
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  // Agent-specific fields
  agentStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: function() {
      return this.role === 'agent' ? 'inactive' : undefined;
    }
  },
  workingHours: [{
    date: { type: Date, default: Date.now },
    startTime: { type: Date },
    endTime: { type: Date },
    totalHours: { type: Number, default: 0 },
    status: { type: String, enum: ['working', 'break', 'finished'], default: 'working' }
  }],
  totalWorkingTime: { type: Number, default: 0 }, // in minutes
  lastActiveTime: { type: Date },
  isBlocked: { type: Boolean, default: false}
}, { timestamps: true }); // ✅ timestamps passed here

module.exports = mongoose.model('User', userSchema);
