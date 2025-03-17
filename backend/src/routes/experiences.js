const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all work experiences for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const experiences = await prisma.workExperience.findMany({
      where: { user_id: req.user.id },
    });
    res.json(experiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all work experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await prisma.workExperience.findMany();
    res.json(experiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new work experience
router.post("/", async (req, res) => {
  try {
    const { userId, title, organization, startDate, endDate, description } =
      req.body;

    const newExperience = await prisma.workExperience.create({
      data: {
        user_id: userId,
        title,
        organization,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
        description,
      },
    });

    res.status(201).json(newExperience);
  } catch (error) {
    console.error("Error creating work experience:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Experiences route working" });
});

module.exports = router;
