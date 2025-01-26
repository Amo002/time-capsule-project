import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import capsuleRoutes from "./routes/capsuleRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

dotenv.config();

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static assets
app.use(
  "/uploads",
  express.static(path.join(__dirname, "assets/images/uploads"))
);
app.use(
  "/default",
  express.static(path.join(__dirname, "assets/images/default"))
);

// Middleware
app.use(express.json());
app.use(cors());

// Global middleware for authentication
app.use((req, res, next) => {
  // Define public routes that should bypass authentication
  const publicRoutes = [
    "/api/capsules/fetchAllCapsules",
    "/api/users/login",
    "/api/users/register",
    "/api/admin/login",
  ];

  // Allow public access to these routes
  if (publicRoutes.some((route) => req.path.startsWith(route))) {
    return next(); // Skip authMiddleware for public routes
  }

  // For all other routes, enforce authentication
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized access. Token missing." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token." });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/capsules", capsuleRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
