const Donation = require('../models/Donations'); // Fixed: use Donations.js (capital D)
const User = require('../models/User');

// Get assigned donations (accepted, not yet collected)
exports.getAssignedDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      agent: req.user.id,
      status: { $in: ['accepted', 'agent_accepted', 'collected'] }
    }).populate('donor');
    res.json(donations);
  } catch {
    res.status(500).json({ msg: "Failed to fetch assigned donations" });
  }
};

exports.acceptAssignedDonation = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, agent: req.user.id, status: 'accepted' },
      { status: 'agent_accepted' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ msg: "Donation not found or cannot be accepted" });
    res.json({ msg: "Donation accepted", donation });
  } catch (error) {
    console.error('Accept donation error:', error);
    res.status(500).json({ msg: "Failed to accept donation" });
  }
};

exports.rejectAssignedDonation = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, agent: req.user.id, status: 'accepted' },
      { status: 'agent_rejected' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ msg: "Not found or can't reject" });
    res.json({ msg: "Marked as rejected", donation });
  } catch (error) {
    console.error('Reject donation error:', error);
    res.status(500).json({ msg: "Failed to reject donation" });
  }
};

// Mark donation as collected
exports.markCollected = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, agent: req.user.id, status: 'agent_accepted' },
      { status: 'collected' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ msg: "Donation not found or not assigned to you" });
    res.json({ msg: "Marked as collected", donation });
  } catch (error) {
    console.error('Mark collected error:', error);
    res.status(500).json({ msg: "Failed to mark as collected" });
  }
};

exports.markNotFound = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, agent: req.user.id, status: 'agent_accepted' },
      { status: 'not_found' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ msg: "Not found or can't mark" });
    res.json({ msg: "Marked as not found", donation });
  } catch (error) {
    console.error('Mark not found error:', error);
    res.status(500).json({ msg: "Failed to mark as not found" });
  }
};

// Get pickup history (collected donations)
exports.getHistory = async (req, res) => {
  try {
    const donations = await Donation.find({
      agent: req.user.id,
      status: { $in: ['collected', 'delivered', 'not_found'] }
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
  const { lat, lng, address } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ msg: "Latitude and longitude are required" });
  }

  try {
    const updatedAgent = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: { lat: parseFloat(lat), lng: parseFloat(lng), address: address || '' }
      },
      { new: true }
    ).select('-password');

    if (!updatedAgent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    res.json({ 
      msg: "Agent location updated successfully", 
      location: updatedAgent.location 
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ msg: "Failed to update agent location" });
  }
};
// Mark donation as delivered
exports.markDelivered = async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate(
      { _id: req.params.id, agent: req.user.id, status: 'collected' },
      { status: 'delivered' },
      { new: true }
    );
    if (!donation) return res.status(404).json({ msg: "Donation not found or not in collected state" });
    res.json({ msg: "Marked as delivered", donation });
  } catch {
    res.status(500).json({ msg: "Failed to mark as delivered" });
  }
};

// Update agent status (active/inactive)
exports.updateAgentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ msg: "Invalid status. Must be 'active' or 'inactive'" });
    }

    const updateData = {
      agentStatus: status,
      lastActiveTime: new Date()
    };

    // If going active, start new working session
    if (status === 'active') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if there's already a working session today
      const agent = await User.findById(req.user.id);
      const todaySession = agent.workingHours.find(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === today.getTime() && !session.endTime;
      });

      if (!todaySession) {
        updateData.$push = {
          workingHours: {
            date: new Date(),
            startTime: new Date(),
            status: 'working'
          }
        };
      }
    }

    const updatedAgent = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ 
      msg: `Agent status updated to ${status}`, 
      agent: updatedAgent 
    });
  } catch (error) {
    console.error('Update agent status error:', error);
    res.status(500).json({ msg: "Failed to update agent status" });
  }
};

// Start/End working session
exports.updateWorkingTime = async (req, res) => {
  try {
    const { action } = req.body; // 'start', 'break', 'resume', 'end'
    
    const agent = await User.findById(req.user.id);
    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find today's session
    let todaySession = agent.workingHours.find(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime() && !session.endTime;
    });

    switch (action) {
      case 'start':
        if (!todaySession) {
          agent.workingHours.push({
            date: new Date(),
            startTime: new Date(),
            status: 'working'
          });
          agent.agentStatus = 'active';
        }
        break;
        
      case 'break':
        if (todaySession) {
          todaySession.status = 'break';
        }
        break;
        
      case 'resume':
        if (todaySession) {
          todaySession.status = 'working';
        }
        break;
        
      case 'end':
        if (todaySession) {
          todaySession.endTime = new Date();
          todaySession.status = 'finished';
          
          // Calculate total hours for this session
          const totalMs = todaySession.endTime - todaySession.startTime;
          todaySession.totalHours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
          
          // Update total working time
          agent.totalWorkingTime += Math.round(totalMs / (1000 * 60)); // in minutes
          agent.agentStatus = 'inactive';
        }
        break;
    }

    agent.lastActiveTime = new Date();
    await agent.save();

    res.json({ 
      msg: `Working time ${action} recorded successfully`,
      workingHours: agent.workingHours,
      agentStatus: agent.agentStatus
    });
  } catch (error) {
    console.error('Update working time error:', error);
    res.status(500).json({ msg: "Failed to update working time" });
  }
};

// Get agent's working time statistics
exports.getWorkingStats = async (req, res) => {
  try {
    const agent = await User.findById(req.user.id);
    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    // Calculate daily stats
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

    res.json({
      agentStatus: agent.agentStatus,
      todayHours: Math.round(todayHours * 100) / 100,
      monthlyHours: Math.round(monthlyHours * 100) / 100,
      totalWorkingTime: agent.totalWorkingTime,
      lastActiveTime: agent.lastActiveTime,
      recentSessions: agent.workingHours.slice(-7) // Last 7 sessions
    });
  } catch (error) {
    console.error('Get working stats error:', error);
    res.status(500).json({ msg: "Failed to get working stats" });
  }
};
