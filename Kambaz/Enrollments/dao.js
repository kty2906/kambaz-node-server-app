import model from "./model.js";

export default function EnrollmentsDao(db) {
  const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments
      .map((enrollment) => enrollment.course)
      .filter((course) => course !== null && course !== undefined);
  };

  const findUsersForCourse = async (courseId) => {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments
      .map((enrollment) => enrollment.user)
      .filter((user) => user !== null && user !== undefined);
  };

  const enrollUserInCourse = (userId, courseId) => {
    return model.create({
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
    });
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    return model.deleteOne({ user: userId, course: courseId });
  };

  const unenrollAllUsersFromCourse = (courseId) => {
    return model.deleteMany({ course: courseId });
  };

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}