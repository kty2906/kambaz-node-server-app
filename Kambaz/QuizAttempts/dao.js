import QuizAttemptModel from "./model.js";


export const createQuizAttempt = (attempt) => {
  return QuizAttemptModel.create(attempt);
};


export const findAttemptsByUserAndQuiz = (userId, quizId) => {
  return QuizAttemptModel.find({ 
    user: userId, 
    quiz: quizId 
  })
  .sort({ attemptNumber: -1 })
  .populate('quiz', 'title points') 
  .populate('user', 'firstName lastName username'); 
};


export const findAttemptById = (attemptId) => {
  return QuizAttemptModel.findById(attemptId)
    .populate('quiz')
    .populate('user', 'firstName lastName username');
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
  })
  .sort({ attemptNumber: -1 })
  .populate('quiz', 'title points showCorrectAnswers');
};


export const findAttemptsByQuiz = (quizId) => {
  return QuizAttemptModel.find({ quiz: quizId })
    .populate('user', 'firstName lastName username')
    .sort({ submittedAt: -1 });
};


export const findAttemptsByUser = (userId) => {
  return QuizAttemptModel.find({ user: userId })
    .populate('quiz', 'title course')
    .populate('course', 'name number')
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
  const result = await QuizAttemptModel.aggregate([
    { 
      $match: { 
        quiz: mongoose.Types.ObjectId(quizId),
        completed: true 
      } 
    },
    { 
      $group: { 
        _id: null, 
        avgScore: { $avg: "$score" },
        count: { $sum: 1 }
      } 
    }
  ]);
  
  return result.length > 0 ? result[0] : { avgScore: 0, count: 0 };
};