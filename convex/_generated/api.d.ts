/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiSessions from "../aiSessions.js";
import type * as auth from "../auth.js";
import type * as backup from "../backup.js";
import type * as citations from "../citations.js";
import type * as collaborators from "../collaborators.js";
import type * as datasets from "../datasets.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as landing from "../landing.js";
import type * as litReviews from "../litReviews.js";
import type * as notes from "../notes.js";
import type * as pages from "../pages.js";
import type * as projects from "../projects.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as setup from "../setup.js";
import type * as update from "../update.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiSessions: typeof aiSessions;
  auth: typeof auth;
  backup: typeof backup;
  citations: typeof citations;
  collaborators: typeof collaborators;
  datasets: typeof datasets;
  documents: typeof documents;
  http: typeof http;
  landing: typeof landing;
  litReviews: typeof litReviews;
  notes: typeof notes;
  pages: typeof pages;
  projects: typeof projects;
  seed: typeof seed;
  settings: typeof settings;
  setup: typeof setup;
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
