import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { StatCard } from '../../components/ui/StatCard'
import { Panel } from '../../components/ui/Panel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { QuizSession } from './QuizSession'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { getMojiKvizi, getMojiRezultati } from './quizStudentApi'

const MODULE_COLORS = [
  '#fbeed0', '#ebe5f3', '#fae5d3', '#e1efe3', '#dbeef2',
  '#fde8e8', '#e8f0fd', '#fdf3e8',
]

interface BackendQuiz {
  id: string
  naziv: string
  status: string
  casIzvajanja: number
  predmetId: string
  ustvarjenOb?: string
}

interface BackendRezultat {
  id: string
  kvizId: string
  kvizNaziv: string
  tocke: number
  skupajVprasanj: number
  odstotek: number
  casResevanjaS: number | null
  oddanoOb: string
}

function formatCas(s: number | null): string {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

function formatDatum(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function StudentQuiz() {
  const { session } = useAuth()
  const location = useLocation()
  const autoStartId = (location.state as { quizId?: string } | null)?.quizId ?? null
  const autoStarted = useRef(false)
  const [sessionQuiz, setSessionQuiz] = useState<BackendQuiz | null>(null)
  const [kvizi, setKvizi] = useState<BackendQuiz[]>([])
  const [rezultati, setRezultati] = useState<BackendRezultat[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useBreakpoint() === 'mobile'

  const nalozi = useCallback(async () => {
    if (!session?.access_token) return
    try {
      const [k, r] = await Promise.all([
        getMojiKvizi(session.access_token),
        getMojiRezultati(session.access_token)
      ])
      setKvizi(k)
      setRezultati(r)
      if (autoStartId && !autoStarted.current) {
        const target = k.find((q: BackendQuiz) => q.id === autoStartId && q.status === 'PUBLISHED')
        if (target) { setSessionQuiz(target); autoStarted.current = true }
      }
    } catch (e) {
      console.error('Failed to load quizzes:', e)
    } finally {
      setLoading(false)
    }
  }, [session, autoStartId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    nalozi()
  }, [nalozi])

  if (sessionQuiz) return (
    <QuizSession
      quiz={sessionQuiz}
      onClose={() => { setSessionQuiz(null); nalozi() }}
    />
  )

  const avgScore = rezultati.length > 0
    ? Math.round(rezultati.reduce((s, r) => s + r.odstotek, 0) / rezultati.length)
    : 0
  const bestScore = rezultati.length > 0
    ? Math.max(...rezultati.map(r => r.odstotek))
    : 0
  const fastestTime = rezultati
    .filter(r => r.casResevanjaS != null)
    .sort((a, b) => (a.casResevanjaS ?? 0) - (b.casResevanjaS ?? 0))[0]

  const poskusiPoKvizu: Record<string, number> = {}
  const rezultatiSort = [...rezultati].sort(
    (a, b) => new Date(a.oddanoOb).getTime() - new Date(b.oddanoOb).getTime()
  )
  const poskusCounter: Record<string, number> = {}
  rezultatiSort.forEach(r => {
    poskusCounter[r.kvizId] = (poskusCounter[r.kvizId] ?? 0) + 1
    poskusiPoKvizu[r.id] = poskusCounter[r.kvizId]
  })

  const published = kvizi.filter(q => q.status === 'PUBLISHED')
  const drafts = kvizi.filter(q => q.status !== 'PUBLISHED')
  const passedCount = rezultati.filter(r => r.odstotek >= 50).length
  const failedCount = rezultati.length - passedCount

  // Attempts and best score per quiz
  const attemptsByQuizId: Record<string, number> = {}
  const bestByQuizId: Record<string, number> = {}
  rezultati.forEach(r => {
    attemptsByQuizId[r.kvizId] = (attemptsByQuizId[r.kvizId] ?? 0) + 1
    if ((bestByQuizId[r.kvizId] ?? -1) < r.odstotek) bestByQuizId[r.kvizId] = r.odstotek
  })

  function QuizCard({ q, idx }: { q: BackendQuiz; idx: number }) {
    const colorLt = MODULE_COLORS[idx % MODULE_COLORS.length]
    const casMin = q.casIzvajanja ? `${q.casIzvajanja} min` : 'no limit'
    const attempts = attemptsByQuizId[q.id] ?? 0
    const best = bestByQuizId[q.id]
    const triesLeft = Math.max(0, 3 - attempts)
    const noXpWarning = attempts >= 3
    const btnLabel = attempts === 0 ? 'START' : 'RETRY'

    const tags = (
      <>
        <Tag label={casMin} bg={C.paper} />
        {attempts > 0 && <Tag label={`BEST: ${best}%`} bg={best >= 80 ? C.greenLt : best >= 50 ? C.yellowLt : C.redLt} />}
        {attempts > 0 && !noXpWarning && <Tag label={`${triesLeft} TR${triesLeft === 1 ? 'Y' : 'IES'} LEFT`} bg={C.cyanLt} />}
        {noXpWarning && <Tag label="0 XP ON RETRY" bg={C.mutedLt} />}
      </>
    )

    if (isMobile) return (
      <div style={{ display: 'flex', border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: colorLt, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
          <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>{tags}</div>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.naziv}</span>
          <ComicBtn sm color={C.yellow} onClick={() => setSessionQuiz(q)}>{btnLabel}</ComicBtn>
        </div>
      </div>
    )

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2.5]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: colorLt }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.naziv}</span>
          {attempts > 0 && (
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>
              {attempts} attempt{attempts !== 1 ? 's' : ''} · best {best}%
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
          {tags}
          <ComicBtn sm color={C.yellow} onClick={() => setSessionQuiz(q)}>{btnLabel}</ComicBtn>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-main">
      <Topbar
        title="QUIZZES"
        subtitle="Test your knowledge · track your progress"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        <div className="quiz-stat-grid">
          <StatCard label="AVG SCORE"    value={`${avgScore}%`}                                sub="across all quizzes" bg={C.cyanLt}   />
          <StatCard label="BEST SCORE"   value={`${bestScore}%`}                               sub="personal best"      bg={C.greenLt}  />
          <StatCard label="FASTEST TIME" value={formatCas(fastestTime?.casResevanjaS ?? null)} sub="best time"          bg={C.yellowLt} />
          <StatCard label="COMPLETED"    value={`${rezultati.length}`}                         sub="quizzes done"       bg={C.redLt}    />
        </div>

        <Panel title="AVAILABLE QUIZZES" accent={C.yellow}
          action={<Tag label={`${published.length} AVAILABLE`} bg={C.yellowLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {loading ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>
                LOADING...
              </div>
            ) : published.length === 0 ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontSize: FS.sm }}>
                No quizzes available yet
              </div>
            ) : published.map((q, idx) => <QuizCard key={q.id} q={q} idx={idx} />)}
          </div>
        </Panel>

        {drafts.length > 0 && (
          <Panel title="UPCOMING QUIZZES" accent={C.muted}
            action={<Tag label={`${drafts.length} COMING SOON`} bg={C.mutedLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
              {drafts.map((q, idx) => {
                const casMin = q.casIzvajanja ? `${q.casIzvajanja} min` : 'no limit'
                return isMobile ? (
                  <div key={q.id} style={{ display: 'flex', border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: C.mutedLt, overflow: 'hidden', opacity: 0.7 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
                      <div style={{ display: 'flex', gap: S[1] }}>
                        <Tag label={casMin} bg={C.paper} />
                        <Tag label="DRAFT" bg={C.yellowLt} />
                      </div>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>{q.naziv}</span>
                      <ComicBtn sm color={C.muted} disabled>NOT YET AVAILABLE</ComicBtn>
                    </div>
                  </div>
                ) : (
                  <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2.5]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: C.mutedLt, opacity: 0.7 }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>{q.naziv}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
                      <Tag label={casMin} bg={C.paper} />
                      <Tag label="DRAFT" bg={C.yellowLt} />
                      <ComicBtn sm color={C.muted} disabled>NOT YET AVAILABLE</ComicBtn>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>
        )}

        <Panel title="QUIZ HISTORY" accent={C.green}
          action={<div style={{ display: 'flex', gap: S[1] }}><Tag label={`${passedCount} PASSED`} bg={C.greenLt} /><Tag label={`${failedCount} FAILED`} bg={C.redLt} /></div>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {rezultati.length === 0 ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontSize: FS.sm }}>
                No completed quizzes yet
              </div>
            ) : rezultati.map(r => {
              const passed = r.odstotek >= 50
              const poskus = poskusiPoKvizu[r.id]
              return isMobile ? (
                <div key={r.id} style={{ display: 'flex', border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: passed ? C.greenLt : C.redLt, overflow: 'hidden' }}>
                  <div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, letterSpacing: '0.1em', color: C.ink, background: passed ? C.green : C.red, padding: `${S[2]} ${S[1.5]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
                    <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
                      <Tag label={`#${poskus}`} bg={C.paper} />
                      <Tag label={`${r.odstotek}%`} bg={r.odstotek >= 80 ? C.greenLt : r.odstotek >= 50 ? C.yellowLt : C.redLt} />
                      <Tag label={formatCas(r.casResevanjaS)} bg={C.paper} />
                      <Tag label={formatDatum(r.oddanoOb)} bg={C.paper} />
                    </div>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{r.kvizNaziv}</span>
                  </div>
                </div>
              ) : (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2.5]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: passed ? C.greenLt : C.redLt }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{r.kvizNaziv}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{r.tocke}/{r.skupajVprasanj} correct</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
                    <Tag label={`#${poskus}`} bg={C.paper} />
                    <Tag label={`${r.odstotek}%`} bg={r.odstotek >= 80 ? C.greenLt : r.odstotek >= 50 ? C.yellowLt : C.redLt} />
                    <Tag label={formatCas(r.casResevanjaS)} bg={C.paper} />
                    <Tag label={formatDatum(r.oddanoOb)} bg={C.paper} />
                    <Tag label={passed ? 'PASSED' : 'FAILED'} bg={passed ? C.greenLt : C.redLt} />
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

      </div>
    </div>
  )
}