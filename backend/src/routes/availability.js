const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all availability slots for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const availabilitySlots = await prisma.availabilitySlot.findMany({
      where: { user_id: req.user.id },
    });
    res.json(availabilitySlots);
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all availability slots
router.get("/", async (req, res) => {
  try {
    const availabilitySlots = await prisma.availabilitySlot.findMany();
    res.json(availabilitySlots);
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new availability slot
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { date, startTime, endTime, maxPets, acceptedPetTypes } = req.body;

    // Make sure we have the authenticated user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("Creating availability slot for user:", req.user.id);

    const availabilitySlot = await prisma.availabilitySlot.create({
      data: {
        user_id: req.user.id,
        date: new Date(date),
        start_time: startTime,
        end_time: endTime,
        max_pets: parseInt(maxPets) || 1,
        accepted_pet_types: acceptedPetTypes || [
          "Dog",
          "Cat",
          "Bird",
          "Fish",
          "Rabbit",
          "Hamster",
          "Guinea Pig",
          "Reptile",
          "Other",
        ],
      },
    });

    res.status(201).json(availabilitySlot);
  } catch (error) {
    console.error("Error adding availability slot:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Availability route working" });
});

// Also update the PUT route for editing existing slots
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);
    const { date, startTime, endTime, maxPets, acceptedPetTypes } = req.body;

    // Check if slot exists and belongs to user
    const slot = await prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (slot.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedSlot = await prisma.availabilitySlot.update({
      where: { id: slotId },
      data: {
        date: date ? new Date(date) : undefined,
        start_time: startTime,
        end_time: endTime,
        max_pets: maxPets ? parseInt(maxPets) : undefined,
        accepted_pet_types: acceptedPetTypes,
      },
    });

    res.json(updatedSlot);
  } catch (error) {
    console.error("Error updating availability slot:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
