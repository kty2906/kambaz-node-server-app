// Quick script to view courses in MongoDB
import mongoose from "mongoose";
import CourseModel from "./Kambaz/Courses/model.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

async function viewCourses() {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB\n");
    
    const courses = await CourseModel.find();
    
    if (courses.length === 0) {
      console.log("No courses found in the database.");
    } else {
      console.log(`Found ${courses.length} course(s):\n`);
      courses.forEach((course, index) => {
        console.log(`--- Course ${index + 1} ---`);
        console.log(`ID: ${course._id}`);
        console.log(`Name: ${course.name}`);
        console.log(`Number: ${course.number}`);
        console.log(`Department: ${course.department}`);
        console.log(`Credits: ${course.credits}`);
        console.log(`Start Date: ${course.startDate}`);
        console.log(`End Date: ${course.endDate}`);
        console.log(`Description: ${course.description?.substring(0, 100)}...`);
        console.log("");
      });
    }
    
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

viewCourses();

