import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import UserRoutes from "./Kambaz/Users/routes.js";
import CoursesRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

// --------------------
// MongoDB Connection
// --------------------
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Optional: Log when connection is disconnected
mongoose.connection.on("disconnected", () =>
  console.warn("⚠️ MongoDB disconnected")
);

// --------------------
// Middleware
// --------------------
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000", // deployed frontend
    ],
  })
);

app.use(express.json());

// --------------------
// Session Configuration
// --------------------
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "super secret session phrase",
  resave: false,
  saveUninitialized: false,
  name: "kambaz.sid",
};

if (process.env.SERVER_ENV === "production" || process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
} else {
  sessionOptions.cookie = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
}

app.use(session(sessionOptions));

// --------------------
// Routes
// --------------------
const db = {};

UserRoutes(app, db);
CoursesRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Optional: Health check route for deployment monitoring
app.get("/api/health", (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "up" : "down";
  res.json({ status: "ok", mongo: mongoStatus });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
