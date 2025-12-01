const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user;
    let role;

    console.log('Login attempt:', username, password);

    // Check credentials and determine role
    if (username === 'admin' && password === 'admin@123') {
      role = 'admin';
    } else if (username === 'ISDocHub' && password === 'ISFamily@2025') {
      role = 'user';
    } else {
      console.log('Invalid credentials');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Find or create user
    try {
      user = await User.findOne({ username });
      if (!user) {
        user = new User({ username, role });
        await user.save();
      }
    } catch (dbError) {
      console.log('Database error, using fallback auth');
      // Fallback if DB is not connected
      user = { _id: username === 'admin' ? '1' : '2', username, role };
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;