const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const petRoutes = require("./routes/pets");
const requestRoutes = require("./routes/requests");
const availabilityRoutes = require("./routes/availability");
const certificateRoutes = require("./routes/certificates");
const experienceRoutes = require("./routes/experiences");
const adminRoutes = require("./routes/admin");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateJWT = require("./middleware/auth");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", authenticateJWT, petRoutes);
app.use("/api/requests", authenticateJWT, requestRoutes);
app.use("/api/availability", authenticateJWT, availabilityRoutes);
app.use("/api/certificates", authenticateJWT, certificateRoutes);
app.use("/api/experiences", authenticateJWT, experienceRoutes);
app.use("/api/admin", authenticateJWT, adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
