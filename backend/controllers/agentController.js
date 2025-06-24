const Donation = require('../models/Donation');
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
