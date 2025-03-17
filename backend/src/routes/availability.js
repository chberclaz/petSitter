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
router.post("/", async (req, res) => {
  try {
    const { userId, date, startTime, endTime, maxPets, acceptedPetTypes } =
      req.body;

    const newSlot = await prisma.availabilitySlot.create({
      data: {
        user_id: userId,
        date: new Date(date),
        start_time: startTime,
        end_time: endTime,
        max_pets: maxPets || 1,
        accepted_pet_types: acceptedPetTypes || ["Dog", "Cat", "Bird"],
      },
    });

    res.status(201).json(newSlot);
  } catch (error) {
    console.error("Error creating availability slot:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Availability route working" });
});

module.exports = router;
