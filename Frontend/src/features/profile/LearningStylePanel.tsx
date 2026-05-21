import { STYLE_INFO, type LearningStyle, C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { Panel } from '../../components/ui/Panel'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'

interface LearningStylePanelProps {
  readonly learningStyle: LearningStyle
  readonly varkScores: Record<LearningStyle, number>
}

const STYLE_EMOJI: Record<LearningStyle, string> = {
  visual:      '👁',
  reading:     '📖',
  auditory:    '🎧',
  kinesthetic: '🤸',
}

const STYLE_EXPLANATION: Record<LearningStyle, string> = {
  visual:      'BIT surfaces diagrams, charts and colour-coded notes front-and-centre in every module you open.',
  reading:     'BIT delivers structured notes, bullet summaries and text-heavy explanations optimised for readers.',
  auditory:    'BIT prioritises spoken explanations, recorded lectures and discussion-style breakdowns.',
  kinesthetic: 'BIT keeps you moving — practice problems, lab exercises and hands-on challenges.',
}

export function LearningStylePanel({ learningStyle, varkScores }: LearningStylePanelProps) {
  const info = STYLE_INFO[learningStyle]
  const total = Object.values(varkScores).reduce((a, b) => a + b, 0) || 1

  return (
    <Panel title="LEARNING STYLE" accent={info.color}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[6] }}>

        {/* Left — type identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <div style={{
              fontSize: '1.75rem',
              width: 52,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: info.bg,
              border: `${BW.base} solid ${C.ink}`,
              borderRadius: R.base,
              flexShrink: 0,
            }}>
              {STYLE_EMOJI[learningStyle]}
            </div>

            <div style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS['5xl'],
              color: C.ink,
              lineHeight: 1,
            }}>
              {info.label.toUpperCase()}
            </div>
          </div>

          <div style={{ fontSize: FS.md, color: C.muted, fontWeight: 600 }}>
            {info.desc}
          </div>

          <div style={{
            fontSize: FS.md,
            color: C.ink,
            fontWeight: 600,
            lineHeight: 1.6,
            marginTop: S[1],
            padding: `${S[3]} ${S[3.5]}`,
            background: info.bg,
            border: `${BW.base} solid ${C.ink}`,
            borderRadius: R.base,
            boxShadow: mkShadow(),
          }}>
            {STYLE_EXPLANATION[learningStyle]}
          </div>
        </div>

        {/* Right — breakdown bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div style={{ alignSelf: 'flex-start' }}>
            <Tag label="FULL BREAKDOWN" bg={info.color} color="#fff" />
          </div>

          {(Object.entries(STYLE_INFO) as [LearningStyle, typeof STYLE_INFO[LearningStyle]][]).map(
            ([key, meta]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[2.5] }}>
                <span style={{
                  width: '5.5rem',
                  fontSize: FS.sm,
                  fontFamily: "'Archivo Black', sans-serif",
                  color: key === learningStyle ? C.ink : C.muted,
                  flexShrink: 0,
                }}>
                  {meta.label.toUpperCase()}
                </span>
                <div style={{ flex: 1 }}>
                  <Bar value={varkScores[key]} max={total} color={meta.color} height="0.75rem" />
                </div>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: FS.base,
                  color: C.ink,
                  width: S[5],
                  textAlign: 'right',
                  flexShrink: 0,
                  fontWeight: key === learningStyle ? 800 : 400,
                }}>
                  {varkScores[key]}
                </span>
              </div>
            )
          )}
        </div>

      </div>
    </Panel>
  )
}
