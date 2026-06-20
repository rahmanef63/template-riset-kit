import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { commentsTables } from "./features/comments/_schema";
import { notionTables } from "./features/notion/_schema";

// Riset Kit OS — full schema (Convex target).
// authTables = @convex-dev/auth. Content tables mirror the localStorage shape
// the frontend store used, so the Convex-backed store adapter maps 1:1.
export default defineSchema({
  ...authTables,
  ...commentsTables,
  ...notionTables,

  risetDocuments: defineTable({
    title: v.string(),
    authors: v.string(),
    year: v.number(),
    fileLabel: v.string(),
    abstract: v.string(),
    tag: v.string(),
    status: v.union(
      v.literal("uploaded"),
      v.literal("indexed"),
      v.literal("reviewed"),
    ),
    uploadedAt: v.number(),
    pages: v.number(),
    highlights: v.number(),
    icon: v.optional(v.string()),
    coverImage: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_uploadedAt", ["uploadedAt"]),

  risetNotes: defineTable({
    title: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    linkedDocIds: v.array(v.string()),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),

  risetCitations: defineTable({
    docId: v.string(),
    style: v.union(
      v.literal("APA"),
      v.literal("MLA"),
      v.literal("Chicago"),
      v.literal("IEEE"),
      v.literal("BibTeX"),
    ),
    rendered: v.string(),
    bibKey: v.string(),
    addedAt: v.number(),
  }).index("by_docId", ["docId"]),

  risetLitReviews: defineTable({
    topic: v.string(),
    question: v.string(),
    docIds: v.array(v.string()),
    matrix: v.array(
      v.object({
        docId: v.string(),
        method: v.string(),
        finding: v.string(),
        gap: v.string(),
      }),
    ),
    updatedAt: v.number(),
    icon: v.optional(v.string()),
  }).index("by_updatedAt", ["updatedAt"]),

  risetAiSessions: defineTable({
    docId: v.string(),
    question: v.string(),
    answer: v.string(),
    ts: v.number(),
  }).index("by_ts", ["ts"]),

  risetProjects: defineTable({
    title: v.string(),
    hypothesis: v.string(),
    status: v.union(
      v.literal("exploring"),
      v.literal("active"),
      v.literal("writing"),
      v.literal("submitted"),
      v.literal("archived"),
    ),
    startedAt: v.number(),
    updatedAt: v.number(),
    targetVenue: v.string(),
    linkedDocIds: v.array(v.string()),
    linkedNoteIds: v.array(v.string()),
    collaboratorIds: v.array(v.string()),
    progress: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_updatedAt", ["updatedAt"]),

  risetDatasets: defineTable({
    name: v.string(),
    source: v.string(),
    format: v.union(
      v.literal("csv"),
      v.literal("json"),
      v.literal("parquet"),
      v.literal("xlsx"),
      v.literal("geojson"),
      v.literal("sav"),
    ),
    rows: v.number(),
    sizeMB: v.number(),
    license: v.string(),
    lastUpdated: v.number(),
    description: v.string(),
    url: v.string(),
  }).index("by_lastUpdated", ["lastUpdated"]),

  risetCollaborators: defineTable({
    name: v.string(),
    affiliation: v.string(),
    role: v.union(
      v.literal("PI"),
      v.literal("co-author"),
      v.literal("advisor"),
      v.literal("RA"),
      v.literal("external"),
    ),
    orcid: v.string(),
    email: v.string(),
    expertise: v.array(v.string()),
    projectIds: v.array(v.string()),
    initials: v.string(),
  }),

  risetPublications: defineTable({
    slug: v.string(),
    title: v.string(),
    authors: v.string(),
    year: v.number(),
    venue: v.string(),
    type: v.union(
      v.literal("journal"),
      v.literal("preprint"),
      v.literal("conference"),
      v.literal("report"),
      v.literal("chapter"),
    ),
    doi: v.string(),
    abstract: v.string(),
    keywords: v.array(v.string()),
    pages: v.optional(v.string()),
    pdfHref: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  risetInsights: defineTable({
    slug: v.string(),
    title: v.string(),
    author: v.string(),
    publishedAt: v.number(),
    readMinutes: v.number(),
    category: v.union(
      v.literal("methodology"),
      v.literal("tool-review"),
      v.literal("field-notes"),
      v.literal("opinion"),
      v.literal("tutorial"),
    ),
    excerpt: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  risetReadingList: defineTable({
    title: v.string(),
    source: v.string(),
    year: v.number(),
    category: v.union(
      v.literal("paper"),
      v.literal("essay"),
      v.literal("book"),
      v.literal("thread"),
      v.literal("report"),
    ),
    href: v.string(),
    why: v.string(),
    addedAt: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_addedAt", ["addedAt"])
    .index("by_status", ["status"]),

  subscribers: defineTable({
    email: v.string(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed")),
    source: v.string(),
    ts: v.number(),
  }).index("by_email", ["email"]),

  // About-page principles — dashboard-editable list (mirrors risetReadingList).
  risetAboutPrinciples: defineTable({
    text: v.string(),
    order: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_order", ["order"])
    .index("by_status", ["status"]),

  // About-page timeline — dashboard-editable list (mirrors risetReadingList).
  risetAboutTimeline: defineTable({
    year: v.string(),
    milestone: v.string(),
    order: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
  })
    .index("by_order", ["order"])
    .index("by_status", ["status"]),

  // Page-builder + landing: complex nested structures stored as blobs keyed by
  // the frontend's string id (PageEntry.id / LandingSection.id).
  pages: defineTable({
    entryId: v.string(),
    slug: v.string(),
    data: v.any(),
  })
    .index("by_entryId", ["entryId"])
    .index("by_slug", ["slug"]),

  landingSections: defineTable({
    sectionId: v.string(),
    data: v.any(),
  }).index("by_sectionId", ["sectionId"]),

  // Singleton site config — onboarding wizard + admin Settings write this.
  siteSettings: defineTable({
    siteName: v.optional(v.string()),
    tagline: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    brandColor: v.optional(v.string()),
    themeDefault: v.optional(v.string()),
    themePreset: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    faviconUrl: v.optional(v.string()),
    socials: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    aboutHeadline: v.optional(v.string()),
    aboutImageUrl: v.optional(v.string()),
    analyticsId: v.optional(v.string()),
    onboardedAt: v.optional(v.number()),
  }),

  // Admin-panel "AI config" block. Singleton row holding the active model +
  // sampling config (mirrors the AiConfig type). One row.
  adminAiConfig: defineTable({
    activeModelId: v.string(),
    systemPrompt: v.string(),
    temperature: v.number(),
    maxOutputTokens: v.number(),
  }),

  // Admin-panel "AI config" moderation rules. One row per rule, keyed by the
  // frontend's stable string id (ModerationRule.id).
  adminModerationRules: defineTable({
    ruleId: v.string(),
    label: v.string(),
    description: v.string(),
    enabled: v.boolean(),
    threshold: v.optional(v.number()),
  }).index("by_ruleId", ["ruleId"]),

  // Admin-panel "Settings" block — WORKSPACE settings (distinct from the
  // public siteSettings singleton). Identity = one row; integrations + apiKeys
  // = one row each keyed by their stable frontend string id.
  adminWorkspaceSettings: defineTable({
    name: v.string(),
    slug: v.string(),
    timezone: v.string(),
    language: v.string(),
    contactEmail: v.string(),
  }),

  adminIntegrations: defineTable({
    integrationId: v.string(),
    label: v.string(),
    category: v.union(
      v.literal("messaging"),
      v.literal("email"),
      v.literal("payments"),
      v.literal("deploy"),
      v.literal("vcs"),
    ),
    status: v.union(
      v.literal("connected"),
      v.literal("disconnected"),
      v.literal("error"),
    ),
    detail: v.string(),
    docsUrl: v.string(),
  }).index("by_integrationId", ["integrationId"]),

  adminApiKeys: defineTable({
    keyId: v.string(),
    label: v.string(),
    tail: v.string(),
    createdAt: v.string(),
    lastUsedAt: v.optional(v.string()),
    scope: v.union(v.literal("read"), v.literal("read-write"), v.literal("admin")),
  }).index("by_keyId", ["keyId"]),

  // Admin-panel "Webhooks" block — endpoints + deliveries (auth-guarded). Keyed
  // by a stable frontend string id (whId / dlId) so the binding's `id: string`
  // contract holds without leaking Convex _id into the view.
  adminWebhooks: defineTable({
    whId: v.string(),
    url: v.string(),
    description: v.string(),
    events: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("failing"),
    ),
    secretTail: v.string(),
    lastDeliveryAt: v.union(v.string(), v.null()),
    failingRetries: v.number(),
  }).index("by_whId", ["whId"]),

  adminWebhookDeliveries: defineTable({
    dlId: v.string(),
    endpointId: v.string(), // the endpoint's whId
    event: v.string(),
    at: v.string(),
    httpCode: v.number(),
    status: v.union(
      v.literal("delivered"),
      v.literal("failed"),
      v.literal("pending"),
      v.literal("retry"),
    ),
    durationMs: v.number(),
    attempt: v.number(),
  }).index("by_endpointId", ["endpointId"]),

  // Admin-panel "Audit log" block — real admin-activity stream. Rows are
  // appended by the other admin mutations (users.changeRole/revoke,
  // webhooks.add/remove/fire, aiConfig.setConfig/reset, settings.setIdentity/
  // revokeKey) via the shared logAudit() helper. Keyed by a stable frontend
  // string id (evId) so the binding's `id: string` contract holds.
  adminAuditEvents: defineTable({
    evId: v.string(),
    at: v.string(), // ISO datetime
    actorId: v.string(),
    actorName: v.string(),
    actorInitials: v.string(),
    actorRole: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
      v.literal("system"),
    ),
    action: v.union(
      v.literal("create"),
      v.literal("update"),
      v.literal("delete"),
      v.literal("publish"),
      v.literal("unpublish"),
      v.literal("invite"),
      v.literal("revoke"),
      v.literal("login"),
      v.literal("logout"),
      v.literal("export"),
    ),
    entityType: v.union(
      v.literal("page"),
      v.literal("user"),
      v.literal("role"),
      v.literal("webhook"),
      v.literal("setting"),
      v.literal("post"),
      v.literal("workflow"),
      v.literal("session"),
    ),
    entityId: v.string(),
    entityLabel: v.string(),
    severity: v.union(v.literal("info"), v.literal("warn"), v.literal("alert")),
    diffSummary: v.optional(v.string()),
  }).index("by_at", ["at"]),

  // Admin-panel "Users" block — role mapping over the @convex-dev/auth `users`
  // table (which stays untouched). One row per user whose role has been changed
  // from the derived default. revoke = delete the row (user drops to default).
  adminRoles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer"),
    ),
  }).index("by_userId", ["userId"]),
});
