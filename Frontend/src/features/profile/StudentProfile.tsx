import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMojiRezultati } from '../quiz/quizStudentApi'
import { getMojiVpisi } from '../modules/moduleApi'
import { getProgressStats, type ProgressStats } from '../progress/progressStatsApi'
import { StatCard } from '../../components/ui/StatCard'
import { ProfHero } from '../../components/professor/ProfHero'
import { ActivityPanel, type ActivityItem } from '../../components/professor/ActivityPanel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Topbar } from '../../components/ui/Topbar'
import { LearningStylePanel } from './LearningStylePanel'
import { C, STYLE_INFO, type LearningStyle } from '../../styles/tokens'
import { STUDENT_STATS } from './mockData'
import '../../styles/profile.css'

const API = import.meta.env.VITE_API_URL

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

export function StudentProfile() {
  const { profil, session, signOut } = useAuth()
  const navigate = useNavigate()
  const [quizCount, setQuizCount] = useState<number | null>(null)
  const [quizAvg, setQuizAvg] = useState<number | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    const token = session.access_token

    Promise.all([
      getMojiRezultati(token),
      getMojiVpisi(token),
    ]).then(([rezultati, vpisi]) => {
      const rArr = Array.isArray(rezultati) ? rezultati : []
      setQuizCount(rArr.length)
      setQuizAvg(rArr.length > 0
        ? Math.round(rArr.reduce((s: number, r: { odstotek: number }) => s + r.odstotek, 0) / rArr.length)
        : null)

      const quizItems: (ActivityItem & { _date: string })[] = rArr
        .filter((r: { oddanoOb?: string }) => r.oddanoOb)
        .map((r: { kvizNaziv: string; odstotek: number; xpZasluzen: number; oddanoOb: string; predmetNaziv?: string }) => ({
          iconBg: r.odstotek >= 80 ? C.greenLt : r.odstotek >= 60 ? C.yellowLt : C.redLt,
          title: `Completed: ${r.kvizNaziv}${r.predmetNaziv ? ` · ${r.predmetNaziv}` : ''}`,
          time: formatTime(r.oddanoOb),
          badge: `${r.odstotek}%`,
          _date: r.oddanoOb,
        }))

      const vArr = Array.isArray(vpisi) ? vpisi : []
      const vpisItems: (ActivityItem & { _date: string })[] = vArr
        .filter((v: { vpisanOb?: string }) => v.vpisanOb)
        .map((v: { predmetNaziv: string; vpisanOb: string }) => ({
          iconBg: C.cyanLt,
          title: `Enrolled in: ${v.predmetNaziv}`,
          time: formatTime(v.vpisanOb),
          badge: 'ENROLLED',
          _date: v.vpisanOb,
        }))

      const merged = [...quizItems, ...vpisItems]
        .sort((a, b) => new Date(b._date).getTime() - new Date(a._date).getTime())
        .slice(0, 10)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ _date: _unused, ...item }) => item)

      setActivity(merged)
    })
    getProgressStats(token).then(setProgressStats).catch(() => {})
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
          <StatCard label="XP TOTAL" value={(profil.xp).toLocaleString()} sub={`${200 - (profil.xp % 200)} XP to Level ${profil.nivo + 1}`} bg={C.yellowLt} />
          <StatCard label="QUIZZES" value={quizCount === null ? '…' : String(quizCount)} sub={quizCount === 0 ? 'no quizzes completed yet' : quizAvg !== null ? `avg. ${quizAvg}% score` : ''} bg={C.cyanLt} />
          <StatCard label="STREAK" value={`${progressStats?.streak ?? 0}d`} sub={`best: ${progressStats?.streakBest ?? 0} days`} bg={C.redLt} />
          <StatCard label="ACHIEVEMENTS · WIP" value={STUDENT_STATS.badges} sub={`${STUDENT_STATS.badgesInProgress} in progress`} bg={C.purpleLt} />
        </div>

        <LearningStylePanel
          learningStyle={styleKey}
          varkScores={varkScores}
          onRetakeVark={() => navigate('/questionnaire')}
        />

        <ActivityPanel items={activity} title="RECENT ACTIVITY" showBadge />
      </div>
    </div>
  )
}