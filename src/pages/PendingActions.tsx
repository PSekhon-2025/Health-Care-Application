import { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";
// Removed unused `useNavigate` import
import axios from "axios";

// Define the interface for a pending user
interface PendingUser {
  id: string;
  username: string;
  email: string;
  role: string;
  village?: string;
}

const PendingActions: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  // Function to fetch all pending users (approved = false)
  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/pending-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingUsers(response.data);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Approve a user
  const handleApprove = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/admin/approve/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh list
      fetchPendingUsers();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Handler to delete a user
  const handleDelete = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the list after deletion
      fetchPendingUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pending User Approvals
      </Typography>
      <Grid container spacing={2}>
        {pendingUsers.map((user) => (
          <Grid item xs={12} key={user.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{user.username}</Typography>
                <Typography variant="body2">Email: {user.email}</Typography>
                <Typography variant="body2">Role: {user.role}</Typography>
                <Typography variant="body2">
                  Village: {user.village || "N/A"}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(user.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PendingActions;
