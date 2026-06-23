import { mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";
import { HERO, STATS, CLIENTS, FEATURES, TESTIMONIALS, PRICING, FAQS, CTA } from "./landingContent";

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
  { title: "Beban kognitif dan friksi onboarding: meta-analisis lintas demografi", authors: "Pratama A., Sari R., Wijaya B.", year: 2024, fileLabel: "PDF · 24 hal", abstract: "Studi meta-analisis terhadap 42 paper primer menunjukkan pola beban kognitif yang konsisten lintas demografi, dengan friksi onboarding sebagai prediktor terkuat ketidakberhasilan adopsi.", tag: "cognitive-science", status: "indexed" as const, uploadedAt: day(2), pages: 24, highlights: 12, coverImage: "https://picsum.photos/seed/riset-doc-cognitive/800/600" },
  { title: "Etnografi adopsi digital UMKM kuliner Indonesia", authors: "Hartono L., Setiawan B.", year: 2023, fileLabel: "PDF · 38 hal", abstract: "Etnografi 6-bulan di 12 UMKM kuliner Bandung. Temuan: adopsi digital terhambat oleh literasi finansial, bukan akses teknologi.", tag: "ethnography", status: "reviewed" as const, uploadedAt: day(8), pages: 38, highlights: 27, coverImage: "https://picsum.photos/seed/riset-doc-umkm/800/600" },
  { title: "Tinjauan kebijakan transportasi publik Jakarta", authors: "Maharani P., Wijaya A.", year: 2025, fileLabel: "PDF · 16 hal", abstract: "Analisis dampak ERP terhadap kongesti dan emisi. Data 2018-2024 menunjukkan korelasi negatif lemah pada koridor utama.", tag: "policy", status: "uploaded" as const, uploadedAt: day(1), pages: 16, highlights: 0 },
];

const NOTES = [
  { title: "Hipotesis utama tesis", body: "Beban kognitif berkorelasi dengan friksi onboarding. Lihat [[doc-1]] hal 8-12 untuk metode pengukuran.", tags: ["thesis", "hypothesis"], linkedDocIds: ["doc-1"], updatedAt: day(1) },
  { title: "Catatan wawancara — Pak Budi", body: "UMKM kuliner sering bingung saat handle 3 platform sekaligus. Solusi: single dashboard. Cross-ref [[doc-2]].", tags: ["interview", "umkm"], linkedDocIds: ["doc-2"], updatedAt: day(4) },
  { title: "Outline bab 2 — Tinjauan pustaka", body: "Struktur: (1) Definisi konsep, (2) State of the art, (3) Gap penelitian. Tarik dari lit-1.", tags: ["outline"], linkedDocIds: [], updatedAt: day(6) },
];

const CITATIONS = [
  { docId: "doc-1", style: "APA" as const, rendered: "Pratama, A., Sari, R., & Wijaya, B. (2024). Beban kognitif dan friksi onboarding: meta-analisis lintas demografi. Journal of Cognitive Studies, 12(3), 88-104.", bibKey: "pratama2024", addedAt: day(2) },
  { docId: "doc-2", style: "BibTeX" as const, rendered: "@article{hartono2023, author={Hartono, L. and Setiawan, B.}, title={Etnografi adopsi digital UMKM kuliner Indonesia}, year={2023}, journal={Indonesian Ethnography Review}}", bibKey: "hartono2023", addedAt: day(7) },
  { docId: "doc-3", style: "Chicago" as const, rendered: "Maharani, Putri, and Asep Wijaya. \"Tinjauan kebijakan transportasi publik Jakarta.\" Jakarta Policy Journal 8, no. 2 (2025): 14-29.", bibKey: "maharani2025", addedAt: day(1) },
  // Extra public citations (formerly SEED_PUBLIC_CITATIONS_EXTRA, hardcoded in
  // CitationsPage). Now seeded into the table so the public directory + admin
  // CRUD share one source of truth.
  { docId: "", style: "APA" as const, rendered: "Nugroho, D., Lestari, M., & Ramadhan, F. (2026). Evaluasi LLM untuk parafrase teks akademik bahasa Indonesia. arXiv:2601.04421.", bibKey: "nugroho2026", addedAt: day(2) },
  { docId: "", style: "IEEE" as const, rendered: "H. Wibowo and R. Putri, \"Sistem rekomendasi sitasi berbasis graph attention,\" in Proc. ICIC, 2024, pp. 1102-1109.", bibKey: "wibowo2024", addedAt: day(5) },
  { docId: "", style: "BibTeX" as const, rendered: "@techreport{openscience2025, author={Tim Kebijakan Sains Terbuka}, title={Pemetaan ekosistem riset terbuka di kampus Indonesia}, institution={Riset Kit}, year={2025}, number={Policy Brief 03}}", bibKey: "openscience2025", addedAt: day(11) },
];

// About-page principles — formerly hardcoded PRINCIPLES in AboutPage.tsx.
const ABOUT_PRINCIPLES = [
  { text: "Privasi-first — dokumen diproses di workspace pribadi.", order: 10, status: "published" as const },
  { text: "EYD-aware — AI ngerti tata bahasa akademik Indonesia.", order: 20, status: "published" as const },
  { text: "Citation-correct — APA, MLA, Chicago, IEEE, BibTeX.", order: 30, status: "published" as const },
  { text: "Methodology-aware — review logika metode otomatis.", order: 40, status: "published" as const },
  { text: "Source-of-truth — setiap klaim selalu balik ke dokumen asli.", order: 50, status: "published" as const },
  { text: "Open formats — export ke .docx, .tex, .md, .bib.", order: 60, status: "published" as const },
];

// About-page timeline — formerly hardcoded TIMELINE in AboutPage.tsx.
const ABOUT_TIMELINE = [
  { year: "2026", milestone: "Riset Kit launch — workspace untuk peneliti Indonesia.", order: 10, status: "published" as const },
  { year: "2025", milestone: "Beta tertutup di 3 universitas — feedback dari 40+ peneliti.", order: 20, status: "published" as const },
  { year: "2024", milestone: "Prototype AI Reader — validasi konsep dengan tesis S2.", order: 30, status: "published" as const },
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

// Mirrors components/templates/research/shared/publications-seed.ts SEED_PUBLICATIONS.
const PUBLICATIONS = [
  { slug: "cognitive-load-meta-analysis-2024", title: "Beban kognitif dan friksi onboarding: meta-analisis lintas demografi", authors: "Pratama A., Sari R., Wijaya B.", year: 2024, venue: "Journal of Cognitive Studies", type: "journal" as const, doi: "10.1234/jcs.2024.0088", pages: "88-104", pdfHref: "#", abstract: "Meta-analisis terhadap 42 studi primer (2010-2023) menggunakan random-effects model. Temuan utama: beban kognitif konsisten lintas demografi, dengan friksi onboarding sebagai prediktor terkuat (β=0.41, p<.001).", keywords: ["cognitive load", "meta-analysis", "onboarding", "UX"], status: "published" as const },
  { slug: "etnografi-umkm-kuliner-bandung-2023", title: "Etnografi adopsi digital UMKM kuliner Indonesia", authors: "Hartono L., Setiawan B.", year: 2023, venue: "Indonesian Ethnography Review", type: "journal" as const, doi: "10.5678/ier.2023.0214", pages: "214-238", pdfHref: "#", abstract: "Etnografi 6-bulan di 12 UMKM kuliner Bandung. Temuan: adopsi digital terhambat oleh literasi finansial, bukan akses teknologi. Implikasi kebijakan: program literasi finansial > subsidi gadget.", keywords: ["ethnography", "UMKM", "literasi finansial", "Bandung"], status: "published" as const },
  { slug: "kebijakan-erp-jakarta-2025", title: "Tinjauan kebijakan transportasi publik Jakarta", authors: "Maharani P., Wijaya A.", year: 2025, venue: "Jakarta Policy Journal", type: "journal" as const, doi: "10.9012/jpj.2025.0014", pages: "14-29", pdfHref: "#", abstract: "Analisis dampak ERP terhadap kongesti dan emisi periode 2018-2024. Korelasi negatif lemah pada koridor utama (r=-0.18). Rekomendasi: integrasi ERP dengan BRT untuk efek substitusi modal.", keywords: ["ERP", "transportasi", "Jakarta", "policy analysis"], status: "published" as const },
  { slug: "preprint-llm-akademik-id-2026", title: "Evaluasi LLM untuk parafrase teks akademik bahasa Indonesia", authors: "Nugroho D., Lestari M., Ramadhan F.", year: 2026, venue: "arXiv:2601.04421", type: "preprint" as const, doi: "10.48550/arXiv.2601.04421", pdfHref: "#", abstract: "Benchmark 6 LLM terhadap 1.200 paragraf tesis berbahasa Indonesia. Metrik: kesesuaian EYD, retensi makna, originalitas (Turnitin proxy). LLM open-weights mendekati closed-source untuk teks ekspositori.", keywords: ["LLM", "bahasa Indonesia", "akademik", "benchmark"], status: "published" as const },
  { slug: "konferensi-icic-2024", title: "Sistem rekomendasi sitasi berbasis graph attention", authors: "Wibowo H., Putri R.", year: 2024, venue: "Proc. ICIC 2024", type: "conference" as const, doi: "10.1109/icic.2024.10455", pages: "1102-1109", pdfHref: "#", abstract: "Model GAT untuk merekomendasikan sitasi relevan dari knowledge-base personal peneliti. F1@10 = 0.71 pada dataset 8.400 paper, mengungguli BM25 (+12 pts) dan SciBERT (+4 pts).", keywords: ["citation recommendation", "graph attention", "scholarly NLP"], status: "published" as const },
  { slug: "laporan-kebijakan-sains-id-2025", title: "Pemetaan ekosistem riset terbuka di kampus Indonesia", authors: "Tim Kebijakan Sains Terbuka", year: 2025, venue: "Riset Kit Policy Brief 03", type: "report" as const, doi: "10.99999/riset.brief.03", pdfHref: "#", abstract: "Survei 64 kampus tentang kebijakan repositori institusional, preprint, dan data sharing. Hanya 18% punya policy formal; 51% bergantung pada inisiatif individual dosen.", keywords: ["open science", "kebijakan", "repositori", "data sharing"], status: "published" as const },
];

// Mirrors components/templates/research/shared/insights-seed.ts SEED_INSIGHTS.
const INSIGHTS = [
  { slug: "memilih-software-citation-manager-2026", title: "Memilih citation manager: Zotero vs Mendeley vs Paperpile (2026)", author: "Dr. Raka Mahendra", publishedAt: day(3), readMinutes: 7, category: "tool-review" as const, excerpt: "Tiga tahun pakai bergantian. Spoiler: Zotero menang untuk peneliti Indonesia karena open-source + plugin Better BibTeX yang reliable.", body: "Zotero menang di tiga dimensi: harga (gratis selamanya), portabilitas data (SQLite lokal), dan ekosistem plugin. Paperpile bagus untuk pengguna Google Docs garis keras. Mendeley sudah ditinggalkan banyak peneliti sejak Elsevier mengubah kebijakan storage 2024.\n\nUntuk konteks Indonesia: Zotero + plugin Better BibTeX + sync via WebDAV (bukan Zotero cloud, batasnya 300MB) = workflow paling robust. Bisa share library antar device tanpa subscription.", tags: ["citation-manager", "zotero", "workflow"], status: "published" as const },
  { slug: "thematic-analysis-vs-grounded-theory", title: "Thematic analysis vs grounded theory: kapan pakai yang mana?", author: "Dr. Raka Mahendra", publishedAt: day(9), readMinutes: 9, category: "methodology" as const, excerpt: "Pertanyaan klasik mahasiswa S2 kualitatif. Jawaban singkat: thematic analysis untuk eksplorasi tema, grounded theory kalau mau bangun teori baru.", body: "Braun & Clarke (2006) bilang thematic analysis fleksibel — bisa deduktif atau induktif. Grounded theory (Glaser & Strauss) lebih ketat: harus theoretical sampling, constant comparison, dan saturation.\n\nDalam praktik supervisor saya menolak grounded theory kalau sample < 20 informan. Untuk skripsi/tesis dengan deadline, thematic analysis lebih realistis. Grounded theory cocok untuk disertasi multi-tahun.", tags: ["qualitative", "methodology", "thematic-analysis"], status: "published" as const },
  { slug: "field-notes-wawancara-umkm-bandung", title: "Field notes: 12 wawancara UMKM kuliner Bandung", author: "Dr. Raka Mahendra", publishedAt: day(14), readMinutes: 6, category: "field-notes" as const, excerpt: "Tiga pelajaran metodologis dari lapangan: jam wawancara penting, gadget bisa intimidating, dan transcript verbatim selalu lebih lama dari estimasi.", body: "Jam 10-11 pagi: pemilik warung paling rileks (lagi prep menu siang). Sore: terlalu sibuk pelanggan. Malam: capek, jawaban pendek-pendek.\n\nRecorder Zoom H1 mahal tapi worth it. Recorder HP suara jelek + bikin informan canggung. Notebook + pulpen tetap jadi backup utama.\n\nTranskrip: estimasi 4x durasi rekaman. 60 menit wawancara = 4 jam transkrip + tidying. 12 wawancara x 4 jam = 48 jam, ekuivalen 1.5 minggu kerja penuh.", tags: ["field-notes", "ethnography", "umkm"], status: "published" as const },
  { slug: "menulis-literature-review-dengan-matrix", title: "Menulis literature review dengan matrix table: template + contoh", author: "Dr. Raka Mahendra", publishedAt: day(21), readMinutes: 8, category: "tutorial" as const, excerpt: "Matrix table = mind-map untuk 30+ paper. Lima kolom wajib: author-year, RQ, metode, temuan utama, gap. Sisanya optional sesuai topik.", body: "Bikin spreadsheet di Google Sheets. Header: ID | Author-Year | Research Question | Method | N (sample) | Key Findings | Limitations | Gap-to-Mine | Quote-to-Cite.\n\nBaca paper sambil isi kolom Quote-to-Cite — paste verbatim 1-2 kalimat penting. Saat draft chapter, tinggal cari di sheet by keyword. Hemat waktu re-reading.\n\nUntuk 30+ paper, pakai Notion table view sebagai gantinya. Filter & sort lebih powerful daripada Google Sheets, dan bisa link ke note panjang.", tags: ["literature-review", "workflow", "tutorial"], status: "published" as const },
  { slug: "ai-paraphrase-bahasa-indonesia-bahaya", title: "AI paraphrase bahasa Indonesia: hati-hati makna geser", author: "Dr. Raka Mahendra", publishedAt: day(28), readMinutes: 5, category: "opinion" as const, excerpt: "Tested 6 LLM untuk parafrase kalimat akademik bahasa Indonesia. Hasil: semua menggeser makna 15-30%. Manusia masih lebih akurat.", body: "GPT-4, Claude, Gemini, dan tiga open-weights diuji parafrase 200 kalimat dari abstrak jurnal sosial. Setiap output dinilai dua expert reviewer. Skor: kesesuaian makna 70-85%, retensi terminologi 60-75%, gaya bahasa akademik 65-80%.\n\nKesimpulan: AI berguna sebagai drafting tool, bukan finalization. Selalu review manual line-by-line. Untuk konteks Turnitin: parafrase AI sering ketauan karena pola sintaksis kaku.", tags: ["LLM", "bahasa-indonesia", "ethics"], status: "published" as const },
  { slug: "obsidian-vs-notion-untuk-riset", title: "Obsidian vs Notion untuk catatan riset: trade-off lokal vs cloud", author: "Dr. Raka Mahendra", publishedAt: day(35), readMinutes: 7, category: "tool-review" as const, excerpt: "Dua tools, dua filosofi. Obsidian: markdown lokal, offline-first, plugin gila. Notion: database cloud, kolaborasi mulus, tapi lock-in.", body: "Obsidian menang untuk solo researcher yang care soal data ownership. File .md plain text, bisa di-git, bisa di-grep, bisa di-backup ke mana saja. Plugin Dataview turns vault into queryable database.\n\nNotion menang untuk tim riset 2+ orang. Real-time collab, comments, mentions, dan database relations yang lebih native daripada plugin Obsidian. Tapi: semua data di server Notion. Export markdown ada tapi link & relation pecah.\n\nPersonal pick: Obsidian untuk thinking, Notion untuk project management.", tags: ["obsidian", "notion", "note-taking"], status: "published" as const },
  { slug: "tips-coding-data-kualitatif-tanpa-nvivo", title: "Coding data kualitatif tanpa NVivo: 3 alternatif gratis", author: "Dr. Raka Mahendra", publishedAt: day(45), readMinutes: 6, category: "tool-review" as const, excerpt: "NVivo license 6 juta/tahun bikin mikir dua kali. Tiga alternatif tested: Taguette (open-source), Atlas.ti free tier, dan Google Docs + comments.", body: "Taguette: open-source, jalan di browser. Cocok untuk individual project, < 50 dokumen. Limitasi: code co-occurrence matrix masih basic.\n\nAtlas.ti free tier: 5 dokumen, 50 codes. Cukup untuk pilot study, tidak cukup untuk full thesis.\n\nGoogle Docs + comments: hack jadul tapi works. Highlight text, add comment dengan code name, gunakan Find untuk aggregate per code. Limitasi: tidak ada visualisasi.\n\nVerdict: Taguette untuk academic, NVivo masih dominant di industri konsultan.", tags: ["qualitative", "nvivo", "tools"], status: "published" as const },
];

// Mirrors components/templates/research/shared/reading-seed.ts SEED_READING_LIST.
const READING_LIST = [
  { title: "On the dangers of stochastic parrots", source: "Bender, Gebru, McMillan-Major & Mitchell — FAccT 2021", year: 2021, category: "paper" as const, href: "#", why: "Wajib baca sebelum bahas etika LLM. Argumen environmental + bias paling sering disitir.", addedAt: day(3), status: "published" as const },
  { title: "Research as a stuck process", source: "Andy Matuschak (essay)", year: 2022, category: "essay" as const, href: "#", why: "Reframing kenapa workflow riset patah. Influence ke desain tool note-taking modern.", addedAt: day(6), status: "published" as const },
  { title: "How to take smart notes", source: "Sönke Ahrens (book)", year: 2017, category: "book" as const, href: "#", why: "Zettelkasten secara praktis. Dasar buat workflow notes ↔ paper di workspace.", addedAt: day(9), status: "published" as const },
  { title: "The methodology section that fooled three reviewers", source: "Anonymous PI thread", year: 2024, category: "thread" as const, href: "#", why: "Studi kasus tentang ambiguitas method writing. Pakai sebagai contoh negatif di seminar.", addedAt: day(12), status: "published" as const },
  { title: "Reproducibility of social science research", source: "Camerer et al. — Nature Human Behaviour", year: 2018, category: "paper" as const, href: "#", why: "Hanya 62% studi sosial yang ter-reproduksi. Patokan empiris saat mendiskusikan replication crisis.", addedAt: day(15), status: "published" as const },
  { title: "Open data Indonesia: laporan tahunan", source: "AIPI (Akademi Ilmu Pengetahuan Indonesia)", year: 2025, category: "report" as const, href: "#", why: "Data terbaru tentang adopsi open data di kampus lokal. Sumber kuantitatif untuk policy paper.", addedAt: day(20), status: "published" as const },
  { title: "Writing science in plain English", source: "Anne E. Greene (book)", year: 2013, category: "book" as const, href: "#", why: "Toolkit konkret untuk membersihkan paragraf akademik yang berbelit. Cocok dipasangkan dengan AI Reader.", addedAt: day(24), status: "published" as const },
  { title: "The careful use of AI in qualitative coding", source: "Brown & Wei — Qualitative Research Quarterly", year: 2025, category: "paper" as const, href: "#", why: "Panduan reproducibility saat pakai LLM untuk thematic coding. Cek sebelum draft method bab 3.", addedAt: day(28), status: "published" as const },
];

// Keep in sync with components/templates/research/shared/landing-seed.ts
// SEED_LANDING_SECTIONS. `syncLanding` below pushes additions/order to an
// already-seeded deployment without touching admin-edited copy.
// Item-bearing sections (stats/features/testimonials/faq/pricing) seed their
// example content into `config` from convex/landingContent.ts — the SAME module
// the frontend render falls back to — so a fresh clone gets editable example
// data and there is no convex<->render drift. Hero/CTA copy also flows from the
// module. Table-backed kinds (portfolio/services/blog) render from their own
// tables and carry no config here.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: HERO.title, subtitle: HERO.subtitle, enabled: true, config: JSON.stringify({ badge: HERO.badge }), layers: [{ id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" }] },
  { id: "ls-stats", order: 20, kind: "stats", title: "Jejak riset yang bisa diverifikasi", subtitle: "Publikasi, sitasi, dataset terbuka, dan kolaborator — angka berjalan dari workspace ini.", enabled: true, config: JSON.stringify({ stats: STATS, clients: CLIENTS }) },
  { id: "ls-features", order: 30, kind: "features", title: "Semua yang dibutuhkan dalam siklus riset", subtitle: "Dari upload paper sampai draft bab — satu workspace, AI di setiap titik.", enabled: true, config: JSON.stringify({ items: FEATURES }) },
  { id: "ls-portfolio", order: 40, kind: "portfolio", title: "Sintesis literatur jadi mudah", subtitle: "Matrix bandingkan metode, temuan, dan gap antar paper otomatis.", enabled: true },
  { id: "ls-library", order: 50, kind: "services", title: "Knowledge-base yang terus tumbuh", subtitle: "Paper terbaru yang sudah diindeks dan siap ditanyai lewat AI Reader.", enabled: true },
  { id: "ls-blog", order: 60, kind: "blog", title: "Publikasi terbaru", subtitle: "Paper, preprint, dan laporan yang sudah dirilis — lengkap dengan DOI dan sitasi siap salin.", enabled: true },
  { id: "ls-testimonials", order: 70, kind: "testimonials", title: "Kata kolaborator dan peneliti", subtitle: "Pengalaman mereka yang meriset bareng lewat workspace ini.", enabled: true, config: JSON.stringify({ items: TESTIMONIALS }) },
  { id: "ls-faq", order: 80, kind: "faq", title: "Pertanyaan yang sering masuk", subtitle: "Soal akses dataset, sitasi, lisensi, dan kolaborasi riset.", enabled: true, config: JSON.stringify({ items: FAQS }) },
  { id: "ls-pricing", order: 90, kind: "pricing", title: "Paket akses & kolaborasi", subtitle: "Dari akses terbuka untuk pembaca sampai kemitraan riset institusi.", enabled: false, config: JSON.stringify({ tiers: PRICING }) },
  { id: "ls-cta", order: 100, kind: "cta", title: CTA.title, subtitle: CTA.subtitle, enabled: true },
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
// `opts.landing === false` skips the landing/home tables (landingSections + pages)
// so a content-only refill (seedDemo) never wipes admin-edited landing copy.
async function insertAll(ctx: any, opts: { landing?: boolean } = {}) {
  for (const d of DOCUMENTS) await ctx.db.insert("risetDocuments", d);
  for (const n of NOTES) await ctx.db.insert("risetNotes", n);
  for (const c of CITATIONS) await ctx.db.insert("risetCitations", c);
  for (const l of LIT_REVIEWS) await ctx.db.insert("risetLitReviews", l);
  for (const s of AI_SESSIONS) await ctx.db.insert("risetAiSessions", s);
  for (const p of PROJECTS) await ctx.db.insert("risetProjects", p);
  for (const d of DATASETS) await ctx.db.insert("risetDatasets", d);
  for (const c of COLLABORATORS) await ctx.db.insert("risetCollaborators", c);
  for (const p of PUBLICATIONS) await ctx.db.insert("risetPublications", p);
  for (const i of INSIGHTS) await ctx.db.insert("risetInsights", i);
  for (const r of READING_LIST) await ctx.db.insert("risetReadingList", r);
  for (const p of ABOUT_PRINCIPLES) await ctx.db.insert("risetAboutPrinciples", p);
  for (const t of ABOUT_TIMELINE) await ctx.db.insert("risetAboutTimeline", t);
  if (opts.landing !== false) {
    for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
    for (const p of PAGES) await ctx.db.insert("pages", { entryId: p.id, slug: p.slug, data: p });
  }

  return {
    documents: DOCUMENTS.length,
    notes: NOTES.length,
    citations: CITATIONS.length,
    litReviews: LIT_REVIEWS.length,
    aiSessions: AI_SESSIONS.length,
    projects: PROJECTS.length,
    datasets: DATASETS.length,
    collaborators: COLLABORATORS.length,
    publications: PUBLICATIONS.length,
    insights: INSIGHTS.length,
    readingList: READING_LIST.length,
    aboutPrinciples: ABOUT_PRINCIPLES.length,
    aboutTimeline: ABOUT_TIMELINE.length,
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
  "risetPublications",
  "risetInsights",
  "risetReadingList",
  "risetAboutPrinciples",
  "risetAboutTimeline",
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

// Demo/CLI seed (NO auth, internal — run via `npx convex run seed:seedDemo`).
// For SHOWCASE/demo deployments only. Refills the content tables for a full
// demo, WITHOUT wiping admin-edited landing copy (landingSections + pages are
// only seeded when still empty). The hero image is a full-bleed background
// (frontend HERO_IMG), not a seeded foreground imageUrl. Idempotent.
export const seedDemo = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Content tables only — never landingSections / pages (the landing/home copy).
    const CONTENT_ONLY = CONTENT_TABLES.filter(
      (t) => t !== "landingSections" && t !== "pages",
    );
    for (const t of CONTENT_ONLY) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    const counts = await insertAll(ctx, { landing: false });
    // Seed landing only if the table is empty (preserve admin-edited copy).
    const hasLanding = await ctx.db.query("landingSections").first();
    if (!hasLanding) {
      for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
    }
    return counts;
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
