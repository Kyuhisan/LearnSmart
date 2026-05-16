# LearnSmart Frontend Rules

## Stack
- React 19 + TypeScript + Vite (in `Frontend/`)
- No external UI libraries (no MUI, Tailwind, etc.) — custom design system only

## Design Tokens — always import from `src/styles/tokens.ts`
- Never use raw hex colors, px values, or font names in code
- Colors: `C.ink`, `C.paper`, `C.cream`, `C.yellow`, `C.cyan`, `C.green`, `C.red`, `C.purple`, `C.navy`
  - Light variants: `C.yellowLt`, `C.cyanLt`, `C.greenLt`, `C.redLt`, `C.purpleLt`, `C.pinkLt`
  - Muted: `C.muted`, `C.mutedLt`, `C.divider`
- Spacing: `S[1]`, `S[2]`, `S[3]`, `S[4]`, `S[5]` etc. (never hardcode `"1rem"` or `"16px"`)
- Font sizes: `FS.xs`, `FS.sm`, `FS.md`, `FS.lg`, `FS.xl`, `FS['2xl']`, `FS['3xl']`, `FS['4xl']`, `FS['5xl']`, `FS['2xs']`
- Border widths: `BW.thin`, `BW.base`
- Border radius: `R.sm`, `R.base`
- Shadow helper: `mkShadow()` for the standard 2px hard shadow

## Fonts (never hardcode font names as strings in JSX — only in CSS files)
- Headings / labels: `'Archivo Black', sans-serif`
- Body: `'Manrope', sans-serif`
- Numbers / mono: `'Space Mono', monospace`

## Component Primitives — use these, never reinvent them
- `ComicBox` — ALL panels/cards. Props: `bg`, `p`, `style`. Never use a raw `<div>` with a border+shadow.
- `Panel` — section wrappers with a header label
- `ComicBtn` — ALL buttons. Props: `color`, `dark`, `sm`, `onClick`
- `Tag` — ALL chips/badges. Props: `label`, `bg`
- `Bar` — progress bars. Props: `value`, `height`, `color`
- `SpeechBubble` — BIT mascot speech bubbles. Props: `color`, `side`
- `BitMascot` — BIT the robot. Props: `size`, `mood`, `float`
- `Sidebar` — app sidebar. Props: `vloga`, `username`
- `StatCard` — stat display boxes. Props: `label`, `value`, `sub`, `bg`, `style`

## Folder Structure

```
src/
├── pages/              # Route shells only — one file per route
├── features/           # One folder per page — all content for that page lives here
│   ├── dashboard/
│   │   ├── StudentDashboard.tsx
│   │   ├── ProfessorDashboard.tsx
│   │   └── mockData.ts (if needed)
│   └── <pageName>/     # Same pattern for every page
├── components/
│   ├── ui/             # Shared primitives used across the whole app
│   └── professor/      # Shared components used across multiple professor pages
│   └── student/        # Shared components used across multiple student pages
├── styles/             # tokens.ts + per-page CSS files
└── context/            # React context providers
```

## Page Architecture — ALWAYS follow this pattern

### Pages (`/pages`)
- One file per route. Contains ONLY: loading guard, Sidebar, role switch.
- Max ~20 lines. No business logic, no inline styles, no conditionals beyond the role switch.
- Shared pages render `{isTeacher ? <ProfessorX /> : <StudentX />}`
- Role-only pages render the single component directly — no role switch needed.

```tsx
// Shared page example
export function DashboardPage() {
  const { profil } = useAuth()
  if (!profil) return <div className="page-loader"><BitMascot size={80} mood="thinking" float /></div>
  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil.vloga} username={profil.username} />
      {profil.vloga === 'ucitelj' ? <ProfessorDashboard /> : <StudentDashboard />}
    </div>
  )
}

// Role-only page example
export function UploadPage() {
  const { profil } = useAuth()
  if (!profil) return <div className="page-loader"><BitMascot size={80} mood="thinking" float /></div>
  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil.vloga} username={profil.username} />
      <ProfessorUpload />
    </div>
  )
}
```

### Feature components (`/features/<page>`)
- `Student<Page>.tsx` — student content for that page
- `Professor<Page>.tsx` — professor content for that page
- Sub-components used only on this page live here too (e.g. `QuizQuestion.tsx`, `LeaderboardRow.tsx`)
- `mockData.ts` — any hardcoded data for that page (never inline in components)
- Each role component returns its own wrapping div (e.g. `<div className="dashboard-main">`)
- Placeholders use cyan bg + STUDENT tag, yellow bg + TEACHER tag

### Shared components (`/components`)
- `ui/` — primitives used across multiple pages by both roles
- `professor/` — components shared across multiple professor pages
- `student/` — components shared across multiple student pages
- If a component is used in ONE page only → it goes in `features/<page>/`
- If a component is used in MULTIPLE pages → it goes in `components/`

## Component Rules
- Every visual "panel" or "card" MUST use `ComicBox` as its root — never custom border/shadow CSS
- All border/shadow styling comes from `ComicBox`, not from CSS classes
- Only `bg` and content change between panel instances
- Never put `isTeacher` / role conditionals inside a feature component — role splitting happens in the page file only

## CSS Rules
- CSS files are for PAGE-LEVEL layout only (page wrapper, topbar, grid layout, responsive breakpoints)
- Component-level styling uses inline styles with tokens — NOT CSS classes
- Never add a CSS class that sets `border`, `box-shadow`, `border-radius`, or `background` on a panel — that's ComicBox's job
- CSS animations stay in `index.css`: `wiggle`, `popIn`, `fadeUp`, `spin`
- Halftone pattern: `radial-gradient(#000 1px, transparent 1px); background-size: 14px 14px; opacity: 0.08`

## Visual Style
- All borders: `2px solid C.ink` (use `BW.base`)
- All hard shadows: `2px 2px 0 C.ink` — use `mkShadow()`
- Hover state: `translate(-1px, -1px)` + shadow grows to `3px 3px 0`
- Border radius: `6px` (`R.base`) for cards, `4px` (`R.sm`) for buttons/tags
- Page backgrounds: cream (`C.cream`) with subtle dot grid pattern

## Routing
All protected routes require auth. Role-only routes redirect to `/dashboard` if wrong role.

### Both roles
- `/` — Login
- `/callback` — Supabase OAuth callback
- `/dashboard` — Home base
- `/modules` — Module library
- `/modules/:id` — Module detail
- `/profile` — Profile
- `/notifications` — Notifications
- `/settings` — Settings

### Student only (`ucenec`)
- `/questionnaire` — VARK quiz
- `/quiz` — Active quiz session
- `/quiz/history` — Past quiz results
- `/leaderboard` — XP rankings
- `/progress` — Learning progress & badges

### Professor only (`ucitelj`)
- `/upload` — Upload content
- `/ai-quiz-builder` — AI quiz generator
- `/analytics` — Class analytics
- `/students` — Students roster
- `/students/:id` — Individual student detail

## Auth
- Auth context: `useAuth()` from `src/context/AuthContext`
- Fields: `profil.vloga` (`'ucenec'` | `'ucitelj'`), `profil.username`, `session.access_token`
- Role check: `profil.vloga === 'ucitelj'` for professor, `'ucenec'` for student

## API
- Base URL: `import.meta.env.VITE_API_URL` (default `http://localhost:8080`)
- Always send `Authorization: Bearer <session.access_token>` for authenticated endpoints

## General Rules
- No magic numbers or colors anywhere in JSX/TSX
- No one-off border/shadow styles — use tokens and ComicBox
- No external component libraries
- Keep components small and focused — if it's reusable, extract it
- Hardcoded/mock data goes in a `mockData.ts` file in the feature folder, never inline in components
- TypeScript: always type props interfaces, never use `any`
