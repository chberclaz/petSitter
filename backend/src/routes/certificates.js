const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all certificates for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { user_id: req.user.id },
    });
    res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all certificates
router.get("/", async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany();
    res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new certificate
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      name,
      issuingOrganization,
      issueDate,
      expiryDate,
      fileUrl,
    } = req.body;

    const newCertificate = await prisma.certificate.create({
      data: {
        user_id: userId,
        name,
        issuing_organization: issuingOrganization,
        issue_date: issueDate ? new Date(issueDate) : null,
        expiry_date: expiryDate ? new Date(expiryDate) : null,
        file_url: fileUrl,
        verified: false,
      },
    });

    res.status(201).json(newCertificate);
  } catch (error) {
    console.error("Error creating certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Certificates route working" });
});

module.exports = router;
