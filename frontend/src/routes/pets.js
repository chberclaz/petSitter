const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Add a new pet
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const {
      name,
      animalType,
      breed,
      subBreed,
      age,
      color,
      markers,
      allergies,
      diet,
      preferences,
    } = req.body;

    const pet = await prisma.pet.create({
      data: {
        owner_id: req.user.id,
        name,
        animal_type: animalType,
        breed,
        sub_breed: subBreed,
        age,
        color,
        markers,
        allergies,
        diet,
        preferences,
      },
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all pets for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { owner_id: req.user.id },
      orderBy: { name: "asc" },
    });

    res.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific pet
router.get("/:id", authenticateJWT, async (req, res) => {
  try {
    const petId = parseInt(req.params.id);

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Check if the user is the owner or an admin
    if (pet.owner_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a pet
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const {
      name,
      animalType,
      breed,
      subBreed,
      age,
      color,
      markers,
      allergies,
      diet,
      preferences,
    } = req.body;

    // Check if pet exists and belongs to user
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.owner_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedPet = await prisma.pet.update({
      where: { id: petId },
      data: {
        name,
        animal_type: animalType,
        breed,
        sub_breed: subBreed,
        age,
        color,
        markers,
        allergies,
        diet,
        preferences,
        updated_at: new Date(),
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
    const petId = parseInt(req.params.id);

    // Check if pet exists and belongs to user
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (pet.owner_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.pet.delete({
      where: { id: petId },
    });

    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
