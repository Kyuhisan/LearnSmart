import { C, BW, R, S, FS } from '../../styles/tokens'

interface TagProps {
  label: string
  bg?: string
  color?: string
  fontSize?: string
}

export function Tag({ label, bg = C.yellowLt, color = C.ink, fontSize = FS.xs }: TagProps) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${S[0.5]} ${S[2]}`,
      background: bg,
      color,
      fontSize,
      fontWeight: 800,
      letterSpacing: '0.03125rem',
      border: `${BW.base} solid ${C.ink}`,
      fontFamily: "'Archivo Black', sans-serif",
      textTransform: 'uppercase',
      borderRadius: R.sm,
      filter: `drop-shadow(2px 2px 0 ${C.ink})`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
