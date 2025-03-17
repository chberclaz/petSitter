import React, { useState, useEffect, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import AuthContext from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (!profile) {
    return <Alert severity="error">{error || "Failed to load profile"}</Alert>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to="/profile/edit"
          startIcon={<EditIcon />}
          sx={{ mb: 2 }}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Basic Info Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                src={profile.profile_image_url}
                alt={profile.first_name}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" component="h2">
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.email}
              </Typography>
              {profile.phone && (
                <Typography variant="body2" color="text.secondary">
                  {profile.phone}
                </Typography>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" component="h3" gutterBottom>
              About Me
            </Typography>
            <Typography variant="body1" paragraph>
              {profile.bio || "No bio provided yet."}
            </Typography>
            {profile.address && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1">{profile.address}</Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Certificates Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
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
                <SchoolIcon sx={{ mr: 1 }} /> Certificates
              </Typography>
              <Button
                variant="contained"
                size="small"
                component="label"
                startIcon={<AddIcon />}
              >
                Add Certificate
                <input
                  type="file"
                  hidden
                  onChange={async (e) => {
                    if (!e.target.files[0]) return;

                    const formData = new FormData();
                    formData.append("certificate", e.target.files[0]);
                    formData.append("name", "New Certificate");
                    formData.append("issuingOrganization", "");
                    formData.append(
                      "issueDate",
                      new Date().toISOString().split("T")[0]
                    );

                    try {
                      const res = await api.post("/api/certificates", formData);
                      setProfile({
                        ...profile,
                        certificates: [...profile.certificates, res.data],
                      });
                    } catch (err) {
                      console.error("Error uploading certificate:", err);
                    }
                  }}
                />
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {profile.certificates.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You haven't added any certificates yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {profile.certificates.map((cert) => (
                  <Grid item xs={12} sm={6} key={cert.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          cert.file_url ||
                          "https://via.placeholder.com/300x140?text=Certificate"
                        }
                        alt={cert.name}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {cert.name}
                        </Typography>
                        {cert.issuing_organization && (
                          <Typography variant="body2" color="text.secondary">
                            {cert.issuing_organization}
                          </Typography>
                        )}
                        {cert.issue_date && (
                          <Typography variant="body2">
                            Issued:{" "}
                            {new Date(cert.issue_date).toLocaleDateString()}
                          </Typography>
                        )}
                        {cert.expiry_date && (
                          <Typography variant="body2">
                            Expires:{" "}
                            {new Date(cert.expiry_date).toLocaleDateString()}
                          </Typography>
                        )}
                        <Chip
                          label={
                            cert.verified ? "Verified" : "Pending Verification"
                          }
                          color={cert.verified ? "success" : "warning"}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          {/* Work Experience Section */}
          <Paper sx={{ p: 3, mb: 4 }}>
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
                <WorkIcon sx={{ mr: 1 }} /> Work Experience
              </Typography>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to="/profile/add-experience"
                startIcon={<AddIcon />}
              >
                Add Experience
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {profile.work_experiences.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You haven't added any work experience yet.
              </Typography>
            ) : (
              <List>
                {profile.work_experiences.map((exp) => (
                  <ListItem key={exp.id} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" component="div">
                          {exp.title} at {exp.organization}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {new Date(exp.start_date).toLocaleDateString()} -
                            {exp.end_date
                              ? new Date(exp.end_date).toLocaleDateString()
                              : "Present"}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="p"
                            sx={{ mt: 1 }}
                          >
                            {exp.description}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Availability Section */}
          <Paper sx={{ p: 3 }}>
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
                <CalendarIcon sx={{ mr: 1 }} /> Availability
              </Typography>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to="/availability"
                startIcon={<EditIcon />}
              >
                Manage Availability
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {profile.availability_slots.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                You haven't set any availability slots yet.
              </Typography>
            ) : (
              <List>
                {profile.availability_slots.slice(0, 5).map((slot) => (
                  <ListItem key={slot.id} disablePadding>
                    <ListItemText
                      primary={new Date(slot.date).toLocaleDateString()}
                      secondary={`${slot.start_time} - ${slot.end_time} (Max pets: ${slot.max_pets})`}
                    />
                  </ListItem>
                ))}
                {profile.availability_slots.length > 5 && (
                  <Button
                    component={RouterLink}
                    to="/availability"
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    View all availability slots
                  </Button>
                )}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
