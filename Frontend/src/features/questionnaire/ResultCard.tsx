import { useState, useEffect } from 'react'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { Panel } from '../../components/ui/Panel'
import { QUESTIONS } from './questions'

interface ResultCardProps {
  answers: LearningStyle[]
  dominantStyle: LearningStyle
  onContinue: () => void
}

const HAIR_OPTIONS = [C.yellow, C.red, C.purple, C.cyan, C.navy, C.green]

function randomAvatar() {
  return {
    hair: HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)],
    glasses: Math.random() < 0.3,
    bigSmile: Math.random() < 0.5,
  }
}

function AvatarFace({ hair, glasses, bigSmile }: { hair: string; glasses: boolean; bigSmile: boolean }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
      {/* Face bg */}
      <rect x="1" y="1" width="78" height="78" rx="10" fill="#FDDBB4" stroke={C.ink} strokeWidth="2" />
      {/* Hair */}
      <path d="M1 32 Q1 1 40 1 Q79 1 79 32 L79 18 Q40 4 1 18 Z" fill={hair} />
      {/* Ears */}
      <rect x="-1" y="36" width="7" height="10" rx="3" fill="#FDDBB4" stroke={C.ink} strokeWidth="1.5" />
      <rect x="74" y="36" width="7" height="10" rx="3" fill="#FDDBB4" stroke={C.ink} strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="28" cy="42" r="5" fill={C.ink} />
      <circle cx="52" cy="42" r="5" fill={C.ink} />
      {/* Eye shine */}
      <circle cx="30" cy="40" r="1.8" fill="white" />
      <circle cx="54" cy="40" r="1.8" fill="white" />
      {/* Mouth */}
      {bigSmile
        ? <path d="M26 57 Q40 68 54 57" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        : <path d="M29 56 Q40 63 51 56" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      }
      {/* Glasses */}
      {glasses && (
        <>
          <rect x="18" y="36" width="20" height="13" rx="4" stroke={C.ink} strokeWidth="1.5" fill="white" fillOpacity="0.35" />
          <rect x="42" y="36" width="20" height="13" rx="4" stroke={C.ink} strokeWidth="1.5" fill="white" fillOpacity="0.35" />
          <line x1="38" y1="42.5" x2="42" y2="42.5" stroke={C.ink} strokeWidth="1.5" />
          <line x1="18" y1="42.5" x2="14" y2="42.5" stroke={C.ink} strokeWidth="1.5" />
          <line x1="62" y1="42.5" x2="66" y2="42.5" stroke={C.ink} strokeWidth="1.5" />
        </>
      )}
    </svg>
  )
}

export function ResultCard({ answers, dominantStyle, onContinue }: ResultCardProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const [avatar] = useState(randomAvatar)

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

      {/* Avatar */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 80, height: 80,
          border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.base,
          boxShadow: mkShadow(),
          overflow: 'hidden',
        }}>
          <AvatarFace hair={avatar.hair} glasses={avatar.glasses} bigSmile={avatar.bigSmile} />
        </div>
        <div style={{ position: 'absolute', top: `-${S[2.5]}`, right: `-${S[6]}`, transform: 'rotate(20deg)' }}>
          <Tag label="YOU!" bg={C.red} />
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
      <Panel title="FULL BREAKDOWN" accent={C.cyan} bg={C.paper} p={S[5]} style={{ width: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2.5] }}>
          {(Object.entries(STYLE_INFO) as [LearningStyle, typeof STYLE_INFO[LearningStyle]][]).map(
            ([key, meta]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[2.5] }}>
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
      </Panel>

      {/* What this means */}
      <Panel title="WHAT THIS MEANS FOR YOU" accent={info.color} bg={info.bg} p={S[4]} style={{ width: '100%' }}>
        <p style={{ fontSize: FS.md, fontWeight: 600, color: C.navy, lineHeight: 1.6 }}>
          {getStyleExplanation(dominantStyle)}
        </p>
      </Panel>

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
