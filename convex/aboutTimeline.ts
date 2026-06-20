import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

const STATUS = v.union(v.literal("draft"), v.literal("published"));

// Public list — published only.
export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("risetAboutTimeline")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(200),
});

// Admin list — everything (draft + published).
export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("risetAboutTimeline").take(200),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("risetAboutTimeline")),
    year: v.string(),
    milestone: v.string(),
    order: v.number(),
    status: STATUS,
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("risetAboutTimeline", data);
  },
});

export const remove = mutation({
  args: { id: v.id("risetAboutTimeline") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
