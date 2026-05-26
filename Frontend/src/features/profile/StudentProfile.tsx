import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Topbar } from '../../components/ui/Topbar'
import { LearningStylePanel } from './LearningStylePanel'
import { C, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { VARK_PROFILES } from '../dashboard/mockData'
import { STUDENT_PROFILE, STUDENT_STATS } from './mockData'
import '../../styles/profile.css'

const ACTIVITY: ActivityItem[] = [
  { iconBg: C.cyanLt,   title: 'Completed Quiz #12 — Binary Trees',       time: '2H AGO', badge: '84%'     },
  { iconBg: C.yellowLt, title: 'Resumed: Machine Learning Fundamentals',   time: '4H AGO', badge: 'CH. 3'   },
  { iconBg: C.greenLt,  title: 'Moved to rank #4 on leaderboard',          time: 'TODAY',  badge: '+150 XP' },
  { iconBg: C.purpleLt, title: 'Completed module: Linear Algebra',         time: '2D AGO', badge: 'DONE'    },
]

export function StudentProfile() {
  const { profil } = useAuth()
  const navigate = useNavigate()

  if (!profil) return null

  const KEY_MAP: Record<string, LearningStyle> = { V: 'visual', A: 'auditory', R: 'reading', K: 'kinesthetic' }
  const styleKey = profil.ucniTip && STYLE_INFO[profil.ucniTip as LearningStyle] ? profil.ucniTip as LearningStyle : null
  const styleInfo = styleKey ? STYLE_INFO[styleKey] : null
  const varkProfile = styleKey ? VARK_PROFILES[styleKey] : null
  const varkScores: Record<LearningStyle, number> | null = varkProfile
    ? varkProfile.vark.reduce((acc, v) => { acc[KEY_MAP[v.key]] = v.score; return acc }, { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 } as Record<LearningStyle, number>)
    : null

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
          level={STUDENT_PROFILE.level}
          learningType={styleInfo ? styleInfo.label.toUpperCase() : undefined}
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
          learningStyle={styleKey}
          varkScores={varkScores}
          onRetakeVark={() => navigate('/questionnaire')}
        />

        <ActivityPanel items={ACTIVITY} title="RECENT ACTIVITY" showBadge={false} />
      </div>
    </div>
  )
}
