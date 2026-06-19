// Riset Kit — landing-page section seed. Split from shared/seed.ts so
// it stays under the 200 LOC cap (same convention as publications-seed).
// Order/visibility/copy admin-editable via /admin → Pages → Landing page;
// section.config JSON overrides renderer defaults (LandingExtras).

import type { LandingSection } from "@/features/_shared/landing/types";

export const SEED_LANDING_SECTIONS: LandingSection[] = [
  {
    id: "ls-hero",
    order: 10,
    kind: "hero",
    title: "Riset workspace yang paham bahasa akademik Indonesia.",
    subtitle:
      "Baca PDF, review literatur, dan draft tesis — semua dalam satu workspace dengan AI yang ngerti EYD dan metodologi riset.",
    enabled: true,
    config: '{"badge":"Untuk peneliti, mahasiswa S2/S3, think-tank"}',
  },
  {
    id: "ls-stats",
    order: 20,
    kind: "stats",
    title: "Jejak riset yang bisa diverifikasi",
    subtitle: "Publikasi, sitasi, dataset terbuka, dan kolaborator — angka berjalan dari workspace ini.",
    enabled: true,
  },
  {
    id: "ls-features",
    order: 30,
    kind: "features",
    title: "Semua yang dibutuhkan dalam siklus riset",
    subtitle: "Dari upload paper sampai draft bab — satu workspace, AI di setiap titik.",
    enabled: true,
  },
  {
    id: "ls-portfolio",
    order: 40,
    kind: "portfolio",
    title: "Sintesis literatur jadi mudah",
    subtitle: "Matrix bandingkan metode, temuan, dan gap antar paper otomatis.",
    enabled: true,
  },
  {
    id: "ls-library",
    order: 50,
    kind: "services",
    title: "Knowledge-base yang terus tumbuh",
    subtitle: "Paper terbaru yang sudah diindeks dan siap ditanyai lewat AI Reader.",
    enabled: true,
  },
  {
    id: "ls-blog",
    order: 60,
    kind: "blog",
    title: "Publikasi terbaru",
    subtitle: "Paper, preprint, dan laporan yang sudah dirilis — lengkap dengan DOI dan sitasi siap salin.",
    enabled: true,
  },
  {
    id: "ls-testimonials",
    order: 70,
    kind: "testimonials",
    title: "Kata kolaborator dan peneliti",
    subtitle: "Pengalaman mereka yang meriset bareng lewat workspace ini.",
    enabled: true,
  },
  {
    id: "ls-faq",
    order: 80,
    kind: "faq",
    title: "Pertanyaan yang sering masuk",
    subtitle: "Soal akses dataset, sitasi, lisensi, dan kolaborasi riset.",
    enabled: true,
  },
  {
    // Peneliti jarang pamer harga — seeded off, admin bisa aktifkan kapan saja.
    id: "ls-pricing",
    order: 90,
    kind: "pricing",
    title: "Paket akses & kolaborasi",
    subtitle: "Dari akses terbuka untuk pembaca sampai kemitraan riset institusi.",
    enabled: false,
  },
  {
    id: "ls-cta",
    order: 100,
    kind: "cta",
    title: "Siap rapikan alur risetmu?",
    subtitle: "Mulai dari upload PDF pertama — workspace siap dalam 5 menit.",
    enabled: true,
  },
  {
    id: "ls-newsletter",
    order: 110,
    kind: "newsletter",
    title: "Ringkasan riset bulanan",
    subtitle: "Publikasi baru, dataset terbuka, dan catatan metodologi — sebulan sekali, tanpa spam.",
    enabled: true,
  },
];
