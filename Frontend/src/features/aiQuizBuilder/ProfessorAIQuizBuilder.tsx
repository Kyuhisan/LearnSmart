import { useState, useRef, useEffect } from 'react'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import {
  AI_QUIZ_DRAFT,
  AI_QUIZ_MODULE_OPTIONS,
  AI_DIFFICULTY_OPTIONS,
  type AIDifficulty,
  type GeneratedQuestion,
} from './mockData'

type QuestionState = GeneratedQuestion & { approved: boolean | null }

function QuestionCard({
  q,
  index,
  onApprove,
  onReject,
}: {
  q: QuestionState
  index: number
  onApprove: () => void
  onReject: () => void
}) {
  const approved = q.approved === true
  const rejected = q.approved === false
  const bg = approved ? C.greenLt : rejected ? C.redLt : C.paper
  const isMobile = useBreakpoint() === 'mobile'

  return (
    <div style={{ background: bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, borderBottom: `${BW.base} solid ${C.ink}`, background: approved ? C.green : rejected ? C.red : C.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <Tag label={`Q${index + 1}`} bg={C.mutedLt} />
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: approved || rejected ? C.paper : C.ink, lineHeight: 1.4, textDecoration: rejected ? 'line-through' : 'none', opacity: rejected ? 0.7 : 1, flex: 1 }}>
            {q.text}
          </span>
          {!isMobile && <>
            <ComicBtn sm color={approved ? C.paper : C.green} onClick={onApprove}>
              {approved ? 'APPROVED' : 'APPROVE'}
            </ComicBtn>
            <ComicBtn sm color={rejected ? C.paper : C.red} onClick={onReject}>
              {rejected ? 'REJECTED' : 'REJECT'}
            </ComicBtn>
          </>}
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2] }}>
            <ComicBtn sm color={approved ? C.paper : C.green} onClick={onApprove} style={{ flex: 1, justifyContent: 'center' }}>
              {approved ? 'APPROVED' : 'APPROVE'}
            </ComicBtn>
            <ComicBtn sm color={rejected ? C.paper : C.red} onClick={onReject} style={{ flex: 1, justifyContent: 'center' }}>
              {rejected ? 'REJECTED' : 'REJECT'}
            </ComicBtn>
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[3]} ${S[3]} ${S[3]}` }}>
        {q.options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[1]} ${S[2]}`, background: i === q.correct ? C.greenLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: i === q.correct ? C.green : C.muted, width: 18, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ fontSize: FS.xs, color: i === q.correct ? C.ink : C.muted, fontWeight: i === q.correct ? 700 : 400 }}>{opt}</span>
            {i === q.correct && <span style={{ marginLeft: 'auto', fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.green }}>CORRECT</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ModuleDropdown({ value, onChange }: { value: string; onChange: (m: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${S[2]} ${S[3]}`, background: C.paper, border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm, boxShadow: mkShadow(), cursor: 'pointer',
          fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink,
          textTransform: 'uppercase',
        }}
      >
        <span>{value}</span>
        <span style={{ fontSize: FS.xs, marginLeft: S[2] }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
          background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
          boxShadow: mkShadow(), overflow: 'hidden',
        }}>
          {AI_QUIZ_MODULE_OPTIONS.map(m => (
            <div
              key={m}
              onClick={() => { onChange(m); setOpen(false) }}
              onMouseEnter={() => setHoveredOption(m)}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                padding: `${S[2]} ${S[3]}`, cursor: 'pointer',
                background: hoveredOption === m ? C.yellowLt : m === value ? C.cream : C.paper,
                fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink,
                textTransform: 'uppercase',
                borderBottom: `1px solid ${C.divider}`,
                transition: 'background 0.1s',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type DifficultyColor = Record<AIDifficulty, string>

function GeneratePanel({ module, setModule, difficulty, setDifficulty, count, setCount, generating, generate, difficultyColor }: {
  module: string; setModule: (m: string) => void
  difficulty: AIDifficulty; setDifficulty: (d: AIDifficulty) => void
  count: number; setCount: (fn: (c: number) => number) => void
  generating: boolean; generate: () => void
  difficultyColor: DifficultyColor
}) {
  return (
    <Panel title="GENERATE" accent={C.yellow} p={S[4]} action={<Tag label="STEP 1" bg={C.yellowLt} />} overflow="visible">
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>MODULE</div>
          <ModuleDropdown value={module} onChange={setModule} />
        </div>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>DIFFICULTY</div>
          <div style={{ display: 'flex', gap: S[2] }}>
            {AI_DIFFICULTY_OPTIONS.map(d => (
              <ComicBtn key={d} sm color={difficulty === d ? difficultyColor[d] : C.paper} onClick={() => setDifficulty(d)} style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>
                {d}
              </ComicBtn>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>QUESTION COUNT</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ComicBtn sm color={C.paper} onClick={() => setCount(c => Math.max(1, c - 1))} disabled={count <= 1}>−</ComicBtn>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['3xl'], color: C.ink, textAlign: 'center' }}>{count}</span>
            <ComicBtn sm color={C.paper} onClick={() => setCount(c => Math.min(15, c + 1))} disabled={count >= 15}>+</ComicBtn>
          </div>
        </div>
        <ComicBtn color={C.yellow} onClick={generate} disabled={generating}>
          {generating ? 'GENERATING...' : 'GENERATE QUIZ'}
        </ComicBtn>
      </div>
    </Panel>
  )
}

function ReviewStatusPanel({ pendingCount, approvedCount, rejectedCount, hasQuestions, isMobile }: { pendingCount: number; approvedCount: number; rejectedCount: number; hasQuestions: boolean; isMobile: boolean }) {
  return (
    <Panel title="REVIEW STATUS" accent={C.cyan} p={S[4]} action={<Tag label="STEP 3" bg={C.cyanLt} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        {([
          { label: 'PENDING',  value: pendingCount,  bg: C.mutedLt },
          { label: 'APPROVED', value: approvedCount, bg: C.greenLt },
          { label: 'REJECTED', value: rejectedCount, bg: C.redLt   },
        ] as const).map(({ label, value, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[2]} ${S[3]}`, background: bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, letterSpacing: 0.5 }}>{label}</span>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{value}</span>
          </div>
        ))}
        {isMobile && (
          <ComicBtn color={C.green} disabled={!hasQuestions || approvedCount === 0} onClick={() => {}} style={{ width: '100%', justifyContent: 'center', marginTop: S[1] }}>
            PUBLISH QUIZ ({approvedCount})
          </ComicBtn>
        )}
      </div>
    </Panel>
  )
}

function ReviewQuestionsPanel({ questions, generating, module, generatingMore, generateMore, setApproval }: {
  questions: QuestionState[] | null
  generating: boolean
  module: string
  generatingMore: boolean
  generateMore: () => void
  setApproval: (id: number, value: boolean | null) => void
}) {
  return (
    <Panel title="REVIEW QUESTIONS" accent={C.purple} p={S[4]} action={<Tag label="STEP 2" bg={C.purpleLt} />}>
      {!questions && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0`, color: C.muted }}>
          <BitMascot size={64} mood="happy" float />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>SELECT A MODULE AND HIT GENERATE</div>
        </div>
      )}
      {generating && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0` }}>
          <BitMascot size={64} mood="thinking" float />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>GEMINI IS THINKING...</div>
          <div style={{ fontSize: FS.xs, color: C.muted }}>Analysing {module}</div>
        </div>
      )}
      {questions && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {questions.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} onApprove={() => setApproval(q.id, true)} onReject={() => setApproval(q.id, false)} />
          ))}
          {generatingMore ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2], padding: S[3], color: C.muted }}>
              <BitMascot size={32} mood="thinking" float />
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>GENERATING MORE...</span>
            </div>
          ) : (
            <ComicBtn color={C.paper} onClick={generateMore} style={{ width: '100%', justifyContent: 'center' }}>
              + GENERATE MORE QUESTIONS
            </ComicBtn>
          )}
        </div>
      )}
    </Panel>
  )
}

export function ProfessorAIQuizBuilder() {
  const [module, setModule] = useState(AI_QUIZ_MODULE_OPTIONS[0])
  const [difficulty, setDifficulty] = useState<AIDifficulty>('MEDIUM')
  const [count, setCount] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[] | null>(null)

  const approvedCount = questions?.filter(q => q.approved === true).length ?? 0
  const rejectedCount = questions?.filter(q => q.approved === false).length ?? 0
  const pendingCount = questions?.filter(q => q.approved === null).length ?? 0

  const [generatingMore, setGeneratingMore] = useState(false)
  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'

  function generate() {
    setGenerating(true)
    setQuestions(null)
    setTimeout(() => {
      setQuestions(AI_QUIZ_DRAFT.questions.map(q => ({ ...q, approved: null })))
      setGenerating(false)
    }, 1800)
  }

  function generateMore() {
    setGeneratingMore(true)
    setTimeout(() => {
      const maxId = questions ? Math.max(...questions.map(q => q.id)) : 0
      const extra = AI_QUIZ_DRAFT.questions.map((q, i) => ({ ...q, id: maxId + i + 1, approved: null as boolean | null }))
      setQuestions(prev => [...(prev ?? []), ...extra])
      setGeneratingMore(false)
    }, 1800)
  }

  function setApproval(id: number, value: boolean | null) {
    setQuestions(prev => prev!.map(q => q.id === id ? { ...q, approved: q.approved === value ? null : value } : q))
  }

  const difficultyColor: Record<AIDifficulty, string> = { EASY: C.green, MEDIUM: C.yellow, HARD: C.red }

  return (
    <div className="dashboard-main">
      <Topbar
        title="AI QUIZ BUILDER"
        subtitle="Generate quizzes with Gemini 2.5 Flash"
        actions={
          <ComicBtn
            color={C.green}
            disabled={!questions || approvedCount === 0}
            onClick={() => {}}
          >
            PUBLISH QUIZ ({approvedCount})
          </ComicBtn>
        }
      />

      {(isTablet || isMobile) ? (
        /* Mobile + Tablet: all panels stacked full width */
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <GeneratePanel module={module} setModule={setModule} difficulty={difficulty} setDifficulty={setDifficulty} count={count} setCount={setCount} generating={generating} generate={generate} difficultyColor={difficultyColor} />
          {questions && <ReviewStatusPanel pendingCount={pendingCount} approvedCount={approvedCount} rejectedCount={rejectedCount} hasQuestions={!!questions} isMobile={isMobile} />}
          <ReviewQuestionsPanel questions={questions} generating={generating} module={module} generatingMore={generatingMore} generateMore={generateMore} setApproval={setApproval} />
        </div>
      ) : (
        /* Desktop: generate + status stacked on left, review questions on right */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: S[4], alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <GeneratePanel module={module} setModule={setModule} difficulty={difficulty} setDifficulty={setDifficulty} count={count} setCount={setCount} generating={generating} generate={generate} difficultyColor={difficultyColor} />
            {questions && <ReviewStatusPanel pendingCount={pendingCount} approvedCount={approvedCount} rejectedCount={rejectedCount} hasQuestions={!!questions} isMobile={false} />}
          </div>
          <ReviewQuestionsPanel questions={questions} generating={generating} module={module} generatingMore={generatingMore} generateMore={generateMore} setApproval={setApproval} />
        </div>
      )}
    </div>
  )
}
