"use client";

import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type {
  EntityMeta,
  FieldDef,
} from "@/features/_shared/crud/types";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { AiReaderSession } from "@/features/_app/types";
import { useAiReaderController } from "./AiReaderView";

const META: EntityMeta = { label: "Sesi AI", labelPlural: "Sesi AI Reader" };

export const FIELDS: FieldDef<AiReaderSession>[] = [
  { kind: "text", key: "docId", label: "Document ID", mono: true },
  { kind: "date", key: "ts", label: "Waktu" },
  { kind: "textarea", key: "question", label: "Pertanyaan", rows: 4 },
  { kind: "textarea", key: "answer", label: "Jawaban AI", rows: 8 },
];

export function AiReaderEditorView({ id }: { id: string }) {
  const controller = useAiReaderController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/ai-reader`}
    />
  );
}
