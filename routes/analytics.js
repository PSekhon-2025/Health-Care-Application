// backend/analytics.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    // 1) Number of camps by status
    const campsByStatusQuery = `
      SELECT status, COUNT(*) AS count
      FROM camps
      GROUP BY status;
    `;
    
    // 2) Number of users by role
    const usersByRoleQuery = `
      SELECT role, COUNT(*) AS count
      FROM users
      GROUP BY role;
    `;
    
    // 3) Total number of patients
    const totalPatientsQuery = `
      SELECT COUNT(*) AS count
      FROM patients;
    `;
    
    // 4) Some medical history distribution (e.g., htn, dm, heart_disease)
    const htnQuery = `
      SELECT htn, COUNT(*) AS count
      FROM medical_history
      GROUP BY htn;
    `;
    const dmQuery = `
      SELECT dm, COUNT(*) AS count
      FROM medical_history
      GROUP BY dm;
    `;
    const heartDiseaseQuery = `
      SELECT heart_disease, COUNT(*) AS count
      FROM medical_history
      GROUP BY heart_disease;
    `;

    // Run queries in parallel (Promise.all)
    const [
      campsByStatusResult,
      usersByRoleResult,
      totalPatientsResult,
      htnResult,
      dmResult,
      heartDiseaseResult
    ] = await Promise.all([
      pool.query(campsByStatusQuery),
      pool.query(usersByRoleQuery),
      pool.query(totalPatientsQuery),
      pool.query(htnQuery),
      pool.query(dmQuery),
      pool.query(heartDiseaseQuery),
    ]);

    // Process data for camps
    let totalCamps = 0;
    let activeCamps = 0;
    let inactiveCamps = 0;
    campsByStatusResult.rows.forEach(row => {
      totalCamps += parseInt(row.count, 10);
      if (row.status.toLowerCase() === 'active') {
        activeCamps = parseInt(row.count, 10);
      } else {
        inactiveCamps += parseInt(row.count, 10);
      }
    });

    // Process data for user roles
    let userRoles = {};
    usersByRoleResult.rows.forEach(row => {
      userRoles[row.role] = parseInt(row.count, 10);
    });

    // Process total patients
    const totalPatients = parseInt(totalPatientsResult.rows[0].count, 10);

    // Process medical history stats
    const parseYesNoCounts = (rows, key) => {
      // Example structure: { 'Yes': X, 'No': Y, 'NULL/Other': Z }
      let result = { Yes: 0, No: 0, Unknown: 0 };
      rows.forEach(r => {
        if (r[key] === 'Yes') result.Yes = parseInt(r.count, 10);
        else if (r[key] === 'No') result.No = parseInt(r.count, 10);
        else result.Unknown += parseInt(r.count, 10);
      });
      return result;
    };

    const htnCounts = parseYesNoCounts(htnResult.rows, 'htn');
    const dmCounts = parseYesNoCounts(dmResult.rows, 'dm');
    const heartDiseaseCounts = parseYesNoCounts(heartDiseaseResult.rows, 'heart_disease');

    // Construct final response
    const analyticsData = {
      camps: {
        totalCamps,
        activeCamps,
        inactiveCamps,
      },
      users: {
        userRoles,
      },
      patients: {
        totalPatients,
      },
      medicalHistory: {
        htn: htnCounts,
        dm: dmCounts,
        heartDisease: heartDiseaseCounts,
      }
    };

    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
