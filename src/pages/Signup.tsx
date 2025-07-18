import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role
  const [village, setVillage] = useState(""); // Only needed for ADMIN
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        username,
        email,
        password,
        role,
        village: role === "ADMIN" ? village : "",
      });

      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Error during signup, please try again.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Logo Area */}
          <Box mb={2}>
            <img src={Logo} alt="Logo" style={{ height: 60, width: 60 }} />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 600, mb: 1 }}
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            mb={3}
          >
            Join our platform and manage your account seamlessly.
          </Typography>

          {/* Signup Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Role Selection Dropdown */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as string)}
              >
                <MenuItem value="USER">Non-Clinical User</MenuItem>
                <MenuItem value="ADMIN">Lower Level Admin</MenuItem>
              </Select>
            </FormControl>

            {/* Village Field (only for ADMIN) */}
            {role === "ADMIN" && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="village"
                label="Village"
                name="village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            )}

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Sign Up
            </Button>
          </Box>

          {/* Link to Sign In */}
          <Box textAlign="center" mt={2}>
            <Link
              variant="body2"
              sx={{ cursor: "pointer", fontWeight: 500 }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
