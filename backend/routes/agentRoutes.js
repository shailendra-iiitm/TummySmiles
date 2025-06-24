const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { authenticate } = require('../middleware/authenticate');
const verifyRole = require('../middleware/verifyRole');

const agentOnly = [authenticate, verifyRole('agent')];

router.get('/assigned', agentOnly, agentController.getAssignedDonations);
router.patch('/pickup/:id/collected', agentOnly, agentController.markCollected);
router.get('/history', agentOnly, agentController.getHistory);
router.patch('/profile', agentOnly, agentController.updateProfile);
router.patch('/pickup/:id/reject', agentOnly, agentController.rejectAssignedDonation);
router.patch('/pickup/:id/not-found', agentOnly, agentController.markNotFound);
router.patch('/pickup/:id/accept', agentOnly, agentController.acceptAssignedDonation);


module.exports = router;
