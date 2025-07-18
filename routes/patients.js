const express = require("express");
const router = express.Router();
const Patient = require("../models/patient");
const pool = require("../config/db");


// POST /api/patients - Create a new patient
router.post("/create", async (req, res) => {
  try {
    const useLocal = req.useLocalDb; // Use the selected database
    const patient = await Patient.create(req.body, useLocal);
    res.status(201).json({ success: true, patient });
    console.log(
      "✅ Successfully inserted patient into ",
      useLocal ? "local database: " : "remote database: ",
      patient
    );
  } catch (err) {
    console.error("Error inserting patient:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/patients - Retrieve a patient by full_name and date_of_birth
router.get("/retrieve", async (req, res) => {
  try {
    const { full_name, date_of_birth } = req.query;
    const useLocal = req.useLocalDb; // Use the selected database
    const patient = await Patient.fetchByFullNameAndDOB(
      full_name,
      date_of_birth,
      useLocal
    );
    if (patient) {
      res.status(200).json({ success: true, patient });
    } else {
      res.status(404).json({ success: false, message: "Patient not found" });
    }
  } catch (err) {
    console.error("Error retrieving patient:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { full_name, date_of_birth, ...updates } = req.body;
    const useLocal = req.useLocalDb; // Use the selected database
    const patient = await Patient.update(
      full_name,
      date_of_birth,
      updates,
      useLocal
    );
    if (patient) {
      res.status(200).json({ success: true, patient });
    } else {
      res.status(404).json({ success: false, message: "Patient not found" });
    }
  } catch (err) {
    console.error("Error updating patient:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/patients/search?query=...
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query; // The search term from the query string
    const useLocal = req.useLocalDb; // Selected DB

    // Call the search method in the Patient model
    const patients = await Patient.search(query, useLocal);
    res.status(200).json(patients);
  } catch (err) {
    console.error("Error searching patients:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/:gov_id", async (req, res) => {
  const { gov_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM patients WHERE gov_id = $1",
      [gov_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json({ patient: result.rows[0] });
  } catch (error) {
    console.error("Error fetching patient by gov_id:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:gov_id", /* authenticateToken, */ async (req, res) => {
  const { gov_id } = req.params;
  const {
    full_name,
    date_of_birth,
    relative_name,
    phone_number,
    email,
    address,
    latitude,
    longitude,
    camp_id
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE patients
       SET full_name = $1,
           date_of_birth = $2,
           relative_name = $3,
           phone_number = $4,
           email = $5,
           address = $6,
           latitude = $7,
           longitude = $8,
           camp_id = $9
       WHERE gov_id = $10
       RETURNING *;`,
      [
        full_name || null,
        date_of_birth || null,
        relative_name || null,
        phone_number || null,
        email || null,
        address || null,
        latitude || null,
        longitude || null,
        camp_id || null,
        gov_id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json({ success: true, patient: result.rows[0] });
  } catch (error) {
    console.error("Error updating patient by gov_id:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
