"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PagesProvider,
  type PagesStore,
} from "@/features/_shared/pages/pages-context";
import type { PageEntry } from "@/features/_shared/pages/types";
import {
  LandingProvider,
  type LandingStore,
} from "@/features/_shared/landing/landing-context";
import type { LandingSection } from "@/features/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import { StoreCtx, useStore, type Ctx } from "./store-context";
import { useConvexDispatch, useDemoDispatch } from "./store-dispatch";
import { reducer } from "./store-reducer";
import { SEED_STATE } from "./seed";
import { loadDemoState, openDemoChannel } from "@/lib/demo-store";
import { IS_DEMO } from "@/lib/stage";
import type { Action, State } from "./types";

// Convex-backed store. Replaces the old localStorage reducer: `state` is
// assembled from live Convex queries; `dispatch` routes each action to the
// matching Convex mutation (see store-dispatch.tsx). Consuming slices are
// UNCHANGED — they still call useStore()/useX()/dispatch(action).
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh nid -> insert.

const withId = <T,>(rows: ReadonlyArray<Record<string, unknown>> | undefined): T[] =>
  ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({ ...r, id: r._id })) as T[];

function Provider({ children }: { children: React.ReactNode }) {
  if (IS_DEMO) return <DemoProvider>{children}</DemoProvider>;
  return <ConvexProvider>{children}</ConvexProvider>;
}

// DEMO-only provider: no Convex queries run (the demo store lives entirely in
// localStorage), state syncs across the public<->admin iframes via a
// BroadcastChannel. Mounted only when NEXT_PUBLIC_DEMO=1; tree-shaken/never
// reached in real clones (IS_DEMO is a build-time const false).
function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(() => loadDemoState(SEED_STATE));

  // Apply actions broadcast from the *other* iframe through the same reducer,
  // so a create/edit/delete in the admin frame re-renders the public frame.
  React.useEffect(() => {
    const ch = openDemoChannel();
    if (!ch) return;
    ch.onmessage = (e: MessageEvent<Action>) => setState((s) => reducer(s, e.data));
    return () => ch.close();
  }, []);

  const dispatch = useDemoDispatch(setState);

  const value = React.useMemo<Ctx>(
    // ponytail: ready=true immediately + progress=100 — the demo state is in
    // hand synchronously, no network load phase to report.
    () => ({ state, dispatch, ready: true, progress: 100 }),
    [state, dispatch],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function ConvexProvider({ children }: { children: React.ReactNode }) {
  const documents = useQuery(api.documents.list, {});
  const notes = useQuery(api.notes.list, {});
  const citations = useQuery(api.citations.list, {});
  const litReviews = useQuery(api.litReviews.list, {});
  const aiSessions = useQuery(api.aiSessions.list, {});
  const projects = useQuery(api.projects.listAll, {});
  const datasets = useQuery(api.datasets.list, {});
  const collaborators = useQuery(api.collaborators.list, {});
  const publications = useQuery(api.publications.listAll, {});
  const insights = useQuery(api.insights.listAll, {});
  const readingList = useQuery(api.readingList.listAll, {});
  const aboutPrinciples = useQuery(api.aboutPrinciples.listAll, {});
  const aboutTimeline = useQuery(api.aboutTimeline.listAll, {});
  const pageRows = useQuery(api.pages.list, {});
  const landingRows = useQuery(api.landing.list, {});

  const queries = [
    documents, notes, citations, litReviews, aiSessions,
    projects, datasets, collaborators, publications, insights, readingList,
    aboutPrinciples, aboutTimeline,
    pageRows, landingRows,
  ];
  const ready = queries.every((q) => q !== undefined);
  const progress = Math.round((queries.filter((q) => q !== undefined).length / queries.length) * 100);

  const state = React.useMemo<State>(
    () => ({
      documents: withId(documents),
      notes: withId(notes),
      citations: withId(citations),
      litReviews: withId(litReviews),
      aiReaderSessions: withId(aiSessions),
      projects: withId(projects),
      datasets: withId(datasets),
      collaborators: withId(collaborators),
      publications: withId(publications),
      insights: withId(insights),
      readingList: withId(readingList),
      aboutPrinciples: withId(aboutPrinciples),
      aboutTimeline: withId(aboutTimeline),
      pages: (pageRows ?? []) as PageEntry[],
      landingSections: (landingRows ?? []) as LandingSection[],
    }),
    [documents, notes, citations, litReviews, aiSessions, projects, datasets, collaborators, publications, insights, readingList, aboutPrinciples, aboutTimeline, pageRows, landingRows],
  );

  const dispatch = useConvexDispatch(state);

  const value = React.useMemo<Ctx>(
    () => ({ state, dispatch, ready, progress }),
    [state, dispatch, ready, progress],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function PagesAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<PagesStore>(
    () => ({
      pages: state.pages,
      create: (entry: PageEntry) => dispatch({ type: "PAGE_CREATE", payload: entry }),
      update: (id, patch) => dispatch({ type: "PAGE_UPDATE", payload: { id, patch } }),
      remove: (id: string) => dispatch({ type: "PAGE_DELETE", payload: { id } }),
      reorderBlock: (id, from, to) =>
        dispatch({ type: "PAGE_REORDER_BLOCK", payload: { id, from, to } }),
      upsertSection: (pageId, section) =>
        dispatch({ type: "PAGE_SECTION_UPSERT", payload: { pageId, section } }),
      removeSection: (pageId, sectionId) =>
        dispatch({ type: "PAGE_SECTION_DELETE", payload: { pageId, sectionId } }),
    }),
    [state.pages, dispatch],
  );
  return <PagesProvider value={value}>{children}</PagesProvider>;
}

function LandingAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<LandingStore>(
    () => ({
      items: state.landingSections,
      publicBase: PUBLIC_BASE,
      adminBase: ADMIN_BASE,
      create: (section: LandingSection) =>
        dispatch({ type: "LANDING_UPSERT", payload: section }),
      update: (id, patch) => {
        const current = state.landingSections.find((s) => s.id === id);
        if (!current) return;
        dispatch({ type: "LANDING_UPSERT", payload: { ...current, ...patch, id } });
      },
      remove: (id: string) => dispatch({ type: "LANDING_DELETE", payload: { id } }),
    }),
    [state.landingSections, dispatch],
  );
  return <LandingProvider value={value}>{children}</LandingProvider>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <PagesAdapter>
        <LandingAdapter>{children}</LandingAdapter>
      </PagesAdapter>
    </Provider>
  );
}
export { useStore };
export const usePages = () => useStore().state.pages;
export const useLandingSections = () => useStore().state.landingSections;

export function useDocuments() {
  return useStore().state.documents;
}
export function useDocument(id: string) {
  const { state } = useStore();
  return state.documents.find((d) => d.id === id) ?? null;
}
export function useNotes() {
  return useStore().state.notes;
}
export function useCitations() {
  return useStore().state.citations;
}
export function useLitReviews() {
  return useStore().state.litReviews;
}
export function useAiReaderSessions() {
  return useStore().state.aiReaderSessions;
}
export function useProjects() {
  return useStore().state.projects;
}
export function useProject(id: string) {
  const { state } = useStore();
  return state.projects.find((p) => p.id === id) ?? null;
}
export function useDatasets() {
  return useStore().state.datasets;
}
export function useCollaborators() {
  return useStore().state.collaborators;
}
export function usePublications() {
  return useStore().state.publications;
}
export function usePublication(slug: string) {
  const { state } = useStore();
  return state.publications.find((p) => p.slug === slug) ?? null;
}
export function useInsights() {
  return useStore().state.insights;
}
export function useInsight(slug: string) {
  const { state } = useStore();
  return state.insights.find((i) => i.slug === slug) ?? null;
}
export function useReadingList() {
  return useStore().state.readingList;
}
export function useAboutPrinciples() {
  return useStore().state.aboutPrinciples;
}
export function useAboutTimeline() {
  return useStore().state.aboutTimeline;
}

export { nid, slugify, fmtDate, rel } from "@/features/_shared/utils";
