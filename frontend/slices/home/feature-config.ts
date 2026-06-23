// Feature-section items for the Riset Kit LandingRenderer.
// Icons can't live in JSON config, so the single-source module carries a
// lucide icon NAME (string) which we map back to a component here. Unknown/
// missing names fall back to Sparkles so the grid never renders an empty cell.

import { Bot, FileText, Library, Quote, Sparkles } from "lucide-react";
import type { FeatureItem } from "@/features/_shared";
import { FEATURES } from "@/convex/landingContent";

const FEATURE_ICONS: Record<string, FeatureItem["icon"]> = {
  FileText,
  Bot,
  Library,
  Quote,
  Sparkles,
};

// Render fallback, derived from the single source (convex/landingContent.ts).
// The seed writes the same FEATURES (icon NAMES) into Convex config; here the
// names map back to lucide components for the local fallback.
export const FEATURE_ITEMS: FeatureItem[] = FEATURES.map((f) => ({
  icon: FEATURE_ICONS[f.icon] ?? Sparkles,
  title: f.title,
  blurb: f.blurb,
}));
