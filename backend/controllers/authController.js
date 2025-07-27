const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
const register = async (req, res) => {
  const { name, phone, email, password, confirmPassword, role, pincode } = req.body;

  if (!name || !phone || !password || !confirmPassword || !role ||
      (['donor', 'agent'].includes(role) && !pincode))
    return res.status(400).json({ msg: "All required fields must be filled" });

  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Passwords do not match" });

  const existingUser = await User.findOne({ phone });
  if (existingUser)
    return res.status(400).json({ msg: "User already exists with this phone" });

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    name,
    phone,
    email,
    password: hashedPassword,
    role,
    pincode: ['donor', 'agent'].includes(role) ? pincode : undefined
  });

  res.status(201).json({ msg: "Registration successful", userId: newUser._id });
};

// LOGIN
const login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ phone: identifier }, { email: identifier }]
  });

  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

  const tokenPayload = {
    id: user._id,
    name: user.name,
    role: user.role,
    ...(user.role === 'agent' || user.role === 'donor' ? { pincode: user.pincode } : {})
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: '2h'
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      pincode: user.pincode || null
    }
  });
};

// UPDATE
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = { ...req.body };

    delete updates.phone;
    delete updates.role;

    if (updates.password) {
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json({ msg: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

module.exports = { register, login, updateUser };
