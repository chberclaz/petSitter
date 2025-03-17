const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Add availability slot
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { date, startTime, endTime, maxPets, acceptedPetTypes } = req.body;

    const availabilitySlot = await prisma.availability_slot.create({
      data: {
        user_id: req.user.id,
        date: new Date(date),
        start_time: startTime,
        end_time: endTime,
        max_pets: maxPets || 1,
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
    res.status(500).json({ message: "Server error" });
  }
});

// Get all availability slots for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const availabilitySlots = await prisma.availability_slot.findMany({
      where: { user_id: req.user.id },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });

    res.json(availabilitySlots);
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get availability slots for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Only return future availability slots
    const availabilitySlots = await prisma.availability_slot.findMany({
      where: {
        user_id: userId,
        date: {
          gte: new Date(),
        },
      },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });

    res.json(availabilitySlots);
  } catch (error) {
    console.error("Error fetching user availability slots:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an availability slot
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);
    const { date, startTime, endTime, maxPets, acceptedPetTypes } = req.body;

    // Check if slot exists and belongs to user
    const slot = await prisma.availability_slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (slot.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedSlot = await prisma.availability_slot.update({
      where: { id: slotId },
      data: {
        date: date ? new Date(date) : undefined,
        start_time: startTime,
        end_time: endTime,
        max_pets: maxPets,
        accepted_pet_types: acceptedPetTypes,
      },
    });

    res.json(updatedSlot);
  } catch (error) {
    console.error("Error updating availability slot:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an availability slot
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const slotId = parseInt(req.params.id);

    // Check if slot exists and belongs to user
    const slot = await prisma.availability_slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    if (slot.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.availability_slot.delete({
      where: { id: slotId },
    });

    res.json({ message: "Availability slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting availability slot:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
