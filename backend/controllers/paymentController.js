const MoneyDonation = require('../models/MoneyDonation');
const User = require('../models/User');
const paymentService = require('../services/paymentService');

// Create payment order
exports.createPaymentOrder = async (req, res) => {
  console.log('=== CREATE PAYMENT ORDER START ===');
  
  try {
    console.log('Step 1: Request received');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from token:', req.user);
    
    const { amount, donorName, donorEmail, donorPhone, message, isAnonymous } = req.body;

    console.log('Step 2: Extracted form data');
    console.log({ amount, donorName, donorEmail, donorPhone, message, isAnonymous });

    // Validation
    if (!amount || amount < 1) {
      console.log('Validation failed: Invalid amount:', amount);
      return res.status(400).json({ msg: 'Amount must be at least ₹1' });
    }

    if (!donorName || !donorEmail || !donorPhone) {
      console.log('Validation failed: Missing donor details');
      return res.status(400).json({ msg: 'All donor details are required' });
    }

    if (!req.user || !req.user.id) {
      console.log('Authentication failed: No user found');
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    console.log('Step 3: Validation passed');

    // Test database operations
    console.log('Step 4: Testing database operations...');
    
    try {
      // Create preliminary donation record
      const donation = new MoneyDonation({
        donor: req.user.id,
        amount,
        donorName,
        donorEmail,
        donorPhone,
        message: message || '',
        isAnonymous: isAnonymous || false,
        razorpayOrderId: 'temp-test-order', // Will be updated after order creation
        paymentStatus: 'pending'
      });

      await donation.save();
      console.log('Step 5: MoneyDonation saved successfully with ID:', donation._id);
      console.log('Receipt number generated:', donation.receiptNumber);

      // Return test response with database success
      return res.json({
        success: true,
        message: 'Database operations successful!',
        user: req.user.id,
        amount: amount,
        donationId: donation._id,
        receiptNumber: donation.receiptNumber,
        test: true
      });

    } catch (dbError) {
      console.log('=== DATABASE ERROR ===');
      console.error('Database error:', dbError);
      console.log('=== END DATABASE ERROR ===');
      throw dbError; // This will be caught by the outer try-catch
    }


  } catch (error) {
    console.log('=== ERROR IN CREATE PAYMENT ORDER ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    console.log('=== END ERROR LOG ===');
    
    res.status(500).json({ 
      success: false, 
      msg: 'Failed to create payment order',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Verify payment and update donation status
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      donationId 
    } = req.body;

    // Verify signature
    const isValidSignature = paymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid payment signature'
      });
    }

    // Get payment details from Razorpay
    const paymentDetails = await paymentService.getPaymentDetails(razorpay_payment_id);

    // Update donation record
    const donation = await MoneyDonation.findByIdAndUpdate(
      donationId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: 'completed',
        paymentMethod: paymentDetails.method
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        msg: 'Donation record not found'
      });
    }

    res.json({
      success: true,
      msg: 'Payment verified successfully',
      donation: {
        id: donation._id,
        amount: donation.amount,
        receiptNumber: donation.receiptNumber,
        status: donation.paymentStatus
      }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      msg: 'Payment verification failed',
      error: error.message
    });
  }
};

// Handle payment failure
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { donationId, error } = req.body;

    await MoneyDonation.findByIdAndUpdate(
      donationId,
      {
        paymentStatus: 'failed',
        failureReason: error.description || 'Payment failed'
      }
    );

    res.json({
      success: true,
      msg: 'Payment failure recorded'
    });

  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to record payment failure'
    });
  }
};

// Get user's money donations
exports.getMyMoneyDonations = async (req, res) => {
  try {
    const donations = await MoneyDonation.find({ donor: req.user.id })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email');

    res.json({
      success: true,
      donations
    });

  } catch (error) {
    console.error('Get my money donations error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch donations'
    });
  }
};

// Get money donation statistics
exports.getMoneyDonationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await MoneyDonation.aggregate([
      { $match: { donor: userId } },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalDonations = await MoneyDonation.countDocuments({ donor: userId });
    const totalAmountDonated = await MoneyDonation.aggregate([
      { $match: { donor: userId, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalDonations,
        totalAmountDonated: totalAmountDonated[0]?.total || 0,
        statusBreakdown: stats
      }
    });

  } catch (error) {
    console.error('Get money donation stats error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch statistics'
    });
  }
};

// Admin: Get all money donations
exports.getAllMoneyDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status) filter.paymentStatus = status;

    const donations = await MoneyDonation.find(filter)
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MoneyDonation.countDocuments(filter);

    res.json({
      success: true,
      donations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get all money donations error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch donations'
    });
  }
};

// Admin: Get money donation analytics
exports.getMoneyDonationAnalytics = async (req, res) => {
  try {
    // Total stats
    const totalStats = await MoneyDonation.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await MoneyDonation.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top donors
    const topDonors = await MoneyDonation.aggregate([
      { $match: { paymentStatus: 'completed', isAnonymous: false } },
      {
        $group: {
          _id: '$donor',
          totalAmount: { $sum: '$amount' },
          donationCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'donorInfo'
        }
      },
      {
        $project: {
          totalAmount: 1,
          donationCount: 1,
          donorName: { $arrayElemAt: ['$donorInfo.name', 0] }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        totalStats,
        monthlyTrend,
        topDonors
      }
    });

  } catch (error) {
    console.error('Get money donation analytics error:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch analytics'
    });
  }
};
