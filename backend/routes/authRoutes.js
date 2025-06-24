const express = require('express');
const { register, login, updateUser } = require('../controllers/authController');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/update', authenticate, updateUser);
router.patch('/update', authenticate, updateUser);

module.exports = router;
