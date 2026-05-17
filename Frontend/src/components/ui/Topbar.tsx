import { type ReactNode, type CSSProperties } from 'react'
import { ComicBtn } from './ComicBtn'
import { C, S, FS } from '../../styles/tokens'

interface TopbarProps {
  title: string
  subtitle?: string
  /** Renders a ← BACK ComicBtn before the title */
  back?: () => void
  /** Right-side action buttons */
  actions?: ReactNode
  /**
   * true (default) — negative-margin escape from dashboard-main padding (1.5rem).
   * false — renders inline; use for wrappers that already have no padding
   *         (module-detail-page, profile pages with padding:0).
   */
  escape?: boolean
}

export function Topbar({ title, subtitle, back, actions, escape = true }: TopbarProps) {
  const style: CSSProperties = {
    padding: `${S[3]} ${S[6]}`,
    background: C.paper,
    borderBottom: `3px solid ${C.ink}`,
    display: 'flex',
    alignItems: 'center',
    gap: S[4],
    ...(escape
      ? { margin: `calc(-1 * ${S[6]}) calc(-1 * ${S[6]}) ${S[5]}` }
      : {}),
  }

  return (
    <div style={style}>
      {back && (
        <ComicBtn sm color={C.paper} onClick={back}>← BACK</ComicBtn>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['4xl'], letterSpacing: -0.5, color: C.ink }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5], fontWeight: 700 }}>
            {subtitle}
          </div>
        )}
      </div>
      {actions}
    </div>
  )
}
