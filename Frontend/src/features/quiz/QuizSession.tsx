import { useState, useEffect, useRef } from 'react'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { QUIZ_QUESTIONS, ACTIVE_QUIZ, type QuizQuestion } from './mockData'

type SessionStep = 'intro' | 'question' | 'feedback' | 'result'

interface QuizSessionProps {
  onClose: () => void
}

function TimerBar({ seconds, total }: { seconds: number; total: number }) {
  const pct = Math.round((seconds / total) * 100)
  const color = pct > 50 ? C.green : pct > 20 ? C.yellow : C.red
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
      <div style={{ flex: 1 }}>
        <Bar value={pct} color={color} height={8} shadow />
      </div>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: FS.sm,
        color: pct <= 20 ? C.red : C.ink, minWidth: 36, textAlign: 'right', fontWeight: 700,
      }}>
        {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
      </span>
    </div>
  )
}

interface OptionButtonProps {
  letter: string
  label: string
  state: 'idle' | 'selected' | 'correct' | 'wrong'
  onClick: () => void
  disabled?: boolean
}

function OptionButton({ letter, label, state, onClick, disabled }: OptionButtonProps) {
  const [hovered, setHovered] = useState(false)

  const bg =
    state === 'correct'  ? C.greenLt  :
    state === 'wrong'    ? C.redLt    :
    (state === 'selected' || hovered) ? C.yellowLt : C.paper

  const border =
    state === 'correct'  ? C.green  :
    state === 'wrong'    ? C.red    :
    state === 'selected' ? C.yellow : C.ink

  const shadow =
    state === 'correct'  ? mkShadow('base', C.green)  :
    state === 'wrong'    ? mkShadow('base', C.red)     :
    state === 'selected' ? mkShadow('lg',   C.yellow)  :
    hovered ? mkShadow('lg') : mkShadow()

  const badgeBg =
    state === 'correct'  ? C.green  :
    state === 'wrong'    ? C.red    :
    state === 'selected' ? C.yellow :
    hovered ? C.yellowLt : C.cream

  const icon =
    state === 'correct'  ? '✓' :
    state === 'wrong'    ? '✗' :
    state === 'selected' ? '✓' : letter

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: S[3],
        padding: `${S[3]} ${S[3.5]}`,
        background: bg,
        border: `${BW.base} solid ${border}`,
        boxShadow: shadow,
        fontSize: FS.md, fontWeight: 600,
        fontFamily: "'Space Mono', monospace",
        textAlign: 'left', cursor: disabled ? 'default' : 'pointer',
        transform: hovered && !disabled && state === 'idle' ? 'translate(-0.125rem, -0.125rem)' : 'none',
        transition: 'all 0.12s ease',
        borderRadius: R.base, color: C.ink, lineHeight: 1.5, width: '100%',
      }}
    >
      <span style={{
        width: S[5], height: S[5], minWidth: S[5],
        background: badgeBg, border: `${BW.base} solid ${border}`,
        borderRadius: R.sm, fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS.sm, fontWeight: 800, color: C.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.12s ease',
      }}>
        {icon}
      </span>
      {label}
    </button>
  )
}

export function QuizSession({ onClose }: QuizSessionProps) {
  const [step, setStep] = useState<SessionStep>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<{ selected: number; correct: number }[]>([])
  const [visible, setVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState(ACTIVE_QUIZ.timeLimit)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (step !== 'question') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, questionIndex])

  const transition = (fn: () => void) => {
    setVisible(false)
    setTimeout(() => { fn(); setVisible(true) }, 200)
  }

  const q: QuizQuestion = QUIZ_QUESTIONS[questionIndex]
  const isLast = questionIndex === QUIZ_QUESTIONS.length - 1
  const score = answers.filter(a => a.selected === a.correct).length
  const finalScore = Math.round((score / QUIZ_QUESTIONS.length) * 100)
  const passed = finalScore >= 60

  const handleSelect = (idx: number) => {
    if (selectedOption !== null || step !== 'question') return
    setSelectedOption(idx)
    setAnswers(prev => [...prev, { selected: idx, correct: q.correct }])
    if (timerRef.current) clearInterval(timerRef.current)
    setStep('feedback')
  }

  const handleTimeout = () => {
    setSelectedOption(-1)
    setAnswers(prev => [...prev, { selected: -1, correct: q.correct }])
    setStep('feedback')
  }

  const handleNext = () => {
    if (isLast) {
      transition(() => setStep('result'))
    } else {
      transition(() => {
        setQuestionIndex(i => i + 1)
        setSelectedOption(null)
        setTimeLeft(ACTIVE_QUIZ.timeLimit)
        setStep('question')
      })
    }
  }

  const getOptionState = (idx: number): OptionButtonProps['state'] => {
    if (step !== 'feedback') return selectedOption === idx ? 'selected' : 'idle'
    if (idx === q.correct) return 'correct'
    if (idx === selectedOption) return 'wrong'
    return 'idle'
  }

  const feedbackCorrect = selectedOption === q?.correct
  const feedbackBg = feedbackCorrect ? C.greenLt : selectedOption === -1 ? C.orangeLt : C.redLt
  const feedbackLabel = feedbackCorrect ? 'CORRECT' : selectedOption === -1 ? "TIME'S UP" : 'WRONG'
  const feedbackAccent = feedbackCorrect ? C.green : selectedOption === -1 ? C.orange : C.red

  return (
    <div className="dashboard-main">
      <Topbar
        title={ACTIVE_QUIZ.title.toUpperCase()}
        subtitle={ACTIVE_QUIZ.module}
        back={onClose}
        actions={
          (step === 'question' || step === 'feedback')
            ? <Tag label={`${String(questionIndex + 1).padStart(2, '0')} / ${QUIZ_QUESTIONS.length}`} bg={C.yellowLt} />
            : undefined
        }
      />

      <div style={{
        maxWidth: '38rem', margin: '0 auto', width: '100%',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${S[3]})`,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>

        {/* ── INTRO ── */}
        {step === 'intro' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[4] }}>
              <BitMascot size={90} mood="happy" float />
              <SpeechBubble color={C.cyan} style={{ marginBottom: S[3], flex: 1 }}>
                <div style={{ fontSize: FS.md, fontWeight: 800 }}>{QUIZ_QUESTIONS.length} questions!</div>
                <div style={{ fontSize: FS.base, color: C.navy, marginTop: S[1] }}>One correct answer each.</div>
              </SpeechBubble>
            </div>

            <ComicBox bg={C.paper} p={S[5]}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[4] }}>
                <Tag label={`${QUIZ_QUESTIONS.length} QUESTIONS`} bg={C.yellowLt} />
                <Tag label={`${Math.floor(ACTIVE_QUIZ.timeLimit / 60)} MIN LIMIT`} bg={C.cyanLt} />
                <Tag label="PASS AT 60%" bg={C.greenLt} />
              </div>
              <p style={{ fontSize: FS.lg, color: C.muted, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                You have <strong style={{ color: C.ink, fontFamily: "'Archivo Black', sans-serif" }}>
                  {Math.floor(ACTIVE_QUIZ.timeLimit / 60)} minutes
                </strong> to complete this quiz. Select the single best answer for each question.
              </p>
            </ComicBox>

            <div style={{ display: 'flex', gap: S[3] }}>
              <ComicBtn color={C.paper} hoverColor={C.yellowLt} onClick={onClose}>BACK</ComicBtn>
              <ComicBtn color={C.red} dark onClick={() => transition(() => setStep('question'))}>
                START QUIZ
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ComicBtn>
            </div>
          </div>
        )}

        {/* ── QUESTION / FEEDBACK ── */}
        {(step === 'question' || step === 'feedback') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>
                <span>Q{String(questionIndex + 1).padStart(2, '0')} / {QUIZ_QUESTIONS.length}</span>
                <span>{Math.round((questionIndex / QUIZ_QUESTIONS.length) * 100)}% complete</span>
              </div>
              <Bar value={questionIndex} max={QUIZ_QUESTIONS.length} />
              <TimerBar seconds={timeLeft} total={ACTIVE_QUIZ.timeLimit} />
            </div>

            <ComicBox bg={C.paper} p={S[5]}>
              <h2 style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS['3xl'], lineHeight: 1.3,
                letterSpacing: '-0.02em', color: C.ink, marginBottom: S[4],
              }}>
                {q.text}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2.5] }}>
                {q.options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    letter={String.fromCharCode(65 + i)}
                    label={opt}
                    state={getOptionState(i)}
                    onClick={() => handleSelect(i)}
                    disabled={step === 'feedback'}
                  />
                ))}
              </div>

              {/* Feedback block inside card */}
              {step === 'feedback' && (
                <div style={{
                  marginTop: S[4],
                  padding: S[4],
                  background: feedbackBg,
                  border: `${BW.base} solid ${feedbackAccent}`,
                  borderRadius: R.sm,
                  boxShadow: mkShadow('base', feedbackAccent),
                }}>
                  <Tag label={feedbackLabel} bg={feedbackBg} />
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: FS.sm, color: C.ink,
                    lineHeight: 1.6, marginTop: S[2], marginBottom: 0,
                  }}>
                    {q.explanation}
                  </p>
                </div>
              )}
            </ComicBox>

            <div style={{ display: 'flex', justifyContent: step === 'feedback' ? 'flex-end' : 'flex-end', alignItems: 'center' }}>
              {step === 'question' && (
                <span style={{ fontSize: FS.base, color: C.muted, fontWeight: 600 }}>Select one answer</span>
              )}
              {step === 'feedback' && (
                <ComicBtn color={C.yellow} onClick={handleNext}>
                  {isLast ? 'SEE RESULTS' : 'NEXT'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </ComicBtn>
              )}
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[4] }}>
              <BitMascot size={90} mood={passed ? 'happy' : 'thinking'} float />
              <SpeechBubble color={passed ? C.green : C.orange} style={{ marginBottom: S[3], flex: 1 }}>
                <div style={{ fontSize: FS.md, fontWeight: 800 }}>
                  {passed ? 'Great work!' : 'Keep practising!'}
                </div>
                <div style={{ fontSize: FS.base, color: C.navy, marginTop: S[1] }}>
                  {passed ? 'Quiz passed.' : 'Review the material and retry.'}
                </div>
              </SpeechBubble>
            </div>

            <ComicBox bg={C.paper} p={S[5]}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
                <Tag label={passed ? 'PASSED' : 'FAILED'} bg={passed ? C.greenLt : C.redLt} />
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['4xl'], color: passed ? C.green : C.red }}>
                  {finalScore}%
                </span>
              </div>
              <div style={{ fontSize: FS.lg, color: C.muted, fontWeight: 600, marginBottom: S[3] }}>
                {score} / {QUIZ_QUESTIONS.length} correct
              </div>
              <Bar value={finalScore} color={passed ? C.green : C.red} height={12} shadow />

              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[4] }}>
                {QUIZ_QUESTIONS.map((question, i) => {
                  const ans = answers[i]
                  const correct = ans?.selected === ans?.correct
                  return (
                    <div key={question.id} style={{
                      display: 'flex', alignItems: 'center', gap: S[2],
                      padding: `${S[2]} ${S[3]}`,
                      background: correct ? C.greenLt : C.redLt,
                      border: `${BW.base} solid ${C.ink}`,
                      borderRadius: R.sm, boxShadow: mkShadow(),
                    }}>
                      <Tag label={`Q${i + 1}`} bg={correct ? C.green : C.red} />
                      <span style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink }}>{question.text}</span>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>{correct ? '✓' : '✗'}</span>
                    </div>
                  )
                })}
              </div>
            </ComicBox>

            <div style={{ display: 'flex', gap: S[3] }}>
              {!passed && (
                <ComicBtn color={C.yellow} onClick={() => {
                  setStep('intro')
                  setQuestionIndex(0)
                  setSelectedOption(null)
                  setAnswers([])
                  setTimeLeft(ACTIVE_QUIZ.timeLimit)
                }}>
                  RETRY
                </ComicBtn>
              )}
              <ComicBtn color={passed ? C.green : C.paper} hoverColor={C.yellowLt} onClick={onClose}>
                {passed ? 'BACK TO QUIZZES' : 'BACK'}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ComicBtn>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
