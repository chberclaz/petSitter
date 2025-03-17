import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../utils/api";
import "../styles/Pets.css";

const petTypes = [
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

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    petId: null,
    petName: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    preferences: "",
    image: "",
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get("/api/pets");
        console.log("Fetched pets:", res.data);
        setPets(res.data);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleDeleteClick = (petId, petName) => {
    setDeleteDialog({ open: true, petId, petName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/pets/${deleteDialog.petId}`);
      setPets(pets.filter((pet) => pet.id !== deleteDialog.petId));
      setDeleteDialog({ open: false, petId: null, petName: "" });
    } catch (err) {
      console.error("Error deleting pet:", err);
      setError("Failed to delete pet");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, petId: null, petName: "" });
  };

  const handleOpenDialog = (pet = null) => {
    if (pet) {
      // Edit existing pet
      setEditingPet(pet);
      setFormData({
        name: pet.name,
        type: pet.animal_type || "Dog",
        breed: pet.breed || "",
        age: pet.age || "",
        preferences: pet.preferences || "",
        image: pet.image || "",
      });
    } else {
      // Add new pet
      setEditingPet(null);
      setFormData({
        name: "",
        type: "Dog",
        breed: "",
        age: "",
        preferences: "",
        image: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingPet) {
        // Update existing pet
        const res = await api.put(`/api/pets/${editingPet.id}`, {
          name: formData.name,
          animal_type: formData.type,
          breed: formData.breed,
          age: formData.age ? parseInt(formData.age) : null,
          preferences: formData.preferences,
          image: formData.image,
        });

        setPets(pets.map((pet) => (pet.id === editingPet.id ? res.data : pet)));
      } else {
        // Add new pet
        const res = await api.post("/api/pets", {
          name: formData.name,
          animal_type: formData.type,
          breed: formData.breed,
          age: formData.age ? parseInt(formData.age) : null,
          preferences: formData.preferences,
          image: formData.image,
        });

        setPets([...pets, res.data]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving pet:", err);
      setError(err.response?.data?.message || "Failed to save pet");
    }
  };

  const handleDelete = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await api.delete(`/api/pets/${petId}`);
        setPets(pets.filter((pet) => pet.id !== petId));
      } catch (err) {
        console.error("Error deleting pet:", err);
        setError("Failed to delete pet");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          My Pets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Pet
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {pets.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" paragraph>
                You haven't added any pets yet.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Your First Pet
              </Button>
            </Box>
          </Grid>
        ) : (
          pets.map((pet) => (
            <Grid item xs={12} sm={12} md={6} lg={6} key={pet.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "450px",
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    pet.image ||
                    `https://source.unsplash.com/random/300x200/?${(
                      pet.animal_type || "pet"
                    ).toLowerCase()}`
                  }
                  alt={pet.name || "Pet"}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {pet.name || "Unnamed Pet"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Type:</strong> {pet.animal_type || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Breed:</strong> {pet.breed || "Not specified"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Age:</strong>{" "}
                    {pet.age ? `${pet.age} years` : "Not specified"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Special Notes:</strong> {pet.preferences || "None"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleOpenDialog(pet)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(pet.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Pet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {deleteDialog.petName}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingPet ? "Edit Pet" : "Add Pet"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pet Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="pet-type-label">Pet Type</InputLabel>
                  <Select
                    labelId="pet-type-label"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    {petTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  label="Age (years)"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Image URL (optional)"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/pet-image.jpg"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Preferences"
                  name="preferences"
                  multiline
                  rows={4}
                  value={formData.preferences}
                  onChange={handleChange}
                  placeholder="Any special care instructions, dietary needs, or other important information..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPet ? "Update" : "Add Pet"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Inline styles
const styles = {
  petsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    width: "100%",
  },
  petsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  addPetButton: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "500",
  },
  noPets: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginTop: "20px",
  },
  petsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
    width: "100%",
  },
  petCard: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  petCardImage: {
    height: "200px",
    overflow: "hidden",
  },
  petImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  petCardContent: {
    padding: "20px",
    flexGrow: "1",
    display: "flex",
    flexDirection: "column",
  },
  petName: {
    marginTop: "0",
    marginBottom: "15px",
    color: "#333",
    fontSize: "1.5rem",
    borderBottom: "2px solid #4caf50",
    paddingBottom: "8px",
  },
  petDetails: {
    flexGrow: "1",
    marginBottom: "15px",
  },
  petLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  petCardActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "auto",
  },
  editPetButton: {
    color: "#2196F3",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "1.2rem",
    color: "#666",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px 15px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #f5c6cb",
  },
};

export default Pets;
