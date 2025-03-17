import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../utils/api";

const SittingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [pets, setPets] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    petId: "",
    availabilityId: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch sitting requests
      const requestsRes = await api.get("/api/sitting-requests");
      setRequests(requestsRes.data);

      // Fetch user's pets
      const petsRes = await api.get("/api/pets");
      setPets(petsRes.data);

      // Fetch available slots
      const availabilityRes = await api.get("/api/availability");
      setAvailabilitySlots(availabilityRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request = null) => {
    if (request) {
      // Edit existing request
      setEditingRequest(request);
      setFormData({
        petId: request.pet_id,
        availabilityId: request.availability_id,
        date: new Date(request.date),
        startTime: request.start_time,
        endTime: request.end_time,
        notes: request.notes || "",
      });
    } else {
      // Add new request
      setEditingRequest(null);
      setFormData({
        petId: pets.length > 0 ? pets[0].id : "",
        availabilityId:
          availabilitySlots.length > 0 ? availabilitySlots[0].id : "",
        date: new Date(),
        startTime: "09:00",
        endTime: "17:00",
        notes: "",
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

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate,
    });
  };

  const handleAvailabilitySelect = (availabilityId) => {
    const selectedSlot = availabilitySlots.find(
      (slot) => slot.id === availabilityId
    );
    if (selectedSlot) {
      setFormData({
        ...formData,
        availabilityId,
        date: new Date(selectedSlot.date),
        startTime: selectedSlot.start_time,
        endTime: selectedSlot.end_time,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingRequest) {
        // Update existing request
        const res = await api.put(
          `/api/sitting-requests/${editingRequest.id}`,
          {
            petId: formData.petId,
            availabilityId: formData.availabilityId,
            date: formData.date.toISOString().split("T")[0],
            startTime: formData.startTime,
            endTime: formData.endTime,
            notes: formData.notes,
          }
        );

        setRequests(
          requests.map((req) => (req.id === editingRequest.id ? res.data : req))
        );
      } else {
        // Add new request
        const res = await api.post("/api/sitting-requests", {
          petId: formData.petId,
          availabilityId: formData.availabilityId,
          date: formData.date.toISOString().split("T")[0],
          startTime: formData.startTime,
          endTime: formData.endTime,
          notes: formData.notes,
        });

        setRequests([...requests, res.data]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving sitting request:", err);
      setError(err.response?.data?.message || "Failed to save sitting request");
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await api.delete(`/api/sitting-requests/${requestId}`);
        setRequests(requests.filter((req) => req.id !== requestId));
      } catch (err) {
        console.error("Error deleting sitting request:", err);
        setError("Failed to delete sitting request");
      }
    }
  };

  const getPetName = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : "Unknown Pet";
  };

  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "pending":
        color = "warning";
        break;
      case "approved":
        color = "success";
        break;
      case "rejected":
        color = "error";
        break;
      default:
        color = "default";
    }
    return <Chip label={status} color={color} size="small" />;
  };

  if (loading) {
    return <Typography>Loading sitting requests...</Typography>;
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
          My Sitting Requests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            console.log("New Request button clicked");
            handleOpenDialog();
          }}
          disabled={pets.length === 0 || availabilitySlots.length === 0}
        >
          New Request
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {pets.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You need to add a pet before you can create a sitting request.
        </Alert>
      )}

      {availabilitySlots.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No availability slots found. Please try again later.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {requests.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" paragraph>
              You haven't made any sitting requests yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                console.log("Create First Request button clicked");
                handleOpenDialog();
              }}
              disabled={pets.length === 0 || availabilitySlots.length === 0}
            >
              Create Your First Request
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pet</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{getPetName(request.pet_id)}</TableCell>
                    <TableCell>
                      {new Date(request.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{`${request.start_time} - ${request.end_time}`}</TableCell>
                    <TableCell>{getStatusChip(request.status)}</TableCell>
                    <TableCell>{request.notes}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(request)}
                        disabled={request.status !== "pending"}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(request.id)}
                        disabled={request.status !== "pending"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRequest ? "Edit Sitting Request" : "New Sitting Request"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="pet-label">Pet</InputLabel>
                  <Select
                    labelId="pet-label"
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleChange}
                  >
                    {pets.map((pet) => (
                      <MenuItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.type || "Unknown"})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="availability-label">
                    Available Slot
                  </InputLabel>
                  <Select
                    labelId="availability-label"
                    id="availabilityId"
                    name="availabilityId"
                    value={formData.availabilityId}
                    onChange={(e) => {
                      handleChange(e);
                      handleAvailabilitySelect(e.target.value);
                    }}
                  >
                    {availabilitySlots.map((slot) => (
                      <MenuItem key={slot.id} value={slot.id}>
                        {new Date(slot.date).toLocaleDateString()} (
                        {slot.start_time} - {slot.end_time})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions or information about your pet..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRequest ? "Update" : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SittingRequests;
