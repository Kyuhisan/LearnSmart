import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, STYLE_INFO, mkShadow } from '../../styles/tokens'

import {
  STUDENT_DETAIL,
  STUDENT_QUIZ_RECORDS,
} from './mockData'

import '../../styles/studentDetailPage.css'

function styleInfo(style: string) {
  return STYLE_INFO[style.toLowerCase() as keyof typeof STYLE_INFO]
}

function scoreColor(score: number): string {
  if (score >= 85) return C.green
  if (score >= 65) return C.yellow
  return C.red
}

function scoreBg(score: number): string {
  if (score >= 85) return C.greenLt
  if (score >= 65) return C.yellowLt
  return C.redLt
}

export function ProfessorStudentDetail() {
  const navigate = useNavigate()
  const isMobile = useBreakpoint() === 'mobile'
  const student = STUDENT_DETAIL
  const info = styleInfo(student.learningStyle)

  return (
    <div className="dashboard-main">
      <Topbar
        title={student.fullName.toUpperCase()}
        subtitle={`Student profile · last active ${student.lastActive.toLowerCase()}`}
        back={() => navigate(-1)}
      />
      <div className="student-detail-page">

        {/* Hero card */}
        <ComicBox bg={info.bg} p={S[5]} style={{ paddingLeft: isMobile ? S[4] : S[8], paddingRight: isMobile ? S[4] : S[8] }}>

          {/* Dot pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
            backgroundSize: '16px 16px', opacity: 0.13,
            borderRadius: R.base, pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {isMobile ? (
              /* Mobile: tags → avatar+name → stats → buttons */
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                <div style={{ display: 'flex', gap: S[1.5], flexWrap: 'nowrap' }}>
                  <Tag label={info.label.toUpperCase()} bg={info.color} color="#fff" />
                  <Tag label="ML FUNDAMENTALS" bg={C.paper} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: C.ink, border: `${BW.base} solid ${C.ink}`, boxShadow: mkShadow(), display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.yellow, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.lg, flexShrink: 0 }}>
                    {student.fullName.charAt(0)}
                  </div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], color: C.ink, lineHeight: 1.1 }}>
                    {student.fullName}
                  </div>
                </div>
                <div style={{ fontSize: FS.sm, color: C.navy, fontWeight: 600 }}>
                  {student.xp.toLocaleString()} XP · avg {student.avgScore}% · last active {student.lastActive.toLowerCase()}
                </div>
                <div style={{ display: 'flex', gap: S[2] }}>
                  <ComicBtn color={C.paper} sm onClick={() => {}}>MESSAGE</ComicBtn>
                  <ComicBtn color={C.purple} dark sm onClick={() => {}}>ASSIGN BIT TUTOR</ComicBtn>
                </div>
              </div>
            ) : (
              /* Desktop/tablet: avatar left, info right */
              <div style={{ display: 'flex', alignItems: 'center', gap: S[5] }}>
                <div style={{ width: '7rem', height: '7rem', borderRadius: '50%', background: C.ink, border: `${BW.base} solid ${C.ink}`, boxShadow: mkShadow(), display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.yellow, fontFamily: "'Archivo Black', sans-serif", fontSize: FS['7xl'], flexShrink: 0 }}>
                  {student.fullName.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
                  <div style={{ display: 'flex', gap: S[1.5], flexWrap: 'wrap' }}>
                    <Tag label={info.label.toUpperCase()} bg={info.color} color="#fff" />
                    <Tag label="ML FUNDAMENTALS" bg={C.paper} />
                  </div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], color: C.ink, lineHeight: 1.1 }}>
                    {student.fullName}
                  </div>
                  <div style={{ fontSize: FS.md, color: C.navy, fontWeight: 600 }}>
                    {student.xp.toLocaleString()} XP · avg {student.avgScore}% · last active {student.lastActive.toLowerCase()}
                  </div>
                  <div style={{ display: 'flex', gap: S[2], marginTop: S[1], flexWrap: 'wrap' }}>
                    <ComicBtn color={C.paper} sm onClick={() => {}}>MESSAGE</ComicBtn>
                    <ComicBtn color={C.purple} dark sm onClick={() => {}}>ASSIGN BIT TUTOR</ComicBtn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ComicBox>

        {/* Bottom grid */}
        <div className="student-detail-grid">

          {/* Recent quizzes */}
          <Panel title="RECENT QUIZZES" accent={C.yellow}>
            <div className="student-detail-quiz-list">
              {STUDENT_QUIZ_RECORDS.map((quiz, i) => (
                <div
                  key={quiz.id}
                  className="student-detail-quiz-row"
                  style={{ borderBottom: i < STUDENT_QUIZ_RECORDS.length - 1 ? `1.5px dashed ${C.divider}` : 'none' }}
                >
                  <div
                    className="student-detail-quiz-score"
                    style={{ background: scoreBg(quiz.score), color: scoreColor(quiz.score), border: `${BW.base} solid ${scoreColor(quiz.score)}` }}
                  >
                    {quiz.score}
                  </div>
                  <div className="student-detail-quiz-info">
                    <span className="student-detail-quiz-title" style={{ color: C.ink }}>{quiz.title}</span>
                    <span className="student-detail-quiz-meta" style={{ color: C.muted }}>{quiz.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* BIT Insights */}
          <Panel title="BIT INSIGHTS" accent={C.purple}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>

              {/* BIT speech bubble */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
                <BitMascot size={48} mood="happy" float />
                <SpeechBubble color={C.purpleLt} style={{ flex: 1 }}>
                  <div style={{ fontSize: FS.xs, fontFamily: "'Archivo Black', sans-serif", color: C.muted, letterSpacing: 1 }}>BIT SAYS:</div>
                  <div style={{ fontSize: FS.sm, fontWeight: 600, marginTop: S[0.5], lineHeight: 1.4, color: C.ink }}>
                    {student.fullName.split(' ')[0]} is one of your top performers. Consider a stretch challenge — Neural Networks module ready.
                  </div>
                </SpeechBubble>
              </div>

              {/* Insight cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
                {[
                  { label: 'STRONGEST',      value: 'Gradient Descent (98%)', bg: C.greenLt,  tag: C.green  },
                  { label: 'STRUGGLES WITH', value: 'Regularization (58%)',   bg: C.redLt,    tag: C.red    },
                  { label: 'MOST ACTIVE',    value: 'Tue/Thu evenings',       bg: C.cyanLt,   tag: C.cyan   },
                  { label: 'AVG SESSION',    value: '24 min · 8 questions',   bg: C.yellowLt, tag: C.yellow },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, background: item.bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 0.5 }}>{item.label}</span>
                    <Tag label={item.value} bg={item.tag} />
                  </div>
                ))}
              </div>

            </div>
          </Panel>

        </div>

      </div>
    </div>
  )
}
