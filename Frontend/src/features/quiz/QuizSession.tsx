import { useState, useEffect, useRef } from 'react'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useAuth } from '../../context/AuthContext'
import { getVprasanjaZaKviz, shraniRezultat } from './quizStudentApi'

type SessionStep = 'intro' | 'loading' | 'question' | 'feedback' | 'result'

interface BackendQuiz {
  id: string
  naziv: string
  status: string
  casIzvajanja: number
  predmetId: string
}

interface BackendVprasanje {
  id: string
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
}

interface QuizSessionProps {
  quiz: BackendQuiz
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
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.sm, color: pct <= 20 ? C.red : C.ink, minWidth: 36, textAlign: 'right', fontWeight: 700 }}>
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

  const bg = state === 'correct' ? C.greenLt : state === 'wrong' ? C.redLt : (state === 'selected' || hovered) ? C.yellowLt : C.paper
  const border = state === 'correct' ? C.green : state === 'wrong' ? C.red : state === 'selected' ? C.yellow : C.ink
  const shadow = state === 'correct' ? mkShadow('base', C.green) : state === 'wrong' ? mkShadow('base', C.red) : state === 'selected' ? mkShadow('lg', C.yellow) : hovered ? mkShadow('lg') : mkShadow()
  const badgeBg = state === 'correct' ? C.green : state === 'wrong' ? C.red : state === 'selected' ? C.yellow : hovered ? C.yellowLt : C.cream
  const icon = state === 'correct' ? '✓' : state === 'wrong' ? '✗' : state === 'selected' ? '✓' : letter

  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[3]} ${S[3.5]}`, background: bg, border: `${BW.base} solid ${border}`, boxShadow: shadow, fontSize: FS.md, fontWeight: 600, fontFamily: "'Space Mono', monospace", textAlign: 'left', cursor: disabled ? 'default' : 'pointer', transform: hovered && !disabled && state === 'idle' ? 'translate(-0.125rem, -0.125rem)' : 'none', transition: 'all 0.12s ease', borderRadius: R.base, color: C.ink, lineHeight: 1.5, width: '100%' }}
    >
      <span style={{ width: S[5], height: S[5], minWidth: S[5], background: badgeBg, border: `${BW.base} solid ${border}`, borderRadius: R.sm, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, fontWeight: 800, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.12s ease' }}>
        {icon}
      </span>
      {label}
    </button>
  )
}

export function QuizSession({ quiz, onClose }: QuizSessionProps) {
  const { session } = useAuth()
  const [step, setStep] = useState<SessionStep>('intro')
  const [vprasanja, setVprasanja] = useState<BackendVprasanje[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [visible, setVisible] = useState(true)

  // Skupni čas za cel kviz
  const totalLimitS = (quiz.casIzvajanja ?? 10) * 60
  const [timeLeft, setTimeLeft] = useState(totalLimitS)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeLeftRef = useRef(totalLimitS)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!session?.access_token) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep('loading')
    getVprasanjaZaKviz(session.access_token, quiz.id).then(data => {
      setVprasanja(data)
      setStep('intro')
    })
  }, [quiz.id, session])

  // En skupni timer za cel kviz — začne ob prvem vprašanju
  useEffect(() => {
    if (step === 'question' && timeLeftRef.current === totalLimitS) {
      // Začni timer samo enkrat
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        timeLeftRef.current -= 1
        setTimeLeft(timeLeftRef.current)
        if (timeLeftRef.current <= 0) {
          clearInterval(timerRef.current!)
          setSelectedOption(-1)
          setAnswers(prev => [...prev, -1])
          setStep('feedback')
        }
      }, 1000)
    }

    if (step === 'result' || step === 'intro' || step === 'loading') {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (step === 'result') {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [step, totalLimitS])

  const transition = (fn: () => void) => {
    setVisible(false)
    setTimeout(() => { fn(); setVisible(true) }, 200)
  }

  const q = vprasanja[questionIndex]
  const isLast = questionIndex === vprasanja.length - 1
  const score = answers.filter((a, i) => a === vprasanja[i]?.indeksPravilnegaOdgovora).length
  const finalScore = vprasanja.length > 0 ? Math.round((score / vprasanja.length) * 100) : 0
  const passed = finalScore >= 50

  const handleSelect = (idx: number) => {
    if (selectedOption !== null || step !== 'question') return
    setSelectedOption(idx)
    setAnswers(prev => [...prev, idx])
    setStep('feedback')
    // Ne ustavljamo timerja — teče ves kviz
  }

  const handleNext = () => {
    if (isLast) {
      if (timerRef.current) clearInterval(timerRef.current)
      const casResevanja = totalLimitS - timeLeftRef.current
      setTotalTimeSpent(casResevanja)
      if (session?.access_token) {
        shraniRezultat(session.access_token, quiz.id, {
          odgovori: answers,
          casResevanjaS: casResevanja
        }).catch(e => console.error('Save result failed:', e))
      }
      transition(() => setStep('result'))
    } else {
      transition(() => {
        setQuestionIndex(i => i + 1)
        setSelectedOption(null)
        setStep('question')
      })
    }
  }

  const getOptionState = (idx: number): OptionButtonProps['state'] => {
    if (!q) return 'idle'
    if (step !== 'feedback') return selectedOption === idx ? 'selected' : 'idle'
    if (idx === q.indeksPravilnegaOdgovora) return 'correct'
    if (idx === selectedOption) return 'wrong'
    return 'idle'
  }

  const feedbackCorrect = q && selectedOption === q.indeksPravilnegaOdgovora
  const feedbackBg = feedbackCorrect ? C.greenLt : selectedOption === -1 ? C.orangeLt : C.redLt
  const feedbackLabel = feedbackCorrect ? 'CORRECT' : selectedOption === -1 ? "TIME'S UP" : 'WRONG'
  const feedbackAccent = feedbackCorrect ? C.green : selectedOption === -1 ? C.orange : C.red

  return (
    <div className="dashboard-main">
      <Topbar
        title={quiz.naziv.toUpperCase()}
        subtitle={`${quiz.casIzvajanja ?? '?'} min · ${vprasanja.length} questions`}
        back={onClose}
        actions={
          (step === 'question' || step === 'feedback')
            ? <Tag label={`${String(questionIndex + 1).padStart(2, '0')} / ${vprasanja.length}`} bg={C.yellowLt} />
            : undefined
        }
      />

      <div style={{ maxWidth: '38rem', margin: '0 auto', width: '100%', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : `translateY(${S[3]})`, transition: 'opacity 0.2s ease, transform 0.2s ease' }}>

        {step === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[4], padding: `${S[8]} 0` }}>
            <BitMascot size={80} mood="thinking" float />
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>LOADING QUESTIONS...</div>
          </div>
        )}

        {step === 'intro' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[4] }}>
              <BitMascot size={90} mood="happy" float />
              <SpeechBubble color={C.cyan} style={{ marginBottom: S[3], flex: 1 }}>
                <div style={{ fontSize: FS.md, fontWeight: 800 }}>{vprasanja.length} questions!</div>
                <div style={{ fontSize: FS.base, color: C.navy, marginTop: S[1] }}>One correct answer each.</div>
              </SpeechBubble>
            </div>
            <ComicBox bg={C.paper} p={S[5]}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[4] }}>
                <Tag label={`${vprasanja.length} QUESTIONS`} bg={C.yellowLt} />
                <Tag label={`${quiz.casIzvajanja ?? '?'} MIN LIMIT`} bg={C.cyanLt} />
                <Tag label="PASS AT 50%" bg={C.greenLt} />
              </div>
              <p style={{ fontSize: FS.lg, color: C.muted, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                You have <strong style={{ color: C.ink, fontFamily: "'Archivo Black', sans-serif" }}>
                  {quiz.casIzvajanja ?? '?'} minutes
                </strong> to complete this quiz. Select the single best answer for each question.
              </p>
            </ComicBox>
            <div style={{ display: 'flex', gap: S[3] }}>
              <ComicBtn color={C.paper} hoverColor={C.yellowLt} onClick={onClose}>BACK</ComicBtn>
              <ComicBtn color={C.red} dark onClick={() => {
                // Reset za svež začetek
                timeLeftRef.current = totalLimitS
                setTimeLeft(totalLimitS)
                transition(() => setStep('question'))
              }}>
                START QUIZ
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ComicBtn>
            </div>
          </div>
        )}

        {(step === 'question' || step === 'feedback') && q && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>
                <span>Q{String(questionIndex + 1).padStart(2, '0')} / {vprasanja.length}</span>
                <span>{Math.round((questionIndex / vprasanja.length) * 100)}% complete</span>
              </div>
              <Bar value={questionIndex} max={vprasanja.length} />
              <TimerBar seconds={timeLeft} total={totalLimitS} />
            </div>
            <ComicBox bg={C.paper} p={S[5]}>
              <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['3xl'], lineHeight: 1.3, letterSpacing: '-0.02em', color: C.ink, marginBottom: S[4] }}>
                {q.besediloVprasanja}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2.5] }}>
                {q.moznosti.map((opt, i) => (
                  <OptionButton key={i} letter={String.fromCharCode(65 + i)} label={opt} state={getOptionState(i)} onClick={() => handleSelect(i)} disabled={step === 'feedback'} />
                ))}
              </div>
              {step === 'feedback' && (
                <div style={{ marginTop: S[4], padding: S[4], background: feedbackBg, border: `${BW.base} solid ${feedbackAccent}`, borderRadius: R.sm, boxShadow: mkShadow('base', feedbackAccent) }}>
                  <Tag label={feedbackLabel} bg={feedbackBg} />
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.sm, color: C.ink, lineHeight: 1.6, marginTop: S[2], marginBottom: 0 }}>
                    {q.razlaga}
                  </p>
                </div>
              )}
            </ComicBox>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {step === 'question' && <span style={{ fontSize: FS.base, color: C.muted, fontWeight: 600 }}>Select one answer</span>}
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

        {step === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[4] }}>
              <BitMascot size={90} mood={passed ? 'happy' : 'thinking'} float />
              <SpeechBubble color={passed ? C.green : C.orange} style={{ marginBottom: S[3], flex: 1 }}>
                <div style={{ fontSize: FS.md, fontWeight: 800 }}>{passed ? 'Great work!' : 'Keep practising!'}</div>
                <div style={{ fontSize: FS.base, color: C.navy, marginTop: S[1] }}>{passed ? 'Quiz passed.' : 'Review the material and retry.'}</div>
              </SpeechBubble>
            </div>
            <ComicBox bg={C.paper} p={S[5]}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
                <Tag label={passed ? 'PASSED' : 'FAILED'} bg={passed ? C.greenLt : C.redLt} />
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['4xl'], color: passed ? C.green : C.red }}>{finalScore}%</span>
              </div>
              <div style={{ fontSize: FS.lg, color: C.muted, fontWeight: 600, marginBottom: S[3] }}>
                {score} / {vprasanja.length} correct · {Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s
              </div>
              <Bar value={finalScore} color={passed ? C.green : C.red} height={12} shadow />
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[4] }}>
                {vprasanja.map((question, i) => {
                  const correct = answers[i] === question.indeksPravilnegaOdgovora
                  return (
                    <div key={question.id} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}`, background: correct ? C.greenLt : C.redLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                      <Tag label={`Q${i + 1}`} bg={correct ? C.green : C.red} />
                      <span style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink }}>{question.besediloVprasanja}</span>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>{correct ? '✓' : '✗'}</span>
                    </div>
                  )
                })}
              </div>
            </ComicBox>
            <div style={{ display: 'flex', gap: S[3] }}>
              <ComicBtn color={C.yellow} onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current)
                timeLeftRef.current = totalLimitS
                setTimeLeft(totalLimitS)
                setStep('intro')
                setQuestionIndex(0)
                setSelectedOption(null)
                setAnswers([])
              }}>
                RETRY
              </ComicBtn>
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