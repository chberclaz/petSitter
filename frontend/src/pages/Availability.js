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
  Chip,
  Box,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { addDays, format } from "date-fns";
import api from "../utils/api";

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

const Availability = () => {
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    maxPets: 1,
    acceptedPetTypes: petTypes,
  });

  // New state for series creation
  const [createSeries, setCreateSeries] = useState(false);
  const [seriesEndDate, setSeriesEndDate] = useState(addDays(new Date(), 7));
  const [seriesFrequency, setSeriesFrequency] = useState("daily"); // daily, weekly, custom
  const [customDays, setCustomDays] = useState(1); // For custom frequency

  useEffect(() => {
    fetchAvailabilitySlots();
  }, []);

  const fetchAvailabilitySlots = async () => {
    try {
      const res = await api.get("/api/availability");
      setAvailabilitySlots(res.data);
    } catch (err) {
      console.error("Error fetching availability slots:", err);
      setError("Failed to load availability slots");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slot = null) => {
    if (slot) {
      // Edit existing slot
      setEditingSlot(slot);
      setFormData({
        date: new Date(slot.date),
        startTime: slot.start_time,
        endTime: slot.end_time,
        maxPets: slot.max_pets,
        acceptedPetTypes: slot.accepted_pet_types || petTypes,
      });
      setCreateSeries(false); // Disable series creation when editing
    } else {
      // Add new slot
      setEditingSlot(null);
      setFormData({
        date: new Date(),
        startTime: "09:00",
        endTime: "17:00",
        maxPets: 1,
        acceptedPetTypes: petTypes,
      });
      setSeriesEndDate(addDays(new Date(), 7));
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCreateSeries(false);
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

    // Update series end date if it's before the start date
    if (createSeries && seriesEndDate < newDate) {
      setSeriesEndDate(addDays(newDate, 7));
    }
  };

  const handleSeriesEndDateChange = (newDate) => {
    setSeriesEndDate(newDate);
  };

  const handleSeriesFrequencyChange = (e) => {
    setSeriesFrequency(e.target.value);
  };

  const handleCustomDaysChange = (e) => {
    setCustomDays(parseInt(e.target.value) || 1);
  };

  const generateSeriesDates = () => {
    const dates = [];
    let currentDate = new Date(formData.date);
    const endDate = new Date(seriesEndDate);

    // Calculate the day increment based on frequency
    let dayIncrement = 1; // daily
    if (seriesFrequency === "weekly") {
      dayIncrement = 7;
    } else if (seriesFrequency === "custom") {
      dayIncrement = customDays;
    }

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, dayIncrement);
    }

    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Make sure the token is in the headers
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      if (editingSlot) {
        // Update existing slot
        const res = await api.put(`/api/availability/${editingSlot.id}`, {
          date: formData.date.toISOString().split("T")[0],
          startTime: formData.startTime,
          endTime: formData.endTime,
          maxPets: formData.maxPets,
          acceptedPetTypes: formData.acceptedPetTypes,
        });

        setAvailabilitySlots(
          availabilitySlots.map((slot) =>
            slot.id === editingSlot.id ? res.data : slot
          )
        );
      } else if (createSeries) {
        // Create a series of slots
        const dates = generateSeriesDates();
        const newSlots = [];

        // Create each slot in the series
        for (const date of dates) {
          const res = await api.post("/api/availability", {
            date: date.toISOString().split("T")[0],
            startTime: formData.startTime,
            endTime: formData.endTime,
            maxPets: formData.maxPets,
            acceptedPetTypes: formData.acceptedPetTypes,
          });

          newSlots.push(res.data);
        }

        setAvailabilitySlots([...availabilitySlots, ...newSlots]);
      } else {
        // Add a single new slot
        const res = await api.post("/api/availability", {
          date: formData.date.toISOString().split("T")[0],
          startTime: formData.startTime,
          endTime: formData.endTime,
          maxPets: formData.maxPets,
          acceptedPetTypes: formData.acceptedPetTypes,
        });

        setAvailabilitySlots([...availabilitySlots, res.data]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("Error saving availability slot:", err);
      setError(
        err.response?.data?.message || "Failed to save availability slot"
      );
    }
  };

  const handleDelete = async (slotId) => {
    try {
      await api.delete(`/api/availability/${slotId}`);
      setAvailabilitySlots(
        availabilitySlots.filter((slot) => slot.id !== slotId)
      );
    } catch (err) {
      console.error("Error deleting availability slot:", err);
      setError("Failed to delete availability slot");
    }
  };

  if (loading) {
    return <Typography>Loading availability...</Typography>;
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
          My Availability
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Availability
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {availabilitySlots.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" paragraph>
              You haven't set any availability slots yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Your First Availability Slot
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Max Pets</TableCell>
                  <TableCell>Accepted Pet Types</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availabilitySlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>
                      {new Date(slot.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{slot.start_time}</TableCell>
                    <TableCell>{slot.end_time}</TableCell>
                    <TableCell>{slot.max_pets}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(slot.accepted_pet_types || petTypes).map((type) => (
                          <Chip key={type} label={type} size="small" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(slot)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(slot.id)}
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
          {editingSlot ? "Edit Availability Slot" : "Add Availability Slot"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Pets"
                  name="maxPets"
                  type="number"
                  value={formData.maxPets}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="pet-types-label">
                    Accepted Pet Types
                  </InputLabel>
                  <Select
                    labelId="pet-types-label"
                    id="pet-types"
                    multiple
                    value={formData.acceptedPetTypes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptedPetTypes: e.target.value,
                      })
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {petTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Series Creation Section - Only show when adding new slots */}
              {!editingSlot && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Divider>
                      <Chip label="Create Series" />
                    </Divider>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={createSeries}
                        onChange={(e) => setCreateSeries(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Create a series of availability slots"
                  />

                  {createSeries && (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Series End Date"
                              value={seriesEndDate}
                              onChange={handleSeriesEndDateChange}
                              minDate={formData.date}
                              renderInput={(params) => (
                                <TextField {...params} fullWidth />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel id="frequency-label">
                              Frequency
                            </InputLabel>
                            <Select
                              labelId="frequency-label"
                              id="frequency"
                              value={seriesFrequency}
                              onChange={handleSeriesFrequencyChange}
                            >
                              <MenuItem value="daily">Daily</MenuItem>
                              <MenuItem value="weekly">Weekly</MenuItem>
                              <MenuItem value="custom">Custom</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {seriesFrequency === "custom" && (
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Days Between Slots"
                              type="number"
                              value={customDays}
                              onChange={handleCustomDaysChange}
                              inputProps={{ min: 1 }}
                              helperText="Enter the number of days between each availability slot"
                            />
                          </Grid>
                        )}

                        <Grid item xs={12}>
                          <Alert severity="info">
                            This will create {generateSeriesDates().length}{" "}
                            availability slots from{" "}
                            {format(formData.date, "MMM d, yyyy")} to{" "}
                            {format(seriesEndDate, "MMM d, yyyy")}.
                          </Alert>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSlot ? "Update" : createSeries ? "Create Series" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Availability;
