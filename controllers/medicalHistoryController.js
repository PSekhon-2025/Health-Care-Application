const MedicalHistory = require("../models/medicalHistory");
const { generateMedicalHistoryPDF } = require("../services/pdfGenerator");
const path = require("path");
const fs = require("fs");

const tempDir = path.join(__dirname, "../temp");

// Ensure the temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const generateMedicalHistoryPDFController = async (req, res) => {
  try {
    const { gov_id } = req.params;
    const useLocal = req.useLocalDb;

    // Fetch medical history by government ID
    const medicalHistory = await MedicalHistory.getByGovId(gov_id, useLocal);

    if (!medicalHistory) {
      return res.status(404).json({ success: false, message: "Medical history not found" });
    }

    // Generate PDF
    const outputPath = path.join(__dirname, `../temp/medical_history_${gov_id}.pdf`);
    await generateMedicalHistoryPDF(medicalHistory, outputPath);

    // Send the PDF file as a response
    res.download(outputPath, `medical_history_${gov_id}.pdf`, (err) => {
      if (err) {
        console.error("Error sending PDF:", err);
        res.status(500).json({ success: false, message: "Error generating PDF" });
      }

      // Optionally delete the file after sending
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("Error generating medical history PDF:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { generateMedicalHistoryPDFController };