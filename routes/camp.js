const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/camp/:campId/patients
// Returns all patients assigned to the specified camp.
router.get('/:campId/patients', authenticateToken, async (req, res) => {
  const { campId } = req.params;
  try {
    const query = `SELECT * FROM patients WHERE camp_id = $1`;
    const { rows } = await pool.query(query, [campId]);
    res.json({ success: true, patients: rows });
  } catch (error) {
    console.error('Error fetching camp patients:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/camp/:campId/addPatient
// Adds a patient to a camp by updating their camp_id.
router.post('/:campId/addPatient', authenticateToken, async (req, res) => {
  const { campId } = req.params;
  const { gov_id } = req.body;
  if (!gov_id) {
    return res.status(400).json({ success: false, message: "gov_id is required" });
  }
  try {
    const query = `
      UPDATE patients
      SET camp_id = $1
      WHERE gov_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [campId, gov_id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, patient: rows[0] });
  } catch (error) {
    console.error("Error adding patient to camp:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
