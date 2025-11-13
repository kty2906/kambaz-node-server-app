import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";

export default function CourseRoutes(app) {
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const course = dao.createCourse(req.body);
    res.json(course);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(204);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    dao.updateCourse(courseId, courseUpdates);
    res.sendStatus(204);
  };

  const findCourseById = (req, res) => {
    const { courseId } = req.params;
    const course = dao.findCourseById(courseId);
    res.json(course);
  };

  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    const modules = modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = modulesDao.createModule(module);
    res.json(newModule);
  };

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = assignmentsDao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const createAssignmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    const newAssignment = assignmentsDao.createAssignment(assignment);
    res.json(newAssignment);
  };

  app.get("/api/courses", findAllCourses);
  app.post("/api/courses", createCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.get("/api/courses/:courseId", findCourseById);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
}