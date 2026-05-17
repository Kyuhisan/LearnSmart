import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Topbar } from '../../components/ui/Topbar'
import { C } from '../../styles/tokens'
import '../../styles/profile.css'

const ACTIVITY: ActivityItem[] = [
  { icon: '⚡', iconBg: C.cyanLt,   title: 'Completed Quiz #12 — Binary Trees', time: '2H AGO',  badge: '84%'     },
  { icon: '📚', iconBg: C.yellowLt, title: 'Resumed: Machine Learning Fundamentals', time: '4H AGO',  badge: 'CH. 3'   },
  { icon: '🏆', iconBg: C.greenLt,  title: 'Moved to rank #4 on leaderboard',   time: 'TODAY',  badge: '+150 XP' },
  { icon: '✅', iconBg: C.purpleLt, title: 'Completed module: Linear Algebra',   time: '2D AGO', badge: 'DONE'    },
]

export function StudentProfile() {
  const { profil, signOut } = useAuth()
  const navigate = useNavigate()

  if (!profil) return null

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-main" style={{ padding: 0 }}>
      <Topbar
        escape={false}
        title="MY PROFILE"
        subtitle="Account · learning style · activity"
        actions={<ComicBtn sm color={C.cyan}>🔔 2</ComicBtn>}
      />

      <div className="prof-content">
        <ProfHero username={profil.username} isTeacher={false} onSignOut={handleSignOut} />

        <div className="prof-stats-row">
          <StatCard label="IN PROGRESS" value="3"  sub="modules active"   bg={C.yellowLt} style={{ flex: 1 }} />
          <StatCard label="COMPLETED"   value="4"  sub="modules finished" bg={C.greenLt}  style={{ flex: 1 }} />
          <StatCard label="QUIZZES"     value="12" sub="quizzes taken"    bg={C.cyanLt}   style={{ flex: 1 }} />
        </div>

        <ActivityPanel items={ACTIVITY} title="RECENT ACTIVITY" />
      </div>
    </div>
  )
}
