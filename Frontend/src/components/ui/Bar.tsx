import { C, BW, R, mkShadow } from '../../styles/tokens'

interface BarProps {
  value: number
  max?: number
  color?: string
  height?: string | number
  shadow?: boolean
}

export function Bar({ value, max = 100, color = C.yellow, height = '0.625rem', shadow }: BarProps) {
  const h = typeof height === 'number' ? `${height}px` : height
  return (
    <div style={{
      height: h,
      background: C.cream,
      border: `${BW.thin} solid ${C.ink}`,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: R.sm,
      boxShadow: shadow ? mkShadow() : undefined,
    }}>
      <div style={{
        width: `${Math.min(100, (value / max) * 100)}%`,
        height: '100%',
        background: color,
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}
