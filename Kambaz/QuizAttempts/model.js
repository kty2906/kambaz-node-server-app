import mongoose from "mongoose";
import quizAttemptSchema from "./schema.js";

const QuizAttemptModel = mongoose.model("QuizAttemptModel", quizAttemptSchema);

export default QuizAttemptModel;