const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authenticate');
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getMyMoneyDonations,
  getMoneyDonationStats
} = require('../controllers/paymentController');

// @route   POST /api/payment/create-order
// @desc    Create Razorpay payment order
// @access  Private (Donor)
router.post('/create-order', authenticate, createPaymentOrder);

// @route   POST /api/payment/test
// @desc    Test endpoint for debugging payment issues
// @access  Private (Donor)
router.post('/test', authenticate, (req, res) => {
  try {
    console.log('Test endpoint hit');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    res.json({ 
      success: true, 
      message: 'Test endpoint working',
      user: req.user,
      body: req.body
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment and update donation status
// @access  Private (Donor)
router.post('/verify', authenticate, verifyPayment);

// @route   POST /api/payment/failure
// @desc    Handle payment failure
// @access  Private (Donor)
router.post('/failure', authenticate, handlePaymentFailure);

// @route   GET /api/payment/my-donations
// @desc    Get user's money donations
// @access  Private (Donor)
router.get('/my-donations', authenticate, getMyMoneyDonations);

// @route   GET /api/payment/stats
// @desc    Get user's money donation statistics
// @access  Private (Donor)
router.get('/stats', authenticate, getMoneyDonationStats);

module.exports = router;
