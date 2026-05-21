import type { CSSProperties } from 'react'
import { ComicBox } from './ComicBox'
import { C, S, FS } from '../../styles/tokens'

interface StatCardProps {
  label: string
  value: string | number
  sub: string
  bg?: string
  style?: CSSProperties
}

export function StatCard({ label, value, sub, bg = C.paper, style }: StatCardProps) {
  return (
    <ComicBox bg={bg} p={S[4]} style={style}>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS.xs,
        color: C.muted,
        letterSpacing: '0.07em',
        marginBottom: S[1.5],
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS['5xl'],
        color: C.ink,
        lineHeight: 1,
        marginBottom: S[1],
      }}>
        {value}
      </div>
      <div style={{
        fontSize: FS.sm,
        color: C.muted,
        fontWeight: 600,
      }}>
        {sub}
      </div>
    </ComicBox>
  )
}
