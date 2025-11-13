import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    assignmentsDao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    assignmentsDao.updateAssignment(assignmentId, assignmentUpdates);
    res.sendStatus(204);
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = assignmentsDao.findAssignmentById(assignmentId);
    res.json(assignment);
  };

  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
  app.get("/api/assignments/:assignmentId", findAssignmentById);
}