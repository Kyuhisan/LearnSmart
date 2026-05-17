import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { ResultCard } from './ResultCard'
import { QUESTIONS } from './questions'

type WizardStep = 'intro' | 'question' | 'result'

interface QuestionnaireWizardProps {
  onComplete?: (style: LearningStyle) => void
}

// Only defined when explicitly set — never falls back to localhost so a
// deployed build never triggers Chrome's Private Network Access prompt.
const API_BASE: string | undefined = import.meta.env.VITE_API_URL

async function classifyStyle(answers: LearningStyle[], token: string | null): Promise<LearningStyle | 'uncategorized'> {
  if (!API_BASE) throw new Error('VITE_API_URL not configured')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/ai/classify-style`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error('Classification failed')
    const data = await res.json() as { learningStyle: LearningStyle | 'uncategorized' }
    return data.learningStyle
  } finally {
    clearTimeout(timeout)
  }
}

function getDominantStyle(answers: LearningStyle[]): LearningStyle {
  const counts = answers.reduce<Record<string, number>>((acc, a) => {
    acc[a] = (acc[a] ?? 0) + 1
    return acc
  }, {})
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as LearningStyle
}

export function QuestionnaireWizard({ onComplete }: QuestionnaireWizardProps) {
  const { session } = useAuth()
  const [step, setStep]                   = useState<WizardStep>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  // Flat list of all chosen styles across all questions (multi-select means
  // multiple entries per question are possible)
  const [answers, setAnswers]             = useState<LearningStyle[]>([])
  // Selections for the current question only (reset on advance)
  const [selected, setSelected]           = useState<LearningStyle[]>([])
  const [dominantStyle, setDominantStyle] = useState<LearningStyle | 'uncategorized' | null>(null)
  const [visible, setVisible]             = useState(true)
  const [submitting, setSubmitting]       = useState(false)
  const [isMobile, setIsMobile]           = useState(window.innerWidth < 640)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const transition = (fn: () => void) => {
    setVisible(false)
    setTimeout(() => { fn(); setVisible(true) }, 200)
  }

  const currentQuestion = QUESTIONS[questionIndex]
  const isLast = questionIndex === QUESTIONS.length - 1

  // Shuffle options once per question (Fisher-Yates) so position/colour
  // gives no hint about which VARK type each option belongs to.
  const shuffledOptions = useMemo(() => {
    const opts = [...(currentQuestion?.options ?? [])]
    for (let i = opts.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]]
    }
    return opts
  }, [questionIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOption = (style: LearningStyle) => {
    setSelected(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  const handleNext = () => {
    const merged = [...answers, ...selected]

    if (!isLast) {
      setAnswers(merged)
      transition(() => {
        setQuestionIndex(i => i + 1)
        setSelected([])
      })
    } else {
      // Last question — classify and show results
      setSubmitting(true)
      void (async () => {
        let result: LearningStyle | 'uncategorized'
        try {
          result = await classifyStyle(merged, session?.access_token ?? null)
        } catch {
          result = getDominantStyle(merged)
        }
        setAnswers(merged)
        setDominantStyle(result)
        setSubmitting(false)
        setStep('result')
      })()
    }
  }

  const handleContinue = () => {
    if (dominantStyle && dominantStyle !== 'uncategorized') onComplete?.(dominantStyle)
    else onComplete?.('visual') // uncategorized — proceed to dashboard with neutral default
  }

  return (
    <div style={{
      // Break out of #root's max-width / border-inline constraints and
      // fill the full viewport on every screen size.
      position: 'fixed',
      inset: 0,
      overflowY: 'auto',
      background: C.cream,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Manrope', sans-serif",
      zIndex: 50,
    }}>
      {/* Halftone dot background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
        backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
        backgroundSize: '0.875rem 0.875rem',
      }} />

      {/* Topbar */}
      <div style={{
        padding: isMobile ? `${S[3]} ${S[3.5]}` : `${S[3.5]} ${S[5.5 as keyof typeof S] ?? S[5]}`,
        background: C.yellow,
        borderBottom: `${BW.thick} solid ${C.ink}`,
        display: 'flex', alignItems: 'center', gap: S[3],
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <BitMascot size={isMobile ? 32 : 38} />
        <div style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: isMobile ? FS.md : FS.lg,
          letterSpacing: '0.03125rem',
          color: C.ink,
        }}>
          LEARNSMART — VARK ASSESSMENT
        </div>
        {step === 'question' && (
          <div style={{
            marginLeft: 'auto',
            fontFamily: "'Space Mono', monospace",
            fontSize: FS.base,
            color: C.navy,
          }}>
            {String(questionIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{QUESTIONS.length}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: step === 'result' ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: isMobile ? `${S[6]} ${S[4]} ${S[10]}` : `${S[10]} ${S[6]}`,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          maxWidth: '35rem',
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : `translateY(${S[3.5]})`,
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}>

          {/* ── INTRO ── */}
          {step === 'intro' && (
            <div style={{
              textAlign: 'center',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: S[6],
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[4], justifyContent: 'center' }}>
                <BitMascot size={isMobile ? 80 : 100} mood="happy" float />
                <SpeechBubble color={C.cyan} style={{ marginBottom: S[3], minWidth: '11rem' }}>
                  <div style={{ fontSize: FS.md, fontWeight: 800 }}>
                    {QUESTIONS.length} quick questions!
                  </div>
                  <div style={{ fontSize: FS.base, color: C.navy, marginTop: S[1] }}>
                    Pick all that apply.
                  </div>
                </SpeechBubble>
              </div>

              <div>
                <Tag label="VARK ASSESSMENT" bg={C.yellow} />
                <h1 style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: isMobile ? FS['5xl'] : FS['7xl'],
                  marginTop: S[3], lineHeight: 1, letterSpacing: '-0.0625rem',
                  color: C.ink,
                }}>
                  HOW DO <span style={{ color: C.red }}>YOU</span> LEARN?
                </h1>
                <p style={{
                  fontSize: FS.lg, color: C.muted, marginTop: S[3],
                  fontWeight: 600, lineHeight: 1.6, maxWidth: '26rem', margin: `${S[3]} auto 0`,
                }}>
                  BIT analyses your preferences across 4 learning modes and
                  personalises every lesson, quiz, and recommendation — just for you.
                </p>
              </div>

              {/* VARK mode pills */}
              <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', justifyContent: 'center' }}>
                {(Object.entries(STYLE_INFO) as [LearningStyle, typeof STYLE_INFO[LearningStyle]][]).map(
                  ([key, meta]) => (
                    <div key={key} style={{
                      padding: `${S[1.5]} ${S[3]}`,
                      background: meta.bg,
                      border: `${BW.base} solid ${C.ink}`,
                      fontSize: FS.base, fontWeight: 800,
                      fontFamily: "'Archivo Black', sans-serif",
                      letterSpacing: '0.03125rem',
                      borderRadius: R.sm,
                    }}>
                      {meta.icon} {meta.label.toUpperCase()}
                    </div>
                  )
                )}
              </div>

              <div style={{ fontSize: FS.base, color: C.muted, fontWeight: 600 }}>
                You may select <strong style={{ color: C.ink }}>more than one answer</strong> per question —
                most people are multimodal.
              </div>

              <ComicBtn onClick={() => transition(() => setStep('question'))} color={C.red} dark>
                START ASSESSMENT →
              </ComicBtn>
            </div>
          )}

          {/* ── QUESTION ── */}
          {step === 'question' && currentQuestion && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
              {/* Progress bar */}
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: S[1.5],
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: FS.sm, color: C.ink,
                }}>
                  <span>Q{String(questionIndex + 1).padStart(2, '0')} / {QUESTIONS.length}</span>
                  <span>{Math.round((questionIndex / QUESTIONS.length) * 100)}% complete</span>
                </div>
                <Bar value={questionIndex} max={QUESTIONS.length} />
              </div>

              {/* Question card */}
              <ComicBox bg={C.paper} p={S[5]}>
                <h2 style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: isMobile ? FS['3xl'] : FS['3xl'],
                  lineHeight: 1.3, letterSpacing: '-0.02em', color: C.ink,
                  marginBottom: S[1.5],
                }}>
                  {currentQuestion.question}
                </h2>

                <p style={{ fontSize: FS.base, color: C.muted, fontWeight: 600, marginBottom: S[4] }}>
                  Select all that apply.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2.5] }}>
                  {shuffledOptions.map((opt, i) => {
                    const isSelected = selected.includes(opt.style)
                    return (
                      <OptionButton
                        key={i}
                        letter={String.fromCharCode(65 + i)}
                        label={opt.label}
                        selected={isSelected}
                        disabled={submitting}
                        onClick={() => !submitting && toggleOption(opt.style)}
                      />
                    )
                  })}
                </div>
              </ComicBox>

              {/* Next / Finish button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: S[3] }}>
                {selected.length === 0 && (
                  <span style={{ fontSize: FS.base, color: C.muted, fontWeight: 600 }}>
                    Choose at least one option
                  </span>
                )}
                {submitting ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: S[2],
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: FS.base, color: C.muted,
                  }}>
                    <div style={{
                      width: S[4], height: S[4], borderRadius: '50%',
                      border: `${BW.thick} solid ${C.ink}`, borderTopColor: 'transparent',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    BIT IS THINKING…
                  </div>
                ) : (
                  <ComicBtn
                    onClick={handleNext}
                    color={selected.length > 0 ? C.yellow : C.divider}
                    disabled={selected.length === 0}
                  >
                    {isLast ? 'FINISH →' : 'NEXT →'}
                  </ComicBtn>
                )}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === 'result' && dominantStyle === 'uncategorized' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[5] }}>
              <div style={{ fontSize: FS['6xl'] }}>⚠️</div>
              <div>
                <Tag label="CLASSIFICATION UNAVAILABLE" bg={C.orangeLt} />
                <h2 style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: FS['4xl'],
                  marginTop: S[2.5], lineHeight: 1.2,
                  letterSpacing: '-0.03em', color: C.ink,
                }}>
                  Couldn't classify your style
                </h2>
                <p style={{ fontSize: FS.lg, color: C.muted, marginTop: S[2.5], fontWeight: 600, lineHeight: 1.6, maxWidth: '24rem' }}>
                  Our AI is temporarily unavailable. Your answers were saved — please try again later from your profile settings.
                </p>
              </div>
              <ComicBtn onClick={handleContinue} color={C.yellow}>
                GO TO DASHBOARD →
              </ComicBtn>
            </div>
          )}
          {step === 'result' && dominantStyle && dominantStyle !== 'uncategorized' && (
            <ResultCard
              answers={answers}
              dominantStyle={dominantStyle}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Multi-select option button ───────────────────────────────────────────────
// All options use the same neutral colours — no VARK type is visually hinted.
interface OptionButtonProps {
  letter: string
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

function OptionButton({ letter, label, selected, onClick, disabled }: OptionButtonProps) {
  const [hovered, setHovered] = useState(false)
  const active = (hovered || selected) && !disabled

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: S[3],
        padding: `${S[3]} ${S[3.5]}`,
        background: active ? C.yellowLt : C.paper,
        border: `${selected ? BW.medium : BW.base} solid ${selected ? C.yellow : C.ink}`,
        boxShadow: active ? mkShadow('lg') : mkShadow(),
        fontSize: FS.md, fontWeight: 600,
        fontFamily: "'Manrope', sans-serif",
        textAlign: 'left',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: hovered && !disabled && !selected ? 'translate(-0.125rem, -0.125rem)' : 'none',
        transition: 'all 0.12s ease',
        borderRadius: R.sm,
        color: C.ink,
        lineHeight: 1.5,
        opacity: disabled ? 0.6 : 1,
        width: '100%',
      }}
    >
      {/* Letter badge / checkmark */}
      <span style={{
        width: S[5], height: S[5], minWidth: S[5],
        background: selected ? C.yellow : (hovered ? C.yellowLt : C.cream),
        border: `${BW.base} solid ${selected ? C.yellow : C.ink}`,
        borderRadius: R.sm,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS.sm,
        fontWeight: 800,
        color: C.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.12s ease',
      }}>
        {selected ? '✓' : letter}
      </span>
      {label}
    </button>
  )
}
