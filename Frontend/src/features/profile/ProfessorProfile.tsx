import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { Topbar } from '../../components/ui/Topbar'
import { C } from '../../styles/tokens'
import { getModuliUcitelj, getStilMix, getKviziUcitelja, type QuizDTO } from '../modules/moduleApi'
import { getProfActivity, type ProfActivityItem } from '../analytics/profesorStatsApi'
import '../../styles/profile.css'

const API = import.meta.env.VITE_API_URL

interface BackendModul { id: string; jeObjavljen: boolean }

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMin / 60)
  const diffD = Math.floor(diffH / 24)
  if (diffMin < 60) return `${diffMin}M AGO`
  if (diffH < 24) return `${diffH}H AGO`
  if (diffD === 1) return 'YESTERDAY'
  if (diffD < 7) return `${diffD}D AGO`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()
}

export function ProfessorProfile() {
  const { profil, session, signOut } = useAuth()
  const [moduli, setModuli] = useState<BackendModul[]>([])
  const [stilMix, setStilMix] = useState<Record<string, number> | null>(null)
  const [kvizi, setKvizi] = useState<QuizDTO[] | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    if (!session?.access_token) return
    const token = session.access_token

    getModuliUcitelj(token).then((data: BackendModul[]) => setModuli(data))
    getStilMix(token).then(setStilMix).catch(() => {})
    getKviziUcitelja(token).then(setKvizi).catch(() => setKvizi([]))

    getProfActivity(token)
      .then((data: ProfActivityItem[]) => {
        const items: ActivityItem[] = data.map(d => ({
          iconBg: d.type === 'QUIZ_PUBLISHED' ? C.greenLt
                : d.type === 'QUIZ_RESULT'    ? C.cyanLt
                : C.yellowLt,
          title: d.title,
          time: formatTime(d.date),
          badge: d.badge,
        }))
        setActivity(items)
      })
      .catch(() => {})
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
        <ProfHero
          username={profil.username}
          isTeacher
          moduleCount={moduli.length > 0 ? moduli.length : null}
          email={session?.user?.email}
          onDeleteAccount={async () => {
            await fetch(`${API}/api/me`, { method: 'DELETE', headers: { Authorization: `Bearer ${session?.access_token}` } })
            await signOut()
          }}
        />

        <div className="quiz-stat-grid">
          <StatCard
            label="STUDENTS"
            value={stilMix === null ? '…' : String(stilMix['_total'] ?? 0)}
            sub={stilMix !== null ? `across ${moduli.length} module${moduli.length !== 1 ? 's' : ''}` : ''}
            bg={C.yellowLt}
          />
          <StatCard
            label="MODULES"
            value={moduleValue}
            sub={moduleSub}
            bg={C.greenLt}
          />
          <StatCard
            label="QUIZZES"
            value={kvizi === null ? '…' : String(kvizi.length)}
            sub={kvizi !== null ? `${kvizi.filter(q => q.status === 'active').length} active` : ''}
            bg={C.pinkLt}
          />
          <StatCard
            label="AVG SCORE"
            value={kvizi === null ? '…' : kvizi.length === 0 ? '—' : '78%'}
            sub={kvizi === null ? '' : kvizi.length === 0 ? 'no quizzes taken yet' : `across ${kvizi.length} quiz${kvizi.length !== 1 ? 'zes' : ''}`}
            bg={C.purpleLt}
          />
        </div>

        <ActivityPanel
          items={activity}
          title="TEACHING ACTIVITY"
          showBadge
        />
      </div>
    </div>
  )
}