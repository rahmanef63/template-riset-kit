"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { parseConfigObject } from "./sections/config";

// Structured editor for a landing section's `config` JSON. For item-bearing
// kinds it renders add/remove/reorder rows with real fields; every other key
// (and unsupported kinds) stay editable via the raw-JSON fallback. Empty rows
// => the public renderer keeps the template defaults.

type ItemField = { k: string; label: string; type?: "text" | "textarea" | "number" | "switch" | "lines" };
// A repeater block targets one array key on the config. `fields` => array of
// objects (features/faq/…); `string` => array of plain strings edited as a
// single field per row (stats.clients, custom.body).
type Repeater =
  | { key: string; singular: string; fields: ItemField[]; string?: never }
  | { key: string; singular: string; string: { label: string; type?: "text" | "textarea" }; fields?: never };
type KindSchema = Repeater[];

const KIND_SCHEMA: Record<string, KindSchema> = {
  features: [
    {
      key: "items",
      singular: "Feature",
      fields: [
        { k: "icon", label: "Icon (lucide name)" },
        { k: "title", label: "Title" },
        { k: "blurb", label: "Blurb", type: "textarea" },
      ],
    },
  ],
  testimonials: [
    {
      key: "items",
      singular: "Testimonial",
      fields: [
        { k: "quote", label: "Quote", type: "textarea" },
        { k: "author", label: "Author" },
        { k: "role", label: "Role" },
        { k: "rating", label: "Rating (1-5)", type: "number" },
      ],
    },
  ],
  faq: [
    {
      key: "items",
      singular: "Q&A",
      fields: [
        { k: "q", label: "Question" },
        { k: "a", label: "Answer", type: "textarea" },
      ],
    },
  ],
  pricing: [
    {
      key: "tiers",
      singular: "Tier",
      fields: [
        { k: "name", label: "Name" },
        { k: "price", label: "Price" },
        { k: "period", label: "Period (e.g. /bln)" },
        { k: "features", label: "Features (one per line)", type: "lines" },
        { k: "featured", label: "Featured", type: "switch" },
        { k: "ctaLabel", label: "CTA label" },
        { k: "ctaHref", label: "CTA href" },
      ],
    },
  ],
  stats: [
    {
      key: "stats",
      singular: "Stat",
      fields: [
        { k: "value", label: "Value (number)", type: "number" },
        { k: "prefix", label: "Prefix" },
        { k: "suffix", label: "Suffix" },
        { k: "label", label: "Label" },
      ],
    },
    {
      key: "clients",
      singular: "Client",
      string: { label: "Name (logo strip)" },
    },
  ],
  custom: [
    {
      key: "body",
      singular: "Paragraph",
      string: { label: "Paragraph", type: "textarea" },
    },
  ],
};

type Row = Record<string, unknown>;

export function LandingConfigField({
  config,
  kind,
  onChange,
}: {
  config: string;
  kind?: string;
  onChange: (next: unknown) => void;
}) {
  const obj = parseConfigObject(config);
  const schema = kind ? KIND_SCHEMA[kind] : undefined;
  const [showRaw, setShowRaw] = React.useState(false);

  return (
    <div className="space-y-3">
      {schema ? (
        schema.map((rep) => (
          <RepeaterBlock
            key={rep.key}
            repeater={rep}
            rows={Array.isArray(obj[rep.key]) ? (obj[rep.key] as unknown[]) : []}
            onCommit={(next) => onChange(JSON.stringify({ ...obj, [rep.key]: next }))}
          />
        ))
      ) : (
        <p className="text-[10px] text-muted-foreground">
          Section kind ini tidak punya editor terstruktur — pakai JSON di bawah.
        </p>
      )}

      <button
        type="button"
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
        onClick={() => setShowRaw((s) => !s)}
      >
        {showRaw ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        Advanced (raw JSON)
      </button>
      {showRaw && (
        <Textarea
          value={config}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="font-mono text-xs"
          placeholder='{ "items": [{ "q": "…", "a": "…" }] }'
        />
      )}
    </div>
  );
}

function RepeaterBlock({
  repeater,
  rows,
  onCommit,
}: {
  repeater: Repeater;
  rows: unknown[];
  onCommit: (next: unknown[]) => void;
}) {
  const isString = Boolean(repeater.string);
  const empty: unknown = isString ? "" : {};

  function setCell(i: number, k: string, v: unknown) {
    onCommit(rows.map((r, idx) => (idx === i ? { ...(r as Row), [k]: v } : r)));
  }
  function setString(i: number, v: unknown) {
    onCommit(rows.map((r, idx) => (idx === i ? v : r)));
  }
  function addRow() {
    onCommit([...rows, empty]);
  }
  function removeRow(i: number) {
    onCommit(rows.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    onCommit(next);
  }

  return (
    <div className="space-y-2">
      {rows.length === 0 && (
        <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          Belum ada {repeater.singular.toLowerCase()} — situs pakai contoh bawaan template. Tambah baris untuk override.
        </p>
      )}
      {rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              {repeater.singular} {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Naik" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronUp className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Turun" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                <ChevronDown className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive" aria-label="Hapus" onClick={() => removeRow(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          {repeater.string ? (
            <div>
              <Label className="text-[10px] text-muted-foreground">{repeater.string.label}</Label>
              <RowCell field={{ k: "", label: repeater.string.label, type: repeater.string.type }} value={row} onChange={(v) => setString(i, v)} />
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {repeater.fields.map((f) => (
                <div key={f.k} className={f.type === "textarea" || f.type === "lines" ? "sm:col-span-2" : ""}>
                  <Label className="text-[10px] text-muted-foreground">{f.label}</Label>
                  <RowCell field={f} value={(row as Row)[f.k]} onChange={(v) => setCell(i, f.k, v)} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addRow}>
        <Plus className="size-3.5" /> Tambah {repeater.singular.toLowerCase()}
      </Button>
    </div>
  );
}

function RowCell({
  field,
  value,
  onChange,
}: {
  field: ItemField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "switch") {
    return <div className="pt-1"><Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} /></div>;
  }
  if (field.type === "textarea") {
    return <Textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1 text-xs" />;
  }
  if (field.type === "lines") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Textarea
        value={arr.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        rows={3}
        className="mt-1 text-xs"
        placeholder="Satu item per baris"
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={value == null || value === "" ? "" : Number(value)}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className="mt-1 text-xs"
      />
    );
  }
  return <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="mt-1 text-xs" />;
}
