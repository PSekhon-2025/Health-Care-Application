const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/user');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const pool = require("../config/db");

// GET /api/admin/stats
router.get(
  "/stats",
  authenticateToken,             // First check if token is valid
  authorizeRole(["SUPER_ADMIN", "ADMIN"]),  // Then check user role
  async (req, res) => {
    try {
      // 1) total users
      const totalUsersResult = await pool.query(`SELECT COUNT(*) AS total_users FROM users`);

      // 2) total patients
      const totalPatientsResult = await pool.query("SELECT COUNT(*) AS total_patients FROM patients");

      // 3) pending actions (not approved)
      const pendingActionsResult = await pool.query("SELECT COUNT(*) AS pending_actions FROM users WHERE approved = false");

      // 4) active camps (placeholder)
      const activeCampsResults = await pool.query("SELECT COUNT(*) AS active_camps FROM camps WHERE status = 'Active'");


      const stats = {
        totalUsers: parseInt(totalUsersResult.rows[0].total_users, 10),
        totalPatients: parseInt(totalPatientsResult.rows[0].total_patients, 10),
        pendingActions: parseInt(pendingActionsResult.rows[0].pending_actions, 10),
        activeCamps: parseInt(activeCampsResults.rows[0].active_camps, 10),
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Server error fetching admin stats" });
    }
  }
);


// Endpoint to allow a logged-in SUPER_ADMIN to create a user
router.post('/create-user', authenticateToken, authorizeRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { username, email, password, role, village } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Optional: Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Since an admin is creating this account, mark it as approved automatically.
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      role,
      village: role === 'ADMIN' ? village : null,
      approved: true,
    });

    res.status(201).json({ message: 'User created by admin', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during user creation' });
  }
});

// NEW ENDPOINT: Get pending users (approved = false)
router.get(
  "/pending-users",
  authenticateToken,
  authorizeRole(["SUPER_ADMIN", "ADMIN"]),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, username, email, role, village FROM users WHERE approved = false"
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      res.status(500).json({ error: "Server error fetching pending users" });
    }
  }
);

// NEW ENDPOINT: Delete a user by ID
router.delete(
  "/user/:id",
  authenticateToken,
  authorizeRole(["SUPER_ADMIN"]),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [userId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted", user: result.rows[0] });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Server error deleting user" });
    }
  }
);

// NEW ENDPOINT: Approve a user by ID
router.post(
  "/approve/:id",
  authenticateToken,
  authorizeRole(["SUPER_ADMIN"]),
  async (req, res) => {
    try {
      const userId = req.params.id;
      // Update the 'approved' field in the DB
      const result = await pool.query(
        "UPDATE users SET approved = true WHERE id = $1 RETURNING *",
        [userId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User approved", user: result.rows[0] });
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ error: "Server error approving user" });
    }
  }
);

// NEW ENDPOINT: Create a camp
router.post(
  '/camps',
  authenticateToken,
  authorizeRole(['SUPER_ADMIN']), // Only SUPER_ADMIN can create camps
  async (req, res) => {
    try {
      const { campName, campLocation, userIds = [], adminIds = [] } = req.body;

      // 1) Insert the new camp
      const campResult = await pool.query(
        `INSERT INTO camps (camp_name, camp_location)
         VALUES ($1, $2)
         RETURNING *`,
        [campName, campLocation]
      );
      const newCamp = campResult.rows[0];

      // 2) Update 'village' for each selected USER/ADMIN to point to new camp ID
      //    userIds and adminIds are arrays of user IDs chosen in the form
      for (const userId of userIds) {
        await pool.query(
          `UPDATE users
           SET village = $1
           WHERE id = $2`,
          [newCamp.id, userId]
        );
      }
      for (const adminId of adminIds) {
        await pool.query(
          `UPDATE users
           SET village = $1
           WHERE id = $2`,
          [newCamp.id, adminId]
        );
      }

      res.status(201).json({
        message: 'Camp created successfully',
        camp: newCamp,
      });
    } catch (error) {
      console.error('Error creating camp:', error);
      res.status(500).json({ error: 'Server error creating camp' });
    }
  }
);

router.get(
  '/allUsers',
  authenticateToken,
  authorizeRole(['SUPER_ADMIN']),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, username, email, role
        FROM users
        ORDER BY username ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching all users:', error);
      res.status(500).json({ error: 'Server error fetching all users' });
    }
  }
);

// In backend/routes/admin.js
router.get(
  '/camps',
  authenticateToken,
  authorizeRole(['SUPER_ADMIN', 'ADMIN']), 
  async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM camps');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching camps:', error);
      res.status(500).json({ error: 'Server error fetching camps' });
    }
  }
);

module.exports = router;
