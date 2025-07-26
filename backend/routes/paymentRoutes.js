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
