const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT, isAdmin } = require("../middleware/auth");
const multer = require("multer");
const { uploadToS3 } = require("../utils/s3Upload");

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Get current user profile
router.get("/me", authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        certificates: true,
        work_experiences: true,
        pets: true,
        availability_slots: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/me", authenticateJWT, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        bio,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile image
router.post(
  "/profile-image",
  authenticateJWT,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const fileUrl = await uploadToS3(
        req.file,
        `profile-images/${req.user.id}`
      );

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { profile_image_url: fileUrl },
      });

      res.json({ message: "Profile image updated", imageUrl: fileUrl });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get public profile of a user
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        bio: true,
        profile_image_url: true,
        certificates: {
          where: { verified: true },
          select: {
            id: true,
            name: true,
            issuing_organization: true,
            issue_date: true,
            expiry_date: true,
            file_url: true,
          },
        },
        work_experiences: true,
        availability_slots: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (admin only)
router.get("/", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_admin: true,
        created_at: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
