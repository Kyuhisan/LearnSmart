import { useState, type ReactNode, type CSSProperties } from 'react'
import { C, BW, R, S, FS, mkShadow } from '../../styles/tokens'

interface ComicBtnProps {
  children: ReactNode
  onClick?: () => void
  color?: string
  hoverColor?: string
  sm?: boolean
  style?: CSSProperties
  dark?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function ComicBtn({
  children,
  onClick,
  color = C.yellow,
  hoverColor,
  sm,
  style,
  dark,
  disabled,
  type = 'button',
}: ComicBtnProps) {
  const [hovered, setHovered] = useState(false)
  const active = hovered && !disabled

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: disabled ? C.mutedLt : (active && hoverColor ? hoverColor : color),
        color: dark ? '#fff' : C.ink,
        border: `${BW.base} solid ${C.ink}`,
        padding: sm ? `${S[1.5]} ${S[3.5]}` : `${S[2.5]} ${S[5]}`,
        fontSize: sm ? FS.sm : FS.md,
        fontWeight: 800,
        letterSpacing: '0.03125rem',
        fontFamily: "'Archivo Black', sans-serif",
        textTransform: 'uppercase',
        boxShadow: mkShadow(active ? 'lg' : 'base'),
        transform: active ? 'translate(-0.0625rem, -0.0625rem)' : 'none',
        transition: 'all 0.12s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: S[1.5],
        borderRadius: R.base,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
