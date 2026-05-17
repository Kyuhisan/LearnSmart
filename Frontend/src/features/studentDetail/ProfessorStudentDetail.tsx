import { useNavigate } from 'react-router-dom'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { BitMascot } from '../../components/ui/BitMascot'
import { Tag } from '../../components/ui/Tag'
import { C, BW, STYLE_INFO, mkShadow } from '../../styles/tokens'

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
      <div className="student-detail-page">

        {/* Topbar */}
        <div className="student-detail-topbar" style={{backgroundColor: C.paper ,borderBottom: `${BW.base} solid ${C.ink}`}}>
          <div className="student-detail-topbar-left">
            <ComicBtn sm color={C.paper} onClick={() => navigate("/students")}>← BACK</ComicBtn>
            <div>
              <div className="student-detail-topbar-name">{student.fullName.toUpperCase()}</div>
              <div className="student-detail-topbar-meta" style={{ color: C.muted }}>
                Student profile · last active {student.lastActive.toLowerCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Hero card */}
        <ComicBox bg={info.bg} p={0}>
          <div className="student-detail-hero">

            {/* Avatar */}
            <div
              className="student-detail-avatar"
              style={{ 
                border: `${BW.base} solid ${C.ink}`, 
                background: info.bg, 
                color: C.ink,
                boxShadow: mkShadow('lg') 
              }}
            >
              {student.fullName.charAt(0)}
            </div>

            {/* Info */}
            <div className="student-detail-hero-info">
              <div className="student-detail-hero-tags">
                <Tag label={`${info.icon} ${info.label.toUpperCase()}`} bg={info.bg} />
                <Tag label="ML FUNDAMENTALS" bg={C.paper} />
              </div>
              <h2 className="student-detail-name" style={{ color: C.ink }}>
                {student.fullName}
              </h2>
              <p className="student-detail-stats-line" style={{ color: C.muted }}>
                {student.xp.toLocaleString()} XP · {student.streak}d streak · last active {student.lastActive.toLowerCase()}
              </p>
              <div className="student-detail-hero-actions">
                <ComicBtn color={C.paper} sm onClick={() => {}}>
                  ✉ MESSAGE
                </ComicBtn>
                <ComicBtn color={C.pink} sm onClick={() => {}}>
                  ✦ ASSIGN BIT TUTOR
                </ComicBtn>
              </div>
            </div>

          </div>
        </ComicBox>

        {/* Bottom grid */}
        <div className="student-detail-grid">

          {/* Recent quizzes */}
          <ComicBox bg={C.paper} p={0}>
            <div
              className="student-detail-panel-header"
              style={{ background: C.yellowLt, borderBottom: `${BW.base} solid ${C.ink}`, color: C.ink }}
            >
              RECENT QUIZZES
            </div>
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
          </ComicBox>

          {/* BIT Insights */}
          <ComicBox bg={C.paper} p={0}>
            <div
              className="student-detail-panel-header"
              style={{ background: C.pinkLt, borderBottom: `${BW.base} solid ${C.ink}`, color: C.ink }}
            >
              BIT INSIGHTS
            </div>
            <div className="student-detail-insights">

              {/* BIT message */}
              <div className="student-detail-bit-row">
                <BitMascot size={52} mood="happy" />
                <p className="student-detail-bit-msg" style={{ color: C.ink }}>
                  {student.fullName.split(' ')[0]} is one of your top performers. Consider a stretch challenge — Neural Networks module ready.
                </p>
              </div>

              {/* Insight rows */}
              <div className="student-detail-insight-list">
                {[
                  { icon: '📗', label: 'Strongest',    value: 'Gradient Descent (98%)' },
                  { icon: '⚠',  label: 'Struggles with', value: 'Regularization (58%)' },
                  { icon: '🕐', label: 'Most active',   value: 'Tue/Thu evenings' },
                  { icon: '🎯', label: 'Avg session',   value: '24 min · 8 questions' },
                ].map((item) => (
                  <div key={item.label} className="student-detail-insight-row" style={{ borderBottom: `1.5px dashed ${C.divider}` }}>
                    <span className="student-detail-insight-label" style={{ color: C.muted }}>
                      {item.icon} {item.label}
                    </span>
                    <span className="student-detail-insight-value" style={{ color: C.ink }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </ComicBox>

        </div>

      </div>
    </div>
  )
}
