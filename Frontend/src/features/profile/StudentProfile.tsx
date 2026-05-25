import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Topbar } from '../../components/ui/Topbar'
import { LearningStylePanel } from './LearningStylePanel'
import { C, STYLE_INFO } from '../../styles/tokens'
import { STUDENT_PROFILE, STUDENT_STATS } from './mockData'
import '../../styles/profile.css'

const ACTIVITY: ActivityItem[] = [
  { iconBg: C.cyanLt,   title: 'Completed Quiz #12 — Binary Trees',       time: '2H AGO', badge: '84%'     },
  { iconBg: C.yellowLt, title: 'Resumed: Machine Learning Fundamentals',   time: '4H AGO', badge: 'CH. 3'   },
  { iconBg: C.greenLt,  title: 'Moved to rank #4 on leaderboard',          time: 'TODAY',  badge: '+150 XP' },
  { iconBg: C.purpleLt, title: 'Completed module: Linear Algebra',         time: '2D AGO', badge: 'DONE'    },
]

export function StudentProfile() {
  const { profil, signOut } = useAuth()
  const navigate = useNavigate()

  if (!profil) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const styleInfo = STYLE_INFO[STUDENT_PROFILE.learningStyle]

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
          onSignOut={handleSignOut}
          level={STUDENT_PROFILE.level}
          learningType={styleInfo.label.toUpperCase()}
          streak={STUDENT_PROFILE.streak}
          onRetakeVark={() => navigate('/questionnaire')}
          onSettings={() => navigate('/settings')}
        />

        <div className="quiz-stat-grid">
          <StatCard
            label="XP TOTAL"
            value={STUDENT_STATS.xp.toLocaleString()}
            sub={`↑ ${STUDENT_STATS.xpRankDelta} positions this week`}
            bg={C.yellowLt}
          />
          <StatCard
            label="QUIZZES"
            value={STUDENT_STATS.quizzes}
            sub={`avg. ${STUDENT_STATS.avgScore}% score`}
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

        <LearningStylePanel
          learningStyle={STUDENT_PROFILE.learningStyle}
          varkScores={STUDENT_PROFILE.varkScores}
        />

        <ActivityPanel items={ACTIVITY} title="RECENT ACTIVITY" showBadge={false} />
      </div>
    </div>
  )
}
