import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  const signin = async (req, res) => {
    const { username, password } = req.body;
    console.log("\n========== SIGNIN START ==========");
    console.log("[Signin] Username:", username);
    console.log("[Signin] Session ID before:", req.sessionID);
    
    const currentUser = await dao.findUserByCredentials(username, password);
    
    if (!currentUser) {
      console.log("[Signin] ❌ Invalid credentials");
      console.log("========== SIGNIN END ==========\n");
      return res.status(401).json({ message: "Unable to login. Try again later." });
    }
    
    console.log("[Signin] ✅ User found:", currentUser.username);
    
    
    const userObj = currentUser.toObject ? currentUser.toObject() : { ...currentUser };
    
   
    req.session["currentUser"] = userObj;
    
    console.log("[Signin] Session after setting user:", req.session["currentUser"]?.username);
    
   
    req.session.save((err) => {
      if (err) {
        console.error("[Signin] ❌ Session save error:", err);
        console.log("========== SIGNIN END ==========\n");
        return res.status(500).json({ message: "Session error" });
      }
      
      console.log("[Signin] ✅✅✅ Session saved successfully!");
      console.log("[Signin] Session ID after save:", req.sessionID);
      console.log("[Signin] Session cookie:", req.session.cookie);
      console.log("========== SIGNIN END ==========\n");
      
      const { password: _, ...userWithoutPassword } = userObj;
      res.json(userWithoutPassword);
    });
  };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const profile = (req, res) => {
    console.log("[Profile] Session:", req.session);
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      console.log("[Profile] No user in session");
      res.sendStatus(401);
      return;
    }
    console.log("[Profile] Returning user:", currentUser.username);
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      req.session["currentUser"] = { ...currentUser, ...userUpdates };
    }
    res.json(currentUser);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };

  const findMyCourses = async (req, res) => {
    console.log("[FindMyCourses] ========== START ==========");
    console.log("[FindMyCourses] Session ID:", req.sessionID);
    console.log("[FindMyCourses] Current user:", req.session["currentUser"]?.username);
    
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      console.log("[FindMyCourses] ❌ Not authenticated");
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = currentUser._id;
      console.log("[FindMyCourses] ✅ Finding courses for user:", userId);
      
      const enrollmentModel = (await import("../Enrollments/model.js")).default;
      const courseModel = (await import("../Courses/model.js")).default;
      
      const enrollments = await enrollmentModel.find({ user: userId });
      console.log("[FindMyCourses] Found", enrollments.length, "enrollments");
      
      if (enrollments.length === 0) {
        return res.json([]);
      }
      
      const courseIds = enrollments.map(e => e.course);
      const courses = await courseModel.find({ _id: { $in: courseIds } });
      
      console.log("[FindMyCourses] ✅ Returning", courses.length, "courses");
      res.json(courses);
      
    } catch (error) {
      console.error("[FindMyCourses] ❌ Error:", error);
      res.status(500).json({ message: "Error fetching courses" });
    }
  };

  // Routes
  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signout", signout);  
  app.post("/api/users", createUser);
  app.get("/api/users/profile", profile);
  app.get("/api/users/current/courses", findMyCourses);
  app.put("/api/users/:userId", updateUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);
}