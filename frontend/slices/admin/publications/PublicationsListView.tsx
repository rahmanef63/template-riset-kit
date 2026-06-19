"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Filter, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { usePublications, useStore } from "@/features/_app/store";
import type { PublicationType } from "@/features/_app/types";

const TYPE_LABEL: Record<PublicationType, string> = {
  journal: "Jurnal",
  preprint: "Preprint",
  conference: "Konferensi",
  report: "Laporan",
  chapter: "Bab buku",
};

const TYPE_TONE: Record<PublicationType, string> = {
  journal: "bg-sky-500/15 text-sky-300 hover:bg-sky-500/15",
  preprint: "bg-amber-500/15 text-amber-300 hover:bg-amber-500/15",
  conference: "bg-violet-500/15 text-violet-300 hover:bg-violet-500/15",
  report: "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15",
  chapter: "bg-rose-500/15 text-rose-300 hover:bg-rose-500/15",
};

type TypeFilter = PublicationType | "all";

export function PublicationsListView() {
  const { dispatch } = useStore();
  const publications = usePublications();
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState<TypeFilter>("all");

  const filtered = React.useMemo(() => {
    const needle = q.toLowerCase().trim();
    return publications
      .filter((p) => {
        if (type !== "all" && p.type !== type) return false;
        if (!needle) return true;
        return (
          p.title.toLowerCase().includes(needle) ||
          p.authors.toLowerCase().includes(needle) ||
          p.venue.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => b.year - a.year);
  }, [publications, q, type]);

  const TYPES: TypeFilter[] = ["all", "journal", "preprint", "conference", "report", "chapter"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Publications</h1>
          <p className="text-sm text-muted-foreground">
            {publications.length} total ·{" "}
            {publications.filter((p) => p.status === "published").length} published ·{" "}
            {publications.filter((p) => p.status === "draft").length} draft
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari publikasi..."
            className="h-9 w-48"
          />
          <Button asChild size="sm" className="gap-1">
            <Link href={`${ADMIN_BASE}/publications/new`}>
              <Plus className="size-4" /> Publikasi baru
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Filter className="size-3.5 self-center text-muted-foreground" />
        {TYPES.map((t) => (
          <Button
            key={t}
            type="button"
            variant={type === t ? "secondary" : "outline"}
            size="sm"
            onClick={() => setType(t)}
            className="h-7 rounded-full px-3 text-[11px] uppercase tracking-wider"
          >
            {t === "all" ? "Semua" : TYPE_LABEL[t]} (
            {t === "all" ? publications.length : publications.filter((p) => p.type === t).length})
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed bg-muted/10 p-10 text-center text-sm text-muted-foreground">
          Tidak ada publikasi yang cocok. Buat publikasi baru atau ubah filter.
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <Card key={p.id} className="border-border/60 bg-card/60">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="size-3" />
                    <span>{p.year}</span>
                    <Badge className={"rounded-full text-[10px] " + TYPE_TONE[p.type]}>
                      {TYPE_LABEL[p.type]}
                    </Badge>
                    {p.status === "draft" && (
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        Draft
                      </Badge>
                    )}
                    <span>·</span>
                    <span className="normal-case tracking-normal">{p.venue}</span>
                  </div>
                  <Link
                    href={`${ADMIN_BASE}/publications/${p.id}`}
                    className="block text-base font-medium leading-snug hover:underline"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{p.authors}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Hapus publikasi "${p.title}"?`)) {
                      dispatch({ type: "publication.delete", id: p.id });
                      toast.success("Publikasi dihapus");
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
