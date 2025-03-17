const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Create a sitting request
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { petId, startDatetime, endDatetime, notes } = req.body;

    // Verify pet belongs to user
    const pet = await prisma.pet.findUnique({
      where: { id: parseInt(petId) },
    });

    if (!pet || pet.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to create request for this pet" });
    }

    const request = await prisma.sitting_request.create({
      data: {
        requester_id: req.user.id,
        pet_id: parseInt(petId),
        start_datetime: new Date(startDatetime),
        end_datetime: new Date(endDatetime),
        notes,
        status: "pending",
      },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating sitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sitting requests created by current user
router.get("/my-requests", authenticateJWT, async (req, res) => {
  try {
    const requests = await prisma.sitting_request.findMany({
      where: { requester_id: req.user.id },
      include: {
        pet: true,
        sitting_assignments: {
          include: {
            sitter: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                profile_image_url: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching sitting requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all sitting assignments for current user (as a sitter)
router.get("/my-assignments", authenticateJWT, async (req, res) => {
  try {
    const assignments = await prisma.sitting_assignment.findMany({
      where: { sitter_id: req.user.id },
      include: {
        request: {
          include: {
            pet: true,
            requester: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                profile_image_url: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(assignments);
  } catch (error) {
    console.error("Error fetching sitting assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get available sitting requests (that match user's availability)
router.get("/available", authenticateJWT, async (req, res) => {
  try {
    // Get user's availability slots
    const availabilitySlots = await prisma.availability_slot.findMany({
      where: { user_id: req.user.id },
    });

    // Find pending requests that match user's availability
    const availableRequests = await prisma.sitting_request.findMany({
      where: {
        status: "pending",
        requester_id: {
          not: req.user.id, // Don't show user's own requests
        },
        sitting_assignments: {
          none: {
            sitter_id: req.user.id, // Don't show requests user has already applied to
          },
        },
      },
      include: {
        pet: true,
        requester: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_image_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Filter requests that match user's availability and accepted pet types
    const matchingRequests = availableRequests.filter((request) => {
      const requestStart = new Date(request.start_datetime);
      const requestEnd = new Date(request.end_datetime);
      const petType = request.pet.animal_type;

      // Check if any availability slot covers this request
      return availabilitySlots.some((slot) => {
        const slotDate = new Date(slot.date);
        const slotStartTime = new Date(slot.date);
        const slotEndTime = new Date(slot.date);

        // Parse time strings and set on slot date
        const [startHours, startMinutes] = slot.start_time
          .split(":")
          .map(Number);
        const [endHours, endMinutes] = slot.end_time.split(":").map(Number);

        slotStartTime.setHours(startHours, startMinutes, 0);
        slotEndTime.setHours(endHours, endMinutes, 0);

        // Check if request falls within this slot's time range and pet type is accepted
        const timeMatches =
          requestStart >= slotStartTime && requestEnd <= slotEndTime;
        const petTypeMatches =
          slot.accepted_pet_types && slot.accepted_pet_types.includes(petType);

        return timeMatches && petTypeMatches;
      });
    });

    res.json(matchingRequests);
  } catch (error) {
    console.error("Error fetching available requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Apply to a sitting request
router.post("/:id/apply", authenticateJWT, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);

    // Check if request exists and is still pending
    const request = await prisma.sitting_request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request is no longer available" });
    }

    if (request.requester_id === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot apply to your own request" });
    }

    // Check if user has already applied
    const existingApplication = await prisma.sitting_assignment.findFirst({
      where: {
        request_id: requestId,
        sitter_id: req.user.id,
      },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied to this request" });
    }

    // Create assignment
    const assignment = await prisma.sitting_assignment.create({
      data: {
        request_id: requestId,
        sitter_id: req.user.id,
        status: "accepted",
      },
    });

    // Update request status
    await prisma.sitting_request.update({
      where: { id: requestId },
      data: { status: "accepted" },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Error applying to request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete a sitting assignment
router.put("/assignments/:id/complete", authenticateJWT, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id);

    // Check if assignment exists and belongs to user
    const assignment = await prisma.sitting_assignment.findUnique({
      where: { id: assignmentId },
      include: { request: true },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.sitter_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (assignment.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "This assignment cannot be completed" });
    }

    // Update assignment status
    const updatedAssignment = await prisma.sitting_assignment.update({
      where: { id: assignmentId },
      data: { status: "completed" },
    });

    // Update request status
    await prisma.sitting_request.update({
      where: { id: assignment.request_id },
      data: { status: "completed" },
    });

    res.json(updatedAssignment);
  } catch (error) {
    console.error("Error completing assignment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a review for a completed sitting
router.post("/assignments/:id/review", authenticateJWT, async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    // Check if assignment exists and the user is the requester
    const assignment = await prisma.sitting_assignment.findUnique({
      where: { id: assignmentId },
      include: { request: true },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.request.requester_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (assignment.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Cannot review an incomplete assignment" });
    }

    // Add review
    const updatedAssignment = await prisma.sitting_assignment.update({
      where: { id: assignmentId },
      data: {
        review_rating: rating,
        review_comment: comment,
      },
    });

    res.json(updatedAssignment);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
