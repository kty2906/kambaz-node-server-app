import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: { 
      type: String, 
      required: true 
    },
    user: { 
      type: String, 
      required: true 
    },
    course: { 
      type: String, 
      required: true 
    },
    attemptNumber: { 
      type: Number, 
      default: 1 
    },
    score: { 
      type: Number, 
      default: 0 
    },
    answers: [
      {
        questionId: { 
          type: String 
        },
        answer: { 
          type: mongoose.Schema.Types.Mixed
        },
        isCorrect: { 
          type: Boolean 
        },
        pointsAwarded: { 
          type: Number, 
          default: 0 
        },
      },
    ],
    startedAt: { 
      type: Date, 
      default: Date.now 
    },
    submittedAt: { 
      type: Date 
    },
    completed: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    collection: "quizAttempts", 
    timestamps: true 
  }
);

export default quizAttemptSchema;