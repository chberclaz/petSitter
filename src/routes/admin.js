const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT, isAdmin } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all certificates pending verification
router.get(
  "/certificates/pending",
  authenticateJWT,
  isAdmin,
  async (req, res) => {
    try {
      const pendingCertificates = await prisma.certificate.findMany({
        where: { verified: false },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      res.json(pendingCertificates);
    } catch (error) {
      console.error("Error fetching pending certificates:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all sitting requests
router.get("/requests", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const requests = await prisma.sitting_request.findMany({
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
        sitting_assignments: {
          include: {
            sitter: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching all requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get system statistics
router.get("/stats", authenticateJWT, isAdmin, async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const petCount = await prisma.pet.count();
    const requestCount = await prisma.sitting_request.count();
    const completedRequestCount = await prisma.sitting_request.count({
      where: { status: "completed" },
    });
    const pendingCertificateCount = await prisma.certificate.count({
      where: { verified: false },
    });

    res.json({
      userCount,
      petCount,
      requestCount,
      completedRequestCount,
      pendingCertificateCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Make a user an admin
router.put(
  "/users/:id/make-admin",
  authenticateJWT,
  isAdmin,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { is_admin: true },
      });

      res.json({
        message: "User promoted to admin",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          isAdmin: updatedUser.is_admin,
        },
      });
    } catch (error) {
      console.error("Error making user admin:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
