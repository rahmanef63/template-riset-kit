import { mutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";

// Demo seed for Riset Kit OS.
// - `seed:run`        — CLI/power use: wipes content then inserts (npx convex run seed:run).
// - `seed:seedSample` — in-app one-click for non-coders: requires login, inserts
//                       ONLY when the site is still empty (never wipes real work).
//
// Data mirrors components/templates/research/shared/*-seed.ts (the former
// localStorage SEED_STATE), converted to Convex inserts. The frontend `id`
// fields are dropped — Convex assigns `_id` on insert.
const now = 1_780_000_000_000;
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;

const DOCUMENTS = [
  { title: "Lorem ipsum: A meta-analysis of cognitive load patterns", authors: "Pratama A., Sari R., Wijaya B.", year: 2024, fileLabel: "PDF · 24 hal", abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Studi meta-analisis terhadap 42 paper menunjukkan pola beban kognitif konsisten lintas demografi.", tag: "cognitive-science", status: "indexed" as const, uploadedAt: day(2), pages: 24, highlights: 12, coverImage: "https://picsum.photos/seed/riset-doc-cognitive/800/600" },
  { title: "Ipsum doloremque: Riset etnografi UMKM Indonesia", authors: "Hartono L., Setiawan B.", year: 2023, fileLabel: "PDF · 38 hal", abstract: "Etnografi 6-bulan di 12 UMKM kuliner Bandung. Temuan: adopsi digital terhambat oleh literasi finansial, bukan akses teknologi.", tag: "ethnography", status: "reviewed" as const, uploadedAt: day(8), pages: 38, highlights: 27, coverImage: "https://picsum.photos/seed/riset-doc-umkm/800/600" },
  { title: "Sit amet: Tinjauan kebijakan transportasi publik Jakarta", authors: "Maharani P., Wijaya A.", year: 2025, fileLabel: "PDF · 16 hal", abstract: "Analisis dampak ERP terhadap kongesti dan emisi. Data 2018-2024 menunjukkan korelasi negatif lemah pada koridor utama.", tag: "policy", status: "uploaded" as const, uploadedAt: day(1), pages: 16, highlights: 0 },
];

const NOTES = [
  { title: "Hipotesis utama tesis", body: "Beban kognitif berkorelasi dengan friksi onboarding. Lihat [[doc-1]] hal 8-12 untuk metode pengukuran.", tags: ["thesis", "hypothesis"], linkedDocIds: ["doc-1"], updatedAt: day(1) },
  { title: "Catatan wawancara — Pak Budi", body: "UMKM kuliner sering bingung saat handle 3 platform sekaligus. Solusi: single dashboard. Cross-ref [[doc-2]].", tags: ["interview", "umkm"], linkedDocIds: ["doc-2"], updatedAt: day(4) },
  { title: "Outline bab 2 — Tinjauan pustaka", body: "Struktur: (1) Definisi konsep, (2) State of the art, (3) Gap penelitian. Tarik dari lit-1.", tags: ["outline"], linkedDocIds: [], updatedAt: day(6) },
];

const CITATIONS = [
  { docId: "doc-1", style: "APA" as const, rendered: "Pratama, A., Sari, R., & Wijaya, B. (2024). Lorem ipsum: A meta-analysis of cognitive load patterns. Journal of Cognitive Studies, 12(3), 88-104.", bibKey: "pratama2024", addedAt: day(2) },
  { docId: "doc-2", style: "BibTeX" as const, rendered: "@article{hartono2023, author={Hartono, L. and Setiawan, B.}, title={Ipsum doloremque: Riset etnografi UMKM Indonesia}, year={2023}, journal={Indonesian Ethnography Review}}", bibKey: "hartono2023", addedAt: day(7) },
  { docId: "doc-3", style: "Chicago" as const, rendered: "Maharani, Putri, and Asep Wijaya. \"Sit amet: Tinjauan kebijakan transportasi publik Jakarta.\" Jakarta Policy Journal 8, no. 2 (2025): 14-29.", bibKey: "maharani2025", addedAt: day(1) },
];

const LIT_REVIEWS = [
  { topic: "Adopsi teknologi UMKM", question: "Apa faktor utama yang menghambat adopsi platform digital di UMKM kuliner Indonesia?", docIds: ["doc-1", "doc-2"], matrix: [
    { docId: "doc-1", method: "Meta-analisis kuantitatif", finding: "Beban kognitif > akses sebagai prediktor", gap: "Belum ada data dari konteks Indonesia" },
    { docId: "doc-2", method: "Etnografi 6-bulan", finding: "Literasi finansial > literasi teknologi", gap: "Sample terbatas Bandung saja" },
  ], updatedAt: day(3) },
  { topic: "Kebijakan transportasi urban", question: "Bagaimana efektivitas ERP di kota besar Asia Tenggara?", docIds: ["doc-3"], matrix: [
    { docId: "doc-3", method: "Analisis data sekunder", finding: "Korelasi negatif lemah dengan kongesti", gap: "Data emisi belum granular per koridor" },
  ], updatedAt: day(1) },
];

const AI_SESSIONS = [
  { docId: "doc-1", question: "Apa metodologi utama yang digunakan?", answer: "Paper ini menggunakan meta-analisis terhadap 42 studi primer (2010-2023) dengan random-effects model. Lihat hal 6-9.", ts: day(1) },
  { docId: "doc-2", question: "Sampel responden seperti apa?", answer: "12 UMKM kuliner di Bandung, dipilih purposive berdasarkan omzet < Rp 50jt/bulan dan minimum 2 tahun beroperasi.", ts: day(7) },
];

const PROJECTS = [
  { title: "Beban kognitif platform UMKM digital di Indonesia", hypothesis: "Friksi onboarding (bukan literasi teknologi) adalah prediktor terkuat ketidakberhasilan adopsi platform digital di UMKM kuliner Indonesia.", status: "writing" as const, startedAt: day(180), updatedAt: day(2), targetVenue: "Journal of Cognitive Studies", linkedDocIds: ["doc-1", "doc-2"], linkedNoteIds: ["note-1", "note-2"], collaboratorIds: ["col-1", "col-2"], progress: 72 },
  { title: "Evaluasi LLM untuk parafrase teks akademik bahasa Indonesia", hypothesis: "LLM open-weights (≥ 7B parameter) dapat menyamai performa closed-source untuk parafrase ekspositori bahasa Indonesia, tetapi tertinggal untuk teks argumentatif.", status: "active" as const, startedAt: day(90), updatedAt: day(5), targetVenue: "Proc. ACL 2026", linkedDocIds: ["doc-1"], linkedNoteIds: ["note-3"], collaboratorIds: ["col-3", "col-4"], progress: 55 },
  { title: "Dampak ERP terhadap kongesti Jakarta — extended analysis", hypothesis: "Efek ERP terhadap kongesti tidak signifikan tanpa integrasi BRT pada koridor sasaran. Substitusi modal transportasi adalah mediator utama.", status: "exploring" as const, startedAt: day(30), updatedAt: day(7), targetVenue: "Jakarta Policy Journal", linkedDocIds: ["doc-3"], linkedNoteIds: [], collaboratorIds: ["col-5"], progress: 18 },
  { title: "Pemetaan ekosistem riset terbuka kampus Indonesia (gelombang 2)", hypothesis: "Adopsi repositori institusional berkorelasi dengan keberadaan policy formal pada level rektorat, bukan inisiatif fakultas.", status: "submitted" as const, startedAt: day(365), updatedAt: day(14), targetVenue: "Riset Kit Policy Brief 04", linkedDocIds: [], linkedNoteIds: [], collaboratorIds: ["col-1", "col-6"], progress: 95 },
  { title: "Etnografi adopsi AI generatif di newsroom Indonesia", hypothesis: "Newsroom besar mengadopsi AI generatif secara bottom-up (jurnalis individu) sebelum top-down (kebijakan editorial), menciptakan ketegangan tata kelola.", status: "active" as const, startedAt: day(60), updatedAt: day(1), targetVenue: "Indonesian Ethnography Review", linkedDocIds: [], linkedNoteIds: ["note-2"], collaboratorIds: ["col-2", "col-3"], progress: 38 },
];

const DATASETS = [
  { name: "BPS Statistik UMKM Indonesia 2018-2024", source: "Badan Pusat Statistik", format: "csv" as const, rows: 48_320, sizeMB: 12.4, license: "Open Data Indonesia", lastUpdated: day(45), description: "Data UMKM per provinsi, sektor, dan kategori omset. Cleaned, deduplicated, geocoded ke level kabupaten.", url: "#" },
  { name: "Transkrip wawancara UMKM Bandung (n=12)", source: "Riset primer", format: "json" as const, rows: 12, sizeMB: 4.8, license: "Restricted — IRB approval required", lastUpdated: day(60), description: "Transkrip verbatim 12 wawancara mendalam dengan pemilik UMKM kuliner Bandung. Anonymized. Coded dengan Taguette.", url: "#" },
  { name: "Jakarta Traffic Volume — Dishub 2018-2024", source: "Dinas Perhubungan DKI Jakarta", format: "parquet" as const, rows: 2_847_120, sizeMB: 184.6, license: "CC-BY-4.0", lastUpdated: day(20), description: "Volume kendaraan per koridor, per 15 menit, periode 2018-2024. Sudah dijoin dengan data ERP zonasi.", url: "#" },
  { name: "Korpus paragraf akademik bahasa Indonesia (1.200 sampel)", source: "Curated dari 240 tesis open-access", format: "json" as const, rows: 1_200, sizeMB: 2.1, license: "CC-BY-SA-4.0", lastUpdated: day(15), description: "Paragraf ekspositori dan argumentatif dari tesis S2 berbahasa Indonesia. Disertai parafrase manual sebagai gold standard.", url: "#" },
  { name: "Survey kebijakan repositori institusional (n=64 kampus)", source: "Riset primer", format: "xlsx" as const, rows: 64, sizeMB: 0.3, license: "CC-BY-4.0", lastUpdated: day(120), description: "Hasil survei kebijakan formal repositori, preprint, dan data sharing di 64 kampus Indonesia. 41 PTN, 23 PTS.", url: "#" },
  { name: "Newsroom AI adoption pulse — wave 1", source: "Riset primer", format: "csv" as const, rows: 184, sizeMB: 0.5, license: "Restricted", lastUpdated: day(8), description: "Survey 184 jurnalis dari 12 newsroom Indonesia tentang penggunaan AI generatif. Mei 2026.", url: "#" },
  { name: "PDDikti Open Data — dosen aktif 2024", source: "PDDikti Kemendikbudristek", format: "csv" as const, rows: 312_840, sizeMB: 28.7, license: "Open Data Indonesia", lastUpdated: day(180), description: "Daftar dosen aktif PT Indonesia per Oktober 2024. Useful untuk sampling frame studi kepegawaian akademik.", url: "#" },
];

const COLLABORATORS = [
  { name: "Dr. Andi Pratama", affiliation: "Universitas Indonesia — Psikologi Kognitif", role: "co-author" as const, orcid: "0000-0001-2345-6789", email: "andi.pratama@example.ac.id", expertise: ["cognitive load", "meta-analysis", "experimental design"], projectIds: ["proj-1", "proj-4"], initials: "AP" },
  { name: "Rina Sari, M.Sc", affiliation: "Institut Teknologi Bandung — Desain Interaksi", role: "co-author" as const, orcid: "0000-0002-3456-7890", email: "rina.sari@example.ac.id", expertise: ["UX research", "ethnography", "service design"], projectIds: ["proj-1", "proj-5"], initials: "RS" },
  { name: "Dimas Nugroho", affiliation: "Mozilla Foundation Indonesia", role: "external" as const, orcid: "0000-0003-4567-8901", email: "dimas.nugroho@example.org", expertise: ["NLP bahasa Indonesia", "LLM evaluation", "open data"], projectIds: ["proj-2", "proj-5"], initials: "DN" },
  { name: "Maya Lestari, Ph.D", affiliation: "Universitas Gadjah Mada — Linguistik Komputasi", role: "advisor" as const, orcid: "0000-0004-5678-9012", email: "maya.lestari@example.ac.id", expertise: ["computational linguistics", "Indonesian morphology"], projectIds: ["proj-2"], initials: "ML" },
  { name: "Putri Maharani", affiliation: "Jakarta Urban Lab", role: "co-author" as const, orcid: "0000-0005-6789-0123", email: "putri.m@example.org", expertise: ["urban policy", "transportation economics"], projectIds: ["proj-3"], initials: "PM" },
  { name: "Budi Hartono", affiliation: "Riset Kit — Operations", role: "RA" as const, orcid: "0000-0006-7890-1234", email: "budi@example.org", expertise: ["data cleaning", "survey administration", "R / tidyverse"], projectIds: ["proj-4"], initials: "BH" },
];

// Keep in sync with components/templates/research/shared/landing-seed.ts
// SEED_LANDING_SECTIONS. `syncLanding` below pushes additions/order to an
// already-seeded deployment without touching admin-edited copy.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: "Riset workspace yang paham bahasa akademik Indonesia.", subtitle: "Baca PDF, review literatur, dan draft tesis — semua dalam satu workspace dengan AI yang ngerti EYD dan metodologi riset.", enabled: true, config: '{"badge":"Untuk peneliti, mahasiswa S2/S3, think-tank"}' },
  { id: "ls-stats", order: 20, kind: "stats", title: "Jejak riset yang bisa diverifikasi", subtitle: "Publikasi, sitasi, dataset terbuka, dan kolaborator — angka berjalan dari workspace ini.", enabled: true },
  { id: "ls-features", order: 30, kind: "features", title: "Semua yang dibutuhkan dalam siklus riset", subtitle: "Dari upload paper sampai draft bab — satu workspace, AI di setiap titik.", enabled: true },
  { id: "ls-portfolio", order: 40, kind: "portfolio", title: "Sintesis literatur jadi mudah", subtitle: "Matrix bandingkan metode, temuan, dan gap antar paper otomatis.", enabled: true },
  { id: "ls-library", order: 50, kind: "services", title: "Knowledge-base yang terus tumbuh", subtitle: "Paper terbaru yang sudah diindeks dan siap ditanyai lewat AI Reader.", enabled: true },
  { id: "ls-blog", order: 60, kind: "blog", title: "Publikasi terbaru", subtitle: "Paper, preprint, dan laporan yang sudah dirilis — lengkap dengan DOI dan sitasi siap salin.", enabled: true },
  { id: "ls-testimonials", order: 70, kind: "testimonials", title: "Kata kolaborator dan peneliti", subtitle: "Pengalaman mereka yang meriset bareng lewat workspace ini.", enabled: true },
  { id: "ls-faq", order: 80, kind: "faq", title: "Pertanyaan yang sering masuk", subtitle: "Soal akses dataset, sitasi, lisensi, dan kolaborasi riset.", enabled: true },
  { id: "ls-pricing", order: 90, kind: "pricing", title: "Paket akses & kolaborasi", subtitle: "Dari akses terbuka untuk pembaca sampai kemitraan riset institusi.", enabled: false },
  { id: "ls-cta", order: 100, kind: "cta", title: "Siap rapikan alur risetmu?", subtitle: "Mulai dari upload PDF pertama — workspace siap dalam 5 menit.", enabled: true },
  { id: "ls-newsletter", order: 110, kind: "newsletter", title: "Ringkasan riset bulanan", subtitle: "Publikasi baru, dataset terbuka, dan catatan metodologi — sebulan sekali, tanpa spam.", enabled: true },
];

const PAGES = [
  { id: "sys-home", slug: "", title: "Home", description: "Riset Kit landing — value prop, lib preview, CTA.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true, isLanding: true },
  { id: "sys-library", slug: "library", title: "Library", description: "Public document library — searchable, downloadable.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-about", slug: "about", title: "About", description: "Tentang tool, tim, dan metodologi.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "custom-methodology", slug: "methodology", title: "Metodologi", description: "Cara kami review literatur dan kelola sitasi.", blocks: [
    { kind: "hero", headline: "Sistematis, transparan, reproducible", sub: "Tiga prinsip lit-review yang kami pakai." },
    { kind: "feature-list", heading: "Tiga prinsip", items: [
      { title: "Pre-registration", body: "Pertanyaan + kriteria inklusi/ekslusi ditulis dulu sebelum cari paper." },
      { title: "PRISMA flow", body: "Identifikasi → screening → eligibility → included, semua dengan jumlah." },
      { title: "Audit trail", body: "Setiap keputusan inklusi tercatat dengan nama reviewer + tanggal." },
    ] },
    { kind: "faq", heading: "FAQ", items: [
      { q: "Database apa saja?", a: "Scopus, Web of Science, Google Scholar, plus database lokal SINTA." },
      { q: "Tools pendamping?", a: "Zotero untuk referensi, Rayyan untuk screening, VOSviewer untuk bibliometrik." },
      { q: "Bagaimana cek kualitas?", a: "Risk-of-bias tool sesuai design — Cochrane RoB 2 untuk RCT, MMAT untuk mixed-methods." },
    ] },
    { kind: "cta", headline: "Mulai review dengan AI Reader", cta: { label: "Buka workspace", href: "/dashboard/admin" } },
  ], status: "published", createdAt: day(14), updatedAt: day(2), systemPage: false },
];

// All demo content inserts (no wipe). Shared by `run` and `seedSample`.
async function insertAll(ctx: any) {
  for (const d of DOCUMENTS) await ctx.db.insert("risetDocuments", d);
  for (const n of NOTES) await ctx.db.insert("risetNotes", n);
  for (const c of CITATIONS) await ctx.db.insert("risetCitations", c);
  for (const l of LIT_REVIEWS) await ctx.db.insert("risetLitReviews", l);
  for (const s of AI_SESSIONS) await ctx.db.insert("risetAiSessions", s);
  for (const p of PROJECTS) await ctx.db.insert("risetProjects", p);
  for (const d of DATASETS) await ctx.db.insert("risetDatasets", d);
  for (const c of COLLABORATORS) await ctx.db.insert("risetCollaborators", c);
  for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
  for (const p of PAGES) await ctx.db.insert("pages", { entryId: p.id, slug: p.slug, data: p });

  return {
    documents: DOCUMENTS.length,
    notes: NOTES.length,
    citations: CITATIONS.length,
    litReviews: LIT_REVIEWS.length,
    aiSessions: AI_SESSIONS.length,
    projects: PROJECTS.length,
    datasets: DATASETS.length,
    collaborators: COLLABORATORS.length,
    landing: LANDING.length,
    pages: PAGES.length,
  };
}

const CONTENT_TABLES = [
  "risetDocuments",
  "risetNotes",
  "risetCitations",
  "risetLitReviews",
  "risetAiSessions",
  "risetProjects",
  "risetDatasets",
  "risetCollaborators",
  "landingSections",
  "pages",
] as const;

// Power/CLI seed: wipes content tables first, then inserts. Destructive — only
// for terminal use where you explicitly want a reset.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    for (const t of CONTENT_TABLES) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    return insertAll(ctx);
  },
});

// Additive landing sync for already-seeded deployments: inserts LANDING
// entries whose sectionId is missing and aligns `order` to the canonical
// lineup. Never touches admin-edited copy/enabled/config on existing rows.
export const syncLanding = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let inserted = 0;
    let reordered = 0;
    for (const s of LANDING) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", s.id))
        .unique();
      if (!existing) {
        await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
        inserted++;
      } else if ((existing.data as { order?: number }).order !== s.order) {
        await ctx.db.patch(existing._id, {
          data: { ...(existing.data as Record<string, unknown>), order: s.order },
        });
        reordered++;
      }
    }
    return { inserted, reordered };
  },
});

// Additive cover-image backfill for already-seeded deployments: for each seed
// document that carries a `coverImage`, find the matching live row by its unique
// `title` and patch `coverImage` ONLY when the row is still missing one. Never
// overwrites an admin-set cover. Safe to re-run (idempotent).
export const syncDocumentImages = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let patched = 0;
    const wanted = DOCUMENTS.filter(
      (d): d is typeof d & { coverImage: string } => "coverImage" in d,
    );
    if (wanted.length === 0) return { patched };
    const rows = await ctx.db.query("risetDocuments").collect();
    for (const seed of wanted) {
      const row = rows.find((r) => r.title === seed.title);
      if (row && !row.coverImage) {
        await ctx.db.patch(row._id, { coverImage: seed.coverImage });
        patched++;
      }
    }
    return { patched };
  },
});

// In-app one-click seed for non-technical owners. Safe: requires an authenticated
// admin AND only runs on an empty site, so it can never wipe real content.
export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const hasProjects = await ctx.db.query("risetProjects").first();
    const hasLanding = await ctx.db.query("landingSections").first();
    if (hasProjects || hasLanding) {
      return { seeded: false, reason: "already-has-content" as const };
    }
    const counts = await insertAll(ctx);
    return { seeded: true, ...counts };
  },
});
