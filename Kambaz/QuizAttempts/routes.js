import * as quizDao from "../Quizzes/dao.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsRoutes(app, db) {

  app.post("/api/quizzes/:quizId/attempts", async (req, res) => {
    try {
      const { quizId } = req.params;
      const { userId, answers, startedAt } = req.body;

      console.log("[QuizAttempts] Submitting attempt for quiz:", quizId, "user:", userId);

      const quiz = await quizDao.findQuizById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const attempts = await quizDao.findAttemptsByUserAndQuiz(userId, quizId);
      const attemptNumber = attempts.length + 1;

      if (!quiz.multipleAttempts && attempts.length > 0) {
        return res.status(400).json({ message: "Multiple attempts not allowed" });
      }

      if (quiz.multipleAttempts && attemptNumber > quiz.attemptsAllowed) {
        return res.status(400).json({ message: "Maximum attempts reached" });
      }

      let totalScore = 0;
      const gradedAnswers = answers.map((answer) => {
        const question = quiz.questions.find((q) => q._id.toString() === answer.questionId);
        if (!question) return { ...answer, isCorrect: false, pointsAwarded: 0 };

        let isCorrect = false;

        if (question.type === "MULTIPLE_CHOICE" && question.choices && question.correctChoice !== undefined) {
          const correctAnswer = question.choices[question.correctChoice];
          isCorrect = answer.answer === correctAnswer;
        } else if (question.type === "TRUE_FALSE" && question.correctAnswer !== undefined) {
          const correctAnswer = question.correctAnswer ? "true" : "false";
          isCorrect = answer.answer === correctAnswer;
        } else if (question.type === "FILL_IN_BLANK" && question.possibleAnswers) {
          const userAnswer = answer.answer?.toString().toLowerCase().trim() || "";
          isCorrect = question.possibleAnswers.some(
            (correctAns) => correctAns.toLowerCase().trim() === userAnswer
          );
        }

        const pointsAwarded = isCorrect ? question.points : 0;
        totalScore += pointsAwarded;

        return {
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect,
          pointsAwarded,
        };
      });

      const attempt = await quizDao.createQuizAttempt({
        _id: uuidv4(),
        quiz: quizId,
        user: userId,
        course: quiz.course,
        attemptNumber,
        score: totalScore,
        answers: gradedAnswers,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        submittedAt: new Date(),
        completed: true,
      });

      console.log("[QuizAttempts] Created attempt:", attempt._id, "Score:", totalScore);
      res.json(attempt);
    } catch (error) {
      console.error("[QuizAttempts] Error submitting attempt:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/quizzes/:quizId/attempts/user/:userId", async (req, res) => {
    try {
      const { quizId, userId } = req.params;
      const attempts = await quizDao.findAttemptsByUserAndQuiz(userId, quizId);
      console.log("[QuizAttempts] Found", attempts.length, "attempts for user:", userId);
      res.json(attempts);
    } catch (error) {
      console.error("[QuizAttempts] Error fetching attempts:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.get("/api/quizzes/:quizId/attempts/user/:userId/latest", async (req, res) => {
    try {
      const { quizId, userId } = req.params;
      const attempt = await quizDao.getLatestAttempt(userId, quizId);
      console.log("[QuizAttempts] Latest attempt:", attempt ? attempt._id : "none");
      res.json(attempt || null);
    } catch (error) {
      console.error("[QuizAttempts] Error fetching latest attempt:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.get("/api/attempts/:attemptId", async (req, res) => {
    try {
      const { attemptId } = req.params;
      const attempt = await quizDao.findAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      res.json(attempt);
    } catch (error) {
      console.error("[QuizAttempts] Error fetching attempt:", error);
      res.status(500).json({ message: error.message });
    }
  });
}