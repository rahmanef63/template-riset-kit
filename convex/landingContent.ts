// SINGLE SOURCE of Riset Kit's landing example content.
//
// Imported by BOTH:
//  - convex/seed.ts → seeds each item section's `config` into landingSections,
//    so a fresh clone gets EDITABLE example data in the admin landing editor
//    (not just code-only defaults).
//  - frontend/slices/home/* → the render fallback (used before the seed runs).
//
// MUST stay framework-pure: no convex/server, no convex/values, no React/lucide
// imports — only literals + plain types — so the Convex bundler AND the Next
// client can both import it. Feature icons are lucide NAMES (string), resolved
// to components in feature-config.ts. Hrefs are root-relative (publicBase = "").
//
// Edit content HERE once; the seed and the render both follow. No drift.

export type LcStat = { value: number; prefix?: string; suffix?: string; label: string };
export type LcFeature = { icon: string; title: string; blurb: string };
export type LcTier = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
};
export type LcFaq = { q: string; a: string };
export type LcTestimonial = { quote: string; author: string; role?: string; rating?: number };

export const HERO = {
  title: "Riset workspace yang paham bahasa akademik Indonesia.",
  subtitle:
    "Baca PDF, review literatur, dan draft tesis — semua dalam satu workspace dengan AI yang ngerti EYD dan metodologi riset.",
  badge: "Untuk peneliti, mahasiswa S2/S3, think-tank",
};

export const STATS: LcStat[] = [
  { value: 24, suffix: "+", label: "Publikasi terindeks" },
  { value: 480, suffix: "+", label: "Sitasi tercatat" },
  { value: 12, label: "Dataset terbuka" },
  { value: 18, label: "Kolaborator aktif" },
];

export const CLIENTS: string[] = [
  "Universitas Garuda Nusantara",
  "Institut Sains Nusantara",
  "Pusat Studi Kebijakan",
  "Lembaga Data Nasional",
  "Lab Sains Sosial",
  "Konsorsium Riset Maritim",
];

export const FEATURES: LcFeature[] = [
  { icon: "FileText", title: "Document Library", blurb: "Upload PDF/DOCX, OCR otomatis, indeks vektor untuk pencarian semantik." },
  { icon: "Bot", title: "AI Reader", blurb: "Chat dengan dokumen — tanya, parafrase, ringkas. Paham EYD bahasa Indonesia." },
  { icon: "Library", title: "Lit Review Matrix", blurb: "Bandingkan 10+ paper sekaligus: metode, temuan, gap penelitian." },
  { icon: "Quote", title: "Citation Manager", blurb: "APA, MLA, Chicago, IEEE, BibTeX. Auto-extract metadata dari PDF." },
];

export const PRICING: LcTier[] = [
  {
    name: "Akses Terbuka",
    price: "Gratis",
    blurb: "Untuk pembaca, mahasiswa, dan peneliti independen.",
    features: ["Semua publikasi & insight", "Dataset berlisensi terbuka", "Sitasi siap salin (APA–BibTeX)"],
    ctaLabel: "Jelajahi library",
    ctaHref: "/library",
  },
  {
    name: "Kolaborasi Riset",
    price: "Proposal",
    blurb: "Riset bersama, ko-autor, dan replikasi studi.",
    features: ["Akses dataset pra-rilis", "Sesi metodologi bersama tim", "Ko-autor dengan ORCID tercatat", "Prioritas review draft"],
    featured: true,
    ctaLabel: "Ajukan kolaborasi",
    ctaHref: "/about",
  },
  {
    name: "Kemitraan Institusi",
    price: "Penawaran khusus",
    blurb: "Untuk universitas, lembaga, dan think-tank.",
    features: ["Riset pesanan & policy brief", "Pelatihan metodologi untuk tim", "Akses penuh arsip dataset"],
    ctaLabel: "Hubungi kami",
    ctaHref: "/about",
  },
];

export const TESTIMONIALS: LcTestimonial[] = [
  { quote: "Matrix lit review-nya memangkas waktu sintesis saya dari dua minggu jadi dua hari. Gap antar paper langsung kelihatan.", author: "Dr. Ratna Dewi", role: "Peneliti senior · Pusat Studi Kebijakan" },
  { quote: "Jarang ada workspace riset yang paham konteks akademik Indonesia — sitasi rapi, istilah EYD konsisten, dataset terdokumentasi.", author: "Prof. Bambang Wirawan", role: "Pembimbing disertasi · Universitas Garuda Nusantara" },
  { quote: "Kolaborasi lintas kota jadi ringan: satu sumber dokumen, satu daftar sitasi, dan semua kolaborator melihat versi yang sama.", author: "Anisa Putri, M.Sc.", role: "Kandidat doktor · Institut Sains Nusantara" },
  { quote: "Data agreement-nya jelas dan prosesnya cepat. Replikasi studi kami jalan tanpa bolak-balik email berminggu-minggu.", author: "Farhan Hidayat", role: "Research associate · Lembaga Data Nasional" },
];

export const FAQS: LcFaq[] = [
  { q: "Bagaimana cara mengakses dataset?", a: "Dataset berlisensi terbuka bisa diunduh langsung dari halaman Library. Untuk data sensitif, ajukan permintaan akses — kami balas maksimal 3 hari kerja dengan data agreement singkat." },
  { q: "Bagaimana cara mensitasi publikasi di sini?", a: "Setiap publikasi punya halaman detail dengan sitasi siap salin dalam format APA, MLA, Chicago, IEEE, dan BibTeX — lengkap dengan DOI." },
  { q: "Apakah terbuka untuk kolaborasi riset?", a: "Ya. Kami terbuka untuk ko-autor, replikasi studi, dan riset bersama lintas institusi. Sertakan proposal singkat (1 halaman) saat menghubungi kami lewat halaman About." },
  { q: "Lisensi apa yang dipakai untuk data dan tulisan?", a: "Publikasi dan insight dirilis dengan CC BY 4.0 kecuali tertera lain. Dataset mengikuti lisensi sumber masing-masing — selalu tercantum di metadata. Atribusi wajib di kedua kasus." },
  { q: "Bagaimana menghubungi tim riset?", a: "Lewat halaman About atau email di footer. Untuk pertanyaan metodologi, sebutkan judul publikasi atau dataset yang relevan supaya cepat kami arahkan ke peneliti yang tepat." },
];

// CTA band copy — title/subtitle only (the CtaBand button is fixed to the
// workspace). Single-sourced so the seed and any future render share one copy.
export const CTA = {
  title: "Siap rapikan alur risetmu?",
  subtitle: "Mulai dari upload PDF pertama — workspace siap dalam 5 menit.",
};
