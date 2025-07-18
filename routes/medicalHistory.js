const express = require("express");
const router = express.Router();
const MedicalHistory = require("../models/medicalHistory");
const pool = require("../config/db");
const { generateMedicalHistoryPDF } = require("../services/pdfGenerator");
const { generateMedicalHistoryPDFController } = require("../controllers/medicalHistoryController");


// POST /api/medical-history/create - Create/Update medical history
router.post("/create", async (req, res) => {
  try {
    const useLocal = req.useLocalDb;
    const medicalHistory = await MedicalHistory.create(req.body, useLocal);
    res.status(201).json({ success: true, medicalHistory });
    console.log(
      "✅ Successfully inserted medical history into",
      useLocal ? "local database: " : "remote database: ",
      medicalHistory
    );
  } catch (err) {
    console.error("Error inserting medical history:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/medical-history/:govId - Get medical history by government ID
router.get("/:gov_id", async (req, res) => {
  try {
    const useLocal = req.useLocalDb;
    const medicalHistory = await MedicalHistory.getByGovId(
      req.params.gov_id,
      useLocal
    );
    if (medicalHistory) {
      res.status(200).json({
        success: true,
        medicalHistory, // This should be the direct medical history object
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Medical history not found" });
    }
  } catch (err) {
    console.error("Error retrieving medical history:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/medical-history/:govId - Delete medical history
router.delete("/:govId", async (req, res) => {
  try {
    const useLocal = req.useLocalDb;
    const result = await MedicalHistory.delete(req.params.govId, useLocal);
    if (result) {
      res
        .status(200)
        .json({ success: true, message: "Medical history deleted" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Medical history not found" });
    }
  } catch (err) {
    console.error("Error deleting medical history:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// GET /api/medical-history/pdf/:gov_id - Generate PDF for medical history  
router.get("/:gov_id/pdf", generateMedicalHistoryPDFController);

module.exports = router;
