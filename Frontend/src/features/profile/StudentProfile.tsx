import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMojiRezultati } from '../quiz/quizStudentApi'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Topbar } from '../../components/ui/Topbar'
import { LearningStylePanel } from './LearningStylePanel'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { Bar } from '../../components/ui/Bar'
import { STUDENT_PROFILE, STUDENT_STATS } from './mockData'
import '../../styles/profile.css'

const ACTIVITY: ActivityItem[] = [
  { iconBg: C.cyanLt,   title: 'Completed Quiz #12 — Binary Trees',       time: '2H AGO', badge: '84%'     },
  { iconBg: C.yellowLt, title: 'Resumed: Machine Learning Fundamentals',   time: '4H AGO', badge: 'CH. 3'   },
  { iconBg: C.greenLt,  title: 'Moved to rank #4 on leaderboard',          time: 'TODAY',  badge: '+150 XP' },
  { iconBg: C.purpleLt, title: 'Completed module: Linear Algebra',         time: '2D AGO', badge: 'DONE'    },
]

export function StudentProfile() {
  const { profil, session } = useAuth()
  const navigate = useNavigate()
  const [quizCount, setQuizCount] = useState<number | null>(null)
  const [quizAvg, setQuizAvg] = useState<number | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    getMojiRezultati(session.access_token).then((data: { odstotek: number }[]) => {
      if (!Array.isArray(data) || data.length === 0) {
        setQuizCount(0)
        setQuizAvg(null)
      } else {
        setQuizCount(data.length)
        setQuizAvg(Math.round(data.reduce((sum, r) => sum + r.odstotek, 0) / data.length))
      }
    })
  }, [session])

  if (!profil) return null

  const styleKey = profil.ucniTip && STYLE_INFO[profil.ucniTip as LearningStyle] ? profil.ucniTip as LearningStyle : null
  const styleInfo = styleKey ? STYLE_INFO[styleKey] : null
  const varkScores = profil.varkScores ?? null

  return (
    <div className="dashboard-main" style={{ padding: 0 }}>
      <Topbar
        title="MY PROFILE"
        subtitle="Account · learning style · activity"
        actions={<ComicBtn sm color={C.cyan} onClick={() => navigate('/notifications')}>2 NEW</ComicBtn>}
      />

      <div className="prof-content">
        <ProfHero
          username={profil.username}
          isTeacher={false}
          level={profil.nivo}
          learningType={styleInfo ? styleInfo.label.toUpperCase() : undefined}
          streak={STUDENT_PROFILE.streak}
          onRetakeVark={() => navigate('/questionnaire')}
          onSettings={() => navigate('/settings')}
        />

        <div className="quiz-stat-grid">
          <StatCard
            label="XP TOTAL"
            value={(profil.xp).toLocaleString()}
            sub={`${200 - (profil.xp % 200)} XP to Level ${profil.nivo + 1}`}
            bg={C.yellowLt}
          />
          <StatCard
            label="QUIZZES"
            value={quizCount === null ? '…' : String(quizCount)}
            sub={quizCount === 0 ? 'no quizzes completed yet' : quizAvg !== null ? `avg. ${quizAvg}% score` : ''}
            bg={C.cyanLt}
          />
          <StatCard
            label="STREAK"
            value={`${STUDENT_STATS.streak}d`}
            sub={`best: ${STUDENT_STATS.bestStreak} days`}
            bg={C.redLt}
          />
          <StatCard
            label="ACHIEVEMENTS"
            value={STUDENT_STATS.badges}
            sub={`${STUDENT_STATS.badgesInProgress} in progress`}
            bg={C.purpleLt}
          />
        </div>

        <div style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.base, boxShadow: mkShadow(), background: C.paper, padding: `${S[3]} ${S[4]}`, display: 'flex', flexDirection: 'column', gap: S[2] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>LEVEL {profil.nivo}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{profil.xp % 200} / 200 XP</span>
          </div>
          <Bar value={profil.xp % 200} max={200} color={C.yellow} shadow />
          <span style={{ fontSize: FS.xs, color: C.muted, fontFamily: "'Space Mono', monospace" }}>{200 - (profil.xp % 200)} XP TO LEVEL {profil.nivo + 1}</span>
        </div>

        <LearningStylePanel
          learningStyle={styleKey}
          varkScores={varkScores}
          onRetakeVark={() => navigate('/questionnaire')}
        />

        <ActivityPanel items={ACTIVITY} title="RECENT ACTIVITY" showBadge={false} />
      </div>
    </div>
  )
}
