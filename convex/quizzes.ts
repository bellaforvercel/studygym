import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new quiz for a study session
export const createQuiz = mutation({
  args: {
    sessionId: v.id("studySessions"),
    documentId: v.id("documents"),
    userId: v.id("users"),
    questions: v.array(v.object({
      id: v.string(),
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.number(),
      explanation: v.string(),
    })),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    generatedFrom: v.string(),
  },
  handler: async (ctx, args) => {
    const quizId = await ctx.db.insert("quizzes", {
      sessionId: args.sessionId,
      documentId: args.documentId,
      userId: args.userId,
      questions: args.questions.map(q => ({ ...q, userAnswer: undefined, timeSpent: undefined })),
      totalTimeSpent: 0,
      difficulty: args.difficulty,
      generatedFrom: args.generatedFrom,
    });

    return quizId;
  },
});

// Submit quiz answers
export const submitQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
    answers: v.array(v.object({
      questionId: v.string(),
      userAnswer: v.number(),
      timeSpent: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Update questions with user answers
    const updatedQuestions = quiz.questions.map(question => {
      const answer = args.answers.find(a => a.questionId === question.id);
      return {
        ...question,
        userAnswer: answer?.userAnswer,
        timeSpent: answer?.timeSpent,
      };
    });

    // Calculate score
    const correctAnswers = updatedQuestions.filter(q => 
      q.userAnswer === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / updatedQuestions.length) * 100);

    // Calculate total time spent
    const totalTimeSpent = args.answers.reduce((sum, answer) => sum + answer.timeSpent, 0);

    await ctx.db.patch(args.quizId, {
      questions: updatedQuestions,
      score,
      completedAt: Date.now(),
      totalTimeSpent,
    });

    // Update session with quiz score
    await ctx.db.patch(quiz.sessionId, {
      quizScore: score,
    });

    // Award XP based on score
    const user = await ctx.db.get(quiz.userId);
    if (user) {
      const xpGained = Math.floor(score / 10) * 5; // 5 XP per 10% score
      await ctx.db.patch(quiz.userId, {
        xp: user.xp + xpGained,
      });
    }

    return await ctx.db.get(args.quizId);
  },
});

// Get quiz by ID
export const getQuiz = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.quizId);
  },
});

// Get quizzes for a user
export const getUserQuizzes = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("quizzes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.completed !== undefined) {
      if (args.completed) {
        query = query.filter((q) => q.neq(q.field("completedAt"), undefined));
      } else {
        query = query.filter((q) => q.eq(q.field("completedAt"), undefined));
      }
    }

    return await query
      .order("desc")
      .take(args.limit || 20);
  },
});

// Get quizzes for a document
export const getDocumentQuizzes = query({
  args: {
    documentId: v.id("documents"),
    userId: v.optional(v.id("users")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("quizzes")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId));

    if (args.userId) {
      query = query.filter((q) => q.eq(q.field("userId"), args.userId));
    }

    return await query
      .order("desc")
      .take(args.limit || 10);
  },
});

// Get quiz statistics for a user
export const getQuizStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.neq(q.field("score"), undefined))
      .collect();

    if (quizzes.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
      };
    }

    const totalQuizzes = quizzes.length;
    const averageScore = quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / totalQuizzes;
    const bestScore = Math.max(...quizzes.map(quiz => quiz.score || 0));
    const totalTimeSpent = quizzes.reduce((sum, quiz) => sum + quiz.totalTimeSpent, 0);

    const difficultyBreakdown = quizzes.reduce((acc, quiz) => {
      acc[quiz.difficulty]++;
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore,
      totalTimeSpent,
      difficultyBreakdown,
    };
  },
});

// Get pending quiz for session (if any)
export const getPendingQuiz = query({
  args: { sessionId: v.id("studySessions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => q.eq(q.field("completedAt"), undefined))
      .first();
  },
});