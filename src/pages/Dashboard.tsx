// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsightsIcon from "@mui/icons-material/Insights";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios"; // Import axios for API requests

interface Patient {
  gov_id: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email?: string;
  address?: string;
  relative_name?: string;
  latitude?: string;
  longitude?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the JWT token
    navigate("/"); // Redirect to the login page
  };

  const handleDownloadReport = async (gov_id: string) => {
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
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        alert("No medical history found for this patient.");
      } else {
        console.error("Error downloading medical history report:", error);
        alert("An error occurred while downloading the report. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const searchQuery = ""; // You can set a default search term if needed
        const response = await fetch(
          `/api/patients/search?query=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        // Sort patients by last name and take the first 10
        const sortedPatients = data
          .sort((a: Patient, b: Patient) => {
            const lastNameA = a.full_name.split(" ").pop() || "";
            const lastNameB = b.full_name.split(" ").pop() || "";
            return lastNameA.localeCompare(lastNameB);
          })
          .slice(0, 10);
        setPatients(sortedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Typography variant="h3" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        gutterBottom
        color="textSecondary"
      >
        Welcome to the health management system
      </Typography>

      {/* Logout Button */}
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Navigation Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Admin Options */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardActionArea onClick={() => handleNavigate("/admin")}>
              <CardContent sx={{ textAlign: "center" }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Admin Options</Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage system settings and more.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Analytics */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardActionArea onClick={() => handleNavigate("/analytics")}>
              <CardContent sx={{ textAlign: "center" }}>
                <InsightsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Analytics</Typography>
                <Typography variant="body2" color="textSecondary">
                  View system analytics and reports.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Patient Registration */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardActionArea onClick={() => handleNavigate("/patient-registration")}>
              <CardContent sx={{ textAlign: "center" }}>
                <PersonAddIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Patient Registration</Typography>
                <Typography variant="body2" color="textSecondary">
                  Register new patients quickly.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Patients Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recent Patients
        </Typography>
        {patients.length > 0 ? (
          <Grid container spacing={3}>
            {patients.map((patient) => (
              <Grid item xs={12} sm={6} md={4} key={patient.gov_id}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {patient.full_name}
                  </Typography>
                  <Typography variant="body2">
                    Gov ID: {patient.gov_id}
                  </Typography>
                  <Typography variant="body2">
                    DOB: {patient.date_of_birth}
                  </Typography>
                  <Typography variant="body2">
                    Phone: {patient.phone_number}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => handleDownloadReport(patient.gov_id)}
                  >
                    Download Report
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No patients found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
