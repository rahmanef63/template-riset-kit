"use client";

import * as React from "react";
import {
  useInsights,
  usePublications,
  useDocuments,
  useReadingList,
} from "@/features/_app/store";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type {
  ConceptCard,
  ConceptListAdapter,
} from "@/features/_shared/concepts/ConceptListPage";

/**
 * Per-template CONCEPT REGISTRY — maps a canonical concept to {data selector +
 * field map + link}, consumed by the shared ConceptListPage (default grid via
 * ConceptCardView). Adapter-only: wraps existing selectors, no schema/table/
 * state rename → zero data migration. Riset-kit's copy points at its own
 * verticals (insights, publications, library, reading-list), giving one
 * consistent public list UI fleet-wide.
 */

const INSIGHT_CATEGORY_LABEL: Record<string, string> = {
  methodology: "Metodologi",
  "tool-review": "Tool Review",
  "field-notes": "Field Notes",
  opinion: "Opini",
  tutorial: "Tutorial",
};

const PUBLICATION_TYPE_LABEL: Record<string, string> = {
  journal: "Jurnal",
  preprint: "Preprint",
  conference: "Konferensi",
  report: "Laporan",
  chapter: "Bab buku",
};

export const insightsAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Insights",
    title: "Catatan singkat dari lapangan",
    subtitle:
      "Esai metodologi, review tool, dan field notes. Lebih ringan dari publikasi formal — lebih cepat sampai ke pembaca.",
  },
  searchable: true,
  columns: 3,
  emptyText: "Tidak ada insight yang cocok. Reset filter atau terbitkan insight baru di Admin.",
  hrefFor: (c) => `${PUBLIC_BASE}/insights/${c.slug}`,
  useCards: () => {
    const insights = useInsights();
    return React.useMemo<ConceptCard[]>(
      () =>
        insights
          .filter((i) => i.status === "published")
          .sort((a, b) => b.publishedAt - a.publishedAt)
          .map((i) => ({
            id: i.id,
            slug: i.slug,
            title: i.title,
            excerpt: i.excerpt,
            date: i.publishedAt,
            tags: [INSIGHT_CATEGORY_LABEL[i.category] ?? i.category, ...i.tags],
          })),
      [insights],
    );
  },
};

export const publicationsAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Publications",
    title: "Output riset terverifikasi",
    subtitle:
      "Paper, preprint, dan laporan yang sudah dirilis. Klik untuk baca abstrak penuh dan ambil sitasi.",
  },
  searchable: true,
  columns: 2,
  emptyText: "Tidak ada publikasi yang cocok. Reset filter atau terbitkan publikasi baru di Admin.",
  hrefFor: (c) => `${PUBLIC_BASE}/publications/${c.slug}`,
  useCards: () => {
    const publications = usePublications();
    return React.useMemo<ConceptCard[]>(
      () =>
        publications
          .filter((p) => p.status === "published")
          .sort((a, b) => b.year - a.year)
          .map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.abstract,
            tags: [PUBLICATION_TYPE_LABEL[p.type] ?? p.type, ...p.keywords.slice(0, 2)],
          })),
      [publications],
    );
  },
};

export const libraryAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Library",
    title: "Knowledge base publik",
    subtitle: "Paper, laporan, dan catatan riset yang sudah diindeks.",
  },
  searchable: true,
  columns: 2,
  emptyText: "Tidak ada dokumen yang cocok.",
  // Documents have no per-item detail route → link back to the library base.
  hrefFor: () => `${PUBLIC_BASE}/library`,
  useCards: () => {
    const docs = useDocuments();
    return React.useMemo<ConceptCard[]>(
      () =>
        docs.map((d) => ({
          id: d.id,
          slug: d.id,
          title: d.title,
          excerpt: d.abstract,
          cover: d.coverImage,
          date: d.uploadedAt,
          tags: [d.tag],
        })),
      [docs],
    );
  },
};

export const readingListAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Reading list",
    title: "Bacaan terpilih untuk peneliti",
    subtitle:
      "Paper, esai, dan buku yang membentuk arah workspace ini. Diperbarui ketika kami menemukan sesuatu yang layak dibaca.",
  },
  searchable: true,
  columns: 2,
  emptyText: "Belum ada bacaan yang cocok.",
  // Curated external links — each card points at its source URL.
  hrefFor: (c) => c.slug,
  useCards: () => {
    const items = useReadingList();
    return React.useMemo<ConceptCard[]>(
      () =>
        items
          .filter((r) => r.status === "published")
          .sort((a, b) => b.addedAt - a.addedAt)
          .map((r) => ({
            id: r.id,
            slug: r.href,
            title: r.title,
            excerpt: r.why,
            date: r.addedAt,
            tags: [r.category, r.source],
          })),
      [items],
    );
  },
};
