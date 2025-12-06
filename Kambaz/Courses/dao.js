import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  const createCourse = async (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return await model.create(newCourse);
  };

  const findAllCourses = async () => {
    return await model.find();
  };

  const findCourseById = async (courseId) => {
    return await model.findById(courseId);
  };

  const updateCourse = async (courseId, courseUpdates) => {
    return await model.updateOne({ _id: courseId }, { $set: courseUpdates });
  };

  const deleteCourse = async (courseId) => {
    return await model.deleteOne({ _id: courseId });
  };

  return {
    createCourse,
    findAllCourses,
    findCourseById,
    updateCourse,
    deleteCourse,
  };
}