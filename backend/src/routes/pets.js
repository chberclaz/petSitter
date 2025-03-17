const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all pets for the authenticated user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: {
        owner_id: req.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({
      message: "Server error fetching pets",
      error: error.toString(),
      stack: error.stack,
    });
  }
});

// Get all pets
router.get("/", async (req, res) => {
  try {
    const pets = await prisma.pet.findMany();
    res.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pet by ID
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Verify the pet belongs to the authenticated user
    if (pet.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new pet
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { name, animal_type, breed, age, specialNotes, image } = req.body;
    animal_data = {
      name,
      animal_type: animal_type, // Map request body animal_type to data animal_type
      breed,
      age: age ? parseInt(age) : null,
      special_notes: specialNotes,
      owner_id: req.user.id,
    };
    console.log(animal_data);
    const pet = await prisma.pet.create({
      data: animal_data,
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({
      message: "Server error creating pet",
      error: error.toString(),
      stack: error.stack,
    });
  }
});

// Update a pet
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, breed, age, specialNotes, image } = req.body;

    // Verify the pet exists and belongs to the authenticated user
    const existingPet = await prisma.pet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (existingPet.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: parseInt(id) },
      data: {
        name,
        animal_type: type, // Changed from type to animal_type
        breed,
        age: age ? parseInt(age) : null,
        special_notes: specialNotes,
        image,
      },
    });

    res.json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a pet
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the pet exists and belongs to the authenticated user
    const existingPet = await prisma.pet.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (existingPet.user_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.pet.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Pets route working" });
});

module.exports = router;
