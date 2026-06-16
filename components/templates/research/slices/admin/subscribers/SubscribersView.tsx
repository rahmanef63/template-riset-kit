"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { Mail } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { rel } from "../../../shared/store";

const STATUS_TONE: Record<string, string> = {
  confirmed: "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15",
  pending: "bg-amber-500/15 text-amber-300 hover:bg-amber-500/15",
  unsubscribed: "bg-rose-500/15 text-rose-300 hover:bg-rose-500/15",
};

export function SubscribersView() {
  const subscribers = useQuery(api.subscribers.list, {});
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const rows = subscribers ?? [];
    const needle = q.toLowerCase().trim();
    if (!needle) return rows;
    return rows.filter((s) => s.email.toLowerCase().includes(needle));
  }, [subscribers, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            {(subscribers ?? []).length} pelanggan newsletter
          </p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari email..."
          className="h-9 w-56"
        />
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          {subscribers === undefined ? (
            <p className="p-10 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : filtered.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Belum ada pelanggan. Form newsletter di situs publik akan mengisi daftar ini.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-border/60">
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Sumber</th>
                    <th className="px-4 py-3 text-left">Bergabung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map((s) => (
                    <tr key={s._id} className="hover:bg-accent/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{s.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={"rounded-full text-[10px] " + (STATUS_TONE[s.status] ?? "")}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">{s.source}</td>
                      <td className="px-4 py-3 text-[11px] text-muted-foreground">{rel(s.ts)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
