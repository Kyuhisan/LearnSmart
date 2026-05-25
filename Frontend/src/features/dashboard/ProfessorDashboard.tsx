import { useState } from 'react'
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
import { C, S, FS, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import {
  PROFESSOR_STATS,
  PROFESSOR_MODULES,
  PROFESSOR_PENDING_QUIZZES,
  PROFESSOR_STYLE_MIX,
  PROFESSOR_TOP_PERFORMERS,
} from './mockData'

function TopPerformerRow({ s, onClick }: { s: typeof PROFESSOR_TOP_PERFORMERS[number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], background: hovered ? C.yellowLt : C.cream, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(hovered ? 'lg' : 'base'), cursor: 'pointer', transform: hovered ? 'translate(-1px, -1px)' : 'none', transition: 'background 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: STYLE_INFO[s.style].bg, border: `${BW.base} solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, flexShrink: 0 }}>
        {s.name.charAt(0)}
      </div>
      <span style={{ flex: 1, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>{s.name}</span>
      <Tag label={s.style} bg={STYLE_INFO[s.style].bg} />
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md }}>{s.score}</span>
    </div>
  )
}

export function ProfessorDashboard() {
  const navigate = useNavigate()
  const isMobile = useBreakpoint() === 'mobile'
  return (
    <div className="dashboard-main">

      <Topbar
        title="HOME BASE — PROF"
        subtitle="Friday · May 2 · 3 quizzes need approval"
        actions={<><ComicBtn sm color={C.cyan}>3 NEW</ComicBtn><ComicBtn sm color={C.paper}>SEARCH</ComicBtn></>}
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
              <div className="stat-card-value" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], lineHeight: 1, color: s.dark ? C.paper : C.ink }}>{s.value}</div>
              <div className="stat-card-label" style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: 1, marginTop: S[1], fontFamily: "'Archivo Black', sans-serif", color: s.dark ? C.paper : C.ink }}>{s.label}</div>
            </ComicBox>
          ))}
        </div>

        {/* AI Builder CTA */}
        <ComicBox bg={C.navy} p={S[5]} style={{ color: C.paper }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: S[3] }}>
            <div>
              <Tag label="GEMINI 2.5 FLASH" bg={C.yellow} />
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], marginTop: S[2], lineHeight: 1 }}>AI QUIZ BUILDER!</div>
              <div style={{ fontSize: FS.md, opacity: 0.8, marginTop: S[1], fontWeight: 600, maxWidth: 360 }}>
                Upload a PDF → AI extracts quiz questions → You review &amp; approve.
              </div>
            </div>
            <div style={{ display: 'flex', gap: S[2], flexWrap: 'nowrap' }}>
              <ComicBtn sm color={C.yellow} onClick={() => navigate('/upload')}>UPLOAD</ComicBtn>
              <ComicBtn sm color={C.pink} dark style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/ai-quiz-builder')}>AI BUILDER</ComicBtn>
            </div>
          </div>
        </ComicBox>

        {/* Modules + Pending quizzes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          {/* Your modules */}
          <Panel title="YOUR MODULES" accent={C.yellow} p={S[4]} action={<ComicBtn sm color={C.green}>+ NEW</ComicBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {PROFESSOR_MODULES.map((m) => (
                <div key={m.title} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? S[1] : S[3], padding: S[2], background: m.draft ? C.cream : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                  {isMobile ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title.toUpperCase()}</span>
                        {m.draft && <Tag label="○ DRAFT" bg={C.orangeLt} />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>{m.students} STUDENTS</span>
                        <ComicBtn sm color={C.yellow}>EDIT</ComicBtn>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md }}>{m.title.toUpperCase()}</span>
                          {m.draft && <span style={{ flexShrink: 0 }}><Tag label="○ DRAFT" bg={C.orangeLt} /></span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'] }}>{m.students}</div>
                        <div style={{ fontSize: FS['2xs'], fontWeight: 800, letterSpacing: 0.5 }}>STUDENTS</div>
                      </div>
                      <ComicBtn sm color={C.yellow}>EDIT</ComicBtn>
                    </>
                  )}
                </div>
              ))}
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
          <Panel title="STUDENT STYLE MIX" accent={C.purple} p={0}
            action={<Tag label="134 STUDENTS" bg={C.purpleLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: S[4] }}>
              {PROFESSOR_STYLE_MIX.map((t) => (
                <div key={t.label} style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[1.5]} ${S[3]}`, background: t.colorLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
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

          {/* Top performers */}
          <Panel title="TOP PERFORMING STUDENTS" accent={C.green} p={S[4]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {PROFESSOR_TOP_PERFORMERS.map((s) => (
                <TopPerformerRow key={s.id} s={s} onClick={() => navigate(`/students/${s.id}`)} />
              ))}
            </div>
          </Panel>
        </div>

      </div>
    </div>
  )
}
