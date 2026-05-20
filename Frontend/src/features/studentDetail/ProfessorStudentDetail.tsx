import { useNavigate } from 'react-router-dom'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { BitMascot } from '../../components/ui/BitMascot'
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
  const student = STUDENT_DETAIL
  const info = styleInfo(student.learningStyle)

  return (
    <div className="dashboard-main">
      <Topbar
        title={student.fullName.toUpperCase()}
        subtitle={`Student profile · last active ${student.lastActive.toLowerCase()}`}
        back={() => navigate('/students')}
      />
      <div className="student-detail-page">

        {/* Hero card — matches ProfHero layout */}
        <ComicBox bg={info.bg} p={S[5]} style={{ paddingLeft: S[8], paddingRight: S[8] }}>

          {/* Dot pattern overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            opacity: 0.13,
            borderRadius: R.base,
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: S[5], position: 'relative', zIndex: 1 }}>

            {/* Avatar */}
            <div style={{
              width: '7rem',
              height: '7rem',
              borderRadius: '50%',
              background: C.ink,
              border: `${BW.base} solid ${C.ink}`,
              boxShadow: mkShadow(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.yellow,
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS['7xl'],
              flexShrink: 0,
            }}>
              {student.fullName.charAt(0)}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>

              {/* Tags */}
              <div style={{ display: 'flex', gap: S[1.5], flexWrap: 'wrap' }}>
                <Tag label={info.label.toUpperCase()} bg={info.color} color="#fff" />
                <Tag label="ML FUNDAMENTALS" bg={C.paper} />
              </div>

              {/* Name */}
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS['5xl'],
                color: C.ink,
                lineHeight: 1.1,
              }}>
                {student.fullName}
              </div>

              {/* Stats line */}
              <div style={{ fontSize: FS.md, color: C.navy, fontWeight: 600 }}>
                {student.xp.toLocaleString()} XP · avg {student.avgScore}% · last active {student.lastActive.toLowerCase()}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: S[2], marginTop: S[1], flexWrap: 'wrap' }}>
                <ComicBtn color={C.paper} sm onClick={() => {}}>MESSAGE</ComicBtn>
                <ComicBtn color={C.purple} dark sm onClick={() => {}}>ASSIGN BIT TUTOR</ComicBtn>
              </div>

            </div>
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
            <div className="student-detail-insights">

              {/* BIT message */}
              <div className="student-detail-bit-row" style={{ alignItems: 'center' }}>
                <BitMascot size={52} mood="happy" />
                <p className="student-detail-bit-msg" style={{ color: C.ink }}>
                  {student.fullName.split(' ')[0]} is one of your top performers. Consider a stretch challenge — Neural Networks module ready.
                </p>
              </div>

              {/* Insight rows */}
              <div className="student-detail-insight-list">
                {[
                  { label: 'Strongest',      value: 'Gradient Descent (98%)' },
                  { label: 'Struggles with', value: 'Regularization (58%)'   },
                  { label: 'Most active',    value: 'Tue/Thu evenings'        },
                  { label: 'Avg session',    value: '24 min · 8 questions'    },
                ].map((item) => (
                  <div key={item.label} className="student-detail-insight-row" style={{ borderBottom: `1.5px dashed ${C.divider}` }}>
                    <span className="student-detail-insight-label" style={{ color: C.muted }}>
                      {item.label}
                    </span>
                    <span className="student-detail-insight-value" style={{ color: C.ink }}>
                      {item.value}
                    </span>
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
