import { useState, useEffect } from 'react'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { Panel } from '../../components/ui/Panel'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { Topbar } from '../../components/ui/Topbar'
import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { getModuliUcitelj, getStilMix, getTopStudents, type TopStudent } from '../modules/moduleApi'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import {
  PROFESSOR_STATS,
  PROFESSOR_PENDING_QUIZZES,
} from './mockData'

interface BackendModul {
  id: string
  naziv: string
  jeObjavljen: boolean
}

function TopPerformerRow({ s, onClick }: { s: TopStudent; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const styleBg = s.ucniTip && s.ucniTip in STYLE_INFO
    ? STYLE_INFO[s.ucniTip as keyof typeof STYLE_INFO].bg
    : C.mutedLt
  const styleLabel = s.ucniTip && s.ucniTip in STYLE_INFO
    ? STYLE_INFO[s.ucniTip as keyof typeof STYLE_INFO].label
    : '—'
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], background: hovered ? C.yellowLt : C.cream, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(hovered ? 'lg' : 'base'), cursor: 'pointer', transform: hovered ? 'translate(-1px, -1px)' : 'none', transition: 'background 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: styleBg, border: `${BW.base} solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, flexShrink: 0 }}>
        {s.imePriimek.charAt(0)}
      </div>
      <span style={{ flex: 1, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>{s.imePriimek}</span>
      <Tag label={styleLabel} bg={styleBg} />
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.md, fontWeight: 700 }}>{s.score}%</span>
    </div>
  )
}

export function ProfessorDashboard() {
  const navigate = useNavigate()
  const isMobile = useBreakpoint() === 'mobile'
  const { session } = useAuth()
  const [moduli, setModuli] = useState<BackendModul[]>([])
  const [loadingModuli, setLoadingModuli] = useState(true)
  const [stilMixData, setStilMixData] = useState<Record<string, number> | null>(null)
  const [topStudents, setTopStudents] = useState<TopStudent[] | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    getModuliUcitelj(session.access_token).then((data: BackendModul[]) => {
      setModuli(data)
      setLoadingModuli(false)
    })
    getStilMix(session.access_token).then(setStilMixData).catch(() => {})
    getTopStudents(session.access_token).then(setTopStudents).catch(() => {})
  }, [session])

  return (
    <div className="dashboard-main">

      <Topbar
        title="HOME BASE — PROF"
        subtitle="Friday · May 2 · 3 quizzes need approval"
        actions={<ComicBtn sm color={C.cyan} onClick={() => navigate('/notifications')}>3 NEW</ComicBtn>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* BIT greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <BitMascot size={70} mood="wink" float />
          <SpeechBubble color={C.cyan} style={{ flex: 1, maxWidth: 480 }}>
            <div style={{ fontSize: FS.xs, fontFamily: "'Archivo Black', sans-serif", letterSpacing: 1 }}>BIT SAYS:</div>
            <div style={{ fontSize: FS.lg, fontWeight: 700, marginTop: S[1], lineHeight: 1.4 }}>
              Hi Prof! <strong>3 AI-generated quizzes</strong> are waiting for your review. 134 students online today.
            </div>
          </SpeechBubble>
        </div>

        {/* Stat cards */}
        <div className="quiz-stat-grid">
          {PROFESSOR_STATS.map((s) => (
            <ComicBox key={s.label} bg={s.bg} p={S[4]}>
              <div className="stat-card-value" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], lineHeight: 1, color: s.dark ? C.paper : C.ink }}>
                {s.label === 'MODULES'
                  ? (loadingModuli ? '…' : String(moduli.length))
                  : s.label === 'PENDING'
                  ? (loadingModuli ? '…' : String(moduli.filter(m => !m.jeObjavljen).length))
                  : s.value}
              </div>
              <div className="stat-card-label" style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: 1, marginTop: S[1], fontFamily: "'Archivo Black', sans-serif", color: s.dark ? C.paper : C.ink }}>{s.label}</div>
            </ComicBox>
          ))}
        </div>

        {/* AI Builder CTA */}
        <ComicBox bg={C.navy} p={S[5]} style={{ color: C.paper }}>
          <Tag label="GEMINI 2.5 FLASH" bg={C.yellow} />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], marginTop: S[2], lineHeight: 1 }}>AI QUIZ BUILDER!</div>
          <div style={{ fontSize: FS.md, opacity: 0.8, marginTop: S[1], fontWeight: 600, maxWidth: 360 }}>
            Upload a PDF → AI extracts quiz questions → You review &amp; approve.
          </div>
          <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
            <ComicBtn color={C.yellow} onClick={() => navigate('/upload')}>UPLOAD</ComicBtn>
            <ComicBtn color={C.pink} dark style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/ai-quiz-builder')}>AI BUILDER</ComicBtn>
          </div>
        </ComicBox>

        {/* Modules + Pending quizzes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          {/* Your modules */}
          <Panel title="YOUR MODULES" accent={C.yellow} p={S[4]} action={<ComicBtn sm color={C.green} onClick={() => navigate('/modules', { state: { openNew: true } })}>+ NEW</ComicBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {loadingModuli
                ? [C.yellow, C.cyan, C.green, C.purple].map((color, i) => (
                    <div key={i} className="skeleton-pulse" style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: S[2], border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: C.paper }}>
                      <div style={{ flex: 1, height: 14, background: color, opacity: 0.35, borderRadius: R.sm }} />
                      <div style={{ width: 48, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
                      <div style={{ width: 42, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
                    </div>
                  ))
                : moduli.length === 0
                ? <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[4] }}>NO MODULES YET</div>
                : moduli.map((m) => (
                    <div key={m.id} onClick={() => navigate('/modules', { state: { editId: m.id } })} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: S[2], background: m.jeObjavljen ? C.paper : C.cream, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), cursor: 'pointer' }}>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.naziv.toUpperCase()}
                      </span>
                      <span style={{ flexShrink: 0 }}>
                        <Tag label={m.jeObjavljen ? '● LIVE' : '○ DRAFT'} bg={m.jeObjavljen ? C.green : C.orangeLt} />
                      </span>
                      <div onClick={e => { e.stopPropagation(); navigate('/modules', { state: { editId: m.id } }) }}>
                        <ComicBtn sm color={C.yellow}>EDIT</ComicBtn>
                      </div>
                    </div>
                  ))
              }
            </div>
          </Panel>

          {/* Pending quizzes */}
          <Panel title="PENDING QUIZZES" accent={C.red} p={S[4]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {PROFESSOR_PENDING_QUIZZES.map((q) => (
                <div key={q.module} style={{ padding: S[2], background: C.redLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs }}>{q.module.toUpperCase()}</div>
                  <div style={{ fontSize: FS.xs, fontWeight: 700, color: C.muted, marginTop: S[1] }}>{q.topic} · {q.questions} questions</div>
                  <div style={{ display: 'flex', gap: S[1], marginTop: S[2] }}>
                    <ComicBtn sm color={C.green}>APPROVE</ComicBtn>
                    <ComicBtn sm color={C.yellow}>EDIT</ComicBtn>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Style mix + Top performers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          {/* Style mix */}
          {(() => {
            const styles = ['visual', 'reading', 'auditory', 'kinesthetic'] as const
            const totalStudents = stilMixData ? Object.values(stilMixData).reduce((a, b) => a + b, 0) : 0
            const rows = styles.map(key => ({
              key,
              label: STYLE_INFO[key].label,
              color: STYLE_INFO[key].color,
              colorLt: STYLE_INFO[key].bg,
              count: stilMixData?.[key] ?? 0,
              percent: totalStudents > 0 ? Math.round(((stilMixData?.[key] ?? 0) / totalStudents) * 100) : 0,
            })).sort((a, b) => b.count - a.count)
            return (
              <Panel title="STUDENT STYLE MIX" accent={C.purple} p={0}
                action={<Tag label={stilMixData === null ? '…' : `${totalStudents} ${totalStudents === 1 ? 'STUDENT' : 'STUDENTS'}`} bg={C.purpleLt} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: S[4] }}>
                  {rows.map((t) => (
                    <div key={t.key} style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[1.5]} ${S[3]}`, background: t.colorLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, width: 100, flexShrink: 0, letterSpacing: 0.5 }}>{t.label.toUpperCase()}</span>
                        {!isMobile && <div style={{ flex: 1 }}><Bar value={t.percent} color={t.color} height={12} shadow /></div>}
                        <Tag label={`${t.percent}%`} bg={t.color} />
                      </div>
                      {isMobile && <Bar value={t.percent} color={t.color} height={12} shadow />}
                    </div>
                  ))}
                </div>
              </Panel>
            )
          })()}

          {/* Top performers */}
          <Panel title="TOP PERFORMING STUDENTS" accent={C.green} p={S[4]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {topStudents === null
                ? [C.green, C.cyan, C.yellow, C.purple, C.red].map((color, i) => (
                    <div key={i} className="skeleton-pulse" style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: C.paper }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, opacity: 0.35 }} />
                      <div style={{ flex: 1, height: 14, background: C.mutedLt, borderRadius: R.sm }} />
                      <div style={{ width: 52, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
                      <div style={{ width: 36, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
                    </div>
                  ))
                : topStudents.length === 0
                ? <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[4] }}>NO QUIZ RESULTS YET</div>
                : topStudents.map((s) => (
                    <TopPerformerRow key={s.ucenecId} s={s} onClick={() => navigate(`/students/${s.ucenecId}`)} />
                  ))
              }
            </div>
          </Panel>
        </div>

      </div>
    </div>
  )
}
