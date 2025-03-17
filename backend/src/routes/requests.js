const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all sitting requests
router.get("/", async (req, res) => {
  try {
    const requests = await prisma.sittingRequest.findMany({
      include: {
        pet: true,
        requester: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new sitting request
router.post("/", async (req, res) => {
  try {
    const { petId, requesterId, startDatetime, endDatetime, notes } = req.body;

    const newRequest = await prisma.sittingRequest.create({
      data: {
        pet_id: petId,
        requester_id: requesterId,
        start_datetime: new Date(startDatetime),
        end_datetime: new Date(endDatetime),
        notes,
        status: "pending",
      },
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sitting requests created by current user
router.get("/my-requests", authenticateJWT, async (req, res) => {
  try {
    const requests = await prisma.sittingRequest.findMany({
      where: { requester_id: req.user.id },
    });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching sitting requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Requests route working" });
});

module.exports = router;
