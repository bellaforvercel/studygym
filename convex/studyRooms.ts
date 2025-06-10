import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new study room
export const createStudyRoom = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    createdBy: v.id("users"),
    isPublic: v.boolean(),
    maxParticipants: v.number(),
    subject: v.optional(v.string()),
    currentDocument: v.optional(v.id("documents")),
    settings: v.object({
      allowChat: v.boolean(),
      pomodoroSync: v.boolean(),
      requireApproval: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert("studyRooms", {
      name: args.name,
      description: args.description,
      createdBy: args.createdBy,
      currentDocument: args.currentDocument,
      isActive: true,
      isPublic: args.isPublic,
      maxParticipants: args.maxParticipants,
      currentParticipants: 1, // Creator is first participant
      subject: args.subject,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      settings: args.settings,
    });

    // Add creator as owner participant
    await ctx.db.insert("roomParticipants", {
      roomId,
      userId: args.createdBy,
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
      status: "active",
      role: "owner",
    });

    return roomId;
  },
});

// Join a study room
export const joinStudyRoom = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    if (room.currentParticipants >= room.maxParticipants) {
      throw new Error("Room is full");
    }

    // Check if user is already in the room
    const existingParticipant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_and_user", (q) => 
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();

    if (existingParticipant) {
      // Update existing participant status
      await ctx.db.patch(existingParticipant._id, {
        lastSeenAt: Date.now(),
        status: "active",
      });
    } else {
      // Add new participant
      await ctx.db.insert("roomParticipants", {
        roomId: args.roomId,
        userId: args.userId,
        joinedAt: Date.now(),
        lastSeenAt: Date.now(),
        status: "active",
        role: "participant",
      });

      // Update room participant count
      await ctx.db.patch(args.roomId, {
        currentParticipants: room.currentParticipants + 1,
        lastActivityAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Leave a study room
export const leaveStudyRoom = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_and_user", (q) => 
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();

    if (!participant) throw new Error("Not a participant of this room");

    // Remove participant
    await ctx.db.delete(participant._id);

    // Update room participant count
    const room = await ctx.db.get(args.roomId);
    if (room) {
      const newCount = Math.max(0, room.currentParticipants - 1);
      await ctx.db.patch(args.roomId, {
        currentParticipants: newCount,
        lastActivityAt: Date.now(),
      });

      // If room is empty and creator left, deactivate room
      if (newCount === 0 || participant.role === "owner") {
        await ctx.db.patch(args.roomId, {
          isActive: false,
        });
      }
    }

    return { success: true };
  },
});

// Get public study rooms
export const getPublicStudyRooms = query({
  args: {
    subject: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("studyRooms")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.subject) {
      query = query.filter((q) => q.eq(q.field("subject"), args.subject));
    }

    return await query
      .order("desc")
      .take(args.limit || 20);
  },
});

// Get room details with participants
export const getStudyRoomDetails = query({
  args: { roomId: v.id("studyRooms") },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return null;

    // Get participants with user details
    const participants = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const participantsWithUsers = await Promise.all(
      participants.map(async (participant) => {
        const user = await ctx.db.get(participant.userId);
        return {
          ...participant,
          user,
        };
      })
    );

    // Get current document details if exists
    let currentDocument = null;
    if (room.currentDocument) {
      currentDocument = await ctx.db.get(room.currentDocument);
    }

    return {
      ...room,
      participants: participantsWithUsers,
      currentDocument,
    };
  },
});

// Update participant status
export const updateParticipantStatus = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("away")
    ),
  },
  handler: async (ctx, args) => {
    const participant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_and_user", (q) => 
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();

    if (!participant) throw new Error("Not a participant of this room");

    await ctx.db.patch(participant._id, {
      status: args.status,
      lastSeenAt: Date.now(),
    });

    // Update room activity
    await ctx.db.patch(args.roomId, {
      lastActivityAt: Date.now(),
    });

    return { success: true };
  },
});

// Set room document
export const setRoomDocument = mutation({
  args: {
    roomId: v.id("studyRooms"),
    documentId: v.optional(v.id("documents")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if user has permission (owner or moderator)
    const participant = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_and_user", (q) => 
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();

    if (!participant || (participant.role !== "owner" && participant.role !== "moderator")) {
      throw new Error("Insufficient permissions");
    }

    await ctx.db.patch(args.roomId, {
      currentDocument: args.documentId,
      lastActivityAt: Date.now(),
    });

    return { success: true };
  },
});

// Get user's study rooms
export const getUserStudyRooms = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const participations = await ctx.db
      .query("roomParticipants")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const rooms = await Promise.all(
      participations.map(async (participation) => {
        const room = await ctx.db.get(participation.roomId);
        return {
          ...room,
          userRole: participation.role,
          userStatus: participation.status,
        };
      })
    );

    return rooms.filter(room => room && room.isActive);
  },
});