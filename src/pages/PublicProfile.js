import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  TextField,
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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  List,
  ListItem,
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

const PublicProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile");
      setProfile(res.data);
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      {/* Rest of the component content */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Availability
        </Typography>
        {profile.availability_slots.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            This user hasn't set any availability yet.
          </Typography>
        ) : (
          <List>
            {profile.availability_slots.map((slot) => (
              <ListItem key={slot.id}>
                <ListItemText
                  primary={`${new Date(slot.date).toLocaleDateString()} (${
                    slot.start_time
                  } - ${slot.end_time})`}
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Max pets: {slot.max_pets}
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ mr: 1 }}
                        >
                          Accepts:
                        </Typography>
                        {(slot.accepted_pet_types || ["All pet types"]).map(
                          (type) => (
                            <Chip key={type} label={type} size="small" />
                          )
                        )}
                      </Box>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default PublicProfile;
