"use client";

import * as React from "react";
import { CrudListView } from "@/features/_shared/crud/CrudListView";
import { PRINCIPLE_FIELDS } from "./AboutPrincipleEditorView";
import type {
  ColumnDef,
  CrudController,
  EntityMeta,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { useStore } from "@/features/_app/store";
import type { AboutPrinciple } from "@/features/_app/types";

const META: EntityMeta = { label: "Prinsip", labelPlural: "Prinsip" };

const COLUMNS: ColumnDef<AboutPrinciple>[] = [
  { key: "order", header: "#", width: "w-[8%]", mono: true },
  { key: "text", header: "Prinsip", width: "w-[72%]" },
  { key: "status", header: "Status", width: "w-[16%]", badge: "outline" },
];

export function useAboutPrinciplesController(): CrudController<AboutPrinciple> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: [...state.aboutPrinciples].sort((a, b) => a.order - b.order),
      getId: (p) => p.id,
      blank: () => ({
        id: `prin-${Date.now().toString(36)}`,
        text: "",
        order: (state.aboutPrinciples.reduce((m, p) => Math.max(m, p.order), 0) || 0) + 10,
        status: "published" as const,
      }),
      create: (principle) => dispatch({ type: "aboutPrinciple.upsert", principle }),
      update: (id, patch) => {
        const cur = state.aboutPrinciples.find((p) => p.id === id);
        if (!cur) return;
        dispatch({ type: "aboutPrinciple.upsert", principle: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "aboutPrinciple.delete", id }),
    }),
    [state.aboutPrinciples, dispatch],
  );
}

export function AboutPrinciplesView() {
  const controller = useAboutPrinciplesController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={PRINCIPLE_FIELDS}
      editPath={(id) => `${ADMIN_BASE}/about-principles/${id}`}
      description="Prinsip yang tampil di halaman About publik."
    />
  );
}
