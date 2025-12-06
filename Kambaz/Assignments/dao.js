import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = (courseId) => {
    return model.find({ course: courseId });
  };

  const createAssignment = (courseId, assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4(), course: courseId };
    return model.create(newAssignment);
  };

  const deleteAssignment = (assignmentId) => {
    return model.deleteOne({ _id: assignmentId });
  };

  const updateAssignment = (assignmentId, assignmentUpdates) => {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
  };

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}