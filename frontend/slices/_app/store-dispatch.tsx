"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { pagesReducer } from "@/features/_shared/pages/reducer";
import type { LandingSection } from "@/features/_shared/landing/types";
import type { Action, State } from "./types";

// Dispatch wiring, split out of store.tsx (move-only): routes each store
// action to the matching Convex mutation. `id` is passed to upsert only when
// it's a known Convex id (existing row); a fresh nid -> insert.

export function useConvexDispatch(state: State): (a: Action) => void {
  const mDocUpsert = useMutation(api.documents.upsert);
  const mDocRemove = useMutation(api.documents.remove);
  const mNoteUpsert = useMutation(api.notes.upsert);
  const mNoteRemove = useMutation(api.notes.remove);
  const mCitationUpsert = useMutation(api.citations.upsert);
  const mCitationRemove = useMutation(api.citations.remove);
  const mLitUpsert = useMutation(api.litReviews.upsert);
  const mLitRemove = useMutation(api.litReviews.remove);
  const mAiCreate = useMutation(api.aiSessions.create);
  const mAiUpsert = useMutation(api.aiSessions.upsert);
  const mAiRemove = useMutation(api.aiSessions.remove);
  const mProjectUpsert = useMutation(api.projects.upsert);
  const mProjectRemove = useMutation(api.projects.remove);
  const mDatasetUpsert = useMutation(api.datasets.upsert);
  const mDatasetRemove = useMutation(api.datasets.remove);
  const mCollabUpsert = useMutation(api.collaborators.upsert);
  const mCollabRemove = useMutation(api.collaborators.remove);
  const mPubUpsert = useMutation(api.publications.upsert);
  const mPubRemove = useMutation(api.publications.remove);
  const mInsightUpsert = useMutation(api.insights.upsert);
  const mInsightRemove = useMutation(api.insights.remove);
  const mReadingUpsert = useMutation(api.readingList.upsert);
  const mReadingRemove = useMutation(api.readingList.remove);
  const mPageUpsert = useMutation(api.pages.upsert);
  const mPageRemove = useMutation(api.pages.remove);
  const mLandingUpsert = useMutation(api.landing.upsert);
  const mLandingRemove = useMutation(api.landing.remove);

  const knownIds = React.useMemo(
    () => ({
      documents: new Set(state.documents.map((d) => d.id)),
      notes: new Set(state.notes.map((n) => n.id)),
      citations: new Set(state.citations.map((c) => c.id)),
      litReviews: new Set(state.litReviews.map((l) => l.id)),
      aiReaderSessions: new Set(state.aiReaderSessions.map((s) => s.id)),
      projects: new Set(state.projects.map((p) => p.id)),
      datasets: new Set(state.datasets.map((d) => d.id)),
      collaborators: new Set(state.collaborators.map((c) => c.id)),
      publications: new Set(state.publications.map((p) => p.id)),
      insights: new Set(state.insights.map((i) => i.id)),
      readingList: new Set(state.readingList.map((r) => r.id)),
    }),
    [state],
  );

  return React.useCallback(
    (action: Action) => {
      const fail = (e: unknown) => console.error(`[store] ${action.type} failed`, e);
      switch (action.type) {
        case "doc.upsert": {
          const { id, ...d } = action.doc;
          void (knownIds.documents.has(id)
            ? mDocUpsert({ id: id as Id<"risetDocuments">, ...d })
            : mDocUpsert(d)
          ).catch(fail);
          break;
        }
        case "doc.delete":
          void mDocRemove({ id: action.id as Id<"risetDocuments"> }).catch(fail);
          break;

        case "note.upsert": {
          const { id, ...d } = action.note;
          void (knownIds.notes.has(id)
            ? mNoteUpsert({ id: id as Id<"risetNotes">, ...d })
            : mNoteUpsert(d)
          ).catch(fail);
          break;
        }
        case "note.delete":
          void mNoteRemove({ id: action.id as Id<"risetNotes"> }).catch(fail);
          break;

        case "citation.upsert": {
          const { id, ...d } = action.citation;
          void (knownIds.citations.has(id)
            ? mCitationUpsert({ id: id as Id<"risetCitations">, ...d })
            : mCitationUpsert(d)
          ).catch(fail);
          break;
        }
        case "citation.delete":
          void mCitationRemove({ id: action.id as Id<"risetCitations"> }).catch(fail);
          break;

        case "litreview.upsert": {
          const { id, ...d } = action.lit;
          void (knownIds.litReviews.has(id)
            ? mLitUpsert({ id: id as Id<"risetLitReviews">, ...d })
            : mLitUpsert(d)
          ).catch(fail);
          break;
        }
        case "litreview.delete":
          void mLitRemove({ id: action.id as Id<"risetLitReviews"> }).catch(fail);
          break;

        case "aireader.create": {
          const { id: _id, ...d } = action.session;
          void _id;
          void mAiCreate(d).catch(fail);
          break;
        }
        case "aireader.upsert": {
          const { id, ...d } = action.session;
          void (knownIds.aiReaderSessions.has(id)
            ? mAiUpsert({ id: id as Id<"risetAiSessions">, ...d })
            : mAiUpsert(d)
          ).catch(fail);
          break;
        }
        case "aireader.delete":
          void mAiRemove({ id: action.id as Id<"risetAiSessions"> }).catch(fail);
          break;

        case "project.upsert": {
          const { id, ...d } = action.project;
          void (knownIds.projects.has(id)
            ? mProjectUpsert({ id: id as Id<"risetProjects">, ...d })
            : mProjectUpsert(d)
          ).catch(fail);
          break;
        }
        case "project.delete":
          void mProjectRemove({ id: action.id as Id<"risetProjects"> }).catch(fail);
          break;

        case "dataset.upsert": {
          const { id, ...d } = action.dataset;
          void (knownIds.datasets.has(id)
            ? mDatasetUpsert({ id: id as Id<"risetDatasets">, ...d })
            : mDatasetUpsert(d)
          ).catch(fail);
          break;
        }
        case "dataset.delete":
          void mDatasetRemove({ id: action.id as Id<"risetDatasets"> }).catch(fail);
          break;

        case "collaborator.upsert": {
          const { id, ...d } = action.collaborator;
          void (knownIds.collaborators.has(id)
            ? mCollabUpsert({ id: id as Id<"risetCollaborators">, ...d })
            : mCollabUpsert(d)
          ).catch(fail);
          break;
        }
        case "collaborator.delete":
          void mCollabRemove({ id: action.id as Id<"risetCollaborators"> }).catch(fail);
          break;

        case "publication.upsert": {
          const { id, ...d } = action.publication;
          void (knownIds.publications.has(id)
            ? mPubUpsert({ id: id as Id<"risetPublications">, ...d })
            : mPubUpsert(d)
          ).catch(fail);
          break;
        }
        case "publication.delete":
          void mPubRemove({ id: action.id as Id<"risetPublications"> }).catch(fail);
          break;

        case "insight.upsert": {
          const { id, ...d } = action.insight;
          void (knownIds.insights.has(id)
            ? mInsightUpsert({ id: id as Id<"risetInsights">, ...d })
            : mInsightUpsert(d)
          ).catch(fail);
          break;
        }
        case "insight.delete":
          void mInsightRemove({ id: action.id as Id<"risetInsights"> }).catch(fail);
          break;

        case "reading.upsert": {
          const { id, ...d } = action.reading;
          void (knownIds.readingList.has(id)
            ? mReadingUpsert({ id: id as Id<"risetReadingList">, ...d })
            : mReadingUpsert(d)
          ).catch(fail);
          break;
        }
        case "reading.delete":
          void mReadingRemove({ id: action.id as Id<"risetReadingList"> }).catch(fail);
          break;

        case "PAGE_DELETE":
          void mPageRemove({ entryId: action.payload.id }).catch(fail);
          break;
        case "PAGE_CREATE":
        case "PAGE_UPDATE":
        case "PAGE_REORDER_BLOCK":
        case "PAGE_SECTION_UPSERT":
        case "PAGE_SECTION_DELETE": {
          const next = pagesReducer({ pages: state.pages }, action);
          const pid =
            (action.payload as { id?: string; pageId?: string }).id ??
            (action.payload as { pageId?: string }).pageId;
          const entry = next.pages.find((p) => p.id === pid);
          if (entry) void mPageUpsert({ entryId: entry.id, slug: entry.slug, data: entry }).catch(fail);
          break;
        }

        case "LANDING_UPSERT": {
          const s = action.payload as LandingSection;
          void mLandingUpsert({ sectionId: s.id, data: s }).catch(fail);
          break;
        }
        case "LANDING_DELETE":
          void mLandingRemove({ sectionId: (action.payload as { id: string }).id }).catch(fail);
          break;

        case "hydrate":
        case "reset":
          // Convex is the source of truth — no-op.
          break;
      }
    },
    [knownIds, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
