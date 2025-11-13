import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

console.log("🚀 Starting server...");
console.log("Environment:", process.env.SERVER_ENV);
console.log("Client URL:", process.env.CLIENT_URL);

// Configure CORS - MUST be first
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
console.log("✅ CORS configured");

// Configure session - MUST be after CORS
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

if (process.env.SERVER_ENV === "production") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
}

app.use(session(sessionOptions));
console.log("✅ Session configured");

// Parse JSON - MUST be after session but BEFORE routes
app.use(express.json());
console.log("✅ JSON parser configured");

// Register all routes
console.log("📝 Registering routes...");
Hello(app);
console.log("  ✓ Hello routes registered");

Lab5(app);
console.log("  ✓ Lab5 routes registered");

UserRoutes(app);
console.log("  ✓ User routes registered");

CourseRoutes(app);
console.log("  ✓ Course routes registered");

ModuleRoutes(app);
console.log("  ✓ Module routes registered");

AssignmentRoutes(app);
console.log("  ✓ Assignment routes registered");

EnrollmentRoutes(app);
console.log("  ✓ Enrollment routes registered");

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("\n🎉 Server running successfully!");
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log("\n🧪 Test these routes:");
  console.log(`  • http://localhost:${PORT}/`);
  console.log(`  • http://localhost:${PORT}/hello`);
  console.log(`  • http://localhost:${PORT}/lab5/welcome`);
  console.log(`  • http://localhost:${PORT}/api/courses`);
  console.log(`  • http://localhost:${PORT}/api/users`);
});