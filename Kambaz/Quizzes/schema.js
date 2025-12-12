import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
    required: true,
  },
  title: { type: String, default: "New Question" },
  points: { type: Number, default: 1 },
  question: { type: String, default: "" },
  choices: [{ type: String }],
  correctChoice: { type: Number },
  correctAnswer: { type: Boolean },
  possibleAnswers: [{ type: String }],
});

const quizSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    course: { type: String, required: true },
    quizType: {
      type: String,
      enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
      default: "GRADED_QUIZ",
    },
    points: { type: Number, default: 0 },
    assignmentGroup: {
      type: String,
      enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
      default: "QUIZZES",
    },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    attemptsAllowed: { type: Number, default: 1 },
    showCorrectAnswers: {
      type: String,
      enum: ["ALWAYS", "IMMEDIATELY", "AFTER_DUE_DATE", "NEVER"],
      default: "IMMEDIATELY",
    },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: { type: String },
    availableDate: { type: String },
    availableUntilDate: { type: String },
    published: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { collection: "quizzes", timestamps: true }
);

export default quizSchema;