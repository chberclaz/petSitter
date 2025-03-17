const express = require("express");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const petRoutes = require("./routes/pets");
const requestRoutes = require("./routes/requests");
const availabilityRoutes = require("./routes/availability");
const certificateRoutes = require("./routes/certificates");
const experienceRoutes = require("./routes/experiences");
const adminRoutes = require("./routes/admin");
const sittingRequestRoutes = require("./routes/sittingRequests");

// Import middleware
const authMiddleware = require("./middleware/auth");

// Create Express app
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory if in development mode
if (process.env.NODE_ENV === "development") {
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", authMiddleware.authenticateJWT, petRoutes);
app.use("/api/requests", authMiddleware.authenticateJWT, requestRoutes);
app.use(
  "/api/availability",
  authMiddleware.authenticateJWT,
  availabilityRoutes
);
app.use("/api/certificates", authMiddleware.authenticateJWT, certificateRoutes);
app.use("/api/experiences", authMiddleware.authenticateJWT, experienceRoutes);
app.use("/api/admin", authMiddleware.authenticateJWT, adminRoutes);
app.use("/api/sitting-requests", sittingRequestRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "PetSitter API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "production"
    } mode`
  );
});

module.exports = app;
