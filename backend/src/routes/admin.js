const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get system statistics
router.get("/stats", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();
    const requestCount = await prisma.sittingRequest.count();

    res.json({
      userCount,
      petCount,
      requestCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Admin route working" });
});

// Get admin dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();
    const requestCount = await prisma.sittingRequest.count();

    res.json({
      userCount,
      petCount,
      requestCount,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify a certificate
router.put("/certificates/:id/verify", async (req, res) => {
  try {
    const certificateId = parseInt(req.params.id);

    const updatedCertificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: { verified: true },
    });

    res.json(updatedCertificate);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
