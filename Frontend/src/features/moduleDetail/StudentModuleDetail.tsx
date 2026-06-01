import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Panel } from '../../components/ui/Panel'
import { Topbar } from '../../components/ui/Topbar'
import { Bar } from '../../components/ui/Bar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { posodobiCas } from '../modules/moduleApi'
import { useAuth } from '../../context/AuthContext'
import '../../styles/moduleDetailPage.css'
import { getModuleContent, getModul, getVisualContent } from './moduleDetailApi'
import { getModuleCompletion, type ModuleCompletion } from '../quiz/quizStudentApi'

type Tab = 'visual' | 'reading' | 'auditory' | 'kinesthetic'

type GlossaryItem = {
  term: string
  definition: string
}

type ReadingData = {
  definition: string
  summary: string
  key_concepts: string[]
  structured_notes: string[]
  glossary: GlossaryItem[]
}

type AuditoryData = {
  audio_url?: string
  narration_script?: string
}

type Question = {
  question: string
  options: string[]
  correct_answer: string
}

type KinestheticData = {
  questions: Question[]
}

type ModuleContentItem = {
  ucniTip: string
  vsebina: ReadingData | AuditoryData | KinestheticData
}

type VisualContentItem = {
  id: string
  imeDatoteke: string
  url: string
  tip: 'IMG' | 'VIDEO'
}

function ContentUnavailable({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[8]} ${S[4]}`, textAlign: 'center' }}>
      <BitMascot size={64} mood="thinking" float />
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>
        {label} CONTENT NOT AVAILABLE FOR THIS MODULE
      </span>
    </div>
  )
}

const tabConfig = {
  visual:      { label: 'VISUAL',      color: C.purpleLt, bitMsg: '"Visual mode engaged. Diagrams incoming."' },
  reading:     { label: 'READING',     color: C.cyanLt,   bitMsg: '"Reading mode active. Loading notes."' },
  auditory:    { label: 'AUDITORY',    color: C.greenLt,  bitMsg: '"Audio mode online. Press play."' },
  kinesthetic: { label: 'KINESTHETIC', color: C.redLt,    bitMsg: '"Practice mode initiated. Let\'s go."' },
}

function VisualContent({ data }: Readonly<{ data: VisualContentItem[] }>) {
  const video = data.find(item => item.tip === 'VIDEO')
  const images = data.filter(item => item.tip === 'IMG')

  return (
    <div className="module-detail-content">

      {video && (
        <div className="module-detail-video">
          <video
            controls
            className="module-detail-video-player"
          >
            <source src={video.url} />
          </video>
        </div>
      )}

      <Panel
        title="VISUAL MATERIALS"
        accent={C.purpleLt}
        p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >

        <div className="module-detail-grid">

          {images.map(image => (
            <ComicBox
              key={image.id}
              bg={C.purpleLt}
              p={S[3]}
            >

              <img
                src={image.url}
                alt={image.imeDatoteke}
                style={{
                  width: '100%',
                  borderRadius: '8px'
                }}
              />

              <div className="module-detail-card-title">
                {image.imeDatoteke}
              </div>
            </ComicBox>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function ReadingContent({ data }: Readonly<{ data?: ReadingData }>) {

  if (!data) return null

  return (
    <div className="module-detail-content">

      <Panel title="DEFINITION" accent={C.cyan} bg={C.cyanLt} p={S[4]}>
        <p className="module-detail-definition">
          {data.definition}
        </p>
      </Panel>

      <Panel title="SUMMARY" accent={C.cyan} p={S[4]}>
        <p className="module-detail-definition">
          {data.summary}
        </p>
      </Panel>

      <Panel title="KEY CONCEPTS" accent={C.cyan} p={S[4]}>
        <div className="module-detail-notes">
          <ul className="module-detail-notes-list">
            {data.key_concepts?.map((concept: string) => (
              <li key={concept}>
                {concept.replace(/^[-•]\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="STRUCTURED NOTES" accent={C.cyan} p={S[4]}>
        <div className="module-detail-notes">
          <ul className="module-detail-notes-list">
            {data.structured_notes?.map((note: string) => (
              <li key={note}>
                {note.replace(/^[-•]\s*/, '')}
                </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="GLOSSARY" accent={C.cyan} p={S[4]}>
        <div className="module-detail-glossary">
          {data.glossary?.map((g: GlossaryItem) => (
            <div
              key={g.term}
              className="module-detail-glossary-row"
            >
              <span className="module-detail-glossary-term">
                {g.term}
              </span>

              <span className="module-detail-glossary-def">
                {g.definition}
              </span>
            </div>
          ))}
        </div>
      </Panel>

    </div>
  )
}

// const WAVEFORM_HEIGHTS = Array.from({ length: 60 }, () => Math.random() * 24 + 8)

function AuditoryContent({ data }: Readonly<{ data?: AuditoryData }>) {

  if (!data) return null

  return (
    <div className="module-detail-content">

      <Panel title="LECTURE" accent={C.green} bg={C.navy} p={S[5]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>

          <div className="module-detail-audio-title">
            FULL LECTURE
          </div>

          <div className="module-detail-audio-sub">
            AI Generated Audio
          </div>

          <audio
            controls
            style={{ width: '100%' }}
          >
            <source
              src={data.audio_url}
              type="audio/mpeg"
            />

            <track
            kind = "captions"
            src = ""
            srcLang = "en"
            label = "English captions"
            />
          </audio>

        </div>
      </Panel>

      {data.narration_script && (
        <Panel
          title="HIGHLIGHTS"
          accent={C.green}
          bg={C.greenLt}
          p={S[4]}
        >
          <div className="module-detail-highlights">

            {data.narration_script
              .split('. ')
              .slice(0, 8)
              .map((line: string, i: number) => (

                <div
                  key={`${line}-${i}`}
                  className="module-detail-highlight-row"
                >
                  <Tag
                    label={`#${i + 1}`}
                    bg={C.green}
                  />

                  <span className="module-detail-highlight-text">
                    {line}
                  </span>
                </div>

              ))}

          </div>
        </Panel>
      )}

    </div>
  )
}

type KineMode = 'select' | 'quiz' | 'cards' | 'match'

function correctOptionText(q: Question): string {
  const opt = q.options.find(o => o.charAt(0) === q.correct_answer)
    ?? q.options.find(o => o.startsWith(q.correct_answer + ')'))
    ?? q.options[0]
  return opt.replace(/^[A-D]\)\s*/, '')
}

function KineModePicker({ count, onSelect }: { count: number; onSelect: (m: 'quiz' | 'cards' | 'match') => void }) {
  const estMins = Math.max(1, Math.round(count * 0.5))
  const modes = [
    {
      id: 'quiz' as const,
      label: 'INTERACTIVE QUIZ',
      accent: C.red,
      bg: C.redLt,
      desc: 'Answer questions one at a time and get instant feedback — green for correct, red for wrong. See your final score at the end.',
      stats: [
        { label: 'QUESTIONS', value: String(count) },
        { label: 'EST. TIME',  value: `~${estMins} MIN` },
        { label: 'SCORING',    value: 'INSTANT' },
      ],
      tags: [{ label: 'FEEDBACK', bg: C.greenLt }, { label: 'SCORE', bg: C.cyanLt }, { label: 'TIMED', bg: C.purpleLt }],
    },
    {
      id: 'cards' as const,
      label: 'FLASHCARDS',
      accent: C.yellow,
      bg: C.yellowLt,
      desc: 'Flip through cards at your own pace. Mark what you know and send the rest back into the deck until every card is mastered.',
      stats: [
        { label: 'CARDS',     value: String(count) },
        { label: 'EST. TIME', value: `~${Math.max(2, count)} MIN` },
        { label: 'STYLE',     value: 'SELF-PACED' },
      ],
      tags: [{ label: 'FLIP', bg: C.cyanLt }, { label: 'REPEAT', bg: C.purpleLt }, { label: 'MASTERY', bg: C.greenLt }],
    },
    {
      id: 'match' as const,
      label: 'MATCHING',
      accent: C.purple,
      bg: C.purpleLt,
      desc: 'Connect each question to its correct answer. Two shuffled columns — click one from each side to form a pair.',
      stats: [
        { label: 'PAIRS',     value: String(count) },
        { label: 'EST. TIME', value: `~${Math.max(2, Math.round(count * 0.75))} MIN` },
        { label: 'STYLE',     value: 'SPATIAL' },
      ],
      tags: [{ label: 'PAIRS', bg: C.cyanLt }, { label: 'SPATIAL', bg: C.yellowLt }, { label: 'RECALL', bg: C.greenLt }],
    },
  ]
  return (
    <div className="module-detail-content">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3] }}>
        {modes.map(m => (
          <div key={m.id} style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column' }}>
            <Panel
              title={m.label}
              accent={m.accent}
              bg={m.bg}
              p={S[4]}
              action={
                <div style={{ display: 'flex', gap: S[1.5] }}>
                  {m.tags.map(t => <Tag key={t.label} label={t.label} bg={t.bg} />)}
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], flex: 1 }}>

                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.muted, lineHeight: 1.6 }}>{m.desc}</div>

                {/* Stat row */}
                <div style={{ display: 'flex', gap: S[2] }}>
                  {m.stats.map(s => (
                    <div key={s.label} style={{ flex: 1, background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, padding: `${S[1.5]} ${S[2]}`, boxShadow: mkShadow() }}>
                      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted }}>{s.label}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink, fontWeight: 700, marginTop: S[0.5] }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <ComicBtn sm color={m.accent} onClick={() => onSelect(m.id)}>
                    GO
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </ComicBtn>
                </div>

              </div>
            </Panel>
          </div>
        ))}
      </div>
    </div>
  )
}

type KineOptionState = 'idle' | 'correct' | 'wrong'

function KineOptionButton({ letter, label, state, onClick, disabled }: {
  letter: string; label: string; state: KineOptionState; onClick: () => void; disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const bg          = state === 'correct' ? C.greenLt : state === 'wrong' ? C.redLt : hovered ? C.yellowLt : C.paper
  const border      = state === 'correct' ? C.green   : state === 'wrong' ? C.red   : hovered ? C.yellow   : C.ink
  const shadow      = state === 'correct' ? mkShadow('base', C.green) : state === 'wrong' ? mkShadow('base', C.red) : hovered ? mkShadow('lg', C.yellow) : mkShadow()
  const badgeBg     = state === 'correct' ? C.green   : state === 'wrong' ? C.red   : hovered ? C.yellow   : C.cream
  const icon        = state === 'correct' ? '✓' : state === 'wrong' ? '✗' : letter

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[3]} ${S[3.5]}`, background: bg, border: `${BW.base} solid ${border}`, boxShadow: shadow, fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, fontWeight: 600, textAlign: 'left', cursor: disabled ? 'default' : 'pointer', transform: hovered && !disabled && state === 'idle' ? 'translate(-0.125rem,-0.125rem)' : 'none', transition: 'all 0.12s ease', borderRadius: R.base, color: C.ink, lineHeight: 1.5, width: '100%' }}
    >
      <span style={{ width: S[5], height: S[5], minWidth: S[5], background: badgeBg, border: `${BW.base} solid ${border}`, borderRadius: R.sm, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.12s ease' }}>
        {icon}
      </span>
      {label}
    </button>
  )
}

function QuizMode({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [done, setDone] = useState(false)
  const [visible, setVisible] = useState(true)

  const q = questions[idx]
  const score = answers.filter((a, i) => a === questions[i].correct_answer).length

  const transition = (fn: () => void) => {
    setVisible(false)
    setTimeout(() => { fn(); setVisible(true) }, 180)
  }

  const handleSelect = (letter: string) => {
    if (selected !== null) return
    setSelected(letter)
    setAnswers(prev => [...prev, letter])
  }

  const handleNext = () => {
    if (idx < questions.length - 1) {
      transition(() => { setIdx(i => i + 1); setSelected(null) })
    } else {
      transition(() => setDone(true))
    }
  }

  const reset = () => { setIdx(0); setSelected(null); setAnswers([]); setDone(false) }

  const getState = (option: string): KineOptionState => {
    const letter = option.charAt(0)
    if (selected === null) return 'idle'
    if (letter === q.correct_answer) return 'correct'
    if (letter === selected) return 'wrong'
    return 'idle'
  }

  const feedbackCorrect = selected === q?.correct_answer
  const feedbackBg     = feedbackCorrect ? C.greenLt : C.redLt
  const feedbackAccent = feedbackCorrect ? C.green   : C.red
  const feedbackLabel  = feedbackCorrect ? 'CORRECT' : 'WRONG'

  const pct    = done ? Math.round((score / questions.length) * 100) : 0
  const passed = pct >= 60
  const col    = pct >= 80 ? C.green : pct >= 60 ? C.yellow : C.red
  const msg    = pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good effort — review the ones you missed.' : 'Keep practising — you\'ve got this!'

  return (
    <div className="module-detail-content">
      <Panel
        title="INTERACTIVE QUIZ"
        accent={C.red}
        p={S[4]}
        action={
          <ComicBtn sm color={C.paper} onClick={onBack}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            BACK
          </ComicBtn>
        }
      >
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.18s ease', display: 'flex', flexDirection: 'column', gap: S[4] }}>

          {done ? (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[4] }}>
                <BitMascot size={80} mood={passed ? 'happy' : 'thinking'} float />
                <SpeechBubble color={passed ? C.green : C.orange} style={{ marginBottom: S[3], flex: 1 }}>
                  <div style={{ fontSize: FS.md, fontWeight: 800 }}>{passed ? 'Great work!' : 'Keep practising!'}</div>
                  <div style={{ fontSize: FS.base, color: C.navy, marginTop: S[1] }}>{msg}</div>
                </SpeechBubble>
              </div>
              <ComicBox bg={C.paper} p={S[5]}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
                  <Tag label={passed ? 'PASSED' : 'NEEDS WORK'} bg={passed ? C.greenLt : C.redLt} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['4xl'], color: col }}>{pct}%</span>
                </div>
                <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.muted, fontWeight: 600, marginBottom: S[3] }}>
                  {score} / {questions.length} correct
                </div>
                <Bar value={pct} max={100} color={col} height={12} shadow />
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[4] }}>
                  {questions.map((question, i) => {
                    const correct = answers[i] === question.correct_answer
                    return (
                      <div key={question.question} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}`, background: correct ? C.greenLt : C.redLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                        <Tag label={`Q${i + 1}`} bg={correct ? C.green : C.red} />
                        <span style={{ flex: 1, fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink }}>{question.question}</span>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>{correct ? '✓' : '✗'}</span>
                      </div>
                    )
                  })}
                </div>
              </ComicBox>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ComicBtn color={C.yellow} onClick={reset}>TRY AGAIN</ComicBtn>
              </div>
            </>
          ) : (
            <>
              {/* Progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag label={`Q${String(idx + 1).padStart(2, '0')} / ${questions.length}`} bg={C.redLt} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>
                    {Math.round((idx / questions.length) * 100)}% complete
                  </span>
                </div>
                <Bar value={idx} max={questions.length} color={C.red} shadow />
              </div>

              {/* Question */}
              <ComicBox bg={C.paper} p={S[5]}>
                <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], lineHeight: 1.35, color: C.ink, margin: 0, marginBottom: S[4] }}>
                  {q.question}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2.5] }}>
                  {q.options.map(opt => (
                    <KineOptionButton
                      key={opt}
                      letter={opt.charAt(0)}
                      label={opt.slice(opt.indexOf(')') + 1).trim() || opt}
                      state={getState(opt)}
                      onClick={() => handleSelect(opt.charAt(0))}
                      disabled={selected !== null}
                    />
                  ))}
                </div>
                {selected !== null && (
                  <div style={{ marginTop: S[4], padding: S[4], background: feedbackBg, border: `${BW.base} solid ${feedbackAccent}`, borderRadius: R.sm, boxShadow: mkShadow('base', feedbackAccent) }}>
                    <Tag label={feedbackLabel} bg={feedbackBg} />
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.sm, color: C.ink, lineHeight: 1.6, marginTop: S[2], marginBottom: 0 }}>
                      Correct answer: {correctOptionText(q)}
                    </p>
                  </div>
                )}
              </ComicBox>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {selected === null
                  ? <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.muted, fontWeight: 600 }}>Select one answer</span>
                  : (
                    <ComicBtn color={C.yellow} onClick={handleNext}>
                      {idx < questions.length - 1 ? 'NEXT' : 'SEE RESULTS'}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </ComicBtn>
                  )
                }
              </div>
            </>
          )}

        </div>
      </Panel>
    </div>
  )
}

function FlashCard({ index, question, isFlipped, isMastered, isAnimating, onFlip, onToggleMastered }: {
  index: number; question: Question; isFlipped: boolean; isMastered: boolean; isAnimating: boolean
  onFlip: () => void; onToggleMastered: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const bg = isMastered ? C.greenLt : isFlipped ? C.yellowLt : hovered ? C.cyanLt : C.cream
  return (
    <div
      style={{ flex: '1 1 220px', cursor: isFlipped ? 'default' : 'pointer' }}
      onClick={isFlipped ? undefined : onFlip}
      onMouseEnter={() => !isFlipped && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ComicBox
        bg={bg}
        p={S[4]}
        style={{
          minHeight: '180px',
          display: 'flex', flexDirection: 'column', gap: S[2],
          cursor: isFlipped ? 'default' : 'pointer',
          transform: isAnimating ? 'scaleX(0.05)' : hovered ? 'translate(-1px,-1px)' : 'scaleX(1)',
          transition: 'transform 0.15s ease, background 0.1s ease',
        }}
      >
        {!isFlipped ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag label={`Q${index + 1}`} bg={C.redLt} />
              {isMastered && <Tag label="✓" bg={C.green} />}
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, lineHeight: 1.5, flex: 1 }}>{question.question}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>TAP TO REVEAL ANSWER</div>
          </>
        ) : (
          <>
            <Tag label="ANSWER" bg={C.greenLt} />
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, lineHeight: 1.4, flex: 1 }}>{correctOptionText(question)}</div>
            <div style={{ display: 'flex', gap: S[2], marginTop: 'auto' }}>
              <ComicBtn sm color={C.green} onClick={onToggleMastered}>
                {isMastered ? '✓ MASTERED' : 'GOT IT'}
              </ComicBtn>
              <ComicBtn sm color={C.red} onClick={onFlip}>↩ FLIP</ComicBtn>
            </div>
          </>
        )}
      </ComicBox>
    </div>
  )
}

function FlashcardMode({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const total = questions.length
  const [flipped, setFlipped]   = useState<Set<number>>(new Set())
  const [mastered, setMastered] = useState<Set<number>>(new Set())
  const [animating, setAnimating] = useState<Set<number>>(new Set())

  const flip = (i: number) => {
    if (animating.has(i)) return
    setAnimating(prev => new Set(prev).add(i))
    setTimeout(() => {
      setFlipped(prev => {
        const next = new Set(prev)
        if (next.has(i)) next.delete(i); else next.add(i)
        return next
      })
      setAnimating(prev => { const next = new Set(prev); next.delete(i); return next })
    }, 150)
  }

  const toggleMastered = (i: number) => {
    setMastered(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
  }

  const reset = () => { setFlipped(new Set()); setMastered(new Set()) }

  const masteredCount = mastered.size
  const allDone = masteredCount === total

  return (
    <div className="module-detail-content">
      <Panel
        title="FLASHCARDS"
        accent={C.yellow}
        p={S[4]}
        action={
          <ComicBtn sm color={C.paper} onClick={onBack}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            BACK
          </ComicBtn>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

          {/* Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: S[1.5] }}>
                <Tag label={`${masteredCount} MASTERED`} bg={C.greenLt} />
                <Tag label={`${total - masteredCount} LEFT`} bg={C.yellowLt} />
              </div>
              {masteredCount > 0 && <ComicBtn sm color={C.red} onClick={reset}>RESET</ComicBtn>}
            </div>
            <Bar value={masteredCount} max={total} color={C.green} shadow />
          </div>

          {/* All mastered banner */}
          {allDone && (
            <ComicBox bg={C.greenLt} p={S[4]}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                <BitMascot size={48} mood="happy" float />
                <div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.lg, color: C.green }}>ALL MASTERED!</div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>You've got all {total} cards down. Reset to review again.</div>
                </div>
              </div>
            </ComicBox>
          )}

          {/* Card grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3] }}>
            {questions.map((q, i) => (
              <FlashCard
                key={i}
                index={i}
                question={q}
                isFlipped={flipped.has(i)}
                isMastered={mastered.has(i)}
                isAnimating={animating.has(i)}
                onFlip={() => flip(i)}
                onToggleMastered={() => toggleMastered(i)}
              />
            ))}
          </div>

        </div>
      </Panel>
    </div>
  )
}

type MatchState = 'idle' | 'selected' | 'matched' | 'wrong'

function MatchItem({ text, state, onClick }: { text: string; state: MatchState; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const disabled = state === 'matched'
  const bg     = state === 'matched' ? C.greenLt : state === 'wrong' ? C.redLt : state === 'selected' ? C.yellowLt : hovered ? C.cyanLt : C.paper
  const border = state === 'matched' ? C.green   : state === 'wrong' ? C.red   : state === 'selected' ? C.yellow   : hovered ? C.cyan   : C.ink
  const shadow = state === 'matched' ? mkShadow('base', C.green) : state === 'wrong' ? mkShadow('base', C.red) : state === 'selected' ? mkShadow('lg', C.yellow) : hovered ? mkShadow('lg') : mkShadow()
  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '100%', padding: `${S[3]} ${S[3.5]}`, background: bg, border: `${BW.base} solid ${border}`, borderRadius: R.base, boxShadow: shadow, cursor: disabled ? 'default' : 'pointer', fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, fontWeight: 600, color: C.ink, lineHeight: 1.4, transition: 'all 0.12s ease', transform: hovered && !disabled && state === 'idle' ? 'translate(-1px,-1px)' : 'none', userSelect: 'none', boxSizing: 'border-box' }}
    >
      {state === 'matched' && <span style={{ marginRight: S[1.5] }}>✓</span>}
      {text}
    </div>
  )
}

function MatchingMode({ questions, onBack }: { questions: Question[]; onBack: () => void }) {
  const total = questions.length
  const [leftItems]  = useState(() => [...questions.map((q, i) => ({ idx: i, text: q.question }))].sort(() => Math.random() - 0.5))
  const [rightItems] = useState(() => [...questions.map((q, i) => ({ idx: i, text: correctOptionText(q) }))].sort(() => Math.random() - 0.5))

  const [leftSel,  setLeftSel]  = useState<number | null>(null)
  const [rightSel, setRightSel] = useState<number | null>(null)
  const [matched,  setMatched]  = useState<Set<number>>(new Set())
  const [wrong,    setWrong]    = useState<{ left: number; right: number } | null>(null)

  const matchedCount = matched.size
  const allDone      = matchedCount === total

  const check = (lPos: number, rPos: number) => {
    if (leftItems[lPos].idx === rightItems[rPos].idx) {
      const next = new Set(matched).add(leftItems[lPos].idx)
      setMatched(next)
      setLeftSel(null)
      setRightSel(null)
    } else {
      setWrong({ left: lPos, right: rPos })
      setTimeout(() => { setWrong(null); setLeftSel(null); setRightSel(null) }, 600)
    }
  }

  const handleLeft = (pos: number) => {
    if (wrong || matched.has(leftItems[pos].idx)) return
    const next = pos === leftSel ? null : pos
    setLeftSel(next)
    if (next !== null && rightSel !== null) check(next, rightSel)
  }

  const handleRight = (pos: number) => {
    if (wrong || matched.has(rightItems[pos].idx)) return
    const next = pos === rightSel ? null : pos
    setRightSel(next)
    if (next !== null && leftSel !== null) check(leftSel, next)
  }

  const reset = () => { setMatched(new Set()); setLeftSel(null); setRightSel(null); setWrong(null) }

  const getLeftState  = (pos: number): MatchState => matched.has(leftItems[pos].idx)  ? 'matched' : wrong?.left  === pos ? 'wrong' : leftSel  === pos ? 'selected' : 'idle'
  const getRightState = (pos: number): MatchState => matched.has(rightItems[pos].idx) ? 'matched' : wrong?.right === pos ? 'wrong' : rightSel === pos ? 'selected' : 'idle'

  return (
    <div className="module-detail-content">
      <Panel
        title="MATCHING"
        accent={C.purple}
        p={S[4]}
        action={
          <ComicBtn sm color={C.paper} onClick={onBack}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            BACK
          </ComicBtn>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

          {/* Progress */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: S[1.5] }}>
                <Tag label={`${matchedCount} MATCHED`} bg={C.greenLt} />
                <Tag label={`${total - matchedCount} LEFT`} bg={C.purpleLt} />
              </div>
              {matchedCount > 0 && <ComicBtn sm color={C.red} onClick={reset}>RESET</ComicBtn>}
            </div>
            <Bar value={matchedCount} max={total} color={C.purple} shadow />
          </div>

          {/* All done banner */}
          {allDone && (
            <ComicBox bg={C.greenLt} p={S[4]}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                <BitMascot size={48} mood="happy" float />
                <div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.lg, color: C.green }}>ALL MATCHED!</div>
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>You paired all {total} correctly. Reset to try again.</div>
                </div>
              </div>
            </ComicBox>
          )}

          {/* Hint */}
          {!allDone && leftSel === null && rightSel === null && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted, textAlign: 'center' }}>
              SELECT A QUESTION, THEN ITS MATCHING ANSWER
            </div>
          )}

          {/* Header row */}
          <div style={{ display: 'flex', gap: S[3] }}>
            <div style={{ flex: 1, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1 }}>QUESTIONS</div>
            <div style={{ flex: 1, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1 }}>ANSWERS</div>
          </div>

          {/* Item rows — aligned by index */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {leftItems.map((lItem, pos) => (
              <div key={pos} style={{ display: 'flex', gap: S[3], alignItems: 'stretch' }}>
                <div style={{ flex: 1 }}>
                  <MatchItem text={lItem.text} state={getLeftState(pos)} onClick={() => handleLeft(pos)} />
                </div>
                <div style={{ flex: 1 }}>
                  <MatchItem text={rightItems[pos].text} state={getRightState(pos)} onClick={() => handleRight(pos)} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </Panel>
    </div>
  )
}

function KinestheticContent({ data }: Readonly<{ data?: KinestheticData }>) {
  const [mode, setMode] = useState<KineMode>('select')
  if (!data || !data.questions?.length) return null
  if (mode === 'quiz')  return <QuizMode       questions={data.questions} onBack={() => setMode('select')} />
  if (mode === 'cards') return <FlashcardMode  questions={data.questions} onBack={() => setMode('select')} />
  if (mode === 'match') return <MatchingMode   questions={data.questions} onBack={() => setMode('select')} />
  return <KineModePicker count={data.questions.length} onSelect={setMode} />
}


export function StudentModuleDetail() {
  const navigate = useNavigate()
  const { id: modulId } = useParams<{ id: string }>()
  const { session } = useAuth()
  
  const [activeTab, setActiveTab] = useState<Tab>('visual')
  const tab = tabConfig[activeTab]
  const casRef = useRef(0)
  
  const [modulNaziv, setModulNaziv] = useState<string>('')
  const [completion, setCompletion] = useState<ModuleCompletion | null>(null)
  const [moduleContent, setModuleContent] = useState<ModuleContentItem[]>([])
  const [visualContent, setVisualContent] = useState<VisualContentItem[]>([])
  const [contentLoaded, setContentLoaded] = useState(false)

  // READING
  const readingContent = moduleContent.find(
    item => item.ucniTip === 'reading'
  )
  const readingData = readingContent?.vsebina as ReadingData | undefined

  // AUDITORY
  const auditoryAudio = moduleContent.find(
    item =>
      item.ucniTip === 'auditory' &&
      (item.vsebina as AuditoryData).audio_url
  )
  const auditoryScript = moduleContent.find(
    item =>
      item.ucniTip === 'auditory' &&
      (item.vsebina as AuditoryData).narration_script
  )
  const auditoryData: AuditoryData | undefined = (auditoryAudio || auditoryScript)
    ? {
        audio_url: (auditoryAudio?.vsebina as AuditoryData | undefined)?.audio_url,
        narration_script: (auditoryScript?.vsebina as AuditoryData | undefined)?.narration_script,
      }
    : undefined

  // KINESTHETIC
  const kinestheticContent = moduleContent.find(
    item =>
      item.ucniTip === 'kinesthetic'
  )
  const kinestheticData = kinestheticContent?.vsebina as KinestheticData | undefined

  useEffect(() => {
    if (!session?.access_token || !modulId) return

    const tick = setInterval(() => {
      casRef.current += 1
    }, 1000)

    const sync = setInterval(async () => {
      if (casRef.current > 0) {
        await posodobiCas(session.access_token, modulId, casRef.current)
        casRef.current = 0
      }
    }, 30000)

    return () => {
      clearInterval(tick)
      clearInterval(sync)
      if (casRef.current > 0 && session?.access_token && modulId) {
        posodobiCas(session.access_token, modulId, casRef.current)
      }
    }
  }, [session, modulId])

  useEffect(() => {
    if (!modulId) {
      return
    }

    const fetchContent = async () => {
      try {
        const data = await getModuleContent(modulId)
        setModuleContent(data)
      } catch (err) {
        console.error(err)
      } finally {
        setContentLoaded(true)
      }
    }
    fetchContent()
    getModul(modulId).then((m: { naziv: string }) => setModulNaziv(m.naziv)).catch(() => {})
  }, [modulId])

  useEffect(() => {
    if (!session?.access_token || !modulId) return
    getModuleCompletion(session.access_token)
      .then(data => setCompletion(data[modulId] ?? null))
      .catch(() => {})
  }, [session, modulId])

  useEffect(() => {
      if (!modulId) {
        return
      }
  
      const fetchVisaulContent = async () => {
        try {
          const data = await getVisualContent(modulId)
          setVisualContent(data)
        } catch(err) {
          console.error(err)
        }
      }
      fetchVisaulContent()
    }, [modulId])

  const contentMap = {
    visual:      contentLoaded && visualContent.length === 0
                   ? <ContentUnavailable label="VISUAL" />
                   : <VisualContent data={visualContent} />,
    reading:     contentLoaded && !readingData
                   ? <ContentUnavailable label="READING" />
                   : <ReadingContent data={readingData} />,
    auditory:    contentLoaded && !auditoryData
                   ? <ContentUnavailable label="AUDITORY" />
                   : <AuditoryContent data={auditoryData} />,
    kinesthetic: contentLoaded && !kinestheticData
                   ? <ContentUnavailable label="KINESTHETIC" />
                   : <KinestheticContent data={kinestheticData} />,
  }

  return (
    <div className="module-detail-page">
      <Topbar
        title={modulNaziv || '…'}
        subtitle={completion ? `${completion.completed} / ${completion.total} quizzes completed` : 'Loading…'}
        back={() => navigate(-1)}
        actions={<ComicBtn sm color={C.cyan}>QUIZ ME →</ComicBtn>}
      />

      <div className="module-detail-tabbar">
        <div className="module-detail-tabs">
          <span className="module-detail-view-as">VIEW AS:</span>
          {(Object.keys(tabConfig) as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`module-detail-tab ${activeTab === t ? 'active' : ''}`}
              style={activeTab === t ? { background: tabConfig[t].color } : {}}
            >
              {tabConfig[t].label}
            </button>
          ))}
        </div>
        <div className="module-detail-tabbar-right">
          {completion && <Tag label={`${completion.completed}/${completion.total} QUIZZES`} bg={C.greenLt} />}
        </div>
      </div>

      <div className="module-detail-bit-row">
        <BitMascot size={50} mood="happy" />
        <SpeechBubble color={tab.color} side="left">
          <span className="module-detail-bit-text">{tab.bitMsg}</span>
        </SpeechBubble>
      </div>

      {contentMap[activeTab]}
    </div>
  )
}