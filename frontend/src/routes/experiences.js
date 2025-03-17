const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Add a new work experience
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { title, organization, startDate, endDate, description } = req.body;

    const experience = await prisma.work_experience.create({
      data: {
        user_id: req.user.id,
        title,
        organization,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
        description,
      },
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error("Error adding work experience:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all work experiences for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const experiences = await prisma.work_experience.findMany({
      where: { user_id: req.user.id },
      orderBy: [{ start_date: "desc" }],
    });

    res.json(experiences);
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a work experience
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);
    const { title, organization, startDate, endDate, description } = req.body;

    // Check if experience exists and belongs to user
    const experience = await prisma.work_experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return res.status(404).json({ message: "Work experience not found" });
    }

    if (experience.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedExperience = await prisma.work_experience.update({
      where: { id: experienceId },
      data: {
        title,
        organization,
        start_date: startDate ? new Date(startDate) : undefined,
        end_date: endDate ? new Date(endDate) : null,
        description,
      },
    });

    res.json(updatedExperience);
  } catch (error) {
    console.error("Error updating work experience:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a work experience
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);

    // Check if experience exists and belongs to user
    const experience = await prisma.work_experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      return res.status(404).json({ message: "Work experience not found" });
    }

    if (experience.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.work_experience.delete({
      where: { id: experienceId },
    });

    res.json({ message: "Work experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
