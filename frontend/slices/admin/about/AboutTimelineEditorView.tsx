"use client";

import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type {
  EntityMeta,
  FieldDef,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { AboutTimelineItem } from "@/features/_app/types";
import { useAboutTimelineController } from "./AboutTimelineView";

const META: EntityMeta = { label: "Timeline", labelPlural: "Timeline" };

export const TIMELINE_FIELDS: FieldDef<AboutTimelineItem>[] = [
  { kind: "text", key: "year", label: "Tahun", mono: true, placeholder: "2026" },
  { kind: "textarea", key: "milestone", label: "Milestone", rows: 3 },
  { kind: "number", key: "order", label: "Urutan" },
  {
    kind: "select",
    key: "status",
    label: "Status",
    options: [
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" },
    ],
  },
];

export function AboutTimelineEditorView({ id }: { id: string }) {
  const controller = useAboutTimelineController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={TIMELINE_FIELDS}
      backHref={`${ADMIN_BASE}/about-timeline`}
    />
  );
}
