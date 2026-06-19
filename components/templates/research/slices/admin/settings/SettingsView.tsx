"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHead } from "@/components/templates/_shared/ui/section-head";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { ImagePickerButton, imageRef } from "@/features/image-picker";
import { parseSocials } from "@/components/templates/_shared/ui/site-footer";
import { DEFAULT_SITE_CONFIG } from "../../../shared/site-config";

export function SettingsView() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const genUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getUrl);
  const [logoUrl, setLogoUrl] = React.useState("");
  const [socialX, setSocialX] = React.useState("");
  const [socialLinkedin, setSocialLinkedin] = React.useState("");
  const [socialGithub, setSocialGithub] = React.useState("");
  const [socialYoutube, setSocialYoutube] = React.useState("");
  const [aboutHeadline, setAboutHeadline] = React.useState("");
  const [aboutBody, setAboutBody] = React.useState("");
  const [aboutImageUrl, setAboutImageUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (settings === undefined) return;
    setLogoUrl(settings?.logoUrl ?? "");
    const sc = parseSocials(settings?.socials);
    setSocialX(sc.x ?? "");
    setSocialLinkedin(sc.linkedin ?? "");
    setSocialGithub(sc.github ?? "");
    setSocialYoutube(sc.youtube ?? "");
    setAboutHeadline(settings?.aboutHeadline ?? "");
    setAboutBody(settings?.seoDescription ?? "");
    setAboutImageUrl(settings?.aboutImageUrl ?? "");
  }, [settings]);

  const onUpload = async (file: File): Promise<string> => {
    const uploadUrl = await genUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = (await res.json()) as { storageId: string };
    return ((await getFileUrl({ storageId: storageId as never })) as string) ?? "";
  };

  const saveLogo = async () => {
    setSaving(true);
    try {
      const socialsMap = Object.fromEntries(
        ([["x", socialX], ["linkedin", socialLinkedin], ["github", socialGithub], ["youtube", socialYoutube]] as const)
          .filter(([, val]) => val.trim()),
      );
      // merge with current settings so we never wipe other fields
      await upsert({
        siteName: settings?.siteName ?? c.brandName,
        ownerName: settings?.ownerName ?? c.ownerName,
        contactEmail: settings?.contactEmail ?? c.email,
        logoUrl,
        socials: Object.keys(socialsMap).length ? JSON.stringify(socialsMap) : undefined,
        aboutHeadline: aboutHeadline || undefined,
        seoDescription: aboutBody || undefined,
        aboutImageUrl: aboutImageUrl || undefined,
      });
      toast.success("Pengaturan tersimpan");
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Pengaturan" title="Settings" subtitle="Konfigurasi workspace, AI, dan branding." />

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Brand</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-xs">Brand name</Label>
              <Input defaultValue={c.brandName} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Owner</Label>
              <Input defaultValue={c.ownerName} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input defaultValue={c.email} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Domain</Label>
              <Input defaultValue={c.baseUrl} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Logo</h3>
          <p className="text-sm text-muted-foreground">
            Logo brand tampil di header situs publik. Jika kosong, header pakai wordmark teks.
          </p>
          <div className="flex items-center gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-12 w-auto rounded-md border border-border/60 bg-background object-contain p-1" />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground">
                —
              </div>
            )}
            <ImagePickerButton
              label={logoUrl ? "Ganti logo" : "Upload logo"}
              title="Logo"
              onUpload={onUpload}
              searchUnsplash={undefined}
              onChange={(img) => setLogoUrl(imageRef(img) ?? "")}
            />
          </div>
          <div className="space-y-3 border-t border-border/60 pt-3">
            <h4 className="text-sm font-medium">Social links</h4>
            <p className="text-sm text-muted-foreground">
              Hanya platform yang diisi URL-nya yang muncul di footer situs publik.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-xs">X / Twitter URL</Label>
                <Input
                  className="mt-1"
                  value={socialX}
                  onChange={(e) => setSocialX(e.target.value)}
                  placeholder="https://x.com/username"
                />
              </div>
              <div>
                <Label className="text-xs">LinkedIn URL</Label>
                <Input
                  className="mt-1"
                  value={socialLinkedin}
                  onChange={(e) => setSocialLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label className="text-xs">GitHub URL</Label>
                <Input
                  className="mt-1"
                  value={socialGithub}
                  onChange={(e) => setSocialGithub(e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <Label className="text-xs">YouTube URL</Label>
                <Input
                  className="mt-1"
                  value={socialYoutube}
                  onChange={(e) => setSocialYoutube(e.target.value)}
                  placeholder="https://youtube.com/@username"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="gap-1" onClick={saveLogo} disabled={saving || settings === undefined}>
              <Save className="size-4" /> {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">About page</h3>
          <div>
            <Label className="text-xs">Judul / headline</Label>
            <Input
              value={aboutHeadline}
              onChange={(e) => setAboutHeadline(e.target.value)}
              placeholder="Workspace riset yang dirancang dari konteks Indonesia."
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Bio / intro</Label>
            <Textarea
              value={aboutBody}
              onChange={(e) => setAboutBody(e.target.value)}
              rows={3}
              placeholder="Ceritakan tentang produk atau timmu…"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Foto</Label>
            <div className="mt-1 flex items-center gap-3">
              {aboutImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aboutImageUrl} alt="About" className="size-16 rounded-lg border border-border/60 object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">Belum ada foto.</span>
              )}
              <ImagePickerButton
                label={aboutImageUrl ? "Ganti foto" : "Upload foto"}
                title="Foto About"
                onUpload={onUpload}
                searchUnsplash={undefined}
                onChange={(img) => setAboutImageUrl(imageRef(img) ?? "")}
              />
              {aboutImageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setAboutImageUrl("")}>
                  Hapus
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" className="gap-1" onClick={saveLogo} disabled={saving || settings === undefined}>
              <Save className="size-4" /> {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">AI</h3>
          <p className="text-sm text-muted-foreground">
            Mode akademik EYD aktif. Provider AI router akan memilih tier (nano/mid/flagship) sesuai kompleksitas
            tugas — citation extract pakai nano, lit synthesis pakai flagship.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="flex items-center justify-between gap-4 p-5 text-sm">
          <div>
            <p className="font-medium text-foreground">Appearance</p>
            <p className="text-muted-foreground">
              Pilih display mode (light/dark/system) + color preset. Tersimpan
              di browser, berlaku ke seluruh dashboard &amp; situs publik.
            </p>
          </div>
          <ThemePresetSwitcher />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <UpdateCard />
        <BackupCard />
      </div>
    </div>
  );
}
