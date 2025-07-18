import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle the login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", { email, password });
      console.log("Login successful:", response.data);

      // Save JWT to localStorage
      localStorage.setItem("token", response.data.token);

      // Decode the token to get the user role
      const decodedToken = JSON.parse(
        atob(response.data.token.split(".")[1])
      );
      const userRole = decodedToken.role;

      // Redirect based on role
      if (userRole === "SUPER_ADMIN") {
        navigate("/dashboard"); // e.g. route for super admins
      } else if (userRole === "ADMIN" || userRole === "USER") {
        navigate("/camp"); // e.g. route for lower-level admins
      } else {
        navigate("/"); // route for normal users
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials, please try again.");
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
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Logo Area */}
          <Box mb={2}>
            <img src={Logo} alt="Logo" style={{ height: 50, width: 50 }} />
          </Box>

          <Typography component="h1" variant="h5">
            Sign In
          </Typography>

          {/* The form for logging in */}
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>

          {/* IMPORTANT: Link is OUTSIDE the <form> to avoid accidental form submission */}
          <Box textAlign="center">
            <Link
              variant="body2"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Don&apos;t have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
