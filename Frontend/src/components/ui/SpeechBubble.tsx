import type { ReactNode, CSSProperties } from 'react'
import { C, BW, S, mkShadow } from '../../styles/tokens'

interface SpeechBubbleProps {
  children: ReactNode
  color?: string
  side?: 'left' | 'right'
  style?: CSSProperties
}

export function SpeechBubble({
  children,
  color = C.paper,
  side = 'left',
  style,
}: SpeechBubbleProps) {
  return (
    <div style={{
      position: 'relative',
      background: color,
      border: `${BW.medium} solid ${C.ink}`,
      padding: `${S[2.5]} ${S[3.5]}`,
      boxShadow: mkShadow('lg'),
      ...style,
    }}>
      {children}
      <div style={{
        position: 'absolute',
        top: S[4],
        [side]: '-0.625rem',
        width: '0.875rem',
        height: '0.875rem',
        background: color,
        borderLeft: `${BW.medium} solid ${C.ink}`,
        borderBottom: `${BW.medium} solid ${C.ink}`,
        transform: side === 'left' ? 'rotate(45deg)' : 'rotate(-135deg)',
      }} />
    </div>
  )
}
