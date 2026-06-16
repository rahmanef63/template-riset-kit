"use client";

import * as React from "react";
import Link from "next/link";
import { BookMarked, Filter, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ADMIN_BASE } from "../../../shared/nav-config";
import { fmtDate, useReadingList, useStore } from "../../../shared/store";
import type { ReadingCategory } from "../../../shared/types";

const CAT_LABEL: Record<ReadingCategory, string> = {
  paper: "Paper",
  essay: "Essay",
  book: "Book",
  thread: "Thread",
  report: "Report",
};

const CAT_TONE: Record<ReadingCategory, string> = {
  paper: "bg-sky-500/15 text-sky-300 hover:bg-sky-500/15",
  essay: "bg-amber-500/15 text-amber-300 hover:bg-amber-500/15",
  book: "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15",
  thread: "bg-rose-500/15 text-rose-300 hover:bg-rose-500/15",
  report: "bg-violet-500/15 text-violet-300 hover:bg-violet-500/15",
};

type CatFilter = ReadingCategory | "all";

export function ReadingListView() {
  const { dispatch } = useStore();
  const items = useReadingList();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<CatFilter>("all");

  const filtered = React.useMemo(() => {
    const needle = q.toLowerCase().trim();
    return items
      .filter((r) => {
        if (cat !== "all" && r.category !== cat) return false;
        if (!needle) return true;
        return (
          r.title.toLowerCase().includes(needle) ||
          r.source.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => b.addedAt - a.addedAt);
  }, [items, q, cat]);

  const CATS: CatFilter[] = ["all", "paper", "essay", "book", "report", "thread"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reading list</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} total ·{" "}
            {items.filter((r) => r.status === "published").length} published ·{" "}
            {items.filter((r) => r.status === "draft").length} draft
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari bacaan..."
            className="h-9 w-48"
          />
          <Button asChild size="sm" className="gap-1">
            <Link href={`${ADMIN_BASE}/reading-list/new`}>
              <Plus className="size-4" /> Bacaan baru
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
            {c === "all" ? "Semua" : CAT_LABEL[c]} (
            {c === "all" ? items.length : items.filter((r) => r.category === c).length})
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed bg-muted/10 p-10 text-center text-sm text-muted-foreground">
          Tidak ada bacaan yang cocok. Tambahkan bacaan baru atau ubah filter.
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r) => (
            <Card key={r.id} className="border-border/60 bg-card/60">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <BookMarked className="size-3" />
                    <Badge className={"rounded-full text-[10px] " + CAT_TONE[r.category]}>
                      {CAT_LABEL[r.category]}
                    </Badge>
                    {r.status === "draft" && (
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        Draft
                      </Badge>
                    )}
                    <span>·</span>
                    <span>{r.year}</span>
                    <span className="normal-case tracking-normal">· {fmtDate(r.addedAt)}</span>
                  </div>
                  <Link
                    href={`${ADMIN_BASE}/reading-list/${r.id}`}
                    className="block text-base font-medium leading-snug hover:underline"
                  >
                    {r.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{r.source}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Hapus bacaan "${r.title}"?`)) {
                      dispatch({ type: "reading.delete", id: r.id });
                      toast.success("Bacaan dihapus");
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
