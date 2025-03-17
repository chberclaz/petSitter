const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all pets for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { owner_id: req.user.id },
    });
    res.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Server error" });
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
router.get("/:id", async (req, res) => {
  try {
    const petId = parseInt(req.params.id);
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new pet
router.post("/", async (req, res) => {
  try {
    const { name, animalType, breed, age, ownerId } = req.body;

    const newPet = await prisma.pet.create({
      data: {
        name,
        animal_type: animalType,
        breed,
        age,
        owner_id: ownerId,
      },
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Pets route working" });
});

module.exports = router;
