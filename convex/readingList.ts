import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

const CATEGORY = v.union(
  v.literal("paper"),
  v.literal("essay"),
  v.literal("book"),
  v.literal("thread"),
  v.literal("report"),
);
const STATUS = v.union(v.literal("draft"), v.literal("published"));

// Public list — published only.
export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("risetReadingList")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(200),
});

// Admin list — everything (draft + published).
export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("risetReadingList").take(200),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("risetReadingList")),
    title: v.string(),
    source: v.string(),
    year: v.number(),
    category: CATEGORY,
    href: v.string(),
    why: v.string(),
    addedAt: v.number(),
    status: STATUS,
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("risetReadingList", data);
  },
});

export const remove = mutation({
  args: { id: v.id("risetReadingList") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
