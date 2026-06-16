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
import { ADMIN_BASE } from "../../../shared/nav-config";
import { nid, slugify, useStore } from "../../../shared/store";
import type { Insight, InsightCategory, PublishStatus } from "../../../shared/types";

const CATEGORIES: InsightCategory[] = ["methodology", "tool-review", "field-notes", "opinion", "tutorial"];
const STATUSES: PublishStatus[] = ["published", "draft"];

function blankInsight(): Insight {
  return {
    id: nid("ins"),
    slug: "",
    title: "Insight baru",
    author: "",
    publishedAt: Date.now(),
    readMinutes: 5,
    category: "methodology",
    excerpt: "",
    body: "",
    tags: [],
    status: "draft",
  };
}

export function InsightEditorView({ id }: { id: string }) {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const isNew = id === "new";
  const existing = state.insights.find((i) => i.id === id);
  if (!isNew && !existing) notFound();

  const [draft, setDraft] = React.useState<Insight>(() => existing ?? blankInsight());
  const [tagsText, setTagsText] = React.useState((existing ?? blankInsight()).tags.join(", "));

  React.useEffect(() => {
    if (existing) {
      setDraft(existing);
      setTagsText(existing.tags.join(", "));
    }
  }, [existing]);

  function save() {
    if (!draft.title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const slug = draft.slug.trim() || slugify(draft.title);
    dispatch({ type: "insight.upsert", insight: { ...draft, slug, tags } });
    toast.success(isNew ? "Insight dibuat" : "Insight disimpan");
    if (isNew) router.push(`${ADMIN_BASE}/insights/${draft.id}`);
  }

  function remove() {
    if (!confirm(`Hapus insight "${draft.title}"?`)) return;
    dispatch({ type: "insight.delete", id: draft.id });
    toast.success("Insight dihapus");
    router.push(`${ADMIN_BASE}/insights`);
  }

  const dateValue = new Date(draft.publishedAt).toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`${ADMIN_BASE}/insights`}
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="author" className="text-xs uppercase tracking-wider text-muted-foreground">
                Penulis
              </Label>
              <Input
                id="author"
                value={draft.author}
                onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug" className="text-xs uppercase tracking-wider text-muted-foreground">
                Slug (auto jika kosong)
              </Label>
              <Input
                id="slug"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="grid gap-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Kategori</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as InsightCategory })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
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
            <div className="grid gap-2">
              <Label htmlFor="read" className="text-xs uppercase tracking-wider text-muted-foreground">
                Menit baca
              </Label>
              <Input
                id="read"
                type="number"
                value={draft.readMinutes}
                onChange={(e) => setDraft({ ...draft, readMinutes: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-xs uppercase tracking-wider text-muted-foreground">
                Tanggal
              </Label>
              <Input
                id="date"
                type="date"
                value={dateValue}
                onChange={(e) =>
                  setDraft({ ...draft, publishedAt: new Date(e.target.value).getTime() })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="excerpt" className="text-xs uppercase tracking-wider text-muted-foreground">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="body" className="text-xs uppercase tracking-wider text-muted-foreground">
              Isi (paragraf dipisah dua baris kosong)
            </Label>
            <Textarea
              id="body"
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              rows={10}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-xs uppercase tracking-wider text-muted-foreground">
              Tags (pisah dengan koma)
            </Label>
            <Input
              id="tags"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
