const Donation = require('../models/Donations'); // Fixed: use Donations.js (capital D)
const User = require('../models/User');
const { findNearestAgents } = require('../utils/distanceCalculator');

// 1. --- Donation Management ---

// For Viewing all donations with optional filters
exports.getAllDonations = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    // If status filter is provided, filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Fetch donations with custom sorting - delivered at the bottom
    const donations = await Donation.find(query)
      .populate('donor')
      .populate('agent')
      .sort({
        // Custom sort: delivered status goes to bottom, rest by creation date
        status: 1, // This will put 'delivered' last alphabetically
        createdAt: -1 // Recent first within same status
      });
    
    // Further sort to ensure delivered donations are at the bottom (final status)
    const sortedDonations = donations.sort((a, b) => {
      if (a.status === 'delivered' && b.status !== 'delivered') return 1;
      if (a.status !== 'delivered' && b.status === 'delivered') return -1;
      // If both same status, sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(sortedDonations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ msg: "Failed to fetch donations" });
  }
};

//For Viewing donation by ID
exports.getDonationById = async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('donor').populate('agent');
  if (!donation) return res.status(404).json({ msg: "Donation not found" });
  res.json(donation);
};

// For Viewing donations by status (pending, assigned, collected, delivered, etc.)
exports.getDonationByStatus = async (req, res) => {
  try {
    const { status } = req.query;
          const validStatuses = ['pending', 'accepted', 'rejected', 'collected', 'delivered'];
    
    if (!status) {
      return res.status(400).json({ msg: "Status parameter is required" });
    }
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        msg: "Invalid status", 
        validStatuses: validStatuses 
      });
    }

    const donations = await Donation.find({ status })
      .populate('donor')
      .populate('agent')
      .sort({ createdAt: -1 }); // Most recent first within status
    
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations by status:', error);
    res.status(500).json({ msg: "Failed to fetch donations by status" });
  }
};

// For Updating donation status
exports.updateDonationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'rejected', 'collected', 'delivered'];
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

  // Update donation with agent, random drop location, and status
  const donation = await Donation.findByIdAndUpdate(
    req.params.id,
    {
      agent: agentId,
      dropLocation: randomDrop,
      status: 'accepted'
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
  try {
    // Basic donation counts
    const totalDonations = await Donation.countDocuments();
    const pendingDonations = await Donation.countDocuments({ status: 'pending' });
    const acceptedDonations = await Donation.countDocuments({ status: 'accepted' });
    const agentAcceptedDonations = await Donation.countDocuments({ status: 'agent_accepted' });
    const completedDonations = await Donation.countDocuments({ status: 'delivered' });
    const rejectedDonations = await Donation.countDocuments({ status: 'rejected' });
    const agentRejectedDonations = await Donation.countDocuments({ status: 'agent_rejected' });
    const collectedDonations = await Donation.countDocuments({ status: 'collected' });
    const notFoundDonations = await Donation.countDocuments({ status: 'not_found' });

    // Combined status groups
    const assignedDonations = agentAcceptedDonations + collectedDonations;
    const totalRejectedDonations = rejectedDonations + agentRejectedDonations + notFoundDonations;

    // User counts
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ role: 'donor' });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const activeAgents = await User.countDocuments({ 
      role: 'agent', 
      agentStatus: 'active' 
    });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // Time-based stats
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayDonations = await Donation.countDocuments({
      createdAt: { $gte: new Date(today.toDateString()) }
    });
    
    const weeklyDonations = await Donation.countDocuments({
      createdAt: { $gte: thisWeek }
    });
    
    const monthlyDonations = await Donation.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Agent performance stats
    const agentStats = await User.aggregate([
      { $match: { role: 'agent' } },
      {
        $project: {
          name: 1,
          agentStatus: 1,
          totalWorkingTime: 1,
          monthlyHours: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$workingHours",
                    cond: { $gte: ["$$this.date", thisMonth] }
                  }
                },
                as: "session",
                in: { $ifNull: ["$$session.totalHours", 0] }
              }
            }
          }
        }
      }
    ]);

    // Popular food types
    const foodTypeStats = await Donation.aggregate([
      { $group: { _id: "$foodType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Monthly donation trend (last 6 months)
    const monthlyTrend = await Donation.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(today.getFullYear(), today.getMonth() - 5, 1) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      // Basic counts
      totalDonations,
      pendingDonations,
      acceptedDonations,
      agentAcceptedDonations,
      completedDonations,
      rejectedDonations,
      agentRejectedDonations,
      collectedDonations,
      notFoundDonations,
      
      // Combined status groups
      assignedDonations,
      totalRejectedDonations,
      
      // User stats
      totalUsers,
      totalDonors,
      totalAgents,
      activeAgents,
      blockedUsers,
      
      // Time-based
      todayDonations,
      weeklyDonations,
      monthlyDonations,
      
      // Performance
      agentStats,
      foodTypeStats,
      monthlyTrend,
      
      // Calculated metrics
      completionRate: totalDonations > 0 ? Math.round((completedDonations / totalDonations) * 100) : 0,
      agentUtilization: totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({ msg: "Failed to get donation statistics" });
  }
};

// 3. --- Role-Specific Queries ---

exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' });
    
    // Calculate real stats for each agent
    const agentsWithStats = await Promise.all(agents.map(async (agent) => {
      const agentObj = agent.toObject();
      
      // Get donation counts
      const totalDeliveries = await Donation.countDocuments({ 
        agent: agent._id, 
        status: 'delivered' 
      });
      
      const activeDeliveries = await Donation.countDocuments({ 
        agent: agent._id, 
        status: { $in: ['accepted', 'agent_accepted', 'collected'] }
      });

      // Calculate working time stats
      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const todayHours = agent.workingHours.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toDateString() === today.toDateString();
      }).reduce((total, session) => total + (session.totalHours || 0), 0);

      const monthlyHours = agent.workingHours.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= thisMonth;
      }).reduce((total, session) => total + (session.totalHours || 0), 0);

      return {
        ...agentObj,
        totalDeliveries,
        activeDeliveries,
        todayHours: Math.round(todayHours * 100) / 100,
        monthlyHours: Math.round(monthlyHours * 100) / 100,
        totalWorkingMinutes: agent.totalWorkingTime || 0
      };
    }));

    res.json(agentsWithStats);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ msg: "Failed to get agents" });
  }
};

exports.getDonors = async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor' });
    
    // Calculate real stats for each donor
    const donorsWithStats = await Promise.all(donors.map(async (donor) => {
      const donorObj = donor.toObject();
      
      const totalDonations = await Donation.countDocuments({ donor: donor._id });
      const completedDonations = await Donation.countDocuments({ 
        donor: donor._id, 
        status: 'delivered' 
      });
      const pendingDonations = await Donation.countDocuments({ 
        donor: donor._id, 
        status: { $in: ['pending', 'accepted', 'agent_accepted', 'collected'] }
      });

      return {
        ...donorObj,
        totalDonations,
        completedDonations,
        pendingDonations
      };
    }));

    res.json(donorsWithStats);
  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({ msg: "Failed to get donors" });
  }
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

// Get suggested agents for a donation based on distance
exports.getSuggestedAgents = async (req, res) => {
  try {
    const { donationId } = req.params;
    
    // Get the donation with location
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ msg: "Donation not found" });
    }
    
    console.log('Full donation object:', JSON.stringify(donation, null, 2));
    
    // Check multiple possible location fields
    let donationLocation = null;
    if (donation.pickupLocation && donation.pickupLocation.lat && donation.pickupLocation.lng) {
      donationLocation = donation.pickupLocation;
      console.log('Using pickupLocation:', donationLocation);
    } else if (donation.location && donation.location.lat && donation.location.lng) {
      donationLocation = donation.location;
      console.log('Using location:', donationLocation);
    } else {
      console.log('No valid location found. Available fields:', Object.keys(donation.toObject()));
      console.log('pickupLocation:', donation.pickupLocation);
      console.log('location:', donation.location);
      return res.status(400).json({ msg: "Donation does not have location data" });
    }
    
    // Get all available agents
    const allAgents = await User.find({ 
      role: 'agent', 
      isBlocked: { $ne: true }
    });
    
    console.log('Found agents:', allAgents.length);
    
    // Find nearest agents
    const suggestedAgents = findNearestAgents(donationLocation, allAgents, 10);
    
    console.log('Suggested agents:', suggestedAgents.length);
    
    res.json({
      donationId: donationId,
      donationLocation: donationLocation,
      suggestedAgents: suggestedAgents
    });
  } catch (error) {
    console.error('Get suggested agents error:', error);
    res.status(500).json({ msg: "Failed to get suggested agents" });
  }
};