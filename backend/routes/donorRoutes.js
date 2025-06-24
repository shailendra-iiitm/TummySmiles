const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { authenticate } = require('../middleware/authenticate');
const verifyRole = require('../middleware/verifyRole');

const donorOnly = [authenticate, verifyRole('donor')];

router.post('/create', donorOnly, donorController.createDonation);
router.get('/mine', donorOnly, donorController.getMyDonations);
router.get('/donation/:id', donorOnly, donorController.getDonationById);
router.get('/profile', donorOnly, donorController.getProfile);
router.patch('/donation/:id', donorOnly, donorController.updateDonation);
router.patch('/profile', donorOnly, donorController.updateProfile);
router.delete('/donation/:id', donorOnly, donorController.deleteMyDonation);

module.exports = router;
