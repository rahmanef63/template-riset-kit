"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  HeroBlock,
  SectionHead,
  FeatureGrid,
  CtaBand,
} from "@/features/_shared";
import { LandingSectionShell } from "@/features/_shared/landing/LandingSectionShell";
import { HeroLayers } from "@/features/_shared/landing/HeroLayers";
import { Stagger } from "@/features/_shared/motion";
import { parseConfigBadge } from "@/features/_shared/landing/parse-config";
import {
  CustomSection,
  FaqSection,
  NewsletterSection,
  PricingSection,
  StatsSection,
  TestimonialsSection,
  cfgString,
  parseConfigObject,
} from "@/features/_shared/landing/sections";
import type { LandingSection } from "@/features/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { Document, LitReview } from "@/features/_app/types";
import {
  LibraryTeaser,
  PublicationsTeaser,
  RESEARCH_CLIENTS,
  RESEARCH_FAQS,
  RESEARCH_STATS,
  RESEARCH_TESTIMONIALS,
  RESEARCH_TIERS,
} from "./LandingExtras";
import { FEATURE_ITEMS } from "./feature-config";
import { HERO_IMG } from "./home-data";

interface Deps {
  documents: Document[];
  litReviews: LitReview[];
  onSubscribe?: (email: string) => Promise<{ ok: boolean; notice?: string }>;
}

/**
 * Maps each enabled landingSection.kind to its research renderer.
 * Admin-editable title/subtitle thread through; section.config JSON
 * overrides every default (stats/faq/tiers/testimonials — see
 * _shared/landing/sections/config.ts). Defaults live in LandingExtras.
 */
export function renderLanding(section: LandingSection, deps: Deps) {
  switch (section.kind) {
    case "hero": {
      const cfg = parseConfigObject(section.config);
      return (
        <LandingSectionShell section={section}>
          {/* Admin-composed background layers (images + HTML/CSS, each with
              opacity + on/off). Empty => HERO_IMG fallback so existing heroes
              look unchanged. When an admin sets a foreground `imageUrl` card
              the ambient background is suppressed (no fallbackImg), mirroring
              the previous behavior. */}
          <HeroLayers
            placement="background"
            layers={section.layers}
            fallbackImg={section.imageUrl ? undefined : HERO_IMG}
          />
          {/* Readability scrim — opt-in via the `shade` toggle so the hero
              image shows in full real color by default. */}
          {section.shade && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/85 to-background" />
            </div>
          )}
          <HeroBlock
            glow={Boolean(section.imageUrl)}
            badge={parseConfigBadge(section.config) ?? "Untuk peneliti, mahasiswa S2/S3, think-tank"}
            title={section.title}
            subtitle={section.subtitle}
            primaryCta={{
              label: cfgString(cfg, "ctaPrimaryLabel") ?? "Buka workspace",
              href: cfgString(cfg, "ctaPrimaryHref") ?? ADMIN_BASE,
            }}
            secondaryCta={{
              label: cfgString(cfg, "ctaSecondaryLabel") ?? "Lihat library publik",
              href: cfgString(cfg, "ctaSecondaryHref") ?? `${PUBLIC_BASE}/library`,
            }}
            image={section.imageUrl ? { url: section.imageUrl, ratio: section.imageRatio } : undefined}
          />
          {/* Foreground layers — above content, click-through. */}
          <HeroLayers placement="foreground" layers={section.layers} />
        </LandingSectionShell>
      );
    }

    case "stats":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <StatsSection section={section} stats={RESEARCH_STATS} clients={RESEARCH_CLIENTS} />
        </LandingSectionShell>
      );

    case "features":
      return (
        <LandingSectionShell section={section} defaultClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            eyebrow="Fitur"
            title={section.title}
            subtitle={section.subtitle}
          />
          <FeatureGrid items={FEATURE_ITEMS} columns={4} className="mt-10" />
        </LandingSectionShell>
      );

    case "portfolio":
      return (
        <LandingSectionShell section={section} defaultClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            eyebrow="Lit Review"
            title={section.title}
            subtitle={section.subtitle}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Stagger itemClassName="h-full">
              {deps.litReviews.map((r) => (
                <Card key={r.id} className="h-full border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Topik riset</p>
                    <h3 className="text-base font-medium">{r.topic}</h3>
                    <p className="text-sm text-muted-foreground">{r.question}</p>
                    <p className="text-xs text-foreground/70">{r.docIds.length} paper · {r.matrix.length} entri matrix</p>
                  </CardContent>
                </Card>
              ))}
            </Stagger>
          </div>
        </LandingSectionShell>
      );

    case "services":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <LibraryTeaser section={section} documents={deps.documents} />
        </LandingSectionShell>
      );

    case "blog":
    case "changelog":
      return (
        <LandingSectionShell section={section} defaultClassName="border-t border-border/50">
          <PublicationsTeaser section={section} />
        </LandingSectionShell>
      );

    case "testimonials":
      return (
        <LandingSectionShell section={section}>
          <TestimonialsSection
            section={section}
            eyebrow="Kolaborator"
            items={RESEARCH_TESTIMONIALS}
          />
        </LandingSectionShell>
      );

    case "faq":
      return (
        <LandingSectionShell section={section}>
          <FaqSection
            section={section}
            items={RESEARCH_FAQS}
            ctaLabel="Hubungi tim riset"
            ctaHref={`${PUBLIC_BASE}/about`}
          />
        </LandingSectionShell>
      );

    case "pricing":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <PricingSection section={section} tiers={RESEARCH_TIERS} featuredBadge="Paling diminati" />
        </LandingSectionShell>
      );

    case "cta":
      return (
        <LandingSectionShell section={section}>
          <CtaBand
            title={section.title}
            subtitle={section.subtitle ?? "Mulai dari upload PDF pertamamu."}
            cta={{ label: "Buka workspace", href: ADMIN_BASE }}
          />
        </LandingSectionShell>
      );

    case "newsletter":
      return (
        <LandingSectionShell section={section}>
          <NewsletterSection
            section={section}
            placeholder="Email kamu"
            buttonLabel="Berlangganan"
            successText="Terima kasih — ringkasan pertama menyusul."
            onSubscribe={deps.onSubscribe}
          />
        </LandingSectionShell>
      );

    case "custom":
      return (
        <LandingSectionShell section={section}>
          <CustomSection section={section} />
        </LandingSectionShell>
      );

    default:
      return null;
  }
}
