import { useState, type ReactNode } from 'react'
import { C, BW, FS, S, R, mkShadow } from '../../styles/tokens'

interface GhostBtnProps {
  children: ReactNode
  onClick?: () => void
}

export function GhostBtn({ children, onClick }: GhostBtnProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.yellowLt : 'transparent',
        color: C.ink,
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: R.sm,
        padding: `${S[1]} ${S[3]}`,
        fontSize: FS.xs,
        fontWeight: 700,
        fontFamily: "'Archivo Black', sans-serif",
        cursor: 'pointer',
        boxShadow: mkShadow(hovered ? 'lg' : 'base'),
        transform: hovered ? 'translate(-1px, -1px)' : 'none',
        transition: 'background 0.12s, box-shadow 0.12s, transform 0.12s',
      }}
    >
      {children}
    </button>
  )
}
