// ─────────────────────────────────────────────────────────────────────────────
// LearnSmart Design Tokens  (v7)
// Single source of truth — update here, applies everywhere.
// ─────────────────────────────────────────────────────────────────────────────

// ── Colors ───────────────────────────────────────────────────────────────────
export const C = {
  cream:    '#fbf6ee',
  paper:    '#fffdf9',
  ink:      '#2d2a26',
  yellow:   '#e8b948',
  yellowLt: '#fbeed0',
  red:      '#d97a6c',
  redLt:    '#fae3df',
  cyan:     '#7cb8c4',
  cyanLt:   '#dbeef2',
  green:    '#85b88f',
  greenLt:  '#e1efe3',
  pink:     '#d491b4',
  pinkLt:   '#f5dfeb',
  purple:   '#a89bc9',
  purpleLt: '#ebe5f3',
  orange:   '#e8a570',
  orangeLt: '#fae5d3',
  navy:     '#3a3936',
  muted:    '#7d7872',
  mutedLt:  '#a8a39c',
  divider:  '#e8dfd0',
} as const

// ── Spacing scale (rem, 4px base) ─────────────────────────────────────────
// Usage: S[1] → '0.25rem' (4px), S[4] → '1rem' (16px)
export const S = {
  0.5: '0.125rem',  //  2px
  1:   '0.25rem',   //  4px
  1.5: '0.375rem',  //  6px
  2:   '0.5rem',    //  8px
  2.5: '0.625rem',  // 10px
  3:   '0.75rem',   // 12px
  3.5: '0.875rem',  // 14px
  4:   '1rem',      // 16px
  5:   '1.25rem',   // 20px
  6:   '1.5rem',    // 24px
  7:   '1.75rem',   // 28px
  8:   '2rem',      // 32px
  9:   '2.25rem',   // 36px
  10:  '2.5rem',    // 40px
  12:  '3rem',      // 48px
  14:  '3.5rem',    // 56px
  16:  '4rem',      // 64px
  20:  '5rem',      // 80px
  24:  '6rem',      // 96px
} as const

// ── Font sizes (rem) ─────────────────────────────────────────────────────────
// Usage: FS.sm → '0.6875rem' (11px)
export const FS = {
  '2xs': '0.5625rem',  //  9px
  xs:    '0.625rem',   // 10px
  sm:    '0.6875rem',  // 11px
  base:  '0.75rem',    // 12px
  md:    '0.8125rem',  // 13px
  lg:    '0.875rem',   // 14px
  xl:    '1rem',       // 16px
  '2xl': '1.125rem',   // 18px
  '3xl': '1.3125rem',  // 21px
  '4xl': '1.5rem',     // 24px
  '5xl': '1.75rem',    // 28px
  '6xl': '2.5rem',     // 40px
  '7xl': '2.75rem',    // 44px
  '8xl': '3.5rem',     // 56px
} as const

// ── Border widths (px — kept in px so thin lines stay sharp at any zoom) ─────
// Usage: BW.base → '2px'
export const BW = {
  thin:   '1.5px',
  base:   '2px',
  medium: '2.5px',
  thick:  '3px',
} as const

// ── Border radius ─────────────────────────────────────────────────────────────
// Usage: R.base → 'var(--ls-radius-base)' — values defined in index.css :root
export const R = {
  sm:   'var(--ls-radius-sm)',
  base: 'var(--ls-radius-base)',
  md:   'var(--ls-radius-md)',
  lg:   'var(--ls-radius-lg)',
  xl:   'var(--ls-radius-xl)',
  full: '9999px',
} as const

// ── Offset shadow helper ──────────────────────────────────────────────────────
// The visual signature of the LearnSmart design: hard offset shadow.
// Usage: mkShadow() → 'var(--ls-shadow-base)'  |  mkShadow('lg', C.yellow) → '3px 3px 0 #e8b948'
export function mkShadow(
  size: 'sm' | 'base' | 'lg' | 'xl' = 'base',
  color: string = C.ink,
): string {
  if (color === C.ink) return `var(--ls-shadow-${size})`
  const offsets = { sm: '1px', base: '2px', lg: '3px', xl: '4px' } as const
  const o = offsets[size]
  return `${o} ${o} 0 ${color}`
}

// ── VARK style metadata ───────────────────────────────────────────────────────
export const STYLE_INFO = {
  visual:      { label: 'Visual',      color: C.purple, bg: C.purpleLt, desc: 'Charts, diagrams, flowcharts & symbolic representations' },
  reading:     { label: 'Read / Write', color: C.cyan,   bg: C.cyanLt,   desc: 'Written text, notes, lists & structured summaries' },
  auditory:    { label: 'Auditory',     color: C.green,  bg: C.greenLt,  desc: 'Discussions, lectures, talking & verbal explanation' },
  kinesthetic: { label: 'Kinesthetic',  color: C.red,    bg: C.redLt,    desc: 'Real examples, case studies, practice & lived experience' },
} as const

export type LearningStyle = keyof typeof STYLE_INFO
