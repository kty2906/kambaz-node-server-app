import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignments = await dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignment = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
   
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can create assignments" });
      return;
    }
    const { courseId } = req.params;
    const assignment = req.body;
    const newAssignment = await dao.createAssignment(courseId, assignment);
    res.send(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
   
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can delete assignments" });
      return;
    }
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.send(status);
  };

  const updateAssignment = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
      res.status(403).json({ message: "Only faculty and admin can update assignments" });
      return;
    }
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
    res.send(status);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.delete("/api/courses/:courseId/assignments/:assignmentId", deleteAssignment);
  app.put("/api/courses/:courseId/assignments/:assignmentId", updateAssignment);
}