import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Start a new study session
export const startStudySession = mutation({
  args: {
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    studyRoomId: v.optional(v.id("studyRooms")),
    sessionType: v.union(v.literal("solo"), v.literal("group")),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("studySessions", {
      userId: args.userId,
      documentId: args.documentId,
      studyRoomId: args.studyRoomId,
      startTime: Date.now(),
      pomodoroCount: 0,
      isCompleted: false,
      sessionType: args.sessionType,
    });

    // Update user's last active timestamp
    await ctx.db.patch(args.userId, {
      lastActiveAt: Date.now(),
    });

    return sessionId;
  },
});

// End a study session
export const endStudySession = mutation({
  args: {
    sessionId: v.id("studySessions"),
    notes: v.optional(v.string()),
    focusRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const endTime = Date.now();
    const duration = Math.round((endTime - session.startTime) / (1000 * 60)); // minutes

    await ctx.db.patch(args.sessionId, {
      endTime,
      duration,
      notes: args.notes,
      focusRating: args.focusRating,
      isCompleted: true,
    });

    // Update user study statistics
    const user = await ctx.db.get(session.userId);
    if (user) {
      const xpGained = Math.floor(duration / 5) * 10; // 10 XP per 5 minutes
      const streakIncrement = duration >= 25 ? 1 : 0; // Streak only if studied for at least 25 minutes

      await ctx.db.patch(session.userId, {
        totalStudyTime: user.totalStudyTime + duration,
        studyStreak: user.studyStreak + streakIncrement,
        xp: user.xp + xpGained,
        lastActiveAt: Date.now(),
      });
    }

    return await ctx.db.get(args.sessionId);
  },
});

// Update pomodoro count
export const updatePomodoroCount = mutation({
  args: {
    sessionId: v.id("studySessions"),
    increment: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const increment = args.increment || 1;
    await ctx.db.patch(args.sessionId, {
      pomodoroCount: session.pomodoroCount + increment,
    });

    return session.pomodoroCount + increment;
  },
});

// Get user's study sessions
export const getUserSessions = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.completed !== undefined) {
      query = query.filter((q) => q.eq(q.field("isCompleted"), args.completed));
    }

    return await query
      .order("desc")
      .take(args.limit || 20);
  },
});

// Get active study session for user
export const getActiveSession = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .order("desc")
      .first();
  },
});

// Get session details with related data
export const getSessionDetails = query({
  args: { sessionId: v.id("studySessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    // Get related document if exists
    let document = null;
    if (session.documentId) {
      document = await ctx.db.get(session.documentId);
    }

    // Get related study room if exists
    let studyRoom = null;
    if (session.studyRoomId) {
      studyRoom = await ctx.db.get(session.studyRoomId);
    }

    // Get associated quizzes
    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    return {
      ...session,
      document,
      studyRoom,
      quizzes,
    };
  },
});

// Get study statistics for a time period
export const getStudyStats = query({
  args: {
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => 
        q.gte(q.field("startTime"), args.startDate) &&
        q.lte(q.field("startTime"), args.endDate) &&
        q.eq(q.field("isCompleted"), true)
      )
      .collect();

    const totalSessions = sessions.length;
    const totalStudyTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const totalPomodoros = sessions.reduce((sum, session) => sum + session.pomodoroCount, 0);
    const averageFocusRating = sessions.filter(s => s.focusRating).length > 0
      ? sessions.reduce((sum, session) => sum + (session.focusRating || 0), 0) / sessions.filter(s => s.focusRating).length
      : 0;

    return {
      totalSessions,
      totalStudyTime,
      totalPomodoros,
      averageFocusRating: Math.round(averageFocusRating * 10) / 10,
      averageSessionLength: totalSessions > 0 ? Math.round(totalStudyTime / totalSessions) : 0,
    };
  },
});

// Update quiz score for session
export const updateSessionQuizScore = mutation({
  args: {
    sessionId: v.id("studySessions"),
    quizScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      quizScore: args.quizScore,
    });
  },
});