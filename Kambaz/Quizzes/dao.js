import { v4 as uuidv4 } from "uuid";
import QuizModel from "./model.js";
import * as quizAttemptDao from "../QuizAttempts/dao.js";

// Quiz CRUD operations
export const createQuiz = (quiz) => {
  const newQuiz = { ...quiz, _id: uuidv4() };
  return QuizModel.create(newQuiz);
};

export const findQuizzesByCourse = (courseId) =>
  QuizModel.find({ course: courseId }).sort({ createdAt: -1 });

export const findQuizById = (quizId) => QuizModel.findById(quizId);

export const updateQuiz = (quizId, quiz) =>
  QuizModel.findByIdAndUpdate(quizId, quiz, { new: true });

export const deleteQuiz = async (quizId) => {
 
  await quizAttemptDao.deleteAttemptsByQuiz(quizId);

  return QuizModel.findByIdAndDelete(quizId);
};


export const addQuestion = async (quizId, question) => {
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  
  
  const newQuestion = {
    _id: question._id || uuidv4(),
    type: question.type,
    title: question.title || "New Question",
    question: question.question || "",
    points: question.points || 1,
  };
  
 
  if (question.type === "MULTIPLE_CHOICE") {
    newQuestion.choices = question.choices?.filter(c => c && c.trim() !== "") || [];
    newQuestion.correctChoice = question.correctChoice;
  } else if (question.type === "TRUE_FALSE") {
    newQuestion.correctAnswer = question.correctAnswer;
  } else if (question.type === "FILL_IN_BLANK") {
    newQuestion.possibleAnswers = question.possibleAnswers?.filter(a => a && a.trim() !== "") || [];
  }
  
  quiz.questions.push(newQuestion);
  quiz.points = quiz.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  
  return quiz.save();
};

export const updateQuestion = async (quizId, questionId, questionData) => {
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  
  const questionIndex = quiz.questions.findIndex((q) => q._id.toString() === questionId);
  if (questionIndex === -1) throw new Error("Question not found");
  
  quiz.questions[questionIndex] = { ...quiz.questions[questionIndex].toObject(), ...questionData };
  quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  
  return quiz.save();
};

export const deleteQuestion = async (quizId, questionId) => {
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");
  
  quiz.questions = quiz.questions.filter((q) => q._id.toString() !== questionId);
  quiz.points = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  
  return quiz.save();
};


export const createQuizAttempt = quizAttemptDao.createQuizAttempt;
export const findAttemptsByUserAndQuiz = quizAttemptDao.findAttemptsByUserAndQuiz;
export const findAttemptById = quizAttemptDao.findAttemptById;
export const updateQuizAttempt = quizAttemptDao.updateQuizAttempt;
export const getLatestAttempt = quizAttemptDao.getLatestAttempt;
export const findAttemptsByQuiz = quizAttemptDao.findAttemptsByQuiz;
export const getAttemptCount = quizAttemptDao.getAttemptCount;
export const getHighestScore = quizAttemptDao.getHighestScore;