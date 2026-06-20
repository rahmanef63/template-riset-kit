"use client";

import * as React from "react";
import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { TIMELINE_FIELDS } from "./AboutTimelineEditorView";
import type {
  ColumnDef,
  CrudController,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { useStore } from "@/features/_app/store";
import type { AboutTimelineItem } from "@/features/_app/types";

const META: EntityMeta = { label: "Timeline", labelPlural: "Timeline" };

const COLUMNS: ColumnDef<AboutTimelineItem>[] = [
  { key: "order", header: "#", width: "w-[8%]", mono: true },
  { key: "year", header: "Tahun", width: "w-[12%]", mono: true },
  { key: "milestone", header: "Milestone", width: "w-[60%]" },
  { key: "status", header: "Status", width: "w-[16%]", badge: "outline" },
];

export function useAboutTimelineController(): CrudController<AboutTimelineItem> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: [...state.aboutTimeline].sort((a, b) => a.order - b.order),
      getId: (t) => t.id,
      blank: () => ({
        id: `tl-${Date.now().toString(36)}`,
        year: String(new Date().getFullYear()),
        milestone: "",
        order: (state.aboutTimeline.reduce((m, t) => Math.max(m, t.order), 0) || 0) + 10,
        status: "published" as const,
      }),
      create: (item) => dispatch({ type: "aboutTimeline.upsert", item }),
      update: (id, patch) => {
        const cur = state.aboutTimeline.find((t) => t.id === id);
        if (!cur) return;
        dispatch({ type: "aboutTimeline.upsert", item: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "aboutTimeline.delete", id }),
    }),
    [state.aboutTimeline, dispatch],
  );
}

export function AboutTimelineView() {
  const controller = useAboutTimelineController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={TIMELINE_FIELDS}
      editPath={(id) => `${ADMIN_BASE}/about-timeline/${id}`}
      description="Milestone yang tampil di halaman About publik."
    />
  );
}
