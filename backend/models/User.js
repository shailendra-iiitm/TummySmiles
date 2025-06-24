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
  }
}, { timestamps: true }); // ✅ timestamps passed here

module.exports = mongoose.model('User', userSchema);
