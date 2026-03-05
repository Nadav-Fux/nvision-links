# nVision Digital AI 🧠

> Hub קהילתי ישראלי לקישורים — קהילות AI, כלי Vibe Coding, מודלי שפה, גרפיקה ומדיה.

[![ציון ביקורת](https://img.shields.io/badge/audit-97%2F100-brightgreen)](#) [![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA-blue)](#) [![תיקון 13](https://img.shields.io/badge/Privacy-Amendment_13-purple)](#)

---

## ⚡ Quick Start

```bash
npm install
npm run dev     # → http://localhost:3000
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 (port 3000) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Edge Functions | Supabase Edge Functions (Deno) |

## 🎨 40 View Modes

Grid · Stack · Carousel · Orbit · Rolodex · Neural Map · Terminal · Chat · IDE · Phone · Mission Control · Constellation · Circuit Board · Skill Tree · Molecular · Periodic Table · Aquarium · Radar · Neural Network · Streaming · Dashboard · Classified · Spotify · Newspaper · Metro Map · Arcade · Desktop · AI Playground · Hologram HUD · Brain MRI · Prompt Flow · GPU Cluster · Training Dashboard · Robot Factory · DNA Helix · Satellite Command · Wormhole · Stock Ticker · Blueprint · Quantum Computer

All views are **fully dynamic** — section count, names, order, colors, and icons are driven by data (DB or static fallback), with zero hardcoding.

## 📂 Key Directories

```
src/
├── pages/           # Routes: Index, Admin, Privacy, Accessibility, 404
├── components/      # 40 view components + admin panel + shared UI
├── data/links.tsx   # Static fallback sections & links
├── lib/             # Hooks: usePublicData, useAnalytics, useTheme
└── integrations/    # Supabase client + auto-generated types

supabase/functions/  # Edge Functions: admin-api, admin-agent, analytics, import
```

## 🔧 Architecture: Dynamic Sections

```
Supabase DB (sections) → usePublicData → Index.tsx → all 40 views
         ↓ empty/error
     staticSections (data/links.tsx)
```

**To add a section:** update the DB (via Admin) or `staticSections` in `data/links.tsx`. Zero code changes needed.

See [GDD.md](GDD.md) for full architecture docs.

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [GDD.md](GDD.md) | General Design Document (PRD) — architecture, DB, Edge Functions, a11y, privacy |
| [VIEW_MODES.md](VIEW_MODES.md) | Detailed guide for all 40 view modes |
| [ANIMATIONS.md](ANIMATIONS.md) | Animation & transition map |
| [TODO.md](TODO.md) | Task tracker (43/43 complete ✅) |

## ♿ Accessibility

- Israeli Standard 5568 + WCAG 2.2 Level AA
- RTL Hebrew (`<html lang="he" dir="rtl">`)
- 15+ accessibility toolbar features (Alt+A)
- `prefers-reduced-motion` support
- Full keyboard navigation

## 🔒 Privacy

- Zero cookies, zero PII, zero tracking pixels
- Anonymous analytics only (page views, clicks — no identifiers)
- Compliant with Amendment 13 to Israel's Privacy Protection Law (2025)

## 📊 Audit Score: 97/100

- Accessibility WCAG 2.2 AA: 98/100
- Privacy Amendment 13: 96/100
- TypeScript: 0 errors · Runtime: 0 errors · Console: 0 errors

---

**כיוון:** RTL · **שפה:** עברית · **דומיין:** [nvision.me](https://nvision.me)
