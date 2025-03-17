const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const { uploadToS3 } = require("../utils/s3Upload");

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Add a new certificate
router.post(
  "/",
  authenticateJWT,
  upload.single("certificate"),
  async (req, res) => {
    try {
      const { name, issuingOrganization, issueDate, expiryDate } = req.body;

      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Certificate file is required" });
      }

      const fileUrl = await uploadToS3(req.file, `certificates/${req.user.id}`);

      const certificate = await prisma.certificate.create({
        data: {
          user_id: req.user.id,
          name,
          issuing_organization: issuingOrganization,
          issue_date: new Date(issueDate),
          expiry_date: expiryDate ? new Date(expiryDate) : null,
          file_url: fileUrl,
          verified: false,
        },
      });

      res.status(201).json(certificate);
    } catch (error) {
      console.error("Error adding certificate:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all certificates for current user
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: "desc" },
    });

    res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a certificate
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const certificateId = parseInt(req.params.id);

    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    if (certificate.user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.certificate.delete({
      where: { id: certificateId },
    });

    res.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify a certificate (admin only)
router.put("/:id/verify", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const certificateId = parseInt(req.params.id);

    const certificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: { verified: true },
    });

    res.json(certificate);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
