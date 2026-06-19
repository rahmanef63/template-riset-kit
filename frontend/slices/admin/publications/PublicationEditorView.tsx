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
import { nid, slugify, useStore } from "@/features/_app/store";
import type { Publication, PublicationType, PublishStatus } from "@/features/_app/types";

const TYPES: PublicationType[] = ["journal", "preprint", "conference", "report", "chapter"];
const STATUSES: PublishStatus[] = ["published", "draft"];

function blankPublication(): Publication {
  return {
    id: nid("pub"),
    slug: "",
    title: "Publikasi baru",
    authors: "",
    year: new Date().getFullYear(),
    venue: "",
    type: "journal",
    doi: "",
    abstract: "",
    keywords: [],
    pages: "",
    pdfHref: "#",
    status: "draft",
  };
}

export function PublicationEditorView({ id }: { id: string }) {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const isNew = id === "new";
  const existing = state.publications.find((p) => p.id === id);
  if (!isNew && !existing) notFound();

  const [draft, setDraft] = React.useState<Publication>(() => existing ?? blankPublication());
  const [keywordsText, setKeywordsText] = React.useState(
    (existing ?? blankPublication()).keywords.join(", "),
  );

  React.useEffect(() => {
    if (existing) {
      setDraft(existing);
      setKeywordsText(existing.keywords.join(", "));
    }
  }, [existing]);

  function save() {
    if (!draft.title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const slug = draft.slug.trim() || slugify(draft.title);
    dispatch({ type: "publication.upsert", publication: { ...draft, slug, keywords } });
    toast.success(isNew ? "Publikasi dibuat" : "Publikasi disimpan");
    if (isNew) router.push(`${ADMIN_BASE}/publications/${draft.id}`);
  }

  function remove() {
    if (!confirm(`Hapus publikasi "${draft.title}"?`)) return;
    dispatch({ type: "publication.delete", id: draft.id });
    toast.success("Publikasi dihapus");
    router.push(`${ADMIN_BASE}/publications`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`${ADMIN_BASE}/publications`}
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
            <Label htmlFor="authors" className="text-xs uppercase tracking-wider text-muted-foreground">
              Penulis
            </Label>
            <Input
              id="authors"
              value={draft.authors}
              onChange={(e) => setDraft({ ...draft, authors: e.target.value })}
              placeholder="Nama A., Nama B."
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
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tipe</Label>
              <Select
                value={draft.type}
                onValueChange={(v) => setDraft({ ...draft, type: v as PublicationType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {t}
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="venue" className="text-xs uppercase tracking-wider text-muted-foreground">
                Venue
              </Label>
              <Input
                id="venue"
                value={draft.venue}
                onChange={(e) => setDraft({ ...draft, venue: e.target.value })}
                placeholder="Jurnal / konferensi / preprint server"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pages" className="text-xs uppercase tracking-wider text-muted-foreground">
                Halaman
              </Label>
              <Input
                id="pages"
                value={draft.pages ?? ""}
                onChange={(e) => setDraft({ ...draft, pages: e.target.value })}
                placeholder="88-104"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="doi" className="text-xs uppercase tracking-wider text-muted-foreground">
                DOI
              </Label>
              <Input
                id="doi"
                value={draft.doi}
                onChange={(e) => setDraft({ ...draft, doi: e.target.value })}
                placeholder="10.1234/..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug" className="text-xs uppercase tracking-wider text-muted-foreground">
                Slug (auto dari judul jika kosong)
              </Label>
              <Input
                id="slug"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="cognitive-load-2024"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="abstract" className="text-xs uppercase tracking-wider text-muted-foreground">
              Abstrak
            </Label>
            <Textarea
              id="abstract"
              value={draft.abstract}
              onChange={(e) => setDraft({ ...draft, abstract: e.target.value })}
              rows={5}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keywords" className="text-xs uppercase tracking-wider text-muted-foreground">
              Keywords (pisah dengan koma)
            </Label>
            <Input
              id="keywords"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="cognitive load, meta-analysis"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pdfHref" className="text-xs uppercase tracking-wider text-muted-foreground">
              Link PDF
            </Label>
            <Input
              id="pdfHref"
              value={draft.pdfHref ?? ""}
              onChange={(e) => setDraft({ ...draft, pdfHref: e.target.value })}
              placeholder="#"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
