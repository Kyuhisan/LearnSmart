import { useState, useRef, useEffect, useCallback } from 'react'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { getModuliUcitelj } from '../modules/moduleApi'
import { generirajVprasanja, shraniKviz, getKvizZaPredmet, getVprasanjaZaKviz, izbrisiVprasanje } from './quizApi'
import { AI_DIFFICULTY_OPTIONS, type AIDifficulty } from './mockData'

interface Modul { id: string; naziv: string }

interface BackendQuestion {
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
}

interface ExistingQuestion {
  id: string
  besediloVprasanja: string
  moznosti: string[]
  indeksPravilnegaOdgovora: number
  razlaga: string
}

interface ExistingQuiz {
  id: string
  naziv: string
  status: string
  casIzvajanja: number
}

type QuestionState = BackendQuestion & {
  id: number
  approved: boolean | null
}

type DifficultyColor = Record<AIDifficulty, string>

function QuestionCard({ q, index, onApprove, onReject }: {
  q: QuestionState; index: number; onApprove: () => void; onReject: () => void
}) {
  const approved = q.approved === true
  const rejected = q.approved === false
  const bg = approved ? C.greenLt : rejected ? C.redLt : C.paper
  const isMobile = useBreakpoint() === 'mobile'

  return (
    <div style={{ background: bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, borderBottom: `${BW.base} solid ${C.ink}`, background: approved ? C.green : rejected ? C.red : C.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <Tag label={`Q${index + 1}`} bg={C.mutedLt} />
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: approved || rejected ? C.paper : C.ink, lineHeight: 1.4, textDecoration: rejected ? 'line-through' : 'none', opacity: rejected ? 0.7 : 1, flex: 1 }}>
            {q.besediloVprasanja}
          </span>
          {!isMobile && <>
            <ComicBtn sm color={approved ? C.paper : C.green} onClick={onApprove}>{approved ? 'APPROVED' : 'APPROVE'}</ComicBtn>
            <ComicBtn sm color={rejected ? C.paper : C.red} onClick={onReject}>{rejected ? 'REJECTED' : 'REJECT'}</ComicBtn>
          </>}
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2] }}>
            <ComicBtn sm color={approved ? C.paper : C.green} onClick={onApprove} style={{ flex: 1, justifyContent: 'center' }}>{approved ? 'APPROVED' : 'APPROVE'}</ComicBtn>
            <ComicBtn sm color={rejected ? C.paper : C.red} onClick={onReject} style={{ flex: 1, justifyContent: 'center' }}>{rejected ? 'REJECTED' : 'REJECT'}</ComicBtn>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: S[3] }}>
        {q.moznosti.map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[1]} ${S[2]}`, background: i === q.indeksPravilnegaOdgovora ? C.greenLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: i === q.indeksPravilnegaOdgovora ? C.green : C.muted, width: 18, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ fontSize: FS.xs, color: i === q.indeksPravilnegaOdgovora ? C.ink : C.muted, fontWeight: i === q.indeksPravilnegaOdgovora ? 700 : 400 }}>{opt}</span>
            {i === q.indeksPravilnegaOdgovora && <span style={{ marginLeft: 'auto', fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.green }}>CORRECT</span>}
          </div>
        ))}
        {q.razlaga && (
          <div style={{ marginTop: S[1], padding: `${S[1]} ${S[2]}`, background: C.cyanLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, fontSize: FS.xs, color: C.muted }}>
            💡 {q.razlaga}
          </div>
        )}
      </div>
    </div>
  )
}

function ExistingQuestionCard({ q, index, onDelete, deleting }: {
  q: ExistingQuestion; index: number; onDelete: () => void; deleting: boolean
}) {
  return (
    <div style={{ background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}`, borderBottom: `${BW.base} solid ${C.ink}`, background: C.cream }}>
        <Tag label={`Q${index + 1}`} bg={C.mutedLt} />
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, lineHeight: 1.4, flex: 1 }}>
          {q.besediloVprasanja}
        </span>
        <ComicBtn sm color={C.red} onClick={onDelete} disabled={deleting}>
          {deleting ? '...' : '✕ DELETE'}
        </ComicBtn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: S[3] }}>
        {q.moznosti.map((opt, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[1]} ${S[2]}`, background: i === q.indeksPravilnegaOdgovora ? C.greenLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: i === q.indeksPravilnegaOdgovora ? C.green : C.muted, width: 18, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ fontSize: FS.xs, color: i === q.indeksPravilnegaOdgovora ? C.ink : C.muted, fontWeight: i === q.indeksPravilnegaOdgovora ? 700 : 400 }}>{opt}</span>
            {i === q.indeksPravilnegaOdgovora && <span style={{ marginLeft: 'auto', fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.green }}>CORRECT</span>}
          </div>
        ))}
        {q.razlaga && (
          <div style={{ marginTop: S[1], padding: `${S[1]} ${S[2]}`, background: C.cyanLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, fontSize: FS.xs, color: C.muted }}>
            💡 {q.razlaga}
          </div>
        )}
      </div>
    </div>
  )
}

function ExistingQuizPanel({ quiz, vprasanja, loadingVprasanja, onDelete, deletingId }: {
  quiz: ExistingQuiz
  vprasanja: ExistingQuestion[]
  loadingVprasanja: boolean
  onDelete: (id: string) => void
  deletingId: string | null
}) {
  return (
    <Panel
      title="CURRENT QUIZ"
      accent={C.orange}
      p={S[4]}
      action={<Tag label={`${vprasanja.length} QUESTIONS`} bg={C.yellowLt} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[2]} ${S[3]}`, background: quiz.status === 'PUBLISHED' ? C.greenLt : C.yellowLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{quiz.naziv}</span>
          <Tag label={quiz.status} bg={quiz.status === 'PUBLISHED' ? C.green : C.yellow} />
        </div>

        {loadingVprasanja ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[4], color: C.muted }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs }}>LOADING QUESTIONS...</span>
          </div>
        ) : vprasanja.length === 0 ? (
          <div style={{ padding: S[3], textAlign: 'center', color: C.muted, fontSize: FS.xs }}>
            No questions yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {vprasanja.map((q, i) => (
              <ExistingQuestionCard
                key={q.id}
                q={q}
                index={i}
                onDelete={() => onDelete(q.id)}
                deleting={deletingId === q.id}
              />
            ))}
          </div>
        )}
      </div>
    </Panel>
  )
}

function ModuleDropdown({ value, options, onChange, loading }: {
  value: Modul | null; options: Modul[]; onChange: (m: Modul) => void; loading: boolean
}) {
  const [open, setOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const label = loading ? 'Loading modules…' : value ? value.naziv : options.length === 0 ? 'No modules yet' : 'Select a module'
  const canOpen = !loading && options.length > 0

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { if (canOpen) setOpen(o => !o) }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${S[2]} ${S[3]}`, background: C.paper, border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm, boxShadow: mkShadow(), cursor: canOpen ? 'pointer' : 'not-allowed',
          fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm,
          color: loading || !value ? C.muted : C.ink, textTransform: 'uppercase',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {canOpen && <span style={{ fontSize: FS.xs, marginLeft: S[2], flexShrink: 0 }}>{open ? '▲' : '▼'}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100, background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
          {options.map(m => (
            <button key={m.id} onClick={() => { onChange(m); setOpen(false) }} onMouseEnter={() => setHoveredId(m.id)} onMouseLeave={() => setHoveredId(null)}
              style={{ padding: `${S[2]} ${S[3]}`, cursor: 'pointer', background: hoveredId === m.id ? C.yellowLt : m.id === value?.id ? C.cream : C.paper, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, textTransform: 'uppercase', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: `1px solid ${C.divider}`, transition: 'background 0.1s', width: '100%', textAlign: 'left', display: 'block' }}>
              {m.naziv}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StepperField({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (fn: (v: number) => number) => void; min: number; max: number
}) {
  return (
    <div>
      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <ComicBtn sm color={C.paper} onClick={() => onChange(v => Math.max(min, v - 1))} disabled={value <= min}>−</ComicBtn>
        <input type="number" min={min} max={max} value={value}
          onChange={e => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) onChange(() => Math.min(max, Math.max(min, n))) }}
          style={{ flex: 1, textAlign: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS['3xl'], color: C.ink, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, background: C.paper, padding: `${S[1]} 0`, boxShadow: mkShadow(), outline: 'none' }}
        />
        <ComicBtn sm color={C.paper} onClick={() => onChange(v => Math.min(max, v + 1))} disabled={value >= max}>+</ComicBtn>
      </div>
    </div>
  )
}

function GeneratePanel({ module, setModule, modules, loadingModules, difficulty, setDifficulty, count, setCount, timeLimit, setTimeLimit, generating, generate, difficultyColor }: {
  module: Modul | null; setModule: (m: Modul) => void; modules: Modul[]; loadingModules: boolean
  difficulty: AIDifficulty; setDifficulty: (d: AIDifficulty) => void
  count: number; setCount: (fn: (c: number) => number) => void
  timeLimit: number; setTimeLimit: (fn: (v: number) => number) => void
  generating: boolean; generate: () => void; difficultyColor: DifficultyColor
}) {
  return (
    <Panel title="GENERATE" accent={C.yellow} p={S[4]} action={<Tag label="STEP 1" bg={C.yellowLt} />} overflow="visible">
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>MODULE</div>
          <ModuleDropdown value={module} options={modules} onChange={setModule} loading={loadingModules} />
        </div>
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>DIFFICULTY</div>
          <div style={{ display: 'flex', gap: S[2] }}>
            {AI_DIFFICULTY_OPTIONS.map(d => (
              <ComicBtn key={d} sm color={difficulty === d ? difficultyColor[d] : C.paper} onClick={() => setDifficulty(d)} style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>{d}</ComicBtn>
            ))}
          </div>
        </div>
        <StepperField label="QUESTION COUNT" value={count} onChange={setCount} min={1} max={15} />
        <StepperField label="TIME LIMIT (MIN)" value={timeLimit} onChange={setTimeLimit} min={1} max={120} />
        <ComicBtn color={C.yellow} onClick={generate} disabled={generating || !module}>
          {generating ? 'GENERATING...' : 'GENERATE QUIZ'}
        </ComicBtn>
      </div>
    </Panel>
  )
}

function ReviewStatusPanel({ pendingCount, approvedCount, rejectedCount, quizCount, onPublish, saving, saved }: {
  pendingCount: number; approvedCount: number; rejectedCount: number
  quizCount: number; onPublish: () => void; saving: boolean; saved: boolean
}) {
  const canPublish = approvedCount >= quizCount && !saving

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
        {saved ? (
          <div style={{ padding: `${S[2]} ${S[3]}`, background: C.greenLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), textAlign: 'center' }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>✓ QUIZ SAVED</span>
          </div>
        ) : (
          <>
            <div style={{ padding: `${S[2]} ${S[3]}`, background: canPublish ? C.greenLt : C.yellowLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), textAlign: 'center' }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>
                {canPublish ? '✓ READY TO PUBLISH' : `APPROVE ${quizCount - approvedCount} MORE TO PUBLISH`}
              </span>
            </div>
            <ComicBtn color={canPublish ? C.green : C.muted} disabled={!canPublish} onClick={onPublish} style={{ width: '100%', justifyContent: 'center' }}>
              {saving ? 'SAVING...' : `PUBLISH QUIZ (${approvedCount}/${quizCount})`}
            </ComicBtn>
          </>
        )}
      </div>
    </Panel>
  )
}

function ReviewQuestionsPanel({ questions, generating, module, generatingMore, generateMore, setApproval }: {
  questions: QuestionState[] | null; generating: boolean; module: Modul | null
  generatingMore: boolean; generateMore: () => void; setApproval: (id: number, value: boolean | null) => void
}) {
  return (
    <Panel title="REVIEW QUESTIONS" accent={C.purple} p={S[4]} action={<Tag label="STEP 2" bg={C.purpleLt} />}>
      {!questions && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0` }}>
          <BitMascot size={64} mood="happy" float />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>SELECT A MODULE AND HIT GENERATE</div>
        </div>
      )}
      {generating && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0` }}>
          <BitMascot size={64} mood="thinking" float />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>GEMINI IS THINKING...</div>
          <div style={{ fontSize: FS.xs, color: C.muted }}>Analysing {module?.naziv ?? '...'}</div>
        </div>
      )}
      {questions && !generating && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {questions.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} onApprove={() => setApproval(q.id, true)} onReject={() => setApproval(q.id, false)} />
          ))}
          {generatingMore ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2], padding: S[3] }}>
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
  const { session } = useAuth()
  const [modules, setModules] = useState<Modul[]>([])
  const [loadingModules, setLoadingModules] = useState(true)
  const [module, setModule] = useState<Modul | null>(null)
  const [difficulty, setDifficulty] = useState<AIDifficulty>('MEDIUM')
  const [count, setCount] = useState(5)
  const [quizCount, setQuizCount] = useState(5)
  const [timeLimit, setTimeLimit] = useState(10)
  const [generating, setGenerating] = useState(false)
  const [generatingMore, setGeneratingMore] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[] | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Obstoječi kviz
  const [existingQuiz, setExistingQuiz] = useState<ExistingQuiz | null>(null)
  const [existingVprasanja, setExistingVprasanja] = useState<ExistingQuestion[]>([])
  const [loadingVprasanja, setLoadingVprasanja] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'

  useEffect(() => {
    if (!session?.access_token) return
    getModuliUcitelj(session.access_token).then((data: Modul[]) => {
      setModules(data)
      if (data.length > 0) setModule(data[0])
      setLoadingModules(false)
    })
  }, [session])

  const naloziObstojeciKviz = useCallback(async () => {
    if (!module || !session?.access_token) return
    try {
      const kvizi = await getKvizZaPredmet(session.access_token, module.id)
      if (kvizi && kvizi.length > 0) {
        const kviz = kvizi[0]
        setExistingQuiz(kviz)
        setLoadingVprasanja(true)
        const vprasanja = await getVprasanjaZaKviz(session.access_token, kviz.id)
        setExistingVprasanja(vprasanja)
        setLoadingVprasanja(false)
      } else {
        setExistingQuiz(null)
        setExistingVprasanja([])
      }
    } catch (e) {
      console.error('Failed to load existing quiz:', e)
    }
  }, [module, session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    naloziObstojeciKviz()
  }, [naloziObstojeciKviz])

  const approvedCount = questions?.filter(q => q.approved === true).length ?? 0
  const rejectedCount = questions?.filter(q => q.approved === false).length ?? 0
  const pendingCount = questions?.filter(q => q.approved === null).length ?? 0

  async function generate() {
    if (!module || !session?.access_token) return
    setQuizCount(count)
    setGenerating(true)
    setQuestions(null)
    setSaved(false)
    try {
      const data: BackendQuestion[] = await generirajVprasanja(
        session.access_token, module.id, count, difficulty
      )
      setQuestions(data.map((q, i) => ({ ...q, id: i, approved: null })))
    } catch (e) {
      console.error('Generation failed:', e)
    } finally {
      setGenerating(false)
    }
  }

  async function generateMore() {
    if (!module || !session?.access_token) return
    setGeneratingMore(true)
    try {
      const data: BackendQuestion[] = await generirajVprasanja(
        session.access_token, module.id, count, difficulty
      )
      const maxId = questions ? Math.max(...questions.map(q => q.id)) : 0
      setQuestions(prev => [...(prev ?? []), ...data.map((q, i) => ({ ...q, id: maxId + i + 1, approved: null as boolean | null }))])
    } catch (e) {
      console.error('Generate more failed:', e)
    } finally {
      setGeneratingMore(false)
    }
  }

  async function publishQuiz() {
  if (!module || !session?.access_token || !questions) return
  const odobrena = questions.filter(q => q.approved === true)
  if (odobrena.length < quizCount) return
  setSaving(true)
  try {
    await shraniKviz(session.access_token, {
      predmetId: module.id,
      naziv: existingQuiz ? existingQuiz.naziv : `${module.naziv} — Quiz`,
      casIzvajanja: timeLimit,
      vprasanja: odobrena.map(q => ({
        besediloVprasanja: q.besediloVprasanja,
        moznosti: q.moznosti,
        indeksPravilnegaOdgovora: q.indeksPravilnegaOdgovora,
        razlaga: q.razlaga
      }))
    })
    setSaved(true)
    setQuestions(null)
    await naloziObstojeciKviz()
  } catch (e) {
    console.error('Save failed:', e)
  } finally {
    setSaving(false)
  }
}
  async function handleDeleteVprasanje(vprasanjeId: string) {
    if (!session?.access_token) return
    setDeletingId(vprasanjeId)
    try {
      await izbrisiVprasanje(session.access_token, vprasanjeId)
      setExistingVprasanja(prev => prev.filter(q => q.id !== vprasanjeId))
    } catch (e) {
      console.error('Delete failed:', e)
    } finally {
      setDeletingId(null)
    }
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
      />

      {(isTablet || isMobile) ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <GeneratePanel module={module} setModule={setModule} modules={modules} loadingModules={loadingModules} difficulty={difficulty} setDifficulty={setDifficulty} count={count} setCount={setCount} timeLimit={timeLimit} setTimeLimit={setTimeLimit} generating={generating} generate={generate} difficultyColor={difficultyColor} />
          {existingQuiz && <ExistingQuizPanel quiz={existingQuiz} vprasanja={existingVprasanja} loadingVprasanja={loadingVprasanja} onDelete={handleDeleteVprasanje} deletingId={deletingId} />}
          {questions && <ReviewStatusPanel pendingCount={pendingCount} approvedCount={approvedCount} rejectedCount={rejectedCount} quizCount={quizCount} onPublish={publishQuiz} saving={saving} saved={saved} />}
          <ReviewQuestionsPanel questions={questions} generating={generating} module={module} generatingMore={generatingMore} generateMore={generateMore} setApproval={setApproval} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: S[4], alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <GeneratePanel module={module} setModule={setModule} modules={modules} loadingModules={loadingModules} difficulty={difficulty} setDifficulty={setDifficulty} count={count} setCount={setCount} timeLimit={timeLimit} setTimeLimit={setTimeLimit} generating={generating} generate={generate} difficultyColor={difficultyColor} />
            {existingQuiz && <ExistingQuizPanel quiz={existingQuiz} vprasanja={existingVprasanja} loadingVprasanja={loadingVprasanja} onDelete={handleDeleteVprasanje} deletingId={deletingId} />}
            {questions && <ReviewStatusPanel pendingCount={pendingCount} approvedCount={approvedCount} rejectedCount={rejectedCount} quizCount={quizCount} onPublish={publishQuiz} saving={saving} saved={saved} />}
          </div>
          <ReviewQuestionsPanel questions={questions} generating={generating} module={module} generatingMore={generatingMore} generateMore={generateMore} setApproval={setApproval} />
        </div>
      )}
    </div>
  )
}