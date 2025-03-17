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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../utils/api";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    petId: null,
    petName: "",
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get("/api/pets");
        setPets(res.data);
      } catch (err) {
        setError("Failed to load pets");
        console.error(err);
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

  if (loading) {
    return <Typography>Loading pets...</Typography>;
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
          component={RouterLink}
          to="/pets/add"
          startIcon={<AddIcon />}
        >
          Add Pet
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {pets.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" paragraph>
            You haven't added any pets yet.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/pets/add"
            startIcon={<AddIcon />}
          >
            Add Your First Pet
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pets.map((pet) => (
            <Grid item xs={12} sm={6} md={4} key={pet.id}>
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
                  image={`https://via.placeholder.com/300x200?text=${pet.name}`}
                  alt={pet.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {pet.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {pet.animal_type} • {pet.breed || "Unknown breed"} •{" "}
                    {pet.age} years old
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={pet.color}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    {pet.allergies && (
                      <Chip
                        label="Has Allergies"
                        color="warning"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    )}
                  </Box>

                  {pet.diet && (
                    <Typography variant="body2">
                      <strong>Diet:</strong> {pet.diet}
                    </Typography>
                  )}

                  {pet.preferences && (
                    <Typography variant="body2">
                      <strong>Preferences:</strong> {pet.preferences}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/pets/edit/${pet.id}`}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(pet.id, pet.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
    </Container>
  );
};

export default Pets;
