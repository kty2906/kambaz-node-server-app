import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CoursesRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can create courses" });
      return;
    }
    const newCourse = await dao.createCourse(req.body);
   
    if (currentUser.role === "FACULTY") {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    res.json(newCourse);
  };

  const deleteCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
  
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can delete courses" });
      return;
    }
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const findAllCourses = async (req, res) => {
    try {
      console.log("[GET /api/courses] Request received");
      console.log("[GET /api/courses] Session:", req.sessionID);
      console.log("[GET /api/courses] Current User:", req.session["currentUser"]?._id || "None");
      const courses = await dao.findAllCourses();
      console.log("[GET /api/courses] Found", courses?.length || 0, "courses");
      res.send(courses);
    } catch (error) {
      console.error("[GET /api/courses] Error:", error);
      res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
  };

  const findCourseById = async (req, res) => {
    const { courseId } = req.params;
    const course = await dao.findCourseById(courseId);
    res.send(course);
  };

  const updateCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
   
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can update courses" });
      return;
    }
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;
      console.log("[GET /api/users/:userId/courses] Request received, userId:", userId);
      console.log("[GET /api/users/:userId/courses] Full path:", req.path);
      console.log("[GET /api/users/:userId/courses] Session:", req.sessionID);
      console.log("[GET /api/users/:userId/courses] Current User:", req.session["currentUser"]?._id || "None");
      
      if (userId === "current") {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
          console.log("[GET /api/users/:userId/courses] No current user in session, returning 401");
          res.status(401).json({ message: "Not authenticated" });
          return;
        }
        userId = currentUser._id;
        console.log("[GET /api/users/:userId/courses] Resolved 'current' to userId:", userId);
      }
      
      const courses = await enrollmentsDao.findCoursesForUser(userId);
      console.log("[GET /api/users/:userId/courses] Found", courses?.length || 0, "courses for user", userId);
      res.json(courses);
    } catch (error) {
      console.error("[GET /api/users/:userId/courses] Error:", error);
      res.status(500).json({ message: "Failed to fetch user courses", error: error.message });
    }
  };

  const findUsersForCourse = async (req, res) => {
    const { courseId } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(courseId);
    res.json(users);
  };

  const enrollUserInCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(userId, courseId);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      userId = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(userId, courseId);
    res.send(status);
  };

  app.post("/api/courses", createCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/courses/:courseId", findCourseById);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
  app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
}