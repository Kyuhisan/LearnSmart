import { useState, type CSSProperties, type ReactNode } from 'react'
import { C, BW, R, mkShadow } from '../../styles/tokens'

interface ComicBoxProps {
  children: ReactNode
  bg?: string
  hoverBg?: string
  shadowColor?: string
  shadowSize?: 'sm' | 'base' | 'lg' | 'xl'
  borderColor?: string
  borderWidth?: string
  p?: number | string
  style?: CSSProperties
  onClick?: () => void
}

export function ComicBox({
  children,
  bg = C.paper,
  hoverBg,
  shadowColor = C.ink,
  shadowSize = 'base',
  borderColor = C.ink,
  borderWidth = BW.base,
  p = '1rem',
  style,
  onClick,
}: ComicBoxProps) {
  const [hovered, setHovered] = useState(false)
  const isClickable = !!onClick

  const nextSize = { sm: 'base', base: 'lg', lg: 'xl', xl: 'xl' } as const

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => isClickable && setHovered(true)}
      onMouseLeave={() => isClickable && setHovered(false)}
      style={{
        background: hovered && hoverBg ? hoverBg : bg,
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow: mkShadow(hovered ? nextSize[shadowSize] : shadowSize, shadowColor),
        padding: p,
        cursor: isClickable ? 'pointer' : 'default',
        transform: hovered ? 'translate(-0.0625rem, -0.0625rem)' : 'none',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease',
        position: 'relative',
        borderRadius: R.base,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
