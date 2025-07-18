const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, approveUser } = require('../models/user');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public signup endpoint (accounts need approval if not SUPER_ADMIN)
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role, village } = req.body;

    // Check if a user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // For public signup, auto-approval only if the role is SUPER_ADMIN (if allowed)
    const approved = role === 'SUPER_ADMIN' ? true : false;

    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      role,
      village: role === 'ADMIN' ? village : null,
      approved,
    });

    res.status(201).json({ message: 'User created; pending approval if applicable', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Public login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.approved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    // Create and send JWT (include id and role)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Protected endpoint for approving a user (only SUPER_ADMIN allowed)
router.post(
  '/approve/:id',
  authenticateToken,
  authorizeRole(['SUPER_ADMIN']),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await approveUser(userId);
      res.json({ message: 'User approved', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during approval' });
    }
  }
);

module.exports = router;
