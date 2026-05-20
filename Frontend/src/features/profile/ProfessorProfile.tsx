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
  { iconBg: C.purpleLt, title: 'AI generated: 8 quiz questions', time: '1H AGO', badge: 'PENDING' },
  { iconBg: C.yellowLt, title: 'Uploaded: Lecture 7 slides.pdf',  time: '3H AGO', badge: '12 MB'  },
  { iconBg: C.cyanLt,   title: '32 students started Quiz #14',    time: 'TODAY',  badge: 'LIVE'   },
  { iconBg: C.greenLt,  title: 'Weekly report exported',          time: '2D AGO', badge: 'CSV'    },
]

export function ProfessorProfile() {
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
        title="PROFESSOR PROFILE"
        subtitle="Account · teaching activity · stats"
        actions={<ComicBtn sm color={C.cyan}>3 NEW</ComicBtn>}
      />

      <div className="prof-content">
        <ProfHero username={profil.username} isTeacher onSignOut={handleSignOut} />

        <div className="prof-stats-row">
          <StatCard label="STUDENTS"  value="248" sub="134 active today"   bg={C.yellowLt} style={{ flex: 1 }} />
          <StatCard label="MODULES"   value="12"  sub="4 published"        bg={C.greenLt}  style={{ flex: 1 }} />
          <StatCard label="QUIZZES"   value="89"  sub="11 AI-pending"      bg={C.pinkLt}   style={{ flex: 1 }} />
          <StatCard label="AVG SCORE" value="78%" sub="↑ 4% vs last term"  bg={C.purpleLt} style={{ flex: 1 }} />
        </div>

        <ActivityPanel items={ACTIVITY} title="TEACHING ACTIVITY" />
      </div>
    </div>
  )
}
