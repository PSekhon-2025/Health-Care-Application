// src/pages/PatientRegistration.tsx
import React, { useState, useEffect, FormEvent } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface PatientFormData {
  // Fields for the patients table
  gov_id: string;
  full_name: string;
  date_of_birth: string;
  relative_name: string;
  phone_number: string;
  email: string;
  address: string;
  latitude: string;
  longitude: string;

  // Fields for the patient_medical_history table
  notes: string;
  // Loss of Vision details
  loss_of_vision: string;
  loss_of_vision_eye: string;
  loss_of_vision_onset: string;
  loss_of_vision_pain: string;
  loss_of_vision_duration: string;
  // Redness details
  redness: string;
  redness_eye: string;
  redness_onset: string;
  redness_pain: string;
  redness_duration: string;
  // Watering details
  watering: string;
  watering_eye: string;
  watering_onset: string;
  watering_pain: string;
  watering_duration: string;
  // Discharge Type
  discharge_type: string;
  // Itching details
  itching: string;
  itching_eye: string;
  itching_duration: string;
  // Additional (Final) Pain details
  pain_final: string;
  pain_final_eye: string;
  pain_final_onset: string;
  pain_final_duration: string;
  // Systemic History
  htn: string;
  dm: string;
  heart_disease: string;
  // Allergy History
  allergy_drops: string;
  allergy_tablets: string;
  seasonal_allergies: string;
  // Contact Lenses History
  contact_lenses_use: string;
  contact_lenses_duration: string;
  contact_lenses_frequency: string;
  // Eye Surgical History
  cataract_or_injury: string;
  retinal_lasers: string;
}

interface PatientSearchResult {
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

const LOCAL_STORAGE_KEY = "patientFullFormData";

const initialFormData: PatientFormData = {
  // Patients table
  gov_id: "",
  full_name: "",
  date_of_birth: "",
  relative_name: "",
  phone_number: "",
  email: "",
  address: "",
  latitude: "",
  longitude: "",
  // Patient Medical History table
  notes: "",
  loss_of_vision: "",
  loss_of_vision_eye: "",
  loss_of_vision_onset: "",
  loss_of_vision_pain: "",
  loss_of_vision_duration: "",
  redness: "",
  redness_eye: "",
  redness_onset: "",
  redness_pain: "",
  redness_duration: "",
  watering: "",
  watering_eye: "",
  watering_onset: "",
  watering_pain: "",
  watering_duration: "",
  discharge_type: "",
  itching: "",
  itching_eye: "",
  itching_duration: "",
  pain_final: "",
  pain_final_eye: "",
  pain_final_onset: "",
  pain_final_duration: "",
  htn: "",
  dm: "",
  heart_disease: "",
  allergy_drops: "",
  allergy_tablets: "",
  seasonal_allergies: "",
  contact_lenses_use: "",
  contact_lenses_duration: "",
  contact_lenses_frequency: "",
  cataract_or_injury: "",
  retinal_lasers: "",
};

const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [submissionMessage, setSubmissionMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  // Handle changes from both text fields and radio buttons
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate required patient fields
  const validateRequiredFields = (): boolean => {
    const { gov_id, full_name, date_of_birth, phone_number } = formData;
    return (
      gov_id.trim() !== "" &&
      full_name.trim() !== "" &&
      date_of_birth.trim() !== "" &&
      phone_number.trim() !== ""
    );
  };

  const handleSaveProgress = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    setSubmissionMessage("Progress saved locally!");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionMessage("");

    // Validate based on which tab we're on
    if (activeTab === 0) {
      if (!validateRequiredFields()) {
        setSubmissionMessage("Please fill in all required patient fields.");
        return;
      }

      try {
        const response = await fetch("/api/patients/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Server error while submitting form");
        }

        const result = await response.json();
        console.log("Patient form submitted successfully:", result);
        setSubmissionMessage("Patient registered successfully!");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setFormData(initialFormData);
      } catch (error) {
        console.error("Submission error:", error);
        setSubmissionMessage("Failed to submit form. Please try again.");
      }
    } else if (activeTab === 1) {
      // Validate gov_id for medical history
      if (!formData.gov_id.trim()) {
        setSubmissionMessage("Please enter a Government ID.");
        return;
      }

      try {
        const response = await fetch("/api/medical-history/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gov_id: formData.gov_id,
            notes: formData.notes,
            // Loss of Vision
            loss_of_vision: formData.loss_of_vision,
            loss_of_vision_eye: formData.loss_of_vision_eye,
            loss_of_vision_onset: formData.loss_of_vision_onset,
            loss_of_vision_pain: formData.loss_of_vision_pain,
            loss_of_vision_duration: formData.loss_of_vision_duration,
            // Redness
            redness: formData.redness,
            redness_eye: formData.redness_eye,
            redness_onset: formData.redness_onset,
            redness_pain: formData.redness_pain,
            redness_duration: formData.redness_duration,
            // Watering
            watering: formData.watering,
            watering_eye: formData.watering_eye,
            watering_onset: formData.watering_onset,
            watering_pain: formData.watering_pain,
            watering_duration: formData.watering_duration,
            // Discharge
            discharge_type: formData.discharge_type,
            // Itching
            itching: formData.itching,
            itching_eye: formData.itching_eye,
            itching_duration: formData.itching_duration,
            // Pain Final
            pain_final: formData.pain_final,
            pain_final_eye: formData.pain_final_eye,
            pain_final_onset: formData.pain_final_onset,
            pain_final_duration: formData.pain_final_duration,
            // Systemic History
            htn: formData.htn,
            dm: formData.dm,
            heart_disease: formData.heart_disease,
            // Allergy History
            allergy_drops: formData.allergy_drops,
            allergy_tablets: formData.allergy_tablets,
            seasonal_allergies: formData.seasonal_allergies,
            // Contact Lenses
            contact_lenses_use: formData.contact_lenses_use,
            contact_lenses_duration: formData.contact_lenses_duration,
            contact_lenses_frequency: formData.contact_lenses_frequency,
            // Eye Surgical History
            cataract_or_injury: formData.cataract_or_injury,
            retinal_lasers: formData.retinal_lasers,
          }),
        });

        if (!response.ok) {
          throw new Error("Server error while submitting medical history");
        }

        const result = await response.json();
        console.log("Medical history submitted successfully:", result);
        setSubmissionMessage("Medical history saved successfully!");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setFormData(initialFormData);
      } catch (error) {
        console.error("Medical history submission error:", error);
        setSubmissionMessage(
          "Failed to submit medical history. Please try again."
        );
      }
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return; // Don't search if query is empty
    }

    setHasSearched(true);
    try {
      const response = await fetch(
        `/api/patients/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const data = await response.json();
      console.log("Search results:", data); // Debug log
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSubmissionMessage("Search failed. Please try again.");
    }
  };

  // Add this to handle Enter key in search
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleSearch();
    }
  };

  const handlePatientSelect = async (patient: PatientSearchResult) => {
    // Reset search state
    setHasSearched(false);
    // First populate the patient information
    setFormData((prevData) => ({
      ...prevData,
      gov_id: patient.gov_id,
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      phone_number: patient.phone_number,
      email: patient.email || "",
      address: patient.address || "",
      relative_name: patient.relative_name || "",
      latitude: patient.latitude || "",
      longitude: patient.longitude || "",
    }));

    // Try to fetch medical history if we're in medical history tab
    try {
      const response = await fetch(`/api/medical-history/${patient.gov_id}`);
      if (response.ok) {
        const data = await response.json();
        // Changed this line to access the medical history data correctly
        if (data.success && data.medicalHistory) {
          const medHistory = data.medicalHistory;
          // Populate medical history fields
          setFormData((prevData) => ({
            ...prevData,
            // Make sure we're setting exact string values that match the radio options
            notes: medHistory.notes || "",
            loss_of_vision: medHistory.loss_of_vision || "No",
            loss_of_vision_eye: medHistory.loss_of_vision_eye || "",
            loss_of_vision_onset: medHistory.loss_of_vision_onset || "",
            loss_of_vision_pain: medHistory.loss_of_vision_pain || "No",
            loss_of_vision_duration: medHistory.loss_of_vision_duration || "",
            redness: medHistory.redness || "No",
            redness_eye: medHistory.redness_eye || "",
            redness_onset: medHistory.redness_onset || "",
            redness_pain: medHistory.redness_pain || "No",
            redness_duration: medHistory.redness_duration || "",
            watering: medHistory.watering || "No",
            watering_eye: medHistory.watering_eye || "",
            watering_onset: medHistory.watering_onset || "",
            watering_pain: medHistory.watering_pain || "No",
            watering_duration: medHistory.watering_duration || "",
            discharge_type: medHistory.discharge_type || "",
            itching: medHistory.itching || "No",
            itching_eye: medHistory.itching_eye || "",
            itching_duration: medHistory.itching_duration || "",
            pain_final: medHistory.pain_final || "No",
            pain_final_eye: medHistory.pain_final_eye || "",
            pain_final_onset: medHistory.pain_final_onset || "",
            pain_final_duration: medHistory.pain_final_duration || "",
            htn: medHistory.htn || "No",
            dm: medHistory.dm || "No",
            heart_disease: medHistory.heart_disease || "No",
            allergy_drops: medHistory.allergy_drops || "No",
            allergy_tablets: medHistory.allergy_tablets || "No",
            seasonal_allergies: medHistory.seasonal_allergies || "No",
            contact_lenses_use: medHistory.contact_lenses_use || "No",
            contact_lenses_duration: medHistory.contact_lenses_duration || "",
            contact_lenses_frequency: medHistory.contact_lenses_frequency || "",
            cataract_or_injury: medHistory.cataract_or_injury || "No",
            retinal_lasers: medHistory.retinal_lasers || "No",
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
    }

    // Clear search results and query
    setSearchResults([]);
    setSearchQuery("");

    // Navigate to the appropriate tab
    setActiveTab(activeTab === 2 ? 0 : activeTab);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Patient Registration and Medical History
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab label="Patient Information" />
          <Tab label="Medical History" />
          <Tab label="Search Patient" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {activeTab === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Patient Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Government ID"
                    name="gov_id"
                    value={formData.gov_id}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Relative Name"
                    name="relative_name"
                    value={formData.relative_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    type="number"
                    inputProps={{ step: "any" }}
                    value={formData.latitude}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    type="number"
                    inputProps={{ step: "any" }}
                    value={formData.longitude}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Patient Medical History
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Government ID"
                    name="gov_id"
                    value={formData.gov_id}
                    onChange={handleChange}
                    helperText="Enter the Government ID of the patient"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">Loss of Vision</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Vision?</FormLabel>
                    <RadioGroup
                      row
                      name="loss_of_vision"
                      value={formData.loss_of_vision}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Eye</FormLabel>
                    <RadioGroup
                      row
                      name="loss_of_vision_eye"
                      value={formData.loss_of_vision_eye}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="R"
                        control={<Radio />}
                        label="R"
                      />
                      <FormControlLabel
                        value="L"
                        control={<Radio />}
                        label="L"
                      />
                      <FormControlLabel
                        value="Both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Onset</FormLabel>
                    <RadioGroup
                      row
                      name="loss_of_vision_onset"
                      value={formData.loss_of_vision_onset}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Sudden"
                        control={<Radio />}
                        label="Sudden"
                      />
                      <FormControlLabel
                        value="Gradual"
                        control={<Radio />}
                        label="Gradual"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Pain?</FormLabel>
                    <RadioGroup
                      row
                      name="loss_of_vision_pain"
                      value={formData.loss_of_vision_pain}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Duration</FormLabel>
                    <RadioGroup
                      row
                      name="loss_of_vision_duration"
                      value={formData.loss_of_vision_duration}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="<2"
                        control={<Radio />}
                        label="<2"
                      />
                      <FormControlLabel
                        value="2-5"
                        control={<Radio />}
                        label="2-5"
                      />
                      <FormControlLabel
                        value="5+"
                        control={<Radio />}
                        label="5+"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">Redness</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Redness?</FormLabel>
                    <RadioGroup
                      row
                      name="redness"
                      value={formData.redness}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Eye</FormLabel>
                    <RadioGroup
                      row
                      name="redness_eye"
                      value={formData.redness_eye}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="R"
                        control={<Radio />}
                        label="R"
                      />
                      <FormControlLabel
                        value="L"
                        control={<Radio />}
                        label="L"
                      />
                      <FormControlLabel
                        value="Both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Onset</FormLabel>
                    <RadioGroup
                      row
                      name="redness_onset"
                      value={formData.redness_onset}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Sudden"
                        control={<Radio />}
                        label="Sudden"
                      />
                      <FormControlLabel
                        value="Gradual"
                        control={<Radio />}
                        label="Gradual"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Pain?</FormLabel>
                    <RadioGroup
                      row
                      name="redness_pain"
                      value={formData.redness_pain}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Duration</FormLabel>
                    <RadioGroup
                      row
                      name="redness_duration"
                      value={formData.redness_duration}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="<1"
                        control={<Radio />}
                        label="<1"
                      />
                      <FormControlLabel
                        value="1-4"
                        control={<Radio />}
                        label="1-4"
                      />
                      <FormControlLabel
                        value="4+"
                        control={<Radio />}
                        label="4+"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">Watering</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Watering?</FormLabel>
                    <RadioGroup
                      row
                      name="watering"
                      value={formData.watering}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Eye</FormLabel>
                    <RadioGroup
                      row
                      name="watering_eye"
                      value={formData.watering_eye}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="R"
                        control={<Radio />}
                        label="R"
                      />
                      <FormControlLabel
                        value="L"
                        control={<Radio />}
                        label="L"
                      />
                      <FormControlLabel
                        value="Both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Onset</FormLabel>
                    <RadioGroup
                      row
                      name="watering_onset"
                      value={formData.watering_onset}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Sudden"
                        control={<Radio />}
                        label="Sudden"
                      />
                      <FormControlLabel
                        value="Gradual"
                        control={<Radio />}
                        label="Gradual"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Pain?</FormLabel>
                    <RadioGroup
                      row
                      name="watering_pain"
                      value={formData.watering_pain}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Duration</FormLabel>
                    <RadioGroup
                      row
                      name="watering_duration"
                      value={formData.watering_duration}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="<1"
                        control={<Radio />}
                        label="<1"
                      />
                      <FormControlLabel
                        value="1-4"
                        control={<Radio />}
                        label="1-4"
                      />
                      <FormControlLabel
                        value="4+"
                        control={<Radio />}
                        label="4+"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Discharge Type</FormLabel>
                    <RadioGroup
                      row
                      name="discharge_type"
                      value={formData.discharge_type}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Clear"
                        control={<Radio />}
                        label="Clear"
                      />
                      <FormControlLabel
                        value="Sticky"
                        control={<Radio />}
                        label="Sticky"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">Itching</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Itching?</FormLabel>
                    <RadioGroup
                      row
                      name="itching"
                      value={formData.itching}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Eye</FormLabel>
                    <RadioGroup
                      row
                      name="itching_eye"
                      value={formData.itching_eye}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="R"
                        control={<Radio />}
                        label="R"
                      />
                      <FormControlLabel
                        value="L"
                        control={<Radio />}
                        label="L"
                      />
                      <FormControlLabel
                        value="Both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Duration</FormLabel>
                    <RadioGroup
                      row
                      name="itching_duration"
                      value={formData.itching_duration}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="<1"
                        control={<Radio />}
                        label="<1"
                      />
                      <FormControlLabel
                        value="1-4"
                        control={<Radio />}
                        label="1-4"
                      />
                      <FormControlLabel
                        value="4+"
                        control={<Radio />}
                        label="4+"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Additional (Final) Pain
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Pain?</FormLabel>
                    <RadioGroup
                      row
                      name="pain_final"
                      value={formData.pain_final}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Eye</FormLabel>
                    <RadioGroup
                      row
                      name="pain_final_eye"
                      value={formData.pain_final_eye}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="R"
                        control={<Radio />}
                        label="R"
                      />
                      <FormControlLabel
                        value="L"
                        control={<Radio />}
                        label="L"
                      />
                      <FormControlLabel
                        value="Both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Onset</FormLabel>
                    <RadioGroup
                      row
                      name="pain_final_onset"
                      value={formData.pain_final_onset}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Sudden"
                        control={<Radio />}
                        label="Sudden"
                      />
                      <FormControlLabel
                        value="Gradual"
                        control={<Radio />}
                        label="Gradual"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Duration</FormLabel>
                    <RadioGroup
                      row
                      name="pain_final_duration"
                      value={formData.pain_final_duration}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="<1"
                        control={<Radio />}
                        label="<1"
                      />
                      <FormControlLabel
                        value="1-4"
                        control={<Radio />}
                        label="1-4"
                      />
                      <FormControlLabel
                        value="4+"
                        control={<Radio />}
                        label="4+"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">Systemic History</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Hypertension</FormLabel>
                    <RadioGroup
                      row
                      name="htn"
                      value={formData.htn}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Diabetes Mellitus</FormLabel>
                    <RadioGroup
                      row
                      name="dm"
                      value={formData.dm}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Heart Disease</FormLabel>
                    <RadioGroup
                      row
                      name="heart_disease"
                      value={formData.heart_disease}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">Allergy History</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Allergy to Drops</FormLabel>
                    <RadioGroup
                      row
                      name="allergy_drops"
                      value={formData.allergy_drops}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Allergy to Tablets</FormLabel>
                    <RadioGroup
                      row
                      name="allergy_tablets"
                      value={formData.allergy_tablets}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Seasonal Allergies</FormLabel>
                    <RadioGroup
                      row
                      name="seasonal_allergies"
                      value={formData.seasonal_allergies}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Contact Lenses History
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">
                      Use of Contact Lenses
                    </FormLabel>
                    <RadioGroup
                      row
                      name="contact_lenses_use"
                      value={formData.contact_lenses_use}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Duration of Use (Years)"
                    name="contact_lenses_duration"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formData.contact_lenses_duration}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Frequency</FormLabel>
                    <RadioGroup
                      row
                      name="contact_lenses_frequency"
                      value={formData.contact_lenses_frequency}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Daily"
                        control={<Radio />}
                        label="Daily"
                      />
                      <FormControlLabel
                        value="Non-daily"
                        control={<Radio />}
                        label="Non-daily"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Eye Surgical History
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Cataract or Injury</FormLabel>
                    <RadioGroup
                      row
                      name="cataract_or_injury"
                      value={formData.cataract_or_injury}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Retinal Lasers</FormLabel>
                    <RadioGroup
                      row
                      name="retinal_lasers"
                      value={formData.retinal_lasers}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Search for Patient
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Search by name, ID, or phone number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleSearch}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={handleSearchKeyPress}
                  />
                </Grid>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                      Search Results ({searchResults.length})
                    </Typography>
                    {searchResults.map((patient) => (
                      <Tooltip
                        key={patient.gov_id}
                        title="Click to load patient information"
                        arrow
                      >
                        <Paper
                          sx={{
                            p: 2,
                            mb: 2,
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                              cursor: "pointer",
                              boxShadow: 3,
                            },
                            transition: "box-shadow 0.3s ease-in-out",
                          }}
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="subtitle2">Name</Typography>
                              <Typography>{patient.full_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="subtitle2">
                                Government ID
                              </Typography>
                              <Typography>{patient.gov_id}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="subtitle2">
                                Date of Birth
                              </Typography>
                              <Typography>{patient.date_of_birth}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Typography variant="subtitle2">Phone</Typography>
                              <Typography>{patient.phone_number}</Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Tooltip>
                    ))}
                  </Grid>
                )}

                {searchResults.length === 0 &&
                  hasSearched &&
                  searchResults !== null && (
                    <Grid item xs={12}>
                      <Typography color="textSecondary" sx={{ mt: 2 }}>
                        No results found
                      </Typography>
                    </Grid>
                  )}
              </Grid>
            </Box>
          )}

          {/* Only render these buttons when on tab 0 or 1 */}
          {(activeTab === 0 || activeTab === 1) && (
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button variant="outlined" onClick={handleSaveProgress}>
                Save Progress
              </Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          )}

          {submissionMessage && (
            <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
              {submissionMessage}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PatientRegistration;
