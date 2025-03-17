import React, { useState, useEffect } from "react";
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
  CardMedia,
  CardActions,
  Avatar,
  Rating,
} from "@mui/material";
import { Pets as PetsIcon } from "@mui/icons-material";
import api from "../utils/api";

const Home = () => {
  const [topSitters, setTopSitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSitters = async () => {
      try {
        // In a real app, you'd have an endpoint to get top-rated sitters
        // For now, we'll just get some random users
        const res = await api.get("/api/users/top-sitters");
        setTopSitters(res.data);
      } catch (err) {
        console.error("Error fetching top sitters:", err);
        // Fallback to sample data
        setTopSitters([
          {
            id: 1,
            first_name: "Jane",
            last_name: "Doe",
            profile_image_url: "https://via.placeholder.com/150",
            bio: "Experienced pet sitter with 5 years of experience caring for dogs, cats, and small animals.",
            rating: 4.8,
          },
          {
            id: 2,
            first_name: "John",
            last_name: "Smith",
            profile_image_url: "https://via.placeholder.com/150",
            bio: "Animal lover with veterinary assistant background. Specialized in caring for dogs with special needs.",
            rating: 4.7,
          },
          {
            id: 3,
            first_name: "Emily",
            last_name: "Johnson",
            profile_image_url: "https://via.placeholder.com/150",
            bio: "Certified dog trainer and pet sitter. I provide exercise, training, and lots of love for your furry friends.",
            rating: 4.9,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSitters();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Find the Perfect Pet Sitter
              </Typography>
              <Typography variant="h5" paragraph>
                Connect with trusted pet sitters in your area who will treat
                your pets like family.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ mr: 2 }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/login"
                >
                  Log In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-image.jpg"
                alt="Happy dog with pet sitter"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, height: "100%", textAlign: "center" }}
            >
              <Box sx={{ fontSize: 60, color: "primary.main", mb: 2 }}>1</Box>
              <Typography variant="h5" component="h3" gutterBottom>
                Create Your Profile
              </Typography>
              <Typography variant="body1">
                Sign up and create your profile. Add your pets, certifications,
                and set your availability if you want to offer pet sitting
                services.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, height: "100%", textAlign: "center" }}
            >
              <Box sx={{ fontSize: 60, color: "primary.main", mb: 2 }}>2</Box>
              <Typography variant="h5" component="h3" gutterBottom>
                Connect
              </Typography>
              <Typography variant="body1">
                Browse pet sitters in your area or create a sitting request for
                your pets. Find the perfect match based on experience and
                availability.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 3, height: "100%", textAlign: "center" }}
            >
              <Box sx={{ fontSize: 60, color: "primary.main", mb: 2 }}>3</Box>
              <Typography variant="h5" component="h3" gutterBottom>
                Relax
              </Typography>
              <Typography variant="body1">
                Your pets are in good hands! After the sitting is complete,
                leave a review to help other pet owners find great sitters.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Pet Sitters Section */}
      <Box sx={{ bgcolor: "grey.100", py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Featured Pet Sitters
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {loading ? (
              <Typography align="center" sx={{ width: "100%" }}>
                Loading featured sitters...
              </Typography>
            ) : (
              topSitters.map((sitter) => (
                <Grid item xs={12} sm={6} md={4} key={sitter.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        sitter.profile_image_url ||
                        "https://via.placeholder.com/300x200?text=Pet+Sitter"
                      }
                      alt={`${sitter.first_name} ${sitter.last_name}`}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          src={sitter.profile_image_url}
                          alt={sitter.first_name}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="h6" component="div">
                          {sitter.first_name} {sitter.last_name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Rating
                          value={sitter.rating}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({sitter.rating})
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {sitter.bio}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={RouterLink}
                        to={`/profile/${sitter.id}`}
                      >
                        View Profile
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          What Pet Owners Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontStyle: "italic" }}
              >
                "I was nervous about leaving my senior dog with someone new, but
                our sitter was amazing! She sent updates and photos throughout
                the day, and my dog was so happy when I got home."
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2 }}>M</Avatar>
                <Typography variant="subtitle1">Maria T.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontStyle: "italic" }}
              >
                "As a pet sitter on this platform, I've met so many wonderful
                pets and their owners. The verification process makes everyone
                feel secure, and the calendar system makes scheduling a breeze!"
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2 }}>J</Avatar>
                <Typography variant="subtitle1">James L.</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="body1"
                paragraph
                sx={{ fontStyle: "italic" }}
              >
                "I have three cats with different personalities and needs. Our
                sitter took the time to understand each one and followed their
                routines perfectly. I'll definitely book again!"
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 2 }}>S</Avatar>
                <Typography variant="subtitle1">Sarah K.</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          py: 6,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Find the Perfect Pet Sitter?
          </Typography>
          <Typography variant="h6" paragraph>
            Join our community of pet lovers today!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
