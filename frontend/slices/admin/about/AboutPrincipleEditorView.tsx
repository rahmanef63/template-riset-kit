"use client";

import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type {
  EntityMeta,
  FieldDef,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { AboutPrinciple } from "@/features/_app/types";
import { useAboutPrinciplesController } from "./AboutPrinciplesView";

const META: EntityMeta = { label: "Prinsip", labelPlural: "Prinsip" };

export const PRINCIPLE_FIELDS: FieldDef<AboutPrinciple>[] = [
  { kind: "textarea", key: "text", label: "Prinsip", rows: 3 },
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

export function AboutPrincipleEditorView({ id }: { id: string }) {
  const controller = useAboutPrinciplesController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={PRINCIPLE_FIELDS}
      backHref={`${ADMIN_BASE}/about-principles`}
    />
  );
}
