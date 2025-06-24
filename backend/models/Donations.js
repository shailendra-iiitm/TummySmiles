const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: String,
  quantity: String,
  pickupAddress: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'collected','agent_rejected', 'not_found','agent_accepted'], default: 'pending' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
