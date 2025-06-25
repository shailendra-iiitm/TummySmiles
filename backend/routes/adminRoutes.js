const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authenticate'); // Fixed path
const verifyRole = require('../middlewares/verifyeRole'); // Fixed filename

// Middleware stack
const adminOnly = [authenticate, verifyRole('admin')];

// --- Donation Management ---
router.get('/donations', adminOnly, adminController.getAllDonations);
router.get('/donation/:id', adminOnly, adminController.getDonationById);
router.get('/donations/status', adminOnly, adminController.getDonationByStatus); // ?status=pending
router.patch('/donation/:id/status', adminOnly, adminController.updateDonationStatus);
router.patch('/donation/:id/assign-agent', adminOnly, adminController.assignAgent);
router.delete('/donation/:id', adminOnly, adminController.deleteDonation);
router.patch('/profile', adminOnly, adminController.updateProfile);
// --- Stats ---
router.get('/stats', adminOnly, adminController.getDonationStats);

// --- Users ---
router.get('/agents', adminOnly, adminController.getAgents);
router.get('/donors', adminOnly, adminController.getDonors);

// --- Donation History ---
router.get('/donations/collected', adminOnly, adminController.getCollectedDonations);
router.get('/donations/by-agent', authenticate, verifyRole('agent'), adminController.getDonationByAgent);
router.get('/donations/by-donor', authenticate, verifyRole('donor'), adminController.getDonationByDonor);

// Block ,unblock ,delete user
router.patch('/user/:id/block', adminOnly, adminController.blockUser);
router.patch('/user/:id/unblock', adminOnly, adminController.unblockUser);
router.delete('/user/:id', adminOnly, adminController.deleteUser);

module.exports = router;
