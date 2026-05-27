import { useState, useEffect, useCallback } from 'react'
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
  return d.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })
}

export function StudentQuiz() {
  const { session } = useAuth()
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
    } catch (e) {
      console.error('Failed to load quizzes:', e)
    } finally {
      setLoading(false)
    }
  }, [session])

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
          action={<Tag label={`${kvizi.length} AVAILABLE`} bg={C.yellowLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {loading ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>
                LOADING...
              </div>
            ) : kvizi.length === 0 ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontSize: FS.sm }}>
                No quizzes available yet
              </div>
            ) : kvizi.map((q, idx) => {
              const colorLt = MODULE_COLORS[idx % MODULE_COLORS.length]
              const casMin = q.casIzvajanja ? `${q.casIzvajanja} min` : '—'
              return isMobile ? (
                <div key={q.id} style={{ display: 'flex', border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: colorLt, overflow: 'hidden' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
                    <div style={{ display: 'flex', gap: S[1] }}>
                      <Tag label={casMin} bg={C.paper} />
                      <Tag label={q.status} bg={q.status === 'PUBLISHED' ? C.greenLt : C.yellowLt} />
                      {q.ustvarjenOb && <Tag label={formatDatum(q.ustvarjenOb)} bg={C.cyanLt} />}
                    </div>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.naziv}</span>
                    <ComicBtn sm color={C.yellow} onClick={() => setSessionQuiz(q)}>START</ComicBtn>
                  </div>
                </div>
              ) : (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2.5]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: colorLt }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.naziv}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
                    <Tag label={casMin} bg={C.paper} />
                    <Tag label={q.status} bg={q.status === 'PUBLISHED' ? C.greenLt : C.yellowLt} />
                    {q.ustvarjenOb && <Tag label={formatDatum(q.ustvarjenOb)} bg={C.cyanLt} />}
                    <ComicBtn sm color={C.yellow} onClick={() => setSessionQuiz(q)}>START</ComicBtn>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel title="COMPLETED QUIZZES" accent={C.green}
          action={<Tag label={`${rezultati.length} DONE`} bg={C.greenLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {rezultati.length === 0 ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontSize: FS.sm }}>
                No completed quizzes yet
              </div>
            ) : rezultati.map(r => {
              const passed = r.odstotek >= 50
              return isMobile ? (
                <div key={r.id} style={{ display: 'flex', border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: passed ? C.greenLt : C.redLt, overflow: 'hidden' }}>
                  <div style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, letterSpacing: '0.1em', color: C.ink, background: passed ? C.green : C.red, padding: `${S[2]} ${S[1.5]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {passed ? 'PASSED' : 'FAILED'}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
                    <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
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