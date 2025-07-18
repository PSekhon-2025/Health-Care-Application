import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
}

const CreateCamp: React.FC = () => {
  const navigate = useNavigate();
  const [campName, setCampName] = useState("");
  const [campLocation, setCampLocation] = useState("");
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedAdminIds, setSelectedAdminIds] = useState<number[]>([]);
  const [error, setError] = useState("");

  // Fetch all users from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/admin/allUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  // Handle checkbox toggles for USER or ADMIN
  const handleCheckboxChange = (userId: number, role: string) => {
    if (role === "USER") {
      setSelectedUserIds((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    } else if (role === "ADMIN") {
      setSelectedAdminIds((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!campName.trim()) {
      setError("Camp name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/admin/camps",
        {
          campName,
          campLocation,
          userIds: selectedUserIds,
          adminIds: selectedAdminIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Camp created:", response.data);

      // Navigate back to Admin Dashboard (Camp Management tab)
      navigate("/admin");
    } catch (err) {
      console.error("Error creating camp:", err);
      setError("Error creating camp. Please try again.");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5" gutterBottom>
            Create a New Camp
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Camp Name"
              value={campName}
              onChange={(e) => setCampName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Camp Location"
              value={campLocation}
              onChange={(e) => setCampLocation(e.target.value)}
            />

            <Box mt={2}>
              <Typography variant="h6">Assign Users</Typography>
              {allUsers
                .filter((u) => u.role === "USER")
                .map((user) => (
                  <FormControlLabel
                    key={user.id}
                    control={
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id, user.role)}
                      />
                    }
                    label={`${user.username} (${user.email})`}
                  />
                ))}
            </Box>

            <Box mt={2}>
              <Typography variant="h6">Assign Admins</Typography>
              {allUsers
                .filter((u) => u.role === "ADMIN")
                .map((admin) => (
                  <FormControlLabel
                    key={admin.id}
                    control={
                      <Checkbox
                        checked={selectedAdminIds.includes(admin.id)}
                        onChange={() =>
                          handleCheckboxChange(admin.id, admin.role)
                        }
                      />
                    }
                    label={`${admin.username} (${admin.email})`}
                  />
                ))}
            </Box>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Camp
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateCamp;
