const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Register a new user
router.post("/register", async (req, res) => {
  console.log("[Auth Route] Register request received");
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;
    console.log("[Auth Route] Register data:", {
      email,
      hasPassword: !!password,
    });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("[Auth Route] Registration failed: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("[Auth Route] Password hashed successfully");

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        role: "user",
      },
    });
    console.log("[Auth Route] User created successfully:", newUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    console.log("[Auth Route] JWT token generated");

    // Return user data and token (excluding password)
    const { password_hash, ...userData } = newUser;

    console.log("[Auth Route] Registration successful, sending response");
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("[Auth Route] Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("[Auth Route] Login request received");
  try {
    const { email, password } = req.body;
    console.log("[Auth Route] Login attempt for email:", email);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("[Auth Route] Login failed: User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("[Auth Route] User found:", user.id);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log("[Auth Route] Login failed: Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("[Auth Route] Password verified successfully");

    // Generate JWT token - make sure userId is included
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    console.log("[Auth Route] JWT token generated");
    console.log("[Auth Route] JWT_SECRET exists:", !!process.env.JWT_SECRET);

    // Return user data and token (excluding password)
    const { password_hash, ...userData } = user;

    console.log("[Auth Route] Login successful, sending response");
    res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("[Auth Route] Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user
router.get("/me", authenticateJWT, async (req, res) => {
  console.log("[Auth Route] Get current user request received");
  try {
    console.log("[Auth Route] Looking up user with ID:", req.user.id);
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      console.log("[Auth Route] User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("[Auth Route] User found:", user.id);

    // Return user data (excluding password)
    const { password, ...userData } = user;

    console.log("[Auth Route] Sending user data");
    res.json(userData);
  } catch (error) {
    console.error("[Auth Route] Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
