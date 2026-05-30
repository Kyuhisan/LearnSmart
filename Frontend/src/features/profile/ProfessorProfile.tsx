import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { Topbar } from '../../components/ui/Topbar'
import { C } from '../../styles/tokens'
import { getModuliUcitelj, getStilMix, getKviziUcitelja, type QuizDTO } from '../modules/moduleApi'
import '../../styles/profile.css'

interface BackendModul { id: string; jeObjavljen: boolean }

const ACTIVITY: ActivityItem[] = [
  { iconBg: C.purpleLt, title: 'AI generated: 8 quiz questions', time: '1H AGO', badge: 'PENDING' },
  { iconBg: C.yellowLt, title: 'Uploaded: Lecture 7 slides.pdf',  time: '3H AGO', badge: '12 MB'  },
  { iconBg: C.cyanLt,   title: '32 students started Quiz #14',    time: 'TODAY',  badge: 'LIVE'   },
  { iconBg: C.greenLt,  title: 'Weekly report exported',          time: '2D AGO', badge: 'CSV'    },
]

export function ProfessorProfile() {
  const { profil, session } = useAuth()
  const navigate = useNavigate()
  const [moduli, setModuli] = useState<BackendModul[]>([])
  const [stilMix, setStilMix] = useState<Record<string, number> | null>(null)
  const [kvizi, setKvizi] = useState<QuizDTO[] | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    getModuliUcitelj(session.access_token).then((data: BackendModul[]) => setModuli(data))
    getStilMix(session.access_token).then(setStilMix).catch(() => {})
    getKviziUcitelja(session.access_token).then(setKvizi).catch(() => setKvizi([]))
  }, [session])

  if (!profil) return null

  const publishedCount = moduli.filter(m => m.jeObjavljen).length
  const moduleValue = moduli.length > 0 ? String(moduli.length) : '…'
  const moduleSub = moduli.length > 0 ? `${publishedCount} published` : ''

  return (
    <div className="dashboard-main" style={{ padding: 0 }}>
      <Topbar
        title="PROFESSOR PROFILE"
        subtitle="Account · teaching activity · stats"
      />

      <div className="prof-content">
        <ProfHero username={profil.username} isTeacher onSettings={() => navigate('/settings')} moduleCount={moduli.length > 0 ? moduli.length : null} email={session?.user?.email} />

        <div className="quiz-stat-grid">
          <StatCard label="STUDENTS"  value={stilMix === null ? '…' : String(stilMix['_total'] ?? 0)}  sub={stilMix !== null ? `across ${moduli.length} module${moduli.length !== 1 ? 's' : ''}` : ''} bg={C.yellowLt} />
          <StatCard label="MODULES"   value={moduleValue}  sub={moduleSub}  bg={C.greenLt}  />
          <StatCard label="QUIZZES"   value={kvizi === null ? '…' : String(kvizi.length)} sub={kvizi !== null ? `${kvizi.filter(q => q.status === 'active').length} active` : ''} bg={C.pinkLt} />
          <StatCard label="AVG SCORE" value={kvizi === null ? '…' : kvizi.length === 0 ? '—' : '78%'} sub={kvizi === null ? '' : kvizi.length === 0 ? 'no quizzes taken yet' : `across ${kvizi.length} quiz${kvizi.length !== 1 ? 'zes' : ''}`} bg={C.purpleLt} />
        </div>

        <ActivityPanel items={ACTIVITY} title="TEACHING ACTIVITY" showBadge={false} />
      </div>
    </div>
  )
}
