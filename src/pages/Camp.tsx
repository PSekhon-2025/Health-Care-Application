// examcare-frontend/src/pages/Camp.tsx
import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, TextField, Button, Grid, Card, CardContent, CardActionArea, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  camp_id?: number;
}

const Camp: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [campPatients, setCampPatients] = useState<Patient[]>([]);
  
  // For this example, assume campId=1
  const campId = 1;

  useEffect(() => {
    fetchCampPatients();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchCampPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/camp/${campId}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCampPatients(response.data.patients);
      }
    } catch (error) {
      console.error("Error fetching camp patients:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      // If your /api/patients/search route is also protected, pass the token:
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/patients/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching patients:", error);
    }
  };

  const handleAddPatient = async (patient: Patient) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/camp/${campId}/addPatient`,
        { gov_id: patient.gov_id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        fetchCampPatients();
        setSearchResults([]);
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error adding patient to camp:", error);
    }
  };

  const handleCardClick = (gov_id: string) => {
    navigate(`/edit-patient/${gov_id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Camp Patients
        </Typography>

        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        
        {/* Search bar */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField 
              fullWidth 
              label="Search Patients by Name, ID, or Phone" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" onClick={handleSearch} fullWidth>
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Display search results */}
        {searchResults.length > 0 && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6">Search Results</Typography>
            <Grid container spacing={2}>
              {searchResults.map((patient) => (
                <Grid item xs={12} sm={6} md={4} key={patient.gov_id}>
                  <Card variant="outlined">
                    <CardActionArea onClick={() => handleAddPatient(patient)}>
                      <CardContent>
                        <Typography variant="h6">{patient.full_name}</Typography>
                        <Typography variant="body2">ID: {patient.gov_id}</Typography>
                        <Typography variant="body2">Phone: {patient.phone_number}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Display patients already in the camp */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          Patients in Camp
        </Typography>
        {campPatients.length === 0 ? (
          <Typography>No patients added to this camp yet.</Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {campPatients.map((patient) => (
              <Grid item xs={12} sm={6} md={4} key={patient.gov_id}>
                <Card variant="outlined">
                  <CardActionArea onClick={() => handleCardClick(patient.gov_id)}>
                    <CardContent>
                      <Typography variant="h6">{patient.full_name}</Typography>
                      <Typography variant="body2">ID: {patient.gov_id}</Typography>
                      <Typography variant="body2">Phone: {patient.phone_number}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Camp;
