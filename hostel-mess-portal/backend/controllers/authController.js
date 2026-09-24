const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  hostelBlock: user.hostelBlock,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, hostelBlock } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const requestedRole = role === 'admin' ? 'admin' : 'student';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: requestedRole,
      hostelBlock: hostelBlock && hostelBlock.trim() ? hostelBlock.trim() : 'General',
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0];
      return res.status(400).json({ message: first ? first.message : 'Invalid input.' });
    }
    console.error('register error:', err);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ message: 'Failed to load profile.' });
  }
};
