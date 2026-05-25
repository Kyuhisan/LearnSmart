import { useState } from 'react'
import { StatCard } from '../../components/ui/StatCard'
import { Panel } from '../../components/ui/Panel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { QuizSession } from './QuizSession'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { QUIZ_STATS, AVAILABLE_QUIZZES, COMPLETED_QUIZZES } from './mockData'

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY:   C.greenLt,
  MEDIUM: C.yellowLt,
  HARD:   C.redLt,
}

export function StudentQuiz() {
  const [sessionActive, setSessionActive] = useState(false)
  const isMobile = useBreakpoint() === 'mobile'

  if (sessionActive) return <QuizSession onClose={() => setSessionActive(false)} />

  return (
    <div className="dashboard-main">
      <Topbar
        title="QUIZZES"
        subtitle="Test your knowledge · track your progress"
        actions={<Tag label={`${QUIZ_STATS.totalCompleted} / ${QUIZ_STATS.totalAvailable} DONE`} bg={C.cyanLt} />}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Stats row */}
        <div className="quiz-stat-grid">
          <StatCard label="AVG SCORE"     value={`${QUIZ_STATS.avgScore}%`}      sub="across all quizzes"          bg={C.cyanLt}   />
          <StatCard label="BEST SCORE"    value={`${QUIZ_STATS.bestScore}%`}     sub="Quiz #12 — Binary Trees"    bg={C.greenLt}  />
          <StatCard label="FASTEST TIME"  value={QUIZ_STATS.fastestTime}         sub="Quiz #12 — Binary Trees"    bg={C.yellowLt} />
          <StatCard label="QUIZ STREAK"   value={`${QUIZ_STATS.streak}d`}        sub="keep it going!"             bg={C.redLt}    />
        </div>

        {/* Available quizzes */}
        <Panel title="AVAILABLE QUIZZES" accent={C.yellow}
          action={<Tag label={`${AVAILABLE_QUIZZES.length} PENDING`} bg={C.yellowLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {AVAILABLE_QUIZZES.map(q => isMobile ? (
              <div key={q.id} style={{
                display: 'flex',
                border: `${BW.base} solid ${C.ink}`,
                borderRadius: R.sm,
                boxShadow: mkShadow(),
                background: q.dueDate ? C.orangeLt : q.moduleColorLt,
                overflow: 'hidden',
              }}>
                {/* Left: vertical DUE label (only if dueDate exists) */}
                {q.dueDate && (
                  <div style={{
                    writingMode: 'vertical-lr',
                    transform: 'rotate(180deg)',
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: FS.xs,
                    letterSpacing: '0.1em',
                    color: C.ink,
                    background: C.orange,
                    padding: `${S[2]} ${S[1.5]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {q.dueDate}
                  </div>
                )}
                {/* Right: content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
                  <div style={{ display: 'flex', gap: S[1] }}>
                    <Tag label={`${q.questions}Q`} bg={C.paper} />
                    <Tag label={q.timeLimit} bg={C.paper} />
                    <Tag label={q.difficulty} bg={DIFFICULTY_COLOR[q.difficulty]} />
                  </div>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.title}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{q.module}</span>
                </div>
              </div>
            ) : (
              <div key={q.id} style={{
                display: 'flex', alignItems: 'center', gap: S[3],
                padding: `${S[2.5]} ${S[3]}`,
                border: `${BW.base} solid ${C.ink}`,
                borderRadius: R.sm,
                boxShadow: mkShadow(),
                background: q.moduleColorLt,
              }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.title}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{q.module}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
                  <Tag label={`${q.questions}Q`} bg={C.paper} />
                  <Tag label={q.timeLimit} bg={C.paper} />
                  <Tag label={q.difficulty} bg={DIFFICULTY_COLOR[q.difficulty]} />
                  {q.dueDate && <Tag label={q.dueDate} bg={C.orangeLt} />}
                  <ComicBtn sm color={C.yellow} hoverColor={C.yellowLt} onClick={() => setSessionActive(true)}>START</ComicBtn>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Completed quizzes */}
        <Panel title="COMPLETED QUIZZES" accent={C.green}
          action={<Tag label={`${COMPLETED_QUIZZES.length} DONE`} bg={C.greenLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {COMPLETED_QUIZZES.map(q => isMobile ? (
              <div key={q.id} style={{
                display: 'flex',
                border: `${BW.base} solid ${C.ink}`,
                borderRadius: R.sm,
                boxShadow: mkShadow(),
                background: q.passed ? C.greenLt : C.redLt,
                overflow: 'hidden',
              }}>
                {/* Left: vertical PASSED/FAILED label */}
                <div style={{
                  writingMode: 'vertical-lr',
                  transform: 'rotate(180deg)',
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: FS.xs,
                  letterSpacing: '0.1em',
                  color: C.ink,
                  background: q.passed ? C.green : C.red,
                  padding: `${S[2]} ${S[1.5]}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {q.passed ? 'PASSED' : 'FAILED'}
                </div>
                {/* Right: content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1.5], padding: `${S[2.5]} ${S[3]}` }}>
                  {/* Row 1: tags */}
                  <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
                    <Tag label={`${q.score}%`} bg={q.score >= 80 ? C.greenLt : q.score >= 65 ? C.yellowLt : C.redLt} />
                    <Tag label={q.timeTaken} bg={C.paper} />
                    <Tag label={q.completedOn} bg={C.paper} />
                  </div>
                  {/* Row 2: title */}
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.title}</span>
                  {/* Row 3: module */}
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{q.module}</span>
                </div>
              </div>
            ) : (
              <div key={q.id} style={{
                display: 'flex', alignItems: 'center', gap: S[3],
                padding: `${S[2.5]} ${S[3]}`,
                border: `${BW.base} solid ${C.ink}`,
                borderRadius: R.sm,
                boxShadow: mkShadow(),
                background: q.moduleColorLt,
              }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{q.title}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{q.module}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
                  <Tag label={`${q.score}%`} bg={q.score >= 80 ? C.greenLt : q.score >= 65 ? C.yellowLt : C.redLt} />
                  <Tag label={q.timeTaken} bg={C.paper} />
                  <Tag label={q.completedOn} bg={C.paper} />
                  <Tag label={q.passed ? 'PASSED' : 'FAILED'} bg={q.passed ? C.greenLt : C.redLt} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}
