const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: String,
  quantity: String,
  pickupAddress: String,
  pickupLocation: {
  lat: { type: Number },
  lng: { type: Number }
  },
  dropLocation: {
  lat: { type: Number },
  lng: { type: Number }
  },
  agentLocation: {
  lat: { type: Number, default: null },
  lng: { type: Number, default: null }
  },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'collected','agent_rejected', 'not_found','agent_accepted'], default: 'pending' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);



