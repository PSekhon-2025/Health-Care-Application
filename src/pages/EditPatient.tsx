// examcare-frontend/src/pages/EditPatient.tsx
import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, TextField, Button, Grid } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Patient {
  gov_id: string;
  full_name: string;
  date_of_birth: string;
  relative_name: string;
  phone_number: string;
  email?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  camp_id?: number;
}

interface MedicalHistory {
  gov_id: string;
  notes: string;
  // Add additional fields as needed (loss_of_vision, redness, etc.)
}

const EditPatient: React.FC = () => {
  const { gov_id } = useParams<{ gov_id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Fetch patient data
        const patientRes = await axios.get(`/api/patients/${gov_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Fetch medical history data
        const historyRes = await axios.get(`/api/medical-history/${gov_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatient(patientRes.data.patient);
        setMedicalHistory(historyRes.data.medicalHistory);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [gov_id]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (patient) {
      setPatient({ ...patient, [e.target.name]: e.target.value });
    }
  };

  const handleMedicalHistoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (medicalHistory) {
      setMedicalHistory({ ...medicalHistory, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      // Update patient data
      await axios.put(`/api/patients/${gov_id}`, patient, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/camp");
    } catch (error) {
      console.error("Error updating patient data:", error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/medical-history/${gov_id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important for downloading files
      });

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `medical_history_${gov_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading medical history report:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found.</div>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit Patient
        </Typography>
        <Grid container spacing={2}>
          {/* Patient Information */}
          <Grid item xs={12}>
            <Typography variant="h6">Patient Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={patient.full_name}
              onChange={handlePatientChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={patient.phone_number}
              onChange={handlePatientChange}
            />
          </Grid>
          {/* Add additional patient fields as needed */}
          <Grid item xs={12}>
            <Typography variant="h6">Medical History</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={medicalHistory?.notes || ""}
              onChange={handleMedicalHistoryChange}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2, ml: 2 }}
          onClick={handleDownloadReport}
        >
          Download Medical History Report
        </Button>
      </Paper>
    </Container>
  );
};

export default EditPatient;
