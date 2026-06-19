"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { Stagger } from "@/features/_shared/motion";
import {
  cfgNumber,
  parseConfigObject,
  type FaqItem,
  type PricingTier,
  type StatItem,
  type TestimonialItem,
} from "@/features/_shared/landing/sections";
import type { LandingSection } from "@/features/_shared/landing/types";
import { SEED_PUBLICATIONS } from "@/features/_app/publications-seed";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { usePublications } from "@/features/_app/store";
import type { Document, Publication } from "@/features/_app/types";

/** Riset Kit default content for the shared landing sections — every
 *  value overridable per-section via the admin landing editor's config
 *  JSON (see _shared/landing/sections/config.ts for keys). */

export const RESEARCH_STATS: StatItem[] = [
  { value: 24, suffix: "+", label: "Publikasi terindeks" },
  { value: 480, suffix: "+", label: "Sitasi tercatat" },
  { value: 12, label: "Dataset terbuka" },
  { value: 18, label: "Kolaborator aktif" },
];

export const RESEARCH_CLIENTS = [
  "Universitas Lorem",
  "Institut Ipsum",
  "Pusat Studi Kebijakan",
  "Lembaga Data Nasional",
  "Lab Sains Sosial",
  "Konsorsium Riset Dolor",
];

export const RESEARCH_FAQS: FaqItem[] = [
  { q: "Bagaimana cara mengakses dataset?", a: "Dataset berlisensi terbuka bisa diunduh langsung dari halaman Library. Untuk data sensitif, ajukan permintaan akses — kami balas maksimal 3 hari kerja dengan data agreement singkat." },
  { q: "Bagaimana cara mensitasi publikasi di sini?", a: "Setiap publikasi punya halaman detail dengan sitasi siap salin dalam format APA, MLA, Chicago, IEEE, dan BibTeX — lengkap dengan DOI." },
  { q: "Apakah terbuka untuk kolaborasi riset?", a: "Ya. Kami terbuka untuk ko-autor, replikasi studi, dan riset bersama lintas institusi. Sertakan proposal singkat (1 halaman) saat menghubungi kami lewat halaman About." },
  { q: "Lisensi apa yang dipakai untuk data dan tulisan?", a: "Publikasi dan insight dirilis dengan CC BY 4.0 kecuali tertera lain. Dataset mengikuti lisensi sumber masing-masing — selalu tercantum di metadata. Atribusi wajib di kedua kasus." },
  { q: "Bagaimana menghubungi tim riset?", a: "Lewat halaman About atau email di footer. Untuk pertanyaan metodologi, sebutkan judul publikasi atau dataset yang relevan supaya cepat kami arahkan ke peneliti yang tepat." },
];

export const RESEARCH_TIERS: PricingTier[] = [
  {
    name: "Akses Terbuka",
    price: "Gratis",
    blurb: "Untuk pembaca, mahasiswa, dan peneliti independen.",
    features: ["Semua publikasi & insight", "Dataset berlisensi terbuka", "Sitasi siap salin (APA–BibTeX)"],
    ctaLabel: "Jelajahi library",
    ctaHref: `${PUBLIC_BASE}/library`,
  },
  {
    name: "Kolaborasi Riset",
    price: "Proposal",
    blurb: "Riset bersama, ko-autor, dan replikasi studi.",
    features: ["Akses dataset pra-rilis", "Sesi metodologi bersama tim", "Ko-autor dengan ORCID tercatat", "Prioritas review draft"],
    featured: true,
    ctaLabel: "Ajukan kolaborasi",
    ctaHref: `${PUBLIC_BASE}/about`,
  },
  {
    name: "Kemitraan Institusi",
    price: "Penawaran khusus",
    blurb: "Untuk universitas, lembaga, dan think-tank.",
    features: ["Riset pesanan & policy brief", "Pelatihan metodologi untuk tim", "Akses penuh arsip dataset"],
    ctaLabel: "Hubungi kami",
    ctaHref: `${PUBLIC_BASE}/about`,
  },
];

export const RESEARCH_TESTIMONIALS: TestimonialItem[] = [
  { quote: "Matrix lit review-nya memangkas waktu sintesis saya dari dua minggu jadi dua hari. Gap antar paper langsung kelihatan.", author: "Dr. Ratna Dewi", role: "Peneliti senior · Pusat Studi Kebijakan" },
  { quote: "Jarang ada workspace riset yang paham konteks akademik Indonesia — sitasi rapi, istilah EYD konsisten, dataset terdokumentasi.", author: "Prof. Bambang Wirawan", role: "Pembimbing disertasi · Universitas Lorem" },
  { quote: "Kolaborasi lintas kota jadi ringan: satu sumber dokumen, satu daftar sitasi, dan semua kolaborator melihat versi yang sama.", author: "Anisa Putri, M.Sc.", role: "Kandidat doktor · Institut Ipsum" },
  { quote: "Data agreement-nya jelas dan prosesnya cepat. Replikasi studi kami jalan tanpa bolak-balik email berminggu-minggu.", author: "Farhan Hidayat", role: "Research associate · Lembaga Data Nasional" },
];

const TYPE_LABEL: Record<Publication["type"], string> = {
  journal: "Jurnal",
  preprint: "Preprint",
  conference: "Konferensi",
  report: "Laporan",
  chapter: "Bab buku",
};

/** Latest publications teaser — backs the "blog"/"changelog" landing
 *  kinds with the publications catalog (full list at /publications). */
export function PublicationsTeaser({ section }: { section: LandingSection }) {
  // Read the live publications catalog (admin-editable at /admin/publications);
  // fall back to the seed list only when the store is empty/unseeded.
  const fromStore = usePublications();
  const publications: Publication[] = fromStore.length > 0 ? fromStore : SEED_PUBLICATIONS;
  const limit = cfgNumber(parseConfigObject(section.config), "limit") ?? 3;
  const latest = [...publications].sort((a, b) => b.year - a.year).slice(0, limit);
  if (latest.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Publikasi"
        title={section.title}
        subtitle={section.subtitle}
        cta={{ label: "Semua publikasi", href: `${PUBLIC_BASE}/publications` }}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stagger itemClassName="h-full">
          {latest.map((p) => (
            <Link key={p.id} href={`${PUBLIC_BASE}/publications/${p.slug}`} className="group block h-full">
              <Card className="h-full border-border/60 bg-card/50 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg">
                <CardContent className="space-y-2 p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="rounded-full text-[10px]">{TYPE_LABEL[p.type]}</Badge>
                    <span>{p.venue} · {p.year}</span>
                  </div>
                  <h3 className="font-medium leading-snug group-hover:underline">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.authors}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{p.abstract}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Stagger>
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="outline" size="sm">
          <Link href={`${PUBLIC_BASE}/publications`}>
            Semua publikasi <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** Recently indexed documents teaser — backs the "services" landing kind
 *  with the live document store (admin CRUD via /admin → Documents). */
export function LibraryTeaser({
  section,
  documents,
}: {
  section: LandingSection;
  documents: Document[];
}) {
  const limit = cfgNumber(parseConfigObject(section.config), "limit") ?? 3;
  const latest = [...documents].sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, limit);
  if (latest.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Library"
        title={section.title}
        subtitle={section.subtitle}
        cta={{ label: "Buka library", href: `${PUBLIC_BASE}/library` }}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stagger itemClassName="h-full">
          {latest.map((d) => (
            <Card key={d.id} className="h-full overflow-hidden border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
              {d.coverImage && (
                <div className="relative aspect-[5/3] w-full overflow-hidden rounded-t-[inherit]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.coverImage}
                    alt={d.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <BookOpen className="size-3" />
                  <span>{d.year}</span>
                  <Badge variant="outline" className="rounded-full text-[10px]">{d.tag}</Badge>
                </div>
                <h3 className="text-sm font-medium leading-snug">{d.title}</h3>
                <p className="text-xs text-muted-foreground">{d.authors}</p>
                <p className="line-clamp-3 text-xs text-foreground/70">{d.abstract}</p>
              </CardContent>
            </Card>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
