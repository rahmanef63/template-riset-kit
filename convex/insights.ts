import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

const CATEGORY = v.union(
  v.literal("methodology"),
  v.literal("tool-review"),
  v.literal("field-notes"),
  v.literal("opinion"),
  v.literal("tutorial"),
);
const STATUS = v.union(v.literal("draft"), v.literal("published"));

// Public list — published only.
export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("risetInsights")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(200),
});

// Admin list — everything (draft + published).
export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("risetInsights").take(200),
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) =>
    ctx.db
      .query("risetInsights")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique(),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("risetInsights")),
    slug: v.string(),
    title: v.string(),
    author: v.string(),
    publishedAt: v.number(),
    readMinutes: v.number(),
    category: CATEGORY,
    excerpt: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    status: STATUS,
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("risetInsights", data);
  },
});

export const remove = mutation({
  args: { id: v.id("risetInsights") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
