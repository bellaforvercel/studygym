import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user profile (called after Clerk authentication)
export const createOrUpdateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        lastActiveAt: now,
      });
      return existingUser._id;
    } else {
      // Create new user with default values
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        studyStreak: 0,
        totalStudyTime: 0,
        level: 1,
        xp: 0,
        subscription: "free",
        createdAt: now,
        lastActiveAt: now,
      });
      return userId;
    }
  },
});

// Get user profile by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Get user profile by ID
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Update user study statistics
export const updateStudyStats = mutation({
  args: {
    userId: v.id("users"),
    studyTimeMinutes: v.number(),
    streakIncrement: v.optional(v.number()),
    xpGained: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const updates: any = {
      totalStudyTime: user.totalStudyTime + args.studyTimeMinutes,
      lastActiveAt: Date.now(),
    };

    if (args.streakIncrement) {
      updates.studyStreak = user.studyStreak + args.streakIncrement;
    }

    if (args.xpGained) {
      const newXp = user.xp + args.xpGained;
      updates.xp = newXp;
      
      // Level up calculation (every 1000 XP = 1 level)
      const newLevel = Math.floor(newXp / 1000) + 1;
      if (newLevel > user.level) {
        updates.level = newLevel;
      }
    }

    await ctx.db.patch(args.userId, updates);
    return await ctx.db.get(args.userId);
  },
});

// Get leaderboard data
export const getLeaderboard = query({
  args: {
    period: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("all_time")
    ),
    metric: v.union(
      v.literal("study_time"),
      v.literal("quiz_score"),
      v.literal("streak"),
      v.literal("documents_read")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("leaderboards")
      .withIndex("by_period_and_metric", (q) => 
        q.eq("period", args.period).eq("metric", args.metric)
      )
      .order("asc")
      .take(limit);
  },
});

// Update user's last active timestamp
export const updateLastActive = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      lastActiveAt: Date.now(),
    });
  },
});

// Get user study statistics
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Get recent sessions count
    const recentSessions = await ctx.db
      .query("studySessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("startTime"), Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
      .collect();

    // Get average quiz score
    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.neq(q.field("score"), undefined))
      .collect();

    const averageQuizScore = quizzes.length > 0 
      ? quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / quizzes.length
      : 0;

    // Get documents read count
    const documentsRead = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gt(q.field("readingProgress"), 0))
      .collect();

    return {
      totalStudyTime: user.totalStudyTime,
      sessionsCompleted: recentSessions.length,
      averageQuizScore: Math.round(averageQuizScore * 10) / 10,
      currentStreak: user.studyStreak,
      documentsRead: documentsRead.length,
      level: user.level,
      xp: user.xp,
    };
  },
});