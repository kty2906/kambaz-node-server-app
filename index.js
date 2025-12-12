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
import QuizzesRoutes from "./Kambaz/Quizzes/routes.js";
import QuizAttemptsRoutes from "./Kambaz/QuizAttempts/routes.js";

const app = express();

// --------------------
// MongoDB Connection
// --------------------
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


mongoose.connection.on("disconnected", () =>
  console.warn("⚠️ MongoDB disconnected")
);

// --------------------
// Middleware
// --------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : process.env.NODE_ENV === 'production'
  ? [] // Must be set in production
  : ['http://localhost:3000']; // Default for development

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);

app.use(express.json());


const sessionOptions = {
  secret: process.env.SESSION_SECRET || "super secret session phrase",
  resave: false,
  saveUninitialized: false,
  name: "kambaz.sid",
  cookie: {
    httpOnly: true,
    secure: false,      
    sameSite: 'lax',    
    maxAge: 24 * 60 * 60 * 1000,
  }
};

// Only override for production
if (process.env.NODE_ENV === "production") {
  console.log("🔒 Using production session settings");
  sessionOptions.proxy = true;
  sessionOptions.cookie.secure = true;
  sessionOptions.cookie.sameSite = 'none';
}

console.log("🍪 Session cookie settings:", sessionOptions.cookie);

app.use(session(sessionOptions));


if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.path}`);
      console.log("  Headers:", {
        origin: req.headers.origin,
        cookie: req.headers.cookie ? "Present" : "Missing",
      });
      console.log("  Session ID:", req.sessionID);
      console.log("  Current User:", req.session["currentUser"]?.username || "None");
    }
    next();
  });
}


app.get("/api/test-session", (req, res) => {
  console.log("[Test Session] Request from:", req.headers.origin);
  console.log("[Test Session] Cookies:", req.headers.cookie);
  console.log("[Test Session] Session ID:", req.sessionID);
  console.log("[Test Session] Session data:", req.session);
  
  res.json({
    sessionID: req.sessionID,
    hasSession: !!req.session,
    currentUser: req.session?.currentUser ? {
      _id: req.session.currentUser._id,
      username: req.session.currentUser.username,
      role: req.session.currentUser.role,
    } : null,
    authenticated: !!req.session?.currentUser,
    cookieReceived: !!req.headers.cookie,
    cookieSettings: req.session?.cookie,
  });
});

// --------------------
// Routes
// --------------------
const db = {};

UserRoutes(app, db);
CoursesRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
QuizzesRoutes(app, db);
QuizAttemptsRoutes(app, db);

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.get("/api/health", (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "up" : "down";
  res.json({ status: "ok", mongo: mongoStatus });
});


app.use((err, req, res, next) => {
  console.error("[ERROR] Unhandled error:", err);
  console.error("  Path:", req.path);
  console.error("  Method:", req.method);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV !== "production" ? err.message : undefined
  });
});


app.use("/api/*", (req, res) => {
  console.error(`[404] Unmatched API route: ${req.method} ${req.path}`);
  console.error("  Original URL:", req.originalUrl);
  res.status(404).json({ 
    message: "API route not found", 
    path: req.path,
    method: req.method 
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});