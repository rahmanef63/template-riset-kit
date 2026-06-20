"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, Stagger } from "@/features/_shared/motion";
import { ADMIN_BASE } from "@/features/_app/nav-config";

const DEFAULT_HEADLINE = "Workspace riset yang dirancang dari konteks Indonesia.";
const DEFAULT_INTRO =
  "Riset Kit dibangun karena tools riset global tidak selalu cocok dengan workflow akademik Indonesia. Bahasa, metodologi, format sitasi — semua kami sesuaikan ulang.";

// Seed/default fallback — keeps the public + demo page non-blank when the
// dashboard-managed tables are still empty (mirrors settings?.aboutHeadline).
const DEFAULT_PRINCIPLES = [
  "Privasi-first — dokumen diproses di workspace pribadi.",
  "EYD-aware — AI ngerti tata bahasa akademik Indonesia.",
  "Citation-correct — APA, MLA, Chicago, IEEE, BibTeX.",
  "Methodology-aware — review logika metode otomatis.",
  "Source-of-truth — setiap klaim selalu balik ke dokumen asli.",
  "Open formats — export ke .docx, .tex, .md, .bib.",
];

const DEFAULT_TIMELINE = [
  { year: "2026", milestone: "Riset Kit launch — workspace untuk peneliti Indonesia." },
  { year: "2025", milestone: "Beta tertutup di 3 universitas — feedback dari 40+ peneliti." },
  { year: "2024", milestone: "Prototype AI Reader — validasi konsep dengan tesis S2." },
];

export function AboutPage() {
  const settings = useQuery(api.settings.get);
  const principleRows = useQuery(api.aboutPrinciples.list, {});
  const timelineRows = useQuery(api.aboutTimeline.list, {});
  const headline = settings?.aboutHeadline || DEFAULT_HEADLINE;
  const intro = settings?.seoDescription || DEFAULT_INTRO;
  const photo = settings?.aboutImageUrl;

  const principles =
    principleRows && principleRows.length > 0
      ? [...principleRows].sort((a, b) => a.order - b.order).map((p) => p.text)
      : DEFAULT_PRINCIPLES;
  const timeline =
    timelineRows && timelineRows.length > 0
      ? [...timelineRows]
          .sort((a, b) => a.order - b.order)
          .map((t) => ({ year: t.year, milestone: t.milestone }))
      : DEFAULT_TIMELINE;
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <Reveal>
        <header>
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={headline}
              className="mb-6 h-40 w-40 rounded-2xl border border-border/60 object-cover"
            />
          )}
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Tentang</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">{headline}</h1>
          <p className="mt-4 max-w-3xl text-muted-foreground">{intro}</p>
          <Button asChild className="mt-6">
            <Link href={ADMIN_BASE}>Coba workspace <ArrowRight className="size-4" /></Link>
          </Button>
        </header>
      </Reveal>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Prinsip</h2>
        </Reveal>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Stagger itemClassName="h-full" step={60} cap={300}>
            {principles.map((p) => (
              <Card key={p} className="h-full border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex items-start gap-3 p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 text-foreground/70" />
                  <span className="text-foreground/85">{p}</span>
                </CardContent>
              </Card>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="mt-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Timeline</h2>
        </Reveal>
        <ol className="mt-6 space-y-3 border-l border-border/60 pl-6">
          {timeline.map((t, idx) => (
            <li key={t.year} className="relative">
              <span className="absolute -left-[29px] top-1.5 grid size-3 place-items-center rounded-full border border-border bg-background">
                <span className="size-1 rounded-full bg-foreground" />
              </span>
              {/* Reveal inside the <li> — Stagger's div children would be invalid <ol> markup. */}
              <Reveal delay={Math.min(idx * 60, 360)}>
                <p className="text-xs font-mono text-muted-foreground">{t.year}</p>
                <p className="text-sm text-foreground/85">{t.milestone}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
