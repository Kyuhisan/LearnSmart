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
import { C, S, FS, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { Tag } from '../../components/ui/Tag'
import { STUDENT_PROFILE, STUDENT_STATS } from './mockData'
import '../../styles/profile.css'

const ACTIVITY: ActivityItem[] = [
  { iconBg: C.cyanLt,   title: 'Completed Quiz #12 — Binary Trees',       time: '2H AGO', badge: '84%'     },
  { iconBg: C.yellowLt, title: 'Resumed: Machine Learning Fundamentals',   time: '4H AGO', badge: 'CH. 3'   },
  { iconBg: C.greenLt,  title: 'Moved to rank #4 on leaderboard',          time: 'TODAY',  badge: '+150 XP' },
  { iconBg: C.purpleLt, title: 'Completed module: Linear Algebra',         time: '2D AGO', badge: 'DONE'    },
]

const API = import.meta.env.VITE_API_URL

export function StudentProfile() {
  const { profil, session, signOut } = useAuth()
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
        actions={<ComicBtn sm color={C.cyan} onClick={() => navigate('/notifications')}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          2 NEW
        </ComicBtn>}
      />

      <div className="prof-content">
        <ProfHero
          username={profil.username}
          isTeacher={false}
          level={profil.nivo}
          xp={profil.xp}
          learningType={styleInfo ? styleInfo.label.toUpperCase() : undefined}
          onRetakeVark={() => navigate('/questionnaire')}
          onDeleteAccount={async () => {
            await fetch(`${API}/api/me`, { method: 'DELETE', headers: { Authorization: `Bearer ${session?.access_token}` } })
            await signOut()
          }}
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
            label="STREAK · WIP"
            value={`${STUDENT_STATS.streak}d`}
            sub={`best: ${STUDENT_STATS.bestStreak} days`}
            bg={C.redLt}
          />
          <StatCard
            label="ACHIEVEMENTS · WIP"
            value={STUDENT_STATS.badges}
            sub={`${STUDENT_STATS.badgesInProgress} in progress`}
            bg={C.purpleLt}
          />
        </div>

<LearningStylePanel
          learningStyle={styleKey}
          varkScores={varkScores}
          onRetakeVark={() => navigate('/questionnaire')}
        />

        <ActivityPanel items={ACTIVITY} title="RECENT ACTIVITY" showBadge={false} action={<Tag label="WIP" bg={C.mutedLt} />} />
      </div>
    </div>
  )
}
