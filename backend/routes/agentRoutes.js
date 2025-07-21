const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { authenticate } = require('../middlewares/authenticate');
const verifyRole = require('../middlewares/verifyeRole');

const agentOnly = [authenticate, verifyRole('agent')];

router.get('/assigned', agentOnly, agentController.getAssignedDonations);
router.get('/history', agentOnly, agentController.getHistory);
router.get('/profile', agentOnly, agentController.getProfile); // ✅ Missing previously
router.patch('/profile', agentOnly, agentController.updateProfile);

router.patch('/pickup/:id/accept', agentOnly, agentController.acceptAssignedDonation);
router.patch('/pickup/:id/reject', agentOnly, agentController.rejectAssignedDonation);
router.patch('/pickup/:id/collect', agentOnly, agentController.markCollected);
router.patch('/pickup/:id/not-found', agentOnly, agentController.markNotFound);
router.patch('/pickup/:id/deliver', agentOnly, agentController.markDelivered); // ✅ Add this

router.patch('/location', agentOnly, agentController.updateAgentLocation);

// Agent status and working time management
router.patch('/status', agentOnly, agentController.updateAgentStatus);
router.patch('/working-time', agentOnly, agentController.updateWorkingTime);
router.get('/working-stats', agentOnly, agentController.getWorkingStats);

module.exports = router;
