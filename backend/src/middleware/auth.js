const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  console.log("[Auth Middleware] Authenticating request to:", req.originalUrl);
  const authHeader = req.headers.authorization;
  console.log("[Auth Middleware] Authorization header present:", !!authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("[Auth Middleware] Token extracted, verifying...");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error(
          "[Auth Middleware] JWT verification failed:",
          err.message
        );
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      console.log(
        "[Auth Middleware] JWT verified successfully for user:",
        user.id
      );
      req.user = user;
      next();
    });
  } else {
    console.log(
      "[Auth Middleware] No authorization header, authentication required"
    );
    res.status(401).json({ message: "Authentication required" });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  console.log(
    "[Admin Middleware] Checking admin status for user:",
    req.user?.id
  );
  console.log("[Admin Middleware] User role:", req.user?.role);

  if (req.user && req.user.role === "admin") {
    console.log("[Admin Middleware] Admin access granted");
    next();
  } else {
    console.log("[Admin Middleware] Admin access denied");
    res.status(403).json({ message: "Admin access required" });
  }
};

module.exports = { authenticateJWT, isAdmin };
