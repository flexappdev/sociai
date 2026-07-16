# SociAI

Fleet site #37 — sociology-of-AI course platform for La Sorbonne L3 · social
layer for the AI-native web. Part of `~/APPS/`.

- **Live**: https://sociai.matsiems.com
- **Local dev**: `npm run dev` → http://localhost:17005
- **Repo**: https://github.com/flexappdev/sociai

## Current version — v2.4 (coaching · Sorbonne · admin · favicon)

Canonical app: [`apps/sociai-v2-2.jsx`](apps/sociai-v2-2.jsx) — a single-file
React SPA mounted at `/` via Next.js catch-all route `[[...slug]]`. Every page
is a real URL (no `#` fragment).

### New in v2.4

| Feature | Details |
|---|---|
| **Coaching tab** (admin-only) | `/coaching` — 25 pomodoros × 4 curated questions = 100 total, designed to run during POM/voice-mode ChatGPT sessions. Notes persist to `localStorage`, export as Markdown from the button in the top-right. |
| **Sorbonne tab** (public) | `/sorbonne` — nine-century institution brief, UFR de Sociologie brief, six sociological perspectives (Structural · Interactionist · Critical · Pragmatist · STS · AI-society) + eight Sorbonne rules the coaching flow respects (neutrality, laïcité, anonymous marking, plagiarism, AI disclosure, harassment channel, attendance, grading anchor). |
| **Context diagram** | Bespoke SVG sociogram inside `/sorbonne` — SociAI at centre, tying it to Magda (teaches Sept), Mat (coaches now), _The Sociology of AI_ course, AI as object, and La Sorbonne as institution. |
| **Admin tab** (mat-only) | `/admin` — coach console with progress stats, next-POM queue jumping into Coaching, fleet links, danger-zone clear-notes. Only visible when signed in as `mat@matsiems.com`. |
| **Admin login** | Third role card on the Landing (alongside Student and Teacher). Username `mat@matsiems.com` / password `mat@matsiems.com`. Admin also sees teacher surfaces (rubrics, cohort). |
| **Favicon** | `public/favicon.svg` + `public/apple-touch-icon.svg` — SVG rendering of the SociMark sociogram. Wired via `layout.tsx` `metadata.icons`. |

### Everything from v2.3 and earlier

| Feature | Details |
|---|---|
| **Path-based URLs (no `#`)** | Every view is a clean path — `/book`, `/diagrams`, `/lecture/<slug>`, `/exam/final-s2`, `/user`. Refreshable, shareable, indexable. |
| **Login credentials** | `student / student2026` (student) · `teacher / teacher2026` (teacher) · `mat@matsiems.com / mat@matsiems.com` (admin). |
| **Header user chip** | Shows current username + avatar with a dropdown to switch between student/teacher/admin, jump to profile, or log out. |
| **Gamification** | 10 pts per correct quiz answer · 5-level ladder (Reader → Student → Sociologist → Analyst → Scholar). Sticky footer chip shows points + level + progress bar, links to `/user`. |
| **User profile** | `/user` page — editable display name / email / bio · stats card · 5-tier level ladder · full activity log (auto-populated from quiz submissions). |
| **Lectures index** | `/lectures` — all 26 lectures in one table with filters (semester / reading kind / status) + diagram-kind column. |
| **26 classes** | 13 per semester, each with lecture + reading + quiz. Every lecture section runs 3 paragraphs (`ps: [...]`). |
| **26 hero diagrams** | Inline SVG (flow, cycle, tree, compare, layers, pyramid, matrix) — one per class. |
| **Per-section diagrams** | ~40 additional diagrams appear at the bottom of individual lecture sections where they add signal. |
| **Diagrams gallery** | `/diagrams` — all 26 hero diagrams in one filterable grid (by semester or by kind). |
| **Glossary** | `/glossary` — 100 curated keywords with definitions (sociological + technical: AI, LLM, RLHF, GPU, transformer, RAG, MCP, AGI, etc). Same 3 views as classes (tiles / table / scroll), search + tag filter, click-to-jump-to-lecture. |
| **Global search** | `Ctrl+S` (or `Cmd+S`, or `/`) opens a search modal with autosuggest across glossary + lectures + nav pages. `↑↓` navigate, `Enter` open, `Esc` close. |
| **Auto-annotated text** | Lecture paragraphs auto-underline every glossary term with a native-tooltip definition — hover any dotted underline for the full explanation. |
| **Tooltips everywhere** | Every header, sidebar, footer, and nav button has a `title` tooltip explaining what it does. Btn primitive accepts a `title` prop. |
| **Teacher-only user dropdown** | Only teachers/admins get the switch-user dropdown. Students get a plain name-chip + logout. |
| **Teacher admin — Students page** | `/students` (teacher-only) — 42-student cohort with per-row progress bar, quiz-avg badge, at-risk flags, and editable private notes. Filter by top/low/at-risk. |
| **Exam runner** | 4 exams (2 midterms + 2 finals) with **functional practice**: pooled MCQs + live countdown timer + essay pane + score % + missed-question review. |
| **Book / Scroller** | All 26 chapters as a scrollable book; 286 vertical slides in the scroller. |
| **Teacher mode** | Answer keys + marking rubrics visible on toggle. |

### URL map (no `#`)

```
/                          canonical mount → dashboard
/dashboard                 overview + progress
/lectures                  all-lecture index with filters
/s1  /s2                   semester grid (tiles/table/scroll views)
/diagrams                  gallery of all 26 hero diagrams
/glossary                  100 curated keywords with definitions
/sorbonne                  institution + department + context diagram
/coaching                  25 pomodoros × 4 questions (admin only)
/admin                     coach console (admin only)
/students                  cohort dashboard (teacher / admin only)
/book                      the whole course as a book
/scroller                  vertical slide reader
/exams                     all 4 exams
/user                      profile · progress · activity log
/lecture/<slug>            full-page lecture reader for one class
/class/<slug>              class with side-panel details
/class/<slug>/quiz         class with the quiz tab active
/exam/<kind>-s<n>          scroll to a specific exam card (e.g. final-s2)
```

### Coaching content bank

The 100 questions in `/coaching` live in the `COACHING_ROUNDS` array in
`apps/sociai-v2-2.jsx`. Each round is one pomodoro (25 min) with 4
probing questions and a one-line `gist`. Add new rounds by appending to the
array — the view auto-picks them up. Notes are per-device (`localStorage`
key `sociai_coaching_notes_v1`); export before clearing.

### Sorbonne content bank

`/sorbonne` reads from the `SORBONNE` object (history · department · six
perspectives · eight rules) and the `CONTEXT_NODES` array (six actors around
SociAI). Both live at the top of `apps/sociai-v2-2.jsx`.

Slug is derived from `slugify(session.title)`, so e.g.:
- `/lecture/algorithms-power-in-the-code`
- `/class/surveillance-capitalism/quiz`
- `/exam/final-s2`

> Prior version `apps/sociai-v2-1.jsx` still browsable at `/apps/sociai-v2-1`.

## Prototype pattern

Drop a `.jsx` file into `apps/` — the pre-build script
`scripts/gen-apps-manifest.mjs` scans that folder and regenerates two
autogenerated files:

- `src/lib/apps.ts` (server-safe manifest of apps)
- `src/app/apps/[slug]/AppRegistry.tsx` (client-side static-import registry)

Each JSX should export a default React component and (optionally) declare a
`META` const with `title`, `subtitle`, and `brand`.

```jsx
const META = {
  title: "SociAI",
  subtitle: "Sociology of AI · L3 course",
  brand: "SociAI",
};

export default function App() {
  return <div>...</div>;
}
```

Visit `/apps/<slug>` to see it rendered. The slug is derived from the filename.
Currently registered prototypes:

- `sociai-v2-2` — canonical course app, enriched content (mounted at site root `/`)
- `sociai-v2-1` — prior version, leaner content
- `sociai-feed` — TikTok-style AI content feed
- `sociai-twin-network` — AI-twin social network
- `sociai-builder-hub` — Product Hunt for AI apps

## Deploy

Pushes to `main` deploy via Vercel (matsiems team). Custom domain
`sociai.matsiems.com` is a Route 53 CNAME → `cname.vercel-dns.com`.
