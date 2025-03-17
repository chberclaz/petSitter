import React, { useContext, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  Pets as PetsIcon,
  CalendarMonth as CalendarIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import AuthContext from "../context/AuthContext";
import api from "../utils/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [petsRes, requestsRes, assignmentsRes, availableRes] =
          await Promise.all([
            api.get("/api/pets"),
            api.get("/api/requests/my-requests"),
            api.get("/api/requests/my-assignments"),
            api.get("/api/requests/available"),
          ]);

        setPets(petsRes.data);
        setRequests(requestsRes.data);
        setAssignments(assignmentsRes.data);
        setAvailableRequests(availableRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.firstName}!
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* My Pets Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <PetsIcon sx={{ mr: 1 }} /> My Pets
              </Typography>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to="/pets/add"
                startIcon={<AddIcon />}
              >
                Add Pet
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {pets.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You haven't added any pets yet.
              </Typography>
            ) : (
              <List>
                {pets.slice(0, 3).map((pet) => (
                  <ListItem key={pet.id} disablePadding>
                    <ListItemText
                      primary={pet.name}
                      secondary={`${pet.animal_type} - ${
                        pet.breed || "Unknown breed"
                      }`}
                    />
                  </ListItem>
                ))}
                {pets.length > 3 && (
                  <Button
                    component={RouterLink}
                    to="/pets"
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    View all pets
                  </Button>
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* My Requests Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <AssignmentIcon sx={{ mr: 1 }} /> My Sitting Requests
              </Typography>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to="/requests/create"
                startIcon={<AddIcon />}
              >
                Create Request
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {requests.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You haven't created any sitting requests yet.
              </Typography>
            ) : (
              <List>
                {requests.slice(0, 3).map((request) => (
                  <ListItem key={request.id} disablePadding>
                    <ListItemText
                      primary={`${request.pet.name} - ${new Date(
                        request.start_datetime
                      ).toLocaleDateString()}`}
                      secondary={`Status: ${request.status}`}
                    />
                  </ListItem>
                ))}
                {requests.length > 3 && (
                  <Button
                    component={RouterLink}
                    to="/requests"
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    View all requests
                  </Button>
                )}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Available Requests Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
              <CalendarIcon sx={{ mr: 1 }} /> Available Sitting Requests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {availableRequests.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No available sitting requests match your availability.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {availableRequests.slice(0, 3).map((request) => (
                  <Grid item xs={12} sm={6} md={4} key={request.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {request.pet.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.pet.animal_type} -{" "}
                          {request.pet.breed || "Unknown breed"}
                        </Typography>
                        <Typography variant="body2">
                          From:{" "}
                          {new Date(request.start_datetime).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          To: {new Date(request.end_datetime).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          Owner: {request.requester.first_name}{" "}
                          {request.requester.last_name}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={async () => {
                            try {
                              await api.post(
                                `/api/requests/${request.id}/apply`
                              );
                              setAvailableRequests(
                                availableRequests.filter(
                                  (r) => r.id !== request.id
                                )
                              );
                              // Refresh assignments
                              const res = await api.get(
                                "/api/requests/my-assignments"
                              );
                              setAssignments(res.data);
                            } catch (err) {
                              console.error("Error applying for request:", err);
                            }
                          }}
                        >
                          Apply
                        </Button>
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/profile/${request.requester.id}`}
                        >
                          View Owner
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
