"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { nid, useStore } from "@/features/_app/store";
import type { PublicReadingItem, PublishStatus, ReadingCategory } from "@/features/_app/types";

const CATEGORIES: ReadingCategory[] = ["paper", "essay", "book", "thread", "report"];
const STATUSES: PublishStatus[] = ["published", "draft"];

function blankItem(): PublicReadingItem {
  return {
    id: nid("read"),
    title: "Bacaan baru",
    source: "",
    year: new Date().getFullYear(),
    category: "paper",
    href: "#",
    why: "",
    addedAt: Date.now(),
    status: "draft",
  };
}

export function ReadingEditorView({ id }: { id: string }) {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const isNew = id === "new";
  const existing = state.readingList.find((r) => r.id === id);
  if (!isNew && !existing) notFound();

  const [draft, setDraft] = React.useState<PublicReadingItem>(() => existing ?? blankItem());

  React.useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing]);

  function save() {
    if (!draft.title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    dispatch({ type: "reading.upsert", reading: draft });
    toast.success(isNew ? "Bacaan dibuat" : "Bacaan disimpan");
    if (isNew) router.push(`${ADMIN_BASE}/reading-list/${draft.id}`);
  }

  function remove() {
    if (!confirm(`Hapus bacaan "${draft.title}"?`)) return;
    dispatch({ type: "reading.delete", id: draft.id });
    toast.success("Bacaan dihapus");
    router.push(`${ADMIN_BASE}/reading-list`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`${ADMIN_BASE}/reading-list`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Kembali ke daftar
        </Link>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button variant="ghost" size="sm" onClick={remove} className="text-rose-400">
              <Trash2 className="size-3.5" /> Hapus
            </Button>
          )}
          <Button size="sm" onClick={save}>
            <Save className="size-3.5" /> Simpan
          </Button>
        </div>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground">
              Judul
            </Label>
            <Input
              id="title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="source" className="text-xs uppercase tracking-wider text-muted-foreground">
              Sumber
            </Label>
            <Input
              id="source"
              value={draft.source}
              onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              placeholder="Penulis / jurnal / institusi"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="year" className="text-xs uppercase tracking-wider text-muted-foreground">
                Tahun
              </Label>
              <Input
                id="year"
                type="number"
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Kategori</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as ReadingCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as PublishStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="href" className="text-xs uppercase tracking-wider text-muted-foreground">
              Link
            </Label>
            <Input
              id="href"
              value={draft.href}
              onChange={(e) => setDraft({ ...draft, href: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="why" className="text-xs uppercase tracking-wider text-muted-foreground">
              Kenapa layak dibaca
            </Label>
            <Textarea
              id="why"
              value={draft.why}
              onChange={(e) => setDraft({ ...draft, why: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
