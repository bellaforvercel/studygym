import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Upload a new document
export const createDocument = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    storageId: v.optional(v.id("_storage")),
    tags: v.optional(v.array(v.string())),
    subject: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    totalPages: v.optional(v.number()),
    extractedText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const documentId = await ctx.db.insert("documents", {
      userId: args.userId,
      title: args.title,
      fileName: args.fileName,
      fileSize: args.fileSize,
      fileType: args.fileType,
      storageId: args.storageId,
      uploadedAt: Date.now(),
      readingProgress: 0,
      tags: args.tags || [],
      subject: args.subject,
      isPublic: args.isPublic || false,
      totalPages: args.totalPages,
      extractedText: args.extractedText,
    });

    return documentId;
  },
});

// Get user's documents
export const getUserDocuments = query({
  args: { 
    userId: v.id("users"),
    subject: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.subject) {
      query = query.filter((q) => q.eq(q.field("subject"), args.subject));
    }

    const documents = await query
      .order("desc")
      .take(args.limit || 50);

    return documents;
  },
});

// Get a specific document
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// Update document reading progress
export const updateReadingProgress = mutation({
  args: {
    documentId: v.id("documents"),
    progress: v.number(), // 0-100
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      readingProgress: Math.max(0, Math.min(100, args.progress)),
      lastReadAt: Date.now(),
    });
  },
});

// Get public documents for study rooms
export const getPublicDocuments = query({
  args: {
    subject: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("documents")
      .withIndex("by_public", (q) => q.eq("isPublic", true));

    if (args.subject) {
      query = query.filter((q) => q.eq(q.field("subject"), args.subject));
    }

    return await query
      .order("desc")
      .take(args.limit || 20);
  },
});

// Search documents by title or tags
export const searchDocuments = query({
  args: {
    userId: v.id("users"),
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const searchTerm = args.searchTerm.toLowerCase();
    const filtered = documents.filter((doc) => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (doc.subject && doc.subject.toLowerCase().includes(searchTerm))
    );

    return filtered
      .sort((a, b) => b.uploadedAt - a.uploadedAt)
      .slice(0, args.limit || 20);
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error("Document not found");

    // Delete associated file from storage if exists
    if (document.storageId) {
      await ctx.storage.delete(document.storageId);
    }

    // Delete the document record
    await ctx.db.delete(args.documentId);
    
    return { success: true };
  },
});

// Update document metadata
export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    subject: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    
    if (args.title !== undefined) updates.title = args.title;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.subject !== undefined) updates.subject = args.subject;
    if (args.isPublic !== undefined) updates.isPublic = args.isPublic;

    await ctx.db.patch(args.documentId, updates);
    return await ctx.db.get(args.documentId);
  },
});

// Get recently accessed documents
export const getRecentDocuments = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.neq(q.field("lastReadAt"), undefined))
      .order("desc")
      .take(args.limit || 10);
  },
});