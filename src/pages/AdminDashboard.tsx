import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    pendingActions: 0,
    activeCamps: 0,
  });

  // NEW: State for camps
  const [camps, setCamps] = useState<any[]>([]);

  const navigate = useNavigate();

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // NEW: Fetch camps from backend
  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/admin/camps", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch camps");
        }

        const data = await response.json();
        setCamps(data);
      } catch (error) {
        console.error("Error fetching camps:", error);
      }
    };

    // Call it once on component mount (or whenever you'd like to refresh)
    fetchCamps();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Back Arrow Button and Title */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <IconButton onClick={() => navigate("/dashboard")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Admin Dashboard
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Account Management" />
          <Tab label="Camp Management" />
          <Tab label="Reports" />
          <Tab label="Settings" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Grid container spacing={3}>
              {/* Quick Stats Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h5">{stats.totalUsers}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Active Camps
                    </Typography>
                    <Typography variant="h5">{stats.activeCamps}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Patients
                    </Typography>
                    <Typography variant="h5">{stats.totalPatients}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/pendingActions")}
                >
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Pending Actions
                    </Typography>
                    <Typography variant="h5">{stats.pendingActions}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {}}
                    >
                      New Camp
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<PeopleIcon />}
                      onClick={() => {}}
                    >
                      Add User
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<AssessmentIcon />}
                      onClick={() => {}}
                    >
                      Generate Report
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Account Management Tab */}
        {activeTab === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {}}
                  >
                    Add New User
                  </Button>
                </Box>
                <List>
                  {["Admin User", "Camp Manager", "Field Worker"].map(
                    (user) => (
                      <ListItem key={user} divider>
                        <ListItemText
                          primary={user}
                          secondary="user@example.com"
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  )}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Camp Management Tab */}
        {activeTab === 2 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/createCamp")}
                  >
                    Create New Camp
                  </Button>
                </Box>

                {/* Display camps from state */}
                {camps.map((camp) => (
                  <Card key={camp.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{camp.camp_name}</Typography>
                      <Typography color="textSecondary">
                        {camp.camp_location}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => {}}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<LocationIcon />}
                        onClick={() => {}}
                      >
                        View Location
                      </Button>
                      <Button
                        size="small"
                        startIcon={<AssessmentIcon />}
                        onClick={() => {}}
                      >
                        Reports
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Reports Tab */}
        {activeTab === 3 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Patient Statistics</Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AssessmentIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => {}}
                    >
                      Generate Patient Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Camp Statistics</Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CampaignIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => {}}
                    >
                      Generate Camp Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <List>
                  <ListItem component="button" onClick={() => {}}>
                    <ListItemText
                      primary="General Settings"
                      secondary="Configure general application settings"
                    />
                    <SettingsIcon />
                  </ListItem>
                  <Divider />
                  <ListItem component="button" onClick={() => {}}>
                    <ListItemText
                      primary="User Permissions"
                      secondary="Manage user roles and permissions"
                    />
                    <PeopleIcon />
                  </ListItem>
                  <Divider />
                  <ListItem component="button" onClick={() => {}}>
                    <ListItemText
                      primary="Camp Settings"
                      secondary="Configure camp-related settings"
                    />
                    <CampaignIcon />
                  </ListItem>
                  <Divider />
                  <ListItem component="button" onClick={() => {}}>
                    <ListItemText
                      primary="Report Settings"
                      secondary="Configure report generation settings"
                    />
                    <AssessmentIcon />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
