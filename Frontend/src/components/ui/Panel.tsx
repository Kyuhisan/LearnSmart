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
  overflow?: CSSProperties['overflow']
}

export function Panel({
  title,
  accent = C.yellow,
  action,
  children,
  p = S[4],
  bg = C.paper,
  style,
  overflow = 'hidden',
}: PanelProps) {
  return (
    <div style={{
      background: bg,
      border: `${BW.base} solid ${C.ink}`,
      boxShadow: mkShadow(),
      borderRadius: R.base,
      overflow,
      display: 'flex',
      flexDirection: 'column',
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
        borderRadius: `calc(${R.base} - ${BW.base}) calc(${R.base} - ${BW.base}) 0 0`,
      }}>
        <div style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.base,
          letterSpacing: '0.0625rem',
          color: C.ink,
        }}>
          {title}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      <div style={{ padding: p, flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}
