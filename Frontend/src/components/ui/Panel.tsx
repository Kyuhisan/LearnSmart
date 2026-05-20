import type { ReactNode, CSSProperties } from 'react'
import { C, BW, R, S, FS, mkShadow } from '../../styles/tokens'

interface PanelProps {
  title: string
  accent?: string
  action?: ReactNode
  children: ReactNode
  p?: number | string
  bg?: string
  style?: CSSProperties
}

export function Panel({
  title,
  accent = C.yellow,
  action,
  children,
  p = S[4],
  bg = C.paper,
  style,
}: PanelProps) {
  return (
    <div style={{
      background: bg,
      border: `${BW.base} solid ${C.ink}`,
      boxShadow: mkShadow(),
      borderRadius: R.base,
      ...style,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[2.5],
        padding: `${S[2.5]} ${S[3.5]}`,
        background: accent,
        borderBottom: `${BW.base} solid ${C.ink}`,
        borderRadius: `${R.base} ${R.base} 0 0`,
      }}>
        <div style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.base,
          letterSpacing: '0.0625rem',
          color: C.ink,
        }}>
          {title}
        </div>
        {action}
      </div>
      <div style={{ padding: p }}>{children}</div>
    </div>
  )
}
