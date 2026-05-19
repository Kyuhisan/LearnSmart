import { useState, useEffect } from 'react'
import { C, S, FS, R, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { QUESTIONS } from './questions'

interface ResultCardProps {
  answers: LearningStyle[]
  dominantStyle: LearningStyle
  onContinue: () => void
}

export function ResultCard({ answers, dominantStyle, onContinue }: ResultCardProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const info = STYLE_INFO[dominantStyle]
  const totalQ = QUESTIONS.length

  const counts = (Object.keys(STYLE_INFO) as LearningStyle[]).reduce<Record<LearningStyle, number>>(
    (acc, key) => ({ ...acc, [key]: answers.filter(a => a === key).length }),
    { visual: 0, reading: 0, auditory: 0, kinesthetic: 0 }
  )

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: S[5],
      animation: 'fadeUp 0.3s ease forwards',
      padding: isMobile ? `0 ${S[1]}` : 0,
    }}>

      {/* Style icon placeholder */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 80, height: 80,
          border: '3px solid currentColor',
          borderRadius: R.base,
          animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
        }} />
        <div style={{ position: 'absolute', top: `-${S[2.5]}`, right: `-${S[6]}`, transform: 'rotate(20deg)' }}>
          <Tag label="YOU!" bg={C.red} color="#fff" />
        </div>
      </div>

      {/* Label + description */}
      <div style={{ textAlign: 'center' }}>
        <Tag label="YOUR LEARNING TYPE" bg={C.yellow} />
        <h2 style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 'clamp(1.75rem, 6vw, 2.5rem)',
            marginBottom: S[2.5],
          lineHeight: 1,
          letterSpacing: '-0.0625rem',
          color: C.ink,
        }}>
          {info.label.toUpperCase()}!
        </h2>
        <p style={{ fontSize: FS.lg, color: C.muted, marginTop: S[1], fontWeight: 600, lineHeight: 1.5 }}>
          {info.desc}
        </p>
      </div>

      {/* Score breakdown */}
      <ComicBox bg={C.paper} p={S[5]} style={{ width: '100%', textAlign: 'left' }}>
        <Tag label="FULL BREAKDOWN" bg={C.cyan} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2.5], marginTop: S[3.5] }}>
          {(Object.entries(STYLE_INFO) as [LearningStyle, typeof STYLE_INFO[LearningStyle]][]).map(
            ([key, meta]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[2.5] }}>
                <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid currentColor', borderRadius: 2, flexShrink: 0 }} />
                <span style={{
                  width: S[24],
                  fontSize: FS.sm,
                  fontWeight: 800,
                  fontFamily: "'Archivo Black', sans-serif",
                  color: C.ink,
                }}>
                  {meta.label.toUpperCase()}
                </span>
                <div style={{ flex: 1 }}>
                  <Bar value={counts[key]} max={totalQ} color={meta.color} />
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: FS.base,
                  width: S[5],
                  textAlign: 'right',
                  color: C.ink,
                }}>
                  {counts[key]}
                </span>
              </div>
            )
          )}
        </div>
      </ComicBox>

      {/* What this means */}
      <ComicBox bg={info.bg} p={S[4]} style={{ width: '100%' }}>
        <div style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.sm,
          letterSpacing: '0.0625rem',
          color: C.ink,
          marginBottom: S[2],
        }}>
          WHAT THIS MEANS FOR YOU:
        </div>
        <p style={{ fontSize: FS.md, fontWeight: 600, color: C.navy, lineHeight: 1.6 }}>
          {getStyleExplanation(dominantStyle)}
        </p>
      </ComicBox>

      <ComicBtn onClick={onContinue} color={C.green}>
        ENTER DASHBOARD
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ComicBtn>
    </div>
  )
}

function getStyleExplanation(style: LearningStyle): string {
  const explanations: Record<LearningStyle, string> = {
    visual:
      'BIT will present concepts through diagrams, charts, colour-coded notes, and infographics. Your modules will feature visual content front-and-centre.',
    reading:
      'BIT will deliver structured notes, bullet-point summaries, and text-heavy explanations. Your modules are optimised for readers.',
    auditory:
      'BIT will prioritise spoken explanations, recorded lectures, and discussion-style breakdowns. Best consumed with headphones on.',
    kinesthetic:
      'BIT will keep you moving — practice problems, lab exercises, and hands-on challenges. Learning by doing is your superpower.',
  }
  return explanations[style]
}
