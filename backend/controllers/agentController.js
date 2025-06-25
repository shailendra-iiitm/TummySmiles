const Donation = require('../models/Donations'); // Fixed: use Donations.js (capital D)
const User = require('../models/User');

// Get assigned donations (accepted, not yet collected)
exports.getAssignedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      agent: req.user.id,
      status: 'accepted'
    }).populate('donor');
    res.json(donations);
  } catch {
    res.status(500).json({ msg: "Failed to fetch assigned donations" });
  }
};

exports.acceptAssignedDonation = async (req, res) => {
  const donation = await Donation.findOneAndUpdate(
    { _id: req.params.id, agent: req.user.id, status: 'accepted' },
    { status: 'agent_accepted' },
    { new: true }
  );
  if (!donation) return res.status(404).json({ msg: "Donation not found or cannot be accepted" });
  res.json({ msg: "Donation accepted", donation });
};

exports.rejectAssignedDonation = async (req, res) => {
  const donation = await Donation.findOneAndUpdate(
    { _id: req.params.id, agent: req.user.id, status: 'accepted' },
    { status: 'agent_rejected' },
    { new: true }
  );
  if (!donation) return res.status(404).json({ msg: "Not found or can't reject" });
  res.json({ msg: "Marked as rejected", donation });
};

// Mark donation as collected
exports.markCollected = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, agent: req.user.id },
      { status: 'collected' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ msg: "Donation not found or not assigned to you" });
    res.json({ msg: "Marked as collected", donation });
  } catch {
    res.status(500).json({ msg: "Failed to mark as collected" });
  }
};

exports.markNotFound = async (req, res) => {
  const donation = await Donation.findOneAndUpdate(
    { _id: req.params.id, agent: req.user.id, status: 'accepted' },
    { status: 'not_found' },
    { new: true }
  );
  if (!donation) return res.status(404).json({ msg: "Not found or can't mark" });
  res.json({ msg: "Marked as not found", donation });
};

// Get pickup history (collected donations)
exports.getHistory = async (req, res) => {
  try {
    const donations = await Donation.find({
      agent: req.user.id,
      status: 'collected'
    }).populate('donor');
    res.json(donations);
  } catch {
    res.status(500).json({ msg: "Failed to fetch history" });
  }
};

// Update agent profile
exports.updateProfile = async (req, res) => {
  const { name, address } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch {
    res.status(500).json({ msg: "Failed to update profile" });
  }
};
// Get agent profile
exports.getProfile = async (req, res) => {
  try {
    const agent = await User.findById(req.user.id).select('-password');
    if (!agent) return res.status(404).json({ msg: "Agent not found" });
    res.json(agent);    
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch profile", error: err.message });
    }
}
// PATCH /agent/location
exports.updateAgentLocation = async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ msg: "Latitude and longitude are required" });
  }

  const updated = await Donation.findOneAndUpdate(
    {
      agent: req.user.id,
      status: { $in: ['accepted', 'agent_accepted'] }
    },
    {
      agentLocation: { lat, lng }
    },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ msg: "No active donation assigned to this agent" });
  }

  res.json({ msg: "Agent location updated", agentLocation: updated.agentLocation });
};
