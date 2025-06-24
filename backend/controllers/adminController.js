const Donation = require('../models/Donation');
const User = require('../models/User');

// 1. --- Donation Management ---

// For Viewing all donations with optional filters
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor').populate('agent');
    res.json(donations);
  } catch {
    res.status(500).json({ msg: "Failed to fetch donations" });
  }
};

//For Viewing donation by ID
exports.getDonationById = async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('donor').populate('agent');
  if (!donation) return res.status(404).json({ msg: "Donation not found" });
  res.json(donation);
};

// For Viewing donations by status (pending, accepted, etc.)
exports.getDonationByStatus = async (req, res) => {
  const { status } = req.query;
  const validStatuses = ['pending', 'accepted', 'rejected', 'collected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ msg: "Invalid status" });

  const donations = await Donation.find({ status }).populate('donor').populate('agent');
  res.json(donations);
};

// For Updating donation status
exports.updateDonationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'rejected', 'collected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ msg: "Invalid status" });

  const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!donation) return res.status(404).json({ msg: "Donation not found" });

  res.json(donation);
};

// To assign agent and random drop location to a donation
exports.assignAgent = async (req, res) => {
  const { agentId } = req.body;

  // Predefined drop points (e.g., warehouses)
  const dropPoints = [
    { lat: 28.70, lng: 77.10 },
    { lat: 28.68, lng: 77.12 },
    { lat: 28.66, lng: 77.15 }
  ];
  const randomDrop = dropPoints[Math.floor(Math.random() * dropPoints.length)];

  // Validate agent
  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    return res.status(400).json({ msg: "Invalid agent" });
  }

  // Update donation with agent and random drop location
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    {
      agent: agentId,
      dropLocation: randomDrop
    },
    { new: true }
  );

  if (!donation) return res.status(404).json({ msg: "Donation not found" });

  res.json({ msg: "Agent assigned with auto-drop location", donation });
};


//To Delete a donation
exports.deleteDonation = async (req, res) => {
  const donation = await Donation.findByIdAndDelete(req.params.id);
  if (!donation) return res.status(404).json({ msg: "Donation not found" });
  res.json({ msg: "Donation deleted" });
};

// 2. --- Stats & Reports ---

exports.getDonationStats = async (req, res) => {
  const [total, pending, accepted, rejected, collected] = await Promise.all([
    Donation.countDocuments(),
    Donation.countDocuments({ status: 'pending' }),
    Donation.countDocuments({ status: 'accepted' }),
    Donation.countDocuments({ status: 'rejected' }),
    Donation.countDocuments({ status: 'collected' })
  ]);

  res.json({ total, pending, accepted, rejected, collected });
};

// 3. --- Role-Specific Queries ---

exports.getAgents = async (req, res) => {
  const agents = await User.find({ role: 'agent' });
  res.json(agents);
};

exports.getDonors = async (req, res) => {
  const donors = await User.find({ role: 'donor' });
  res.json(donors);
};

exports.getCollectedDonations = async (req, res) => {
  const donations = await Donation.find({ status: 'collected' }).populate('donor');
  res.json(donations);
};

exports.getDonationByAgent = async (req, res) => {
  const donations = await Donation.find({ agent: req.user.id }).populate('donor');
  res.json(donations);
};

exports.getDonationByDonor = async (req, res) => {
  const donations = await Donation.find({ donor: req.user.id }).populate('agent');
  res.json(donations);
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json(user);
};

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
    res.status(500).json({ msg: "Error updating profile" });
  }
}

// adminController.js
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ msg: "User blocked", user });
};

exports.unblockUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ msg: "User unblocked", user });
};
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json({ msg: "User deleted" });
};