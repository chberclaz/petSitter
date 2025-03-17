import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material";
import api from "../utils/api";

const animalTypes = [
  "Dog",
  "Cat",
  "Bird",
  "Fish",
  "Rabbit",
  "Hamster",
  "Guinea Pig",
  "Reptile",
  "Other",
];

const AddPet = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    animalType: "",
    breed: "",
    subBreed: "",
    age: "",
    color: "",
    markers: "",
    allergies: "",
    diet: "",
    preferences: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/pets", formData);
      navigate("/pets");
    } catch (err) {
      console.error("Error adding pet:", err);
      setError(
        err.response?.data?.message || "Failed to add pet. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add a New Pet
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Pet Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Animal Type"
                name="animalType"
                value={formData.animalType}
                onChange={handleChange}
              >
                {animalTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sub-breed"
                name="subBreed"
                value={formData.subBreed}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age (years)"
                name="age"
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                value={formData.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Distinctive Markers"
                name="markers"
                multiline
                rows={2}
                value={formData.markers}
                onChange={handleChange}
                placeholder="Any distinctive marks, scars, or physical characteristics"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                name="allergies"
                multiline
                rows={2}
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List any known allergies"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diet"
                name="diet"
                multiline
                rows={2}
                value={formData.diet}
                onChange={handleChange}
                placeholder="Describe your pet's diet, feeding schedule, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preferences & Habits"
                name="preferences"
                multiline
                rows={3}
                value={formData.preferences}
                onChange={handleChange}
                placeholder="Describe your pet's preferences, habits, likes and dislikes"
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {loading ? "Adding Pet..." : "Add Pet"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/pets")}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddPet;
