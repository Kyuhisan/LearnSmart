import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { GhostBtn } from '../../components/ui/GhostBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, STYLE_INFO } from '../../styles/tokens'
import {
  PROFESSOR_STATS,
  PROFESSOR_MODULES,
  PROFESSOR_PENDING_QUIZZES,
  PROFESSOR_STYLE_MIX,
  PROFESSOR_TOP_PERFORMERS,
} from './mockData'

export function ProfessorDashboard() {
  return (
    <div className="dashboard-main">

      <Topbar
        title="HOME BASE — PROF"
        subtitle="Friday · May 2 · 3 quizzes need approval"
        actions={<><ComicBtn sm color={C.cyan}>🔔 3</ComicBtn><ComicBtn sm color={C.pink}>⌕</ComicBtn></>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* BIT greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <BitMascot size={70} mood="wink" float />
          <SpeechBubble color={C.cyan} style={{ flex: 1, maxWidth: 480 }}>
            <div style={{ fontSize: FS.xs, fontFamily: "'Archivo Black', sans-serif", letterSpacing: 1 }}>BIT SAYS:</div>
            <div style={{ fontSize: FS.lg, fontWeight: 700, marginTop: S[1], lineHeight: 1.4 }}>
              Hi Prof! <strong>3 AI-generated quizzes</strong> are waiting for your review. 134 students online today. ✨
            </div>
          </SpeechBubble>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
          {PROFESSOR_STATS.map((s) => (
            <ComicBox key={s.label} bg={s.bg} p={S[4]}>
              <div style={{ fontSize: FS['4xl'] }}>{s.emoji}</div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], lineHeight: 1, marginTop: S[1], color: s.dark ? '#fff' : C.ink }}>{s.value}</div>
              <div style={{ fontSize: FS.xs, fontWeight: 800, letterSpacing: 1, marginTop: S[1], fontFamily: "'Archivo Black', sans-serif", color: s.dark ? '#fff' : C.ink }}>{s.label}</div>
            </ComicBox>
          ))}
        </div>

        {/* AI Builder CTA */}
        <ComicBox bg={C.navy} p={S[5]} style={{ color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.1 }}>✨</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: S[3], position: 'relative' }}>
            <div>
              <Tag label="GEMINI 2.5 FLASH" bg={C.yellow} />
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], marginTop: S[2], lineHeight: 1 }}>AI QUIZ BUILDER!</div>
              <div style={{ fontSize: FS.md, opacity: 0.8, marginTop: S[1], fontWeight: 600, maxWidth: 360 }}>
                Upload a PDF → AI extracts quiz questions → You review &amp; approve.
              </div>
            </div>
            <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
              <ComicBtn color={C.yellow}>📤 UPLOAD</ComicBtn>
              <ComicBtn color={C.pink} dark>✨ AI BUILDER</ComicBtn>
            </div>
          </div>
        </ComicBox>

        {/* Modules + Pending quizzes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3] }}>

          {/* Your modules */}
          <ComicBox bg={C.paper} p={S[4]}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag label="YOUR MODULES" bg={C.yellow} />
              <ComicBtn sm color={C.green}>+ NEW</ComicBtn>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[3] }}>
              {PROFESSOR_MODULES.map((m) => (
                <div key={m.title} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: S[2], background: m.draft ? C.cream : C.yellowLt, border: `${BW.medium} solid ${C.ink}` }}>
                  <div style={{ fontSize: FS['3xl'] }}>{m.mascot}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md }}>{m.title.toUpperCase()}</span>
                      {m.draft && <Tag label="DRAFT" bg={C.muted} color="#fff" />}
                    </div>
                    {!m.draft && (
                      <div style={{ marginTop: S[1] }}>
                        <Bar value={m.completion} color={C.green} height="5px" />
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'] }}>{m.students}</div>
                    <div style={{ fontSize: FS['2xs'], fontWeight: 800, letterSpacing: 0.5 }}>STUDENTS</div>
                  </div>
                  <GhostBtn>EDIT</GhostBtn>
                </div>
              ))}
            </div>
          </ComicBox>

          {/* Pending quizzes */}
          <ComicBox bg={C.paper} p={S[4]}>
            <Tag label="PENDING" bg={C.red} color="#fff" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[3] }}>
              {PROFESSOR_PENDING_QUIZZES.map((q) => (
                <div key={q.module} style={{ padding: S[2], background: C.redLt, border: `${BW.base} solid ${C.ink}` }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs }}>{q.module.toUpperCase()}</div>
                  <div style={{ fontSize: FS.xs, fontWeight: 700, color: C.muted, marginTop: S[1] }}>{q.topic} · {q.questions} questions</div>
                  <div style={{ display: 'flex', gap: S[1], marginTop: S[2] }}>
                    <ComicBtn sm color={C.green} dark>✓ APPROVE</ComicBtn>
                    <GhostBtn>EDIT</GhostBtn>
                  </div>
                </div>
              ))}
            </div>
          </ComicBox>
        </div>

        {/* Style mix + Top performers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>

          {/* Style mix */}
          <ComicBox bg={C.paper} p={S[4]}>
            <Tag label="STYLE MIX" bg={C.purple} color="#fff" />
            <div style={{ fontSize: FS.xs, fontWeight: 700, color: C.muted, marginTop: S[1] }}>134 enrolled students</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[3] }}>
              {PROFESSOR_STYLE_MIX.map((t) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <span style={{ fontSize: FS['2xl'], width: 24 }}>{t.emoji}</span>
                  <span style={{ width: 80, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs }}>{t.label.toUpperCase()}</span>
                  <div style={{ flex: 1 }}><Bar value={t.percent} color={t.color} height="10px" /></div>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, width: 32, textAlign: 'right' }}>{t.percent}%</span>
                </div>
              ))}
            </div>
          </ComicBox>

          {/* Top performers */}
          <ComicBox bg={C.paper} p={S[4]}>
            <Tag label="TOP PERFORMERS" bg={C.green} color="#fff" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[3] }}>
              {PROFESSOR_TOP_PERFORMERS.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], background: C.cream, border: `${BW.base} solid ${C.ink}` }}>
                  <span style={{ fontSize: FS['3xl'] }}>{s.emoji}</span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: FS.sm }}>{s.name}</span>
                  <Tag label={s.style} bg={STYLE_INFO[s.style].bg} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md }}>{s.score}</span>
                </div>
              ))}
            </div>
          </ComicBox>
        </div>

      </div>
    </div>
  )
}
