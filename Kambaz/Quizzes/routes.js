import * as quizDao from "./dao.js";

export default function QuizzesRoutes(app, db) {

  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const { courseId } = req.params;
      const quizzes = await quizDao.findQuizzesByCourse(courseId);
      res.json(quizzes);
    } catch (error) {
      console.error("[Quizzes] Error fetching quizzes:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.get("/api/quizzes/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      console.log("[Quizzes] Fetching quiz:", quizId);
      const quiz = await quizDao.findQuizById(quizId);
      if (!quiz) {
        console.log("[Quizzes] Quiz not found:", quizId);
        return res.status(404).json({ message: "Quiz not found" });
      }
      console.log("[Quizzes] Quiz found:", quiz._id, "Questions:", quiz.questions?.length || 0);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error fetching quiz:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new quiz
  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const { courseId } = req.params;
     
      const cleanedData = {
        ...req.body,
        course: courseId,
        title: req.body.title || "Untitled Quiz",
      };
      
      
      if (cleanedData.dueDate === "") delete cleanedData.dueDate;
      if (cleanedData.availableDate === "") delete cleanedData.availableDate;
      if (cleanedData.availableUntilDate === "") delete cleanedData.availableUntilDate;
      
      console.log("[Quizzes] Creating quiz with data:", JSON.stringify(cleanedData, null, 2));
      const quiz = await quizDao.createQuiz(cleanedData);
      console.log("[Quizzes] Created new quiz:", quiz._id);
      res.status(201).json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error creating quiz:", error);
      console.error("[Quizzes] Error stack:", error.stack);
      res.status(500).json({ message: error.message || "Failed to create quiz" });
    }
  });

  
  app.put("/api/quizzes/:quizId/publish", async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizDao.updateQuiz(quizId, { published: true });
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      console.log("[Quizzes] Published quiz:", quizId);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error publishing quiz:", error);
      res.status(500).json({ message: error.message });
    }
  });

 
  app.put("/api/quizzes/:quizId/unpublish", async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizDao.updateQuiz(quizId, { published: false });
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      console.log("[Quizzes] Unpublished quiz:", quizId);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error unpublishing quiz:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.put("/api/quizzes/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizDao.updateQuiz(quizId, req.body);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      console.log("[Quizzes] Updated quiz:", quiz._id);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error updating quiz:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.delete("/api/quizzes/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizDao.deleteQuiz(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      console.log("[Quizzes] Deleted quiz:", quizId);
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("[Quizzes] Error deleting quiz:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.post("/api/quizzes/:quizId/questions", async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await quizDao.addQuestion(quizId, req.body);
      console.log("[Quizzes] Added question to quiz:", quizId);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error adding question:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update a question
  app.put("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const quiz = await quizDao.updateQuestion(quizId, questionId, req.body);
      console.log("[Quizzes] Updated question:", questionId);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error updating question:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a question
  app.delete("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
    try {
      const { quizId, questionId } = req.params;
      const quiz = await quizDao.deleteQuestion(quizId, questionId);
      console.log("[Quizzes] Deleted question:", questionId);
      res.json(quiz);
    } catch (error) {
      console.error("[Quizzes] Error deleting question:", error);
      res.status(500).json({ message: error.message });
    }
  });
}