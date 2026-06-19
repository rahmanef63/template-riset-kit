"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Filter, Lightbulb, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { fmtDate, useInsights, useStore } from "@/features/_app/store";
import type { InsightCategory } from "@/features/_app/types";

const CATEGORY_LABEL: Record<InsightCategory, string> = {
  methodology: "Metodologi",
  "tool-review": "Tool Review",
  "field-notes": "Field Notes",
  opinion: "Opini",
  tutorial: "Tutorial",
};

const CATEGORY_TONE: Record<InsightCategory, string> = {
  methodology: "bg-sky-500/15 text-sky-300 hover:bg-sky-500/15",
  "tool-review": "bg-amber-500/15 text-amber-300 hover:bg-amber-500/15",
  "field-notes": "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15",
  opinion: "bg-rose-500/15 text-rose-300 hover:bg-rose-500/15",
  tutorial: "bg-violet-500/15 text-violet-300 hover:bg-violet-500/15",
};

type CatFilter = InsightCategory | "all";

export function InsightsListView() {
  const { dispatch } = useStore();
  const insights = useInsights();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<CatFilter>("all");

  const filtered = React.useMemo(() => {
    const needle = q.toLowerCase().trim();
    return insights
      .filter((i) => {
        if (cat !== "all" && i.category !== cat) return false;
        if (!needle) return true;
        return (
          i.title.toLowerCase().includes(needle) ||
          i.excerpt.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => b.publishedAt - a.publishedAt);
  }, [insights, q, cat]);

  const CATS: CatFilter[] = ["all", "methodology", "tool-review", "field-notes", "tutorial", "opinion"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
          <p className="text-sm text-muted-foreground">
            {insights.length} total ·{" "}
            {insights.filter((i) => i.status === "published").length} published ·{" "}
            {insights.filter((i) => i.status === "draft").length} draft
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari insight..."
            className="h-9 w-48"
          />
          <Button asChild size="sm" className="gap-1">
            <Link href={`${ADMIN_BASE}/insights/new`}>
              <Plus className="size-4" /> Insight baru
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Filter className="size-3.5 self-center text-muted-foreground" />
        {CATS.map((c) => (
          <Button
            key={c}
            type="button"
            variant={cat === c ? "secondary" : "outline"}
            size="sm"
            onClick={() => setCat(c)}
            className="h-7 rounded-full px-3 text-[11px] uppercase tracking-wider"
          >
            {c === "all" ? "Semua" : CATEGORY_LABEL[c]} (
            {c === "all" ? insights.length : insights.filter((i) => i.category === c).length})
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed bg-muted/10 p-10 text-center text-sm text-muted-foreground">
          Tidak ada insight yang cocok. Buat insight baru atau ubah filter.
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((i) => (
            <Card key={i.id} className="border-border/60 bg-card/60">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <Lightbulb className="size-3" />
                    <Badge className={"rounded-full text-[10px] " + CATEGORY_TONE[i.category]}>
                      {CATEGORY_LABEL[i.category]}
                    </Badge>
                    {i.status === "draft" && (
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        Draft
                      </Badge>
                    )}
                    <span>·</span>
                    <span className="normal-case tracking-normal">{fmtDate(i.publishedAt)}</span>
                    <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                      <Clock className="size-3" /> {i.readMinutes} mnt
                    </span>
                  </div>
                  <Link
                    href={`${ADMIN_BASE}/insights/${i.id}`}
                    className="block text-base font-medium leading-snug hover:underline"
                  >
                    {i.title}
                  </Link>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{i.excerpt}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Hapus insight "${i.title}"?`)) {
                      dispatch({ type: "insight.delete", id: i.id });
                      toast.success("Insight dihapus");
                    }
                  }}
                >
                  <Trash2 className="size-3.5 text-rose-400" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
