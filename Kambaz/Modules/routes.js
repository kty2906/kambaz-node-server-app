import ModulesDao from "./dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can create modules" });
      return;
    }
    const { courseId } = req.params;
    const module = req.body;
    const newModule = await dao.createModule(courseId, module);
    res.send(newModule);
  };

  const deleteModule = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
   
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can delete modules" });
      return;
    }
    const { courseId, moduleId } = req.params;
    const status = await dao.deleteModule(courseId, moduleId);
    res.send(status);
  };

  const updateModule = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can update modules" });
      return;
    }
    const { courseId, moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await dao.updateModule(courseId, moduleId, moduleUpdates);
    res.send(status);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}