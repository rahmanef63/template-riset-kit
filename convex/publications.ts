import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./_shared/auth";

const TYPE = v.union(
  v.literal("journal"),
  v.literal("preprint"),
  v.literal("conference"),
  v.literal("report"),
  v.literal("chapter"),
);
const STATUS = v.union(v.literal("draft"), v.literal("published"));

// Public list — published only.
export const list = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("risetPublications")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(200),
});

// Admin list — everything (draft + published).
export const listAll = query({
  args: {},
  handler: async (ctx) => ctx.db.query("risetPublications").take(200),
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) =>
    ctx.db
      .query("risetPublications")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique(),
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("risetPublications")),
    slug: v.string(),
    title: v.string(),
    authors: v.string(),
    year: v.number(),
    venue: v.string(),
    type: TYPE,
    doi: v.string(),
    abstract: v.string(),
    keywords: v.array(v.string()),
    pages: v.optional(v.string()),
    pdfHref: v.optional(v.string()),
    status: STATUS,
  },
  handler: async (ctx, { id, ...data }) => {
    await requireUser(ctx);
    if (id) {
      await ctx.db.patch(id, data);
      return id;
    }
    return ctx.db.insert("risetPublications", data);
  },
});

export const remove = mutation({
  args: { id: v.id("risetPublications") },
  handler: async (ctx, { id }) => {
    await requireUser(ctx);
    await ctx.db.delete(id);
  },
});
