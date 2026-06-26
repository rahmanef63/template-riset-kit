<div align="center">

# Riset Kit

**A 100% headless research workspace you fully own.**
Clone it to your own Vercel + Convex, sign in, and run everything — documents, notes,
literature reviews, citations, projects, datasets, collaborators, publications — from one
admin dashboard. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-riset-kit)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Convex](https://img.shields.io/badge/Convex-realtime-orange)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

[**Live demo**](https://riset-kit.vercel.app)

</div>

---

## What is this?

A **clone-to-own** research workspace template. Deploy it to **your** infrastructure and you
get a full research site whose data lives in **your** Convex database — managed entirely from
the admin dashboard. The frontend is stateless, so updates never touch your data.

- 📚 **For readers** — a fast, SEO-ready public site (publications, insights, library, reading list).
- 🧪 **For you** — a dashboard to run the whole research operation, with zero coding.
- 🔒 **Yours** — your repo, your Vercel, your Convex. No vendor lock-in.

## ✨ Features

- **Headless research workspace on Convex** — documents, notes, citations, literature-review
  matrices, AI reader sessions, projects, datasets, collaborators, publications, insights,
  reading list, subscribers. Realtime, edited from `/dashboard/admin`.
- **Page builder + landing sections** — compose public pages and the landing (hero, stats,
  features, pricing, FAQ, testimonials, CTA, …) as data, served at `/[...slug]`.
- **Zero-touch setup** — deploy → open `/admin` → claim owner → run the onboarding wizard →
  one-click sample content. No env editing, no terminal. Auth keys auto-provision at build.
- **Branding from the dashboard** — site name, tagline, owner, contact, logo, favicon, brand
  colour, light/dark/system theme, SEO description. Stored in Convex, applied at runtime.
- **Image picker** — drag-drop / upload file chooser plus a paste-URL and Unsplash tab
  (curated fallback without an `UNSPLASH_ACCESS_KEY`).
- **Secure admin** — keyless first-owner claim, then signup gates behind an optional invite
  key (`ADMIN_SIGNUP_KEY`), or auto-create the owner from env (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).
- **Roles & audit log** — owner / admin / editor / viewer over `@convex-dev/auth`; admin
  actions (role changes, webhooks, settings, AI config) append to a real audit stream.
- **Admin control panel** — AI config (model + sampling + moderation rules), analytics,
  users & roles, webhooks + deliveries, integrations, and API keys.
- **`/setup` health page** — a plain-language checklist of what's done and what's left.
- **In-app updates** — admin sees current vs upstream version and rebuilds in one click via a
  Vercel deploy hook (`VERCEL_DEPLOY_HOOK_URL`).
- **Backup & restore** — download / re-import all your content as JSON, no terminal. Auth
  tables are deliberately excluded — credentials never leave the backend.
- **Production Next.js** — SSR metadata, true HTTP 404s, error/loading boundaries, sitemap,
  robots, a splash loader until data is ready.
- **Demo / clone stages** — a "Deploy your own" button shows on the demo only (`NEXT_PUBLIC_DEMO`).
- **Tested clones** — `npm run smoke` checks a clone can deploy (local, no CI cost).

## 🚀 Quick start (non-coder)

1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-riset-kit)** → connect GitHub → add the **Convex** integration → Deploy.
2. Open `https://your-site.vercel.app/admin` (redirects to `/dashboard/admin`) and register the first account — it becomes the **owner**.
3. Finish the onboarding wizard, then click **fill sample content** to populate the workspace. Done.

## 💻 Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npx convex dev --once             # generates convex/_generated
npm run dev                       # http://localhost:3000
```

> `convex/_generated` must be committed before deploy.

## 🔐 Environment — two places

Variables live in **two** dashboards. The Deploy/clone button only fills the Vercel ones;
set the Convex ones in the Convex dashboard (or let the build do it).

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | ✅ | Convex deployment URL (`.convex.cloud` or self-hosted) |
| `CONVEX_DEPLOY_KEY` | Vercel | ✅ | deploys functions + schema at build (`build:auto`) and auto-provisions auth keys |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | Convex | ✅ | login signing — **auto-set at build** by `scripts/setup-auth.mjs` (or `npx @convex-dev/auth`) |
| `ADMIN_SIGNUP_KEY` | Convex | – | invite key gating admin signup |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Convex | – | auto-create the owner on first load |
| `VERCEL_DEPLOY_HOOK_URL` | Convex | – | enables the admin "Rebuild now" button |
| `UNSPLASH_ACCESS_KEY` | Convex/Vercel | – | server-side key for the image picker's Unsplash tab |
| `ANTHROPIC_API_KEY` | Convex | – | AI reader / chat |
| `NEXT_PUBLIC_DEMO` | Vercel | – | demo only — shows the "Deploy your own" button |

> `vercel.json` sets the Build Command to `npm run build:auto`, which runs `convex deploy`
> automatically when `CONVEX_DEPLOY_KEY` is present — leave the Vercel Build Command on default.

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS 4 · shadcn/ui · Radix |
| Backend / DB | Convex — realtime (cloud or self-hosted) |
| Auth | `@convex-dev/auth` (Password; optional GitHub / Google OAuth) |
| Theme | next-themes (light / dark / system) |
| Charts | Recharts |
| AI | Vercel AI SDK (`ai` · `@ai-sdk/anthropic`) |

## 🗂️ Project structure

```
app/
  (public)/        public site — home, publications, insights, library, citations,
                   reading-list, about, blocks, [...slug] page builder (+ loading/error/404)
  dashboard/admin/ research CMS (gated) — documents, notes, citations, lit-review, ai-reader,
                   projects, datasets, collaborators, publications, insights, reading-list,
                   about-*, subscribers, pages, landing, database, notion-notes, analytics,
                   admin-panel (ai-config · analytics · audit-log · users · webhooks · settings),
                   settings
  admin/           redirect → /dashboard/admin
  setup/           /setup health page
  api/unsplash/    image-picker Unsplash proxy
  icon.tsx         default favicon
components/
  onboarding/      setup wizard
  admin/           backup-card · update-card
  setup/           setup-health
  blocks/          landing/page block renderer
  shared/ui/       FilePicker (image picker primitive)
  public-chrome.tsx · admin-gate.tsx · site-loader.tsx · demo-ribbon.tsx · ai-chat-fab.tsx
convex/
  schema.ts        auth + research content + siteSettings + admin-panel tables
  auth.ts setup.ts settings.ts files.ts seed.ts backup.ts update.ts
  documents.ts notes.ts citations.ts litReviews.ts projects.ts datasets.ts …function modules
  features/        comments · notion slices
lib/headless-core/ version manifest + settings core (index.ts · version.ts · settings.ts)
scripts/           setup-auth.mjs (build-time JWT keys) · smoke-test.mjs
version.json       single source of version truth (in-app update channel reads it)
```

## 🗺️ Roadmap

- [x] **headless-core** module + version manifest (`lib/headless-core/`)
- [x] One-click **"Update available"** in admin
- [x] One-click **backup / restore**
- [x] Roles (owner / admin / editor / viewer) + admin audit log
- [x] **`/setup`** health page + clone **smoke-test**
- [x] Page builder + landing sections
- [ ] Per-action RBAC beyond the current role tiers
- [ ] Optional Resend "forgot password" flow

## 📄 License

MIT © Rahman ([rahmanef.com](https://rahmanef.com))

<div align="center"><sub>Built with <a href="https://resource.rahmanef.com">rahman-resources</a>.</sub></div>
</content>
</invoke>
