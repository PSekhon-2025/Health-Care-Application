import React, { useState, useEffect, FormEvent } from "react";

// Define the shape of our form data based on the new schema
interface PatientFormData {
  gov_id: string; // Government-issued ID (required)
  full_name: string; // Full Name (required)
  date_of_birth: string; // Date of Birth (required)
  relative_name: string; // Relative Name (optional)
  phone_number: string; // Phone Number (required)
  email: string; // Email (optional)
  address: string; // Address (optional)
  latitude: string; // Latitude (optional, as a string for input handling)
  longitude: string; // Longitude (optional)
}

const LOCAL_STORAGE_KEY = "patientFormData";

const PatientForm: React.FC = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    gov_id: "",
    full_name: "",
    date_of_birth: "",
    relative_name: "",
    phone_number: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [submissionMessage, setSubmissionMessage] = useState<string>("");

  // Load saved form data from localStorage on component mount
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

  // Handle input changes for all form elements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate required fields: gov_id, full_name, date_of_birth, and phone_number
  const validateRequiredFields = (): boolean => {
    const { gov_id, full_name, date_of_birth, phone_number } = formData;
    return (
      gov_id.trim() !== "" &&
      full_name.trim() !== "" &&
      date_of_birth.trim() !== "" &&
      phone_number.trim() !== ""
    );
  };

  // Save progress to localStorage
  const handleSaveProgress = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    setSubmissionMessage("Progress saved locally!");
  };

  // Submit form data to the server
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionMessage("");

    if (!validateRequiredFields()) {
      setSubmissionMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server error while submitting form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      setSubmissionMessage("Patient registered successfully!");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setFormData({
        gov_id: "",
        full_name: "",
        date_of_birth: "",
        relative_name: "",
        phone_number: "",
        email: "",
        address: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error(error);
      setSubmissionMessage("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h1>Patient Registration</h1>
      <form onSubmit={handleSubmit}>
        {/* Government-issued ID */}
        <div className="form-group">
          <label htmlFor="gov_id">Government ID*:</label>
          <input
            type="text"
            id="gov_id"
            name="gov_id"
            value={formData.gov_id}
            onChange={handleChange}
            required
          />
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="full_name">Full Name*:</label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth*:</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        {/* Relative Name (optional) */}
        <div className="form-group">
          <label htmlFor="relative_name">Relative Name:</label>
          <input
            type="text"
            id="relative_name"
            name="relative_name"
            value={formData.relative_name}
            onChange={handleChange}
          />
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label htmlFor="phone_number">Phone Number*:</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email (optional) */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Address (optional) */}
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Latitude (optional) */}
        <div className="form-group">
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
          />
        </div>

        {/* Longitude (optional) */}
        <div className="form-group">
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
          />
        </div>

        {/* Form actions */}
        <div className="form-actions">
          <button type="button" onClick={handleSaveProgress}>
            Save Progress
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>

      {/* Display submission messages */}
      {submissionMessage && <p>{submissionMessage}</p>}
    </div>
  );
};

export default PatientForm;
