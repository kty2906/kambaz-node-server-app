import { v4 as uuidv4 } from "uuid";
import courseModel from "../Courses/model.js";

export default function ModulesDao(db) {
  
  const findModulesForCourse = async (courseId) => {
    const course = await courseModel.findById(courseId);
    if (!course) return [];
    return course.modules || [];
  };

  
  const createModule = async (courseId, module) => {
    const newModule = { ...module, _id: uuidv4() };
    await courseModel.updateOne(
      { _id: courseId },
      { $push: { modules: newModule } }
    );
    return newModule;
  };

 
  const deleteModule = async (courseId, moduleId) => {
    const status = await courseModel.updateOne(
      { _id: courseId },
      { $pull: { modules: { _id: moduleId } } }
    );
    return status;
  };

 
  const updateModule = async (courseId, moduleId, moduleUpdates) => {
    const course = await courseModel.findById(courseId);
    const module = course.modules.id(moduleId);
    Object.assign(module, moduleUpdates);
    await course.save();
    return module;
  };

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}