const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all sitting requests for the authenticated user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all pets owned by the user
    const userPets = await prisma.pet.findMany({
      where: { user_id: userId },
      select: { id: true },
    });

    const petIds = userPets.map((pet) => pet.id);

    // Get all sitting requests for the user's pets
    const sittingRequests = await prisma.sittingRequest.findMany({
      where: {
        pet_id: {
          in: petIds,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json(sittingRequests);
  } catch (error) {
    console.error("Error fetching sitting requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new sitting request
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { petId, availabilityId, date, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Verify the pet belongs to the user
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet || pet.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You can only create requests for your own pets" });
    }

    // Verify the availability slot exists
    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Create the sitting request
    const sittingRequest = await prisma.sittingRequest.create({
      data: {
        pet_id: petId,
        availability_id: availabilityId,
        date: new Date(date),
        start_time: startTime,
        end_time: endTime,
        notes: notes,
        status: "pending",
      },
    });

    res.status(201).json(sittingRequest);
  } catch (error) {
    console.error("Error creating sitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific sitting request
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const sittingRequest = await prisma.sittingRequest.findUnique({
      where: { id: parseInt(id) },
      include: { pet: true },
    });

    if (!sittingRequest) {
      return res.status(404).json({ message: "Sitting request not found" });
    }

    // Verify the request is for a pet owned by the user
    if (sittingRequest.pet.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(sittingRequest);
  } catch (error) {
    console.error("Error fetching sitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a sitting request
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { petId, availabilityId, date, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Verify the request exists and is for a pet owned by the user
    const existingRequest = await prisma.sittingRequest.findUnique({
      where: { id: parseInt(id) },
      include: { pet: true },
    });

    if (!existingRequest) {
      return res.status(404).json({ message: "Sitting request not found" });
    }

    if (existingRequest.pet.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow updates if the request is still pending
    if (existingRequest.status !== "pending") {
      return res.status(400).json({
        message: "Cannot update a request that has been approved or rejected",
      });
    }

    // Verify the new pet belongs to the user if it's being changed
    if (petId && petId !== existingRequest.pet_id) {
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
      });

      if (!pet || pet.user_id !== userId) {
        return res
          .status(403)
          .json({ message: "You can only create requests for your own pets" });
      }
    }

    // Update the sitting request
    const updatedRequest = await prisma.sittingRequest.update({
      where: { id: parseInt(id) },
      data: {
        pet_id: petId || existingRequest.pet_id,
        availability_id: availabilityId || existingRequest.availability_id,
        date: date ? new Date(date) : existingRequest.date,
        start_time: startTime || existingRequest.start_time,
        end_time: endTime || existingRequest.end_time,
        notes: notes !== undefined ? notes : existingRequest.notes,
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating sitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a sitting request
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify the request exists and is for a pet owned by the user
    const existingRequest = await prisma.sittingRequest.findUnique({
      where: { id: parseInt(id) },
      include: { pet: true },
    });

    if (!existingRequest) {
      return res.status(404).json({ message: "Sitting request not found" });
    }

    if (existingRequest.pet.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow deletion if the request is still pending
    if (existingRequest.status !== "pending") {
      return res.status(400).json({
        message: "Cannot delete a request that has been approved or rejected",
      });
    }

    // Delete the sitting request
    await prisma.sittingRequest.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting sitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
