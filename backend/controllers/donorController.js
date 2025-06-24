const Donation = require('../models/Donation');
const User = require('../models/User');

// Create new donation
exports.createDonation = async (req, res) => {
  const { foodType, quantity, pickupAddress } = req.body;
  try {
    const donation = new Donation({
      donor: req.user.id,
      foodType,
      quantity,
      pickupAddress
    });
    await donation.save();
    res.status(201).json(donation);
  } catch {
    res.status(500).json({ msg: "Error creating donation" });
  }
};

// View all donations by logged-in donor
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id }).populate('agent');
    res.json(donations);
  } catch {
    res.status(500).json({ msg: "Failed to fetch donations" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
    }
    catch { 
        
        res.status(500).json({ msg: "Error fetching profile" });
    }   
};

// Update donor profile
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
};

// Delete donation owned by donor
exports.deleteMyDonation = async (req, res) => {
  try {
    const donation = await Donation.findOneAndDelete({
      _id: req.params.id,
      donor: req.user.id
    });
    if (!donation) return res.status(404).json({ msg: "Donation not found or not yours" });

    res.json({ msg: "Donation deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting donation" });
  }
};
// Get donation details by ID
exports.getDonationById = async (req, res) => { 
    try {
        const donation = await Donation.findById(req.params.id).populate('donor').populate('agent');
        if (!donation) return res.status(404).json({ msg: "Donation not found" });
        res.json(donation);
    } catch {
        res.status(500).json({ msg: "Error fetching donation details" });
    }
    }

// Update donation details by ID
exports.updateDonation = async (req, res) => {
    const { foodType, quantity, pickupAddress } = req.body;
    try {
        const donation = await Donation.findOneAndUpdate(
        { _id: req.params.id, donor: req.user.id },
        { foodType, quantity, pickupAddress },
        { new: true }
        );
        if (!donation) return res.status(404).json({ msg: "Donation not found or not yours" });
        res.json(donation);
    } catch {
        res.status(500).json({ msg: "Error updating donation" });
    }
    }