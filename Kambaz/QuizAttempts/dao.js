import QuizAttemptModel from "./model.js";
import { v4 as uuidv4 } from "uuid"; // Add this import!

// Create a new quiz attempt
export const createQuizAttempt = (attempt) => {
  const newAttempt = {
    ...attempt,
    _id: uuidv4()  
  };
  return QuizAttemptModel.create(newAttempt);
};

// Find all attempts by a specific user for a specific quiz
export const findAttemptsByUserAndQuiz = (userId, quizId) => {
  return QuizAttemptModel.find({ 
    user: userId, 
    quiz: quizId 
  }).sort({ attemptNumber: -1 });
};


export const findAttemptById = (attemptId) => {
  return QuizAttemptModel.findById(attemptId);
};

export const updateQuizAttempt = (attemptId, attemptData) => {
  return QuizAttemptModel.findByIdAndUpdate(
    attemptId, 
    attemptData, 
    { new: true }
  );
};


export const getLatestAttempt = (userId, quizId) => {
  return QuizAttemptModel.findOne({ 
    user: userId, 
    quiz: quizId 
  }).sort({ attemptNumber: -1 });
};


export const findAttemptsByQuiz = (quizId) => {
  return QuizAttemptModel.find({ quiz: quizId })
    .sort({ submittedAt: -1 });
};


export const findAttemptsByUser = (userId) => {
  return QuizAttemptModel.find({ user: userId })
    .sort({ submittedAt: -1 });
};


export const deleteQuizAttempt = (attemptId) => {
  return QuizAttemptModel.findByIdAndDelete(attemptId);
};


export const deleteAttemptsByQuiz = (quizId) => {
  return QuizAttemptModel.deleteMany({ quiz: quizId });
};


export const getAttemptCount = async (userId, quizId) => {
  return QuizAttemptModel.countDocuments({ 
    user: userId, 
    quiz: quizId,
    completed: true 
  });
};


export const getHighestScore = async (userId, quizId) => {
  const attempts = await QuizAttemptModel.find({ 
    user: userId, 
    quiz: quizId,
    completed: true 
  }).sort({ score: -1 }).limit(1);
  
  return attempts.length > 0 ? attempts[0].score : 0;
};


export const getAverageScoreForQuiz = async (quizId) => {
  const attempts = await QuizAttemptModel.find({
    quiz: quizId,
    completed: true
  });
  
  if (attempts.length === 0) {
    return { avgScore: 0, count: 0 };
  }
  
  const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return {
    avgScore: totalScore / attempts.length,
    count: attempts.length
  };
};