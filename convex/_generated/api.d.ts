/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _shared_auth from "../_shared/auth.js";
import type * as aiSessions from "../aiSessions.js";
import type * as auth from "../auth.js";
import type * as backup from "../backup.js";
import type * as citations from "../citations.js";
import type * as collaborators from "../collaborators.js";
import type * as datasets from "../datasets.js";
import type * as documents from "../documents.js";
import type * as features_aiChat_action from "../features/aiChat/action.js";
import type * as features_comments__schema from "../features/comments/_schema.js";
import type * as features_comments_mutation from "../features/comments/mutation.js";
import type * as features_comments_public from "../features/comments/public.js";
import type * as features_comments_query from "../features/comments/query.js";
import type * as features_notion__schema from "../features/notion/_schema.js";
import type * as features_notion_mutation from "../features/notion/mutation.js";
import type * as features_notion_query from "../features/notion/query.js";
import type * as http from "../http.js";
import type * as insights from "../insights.js";
import type * as landing from "../landing.js";
import type * as litReviews from "../litReviews.js";
import type * as notes from "../notes.js";
import type * as pages from "../pages.js";
import type * as projects from "../projects.js";
import type * as publications from "../publications.js";
import type * as readingList from "../readingList.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as setup from "../setup.js";
import type * as subscribers from "../subscribers.js";
import type * as update from "../update.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_shared/auth": typeof _shared_auth;
  aiSessions: typeof aiSessions;
  auth: typeof auth;
  backup: typeof backup;
  citations: typeof citations;
  collaborators: typeof collaborators;
  datasets: typeof datasets;
  documents: typeof documents;
  "features/aiChat/action": typeof features_aiChat_action;
  "features/comments/_schema": typeof features_comments__schema;
  "features/comments/mutation": typeof features_comments_mutation;
  "features/comments/public": typeof features_comments_public;
  "features/comments/query": typeof features_comments_query;
  "features/notion/_schema": typeof features_notion__schema;
  "features/notion/mutation": typeof features_notion_mutation;
  "features/notion/query": typeof features_notion_query;
  http: typeof http;
  insights: typeof insights;
  landing: typeof landing;
  litReviews: typeof litReviews;
  notes: typeof notes;
  pages: typeof pages;
  projects: typeof projects;
  publications: typeof publications;
  readingList: typeof readingList;
  seed: typeof seed;
  settings: typeof settings;
  setup: typeof setup;
  subscribers: typeof subscribers;
  update: typeof update;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
