import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { Panel } from '../../components/ui/Panel'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import { getMojiRezultati, getMojiKvizi } from '../quiz/quizStudentApi'
import { getLeaderboard, type LeaderboardEntry } from '../leaderboard/leaderboardApi'
import { getModuliJavni, getMojiVpisi } from '../modules/moduleApi'
import { getProgressStats, type ProgressStats } from '../progress/progressStatsApi'
import { getMojeZnacke, type BadgeResponse } from '../progress/badgesApi'
import { IconBox } from '../../components/ui/IconBox'
import {
  STUDENT_DAILY_QUESTS,
  VARK_PROFILES,
} from './mockData'

const MODULE_COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red]

const BADGE_DEFINITIONS = {
  FIRST_QUIZ: {
    label: 'FIRST QUIZ',
    description: 'Complete your first quiz',
    color: C.green,
    colorLt: C.greenLt,
  },

  STREAK_3: {
    label: 'STREAK 3',
    description: 'Maintain a 3-day streak',
    color: C.orange,
    colorLt: C.orangeLt,
  },

  PERFECT_SCORE: {
    label: 'PERFECT SCORE',
    description: 'Score 100% on any quiz',
    color: C.cyan,
    colorLt: C.cyanLt,
  },

  MODULE_COMPLETE: {
    label: 'COMPLETIONIST',
    description: 'Complete a module',
    color: C.purple,
    colorLt: C.purpleLt,
  },

  QUIZ_MASTER: {
    label: 'QUIZ MASTER',
    description: 'Completed 10 quizes.',
    color: C.purple,
    colorLt: C.purpleLt
  }
}

export function LearningTypeIcon({ type, size = 20 }: { type: string; size?: number }) {
  switch (type) {
    case 'visual':
      return (
        <svg width={size} height={size} fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M30.941 15.177c-9.787-11.183-20.096-11.187-29.882 0-0.192 0.219-0.31 0.507-0.31 0.823s0.117 0.605 0.311 0.825l-0.001-0.001c4.893 5.591 9.919 8.427 14.939 8.427h0.001c5.021 0 10.047-2.836 14.941-8.427 0.192-0.219 0.309-0.507 0.309-0.823s-0.117-0.604-0.31-0.825l0.001 0.001zM3.682 16c8.299-8.961 16.336-8.961 24.637 0-8.301 8.961-16.34 8.961-24.637 0zM16 10.75c-2.899 0-5.25 2.351-5.25 5.25s2.351 5.25 5.25 5.25c2.899 0 5.25-2.351 5.25-5.25v0c-0.004-2.898-2.352-5.246-5.25-5.25h-0zM16 18.75c-1.519 0-2.75-1.231-2.75-2.75s1.231-2.75 2.75-2.75c1.519 0 2.75 1.231 2.75 2.75v0c-0.002 1.518-1.232 2.748-2.75 2.75h-0z" />
        </svg>
      )
    case 'reading':
      return (
        <svg width={size} height={size} fill="currentColor" viewBox="0 -4 32 40" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M30.879 5.111c-0.226-0.223-0.536-0.361-0.879-0.361-0 0-0 0-0 0h-0.014l-2.736 0.028v-2.778c-0-0.346-0.141-0.659-0.367-0.886v0c-0.238-0.21-0.546-0.344-0.885-0.364l-0.004-0c-0.277-0.020-0.601-0.031-0.927-0.031-3.478 0-6.655 1.285-9.084 3.407l0.016-0.014c-2.412-2.108-5.59-3.393-9.068-3.393-0.326 0-0.65 0.011-0.971 0.034l0.043-0.002c-0.027-0.002-0.059-0.004-0.090-0.004-0.318 0-0.603 0.142-0.795 0.367l-0.001 0.001c-0.227 0.226-0.368 0.54-0.368 0.886v2.778l-2.737-0.028c-0.009-0-0.020-0-0.031-0-0.337 0-0.642 0.138-0.86 0.362l-0 0c-0.229 0.227-0.371 0.541-0.371 0.889v24c0 0 0 0 0 0 0 0.69 0.559 1.249 1.249 1.249 0.216 0 0.42-0.055 0.597-0.152l-0.007 0.003c1.836-1.087 4.047-1.73 6.408-1.73 2.353 0 4.556 0.638 6.448 1.751l-0.060-0.032c0.034 0.016 0.078 0.032 0.122 0.046l0.009 0.002c0.048 0.023 0.106 0.045 0.166 0.063l0.009 0.002c0.018 0.005 0.034 0.016 0.052 0.019l0.002 0.002h0.006c0.031 0.006 0.062 0.012 0.093 0.016h0.004l0.005 0.002c0.041 0.005 0.088 0.008 0.136 0.008 0.003 0 0.006 0 0.009-0l0.001 0h0.002l0.001-0c0.042 0 0.084-0.002 0.126-0.006h0.002c0.061-0.007 0.114-0.017 0.166-0.029l-0.010 0.002h0.003c0.015-0.004 0.029-0.013 0.044-0.017 0.052-0.017 0.094-0.034 0.135-0.053l-0.008 0.003c0.061-0.020 0.112-0.040 0.16-0.063l-0.008 0.003c1.831-1.081 4.035-1.72 6.388-1.72 2.361 0 4.572 0.643 6.468 1.764l-0.059-0.032c0.171 0.093 0.374 0.148 0.59 0.148 0.69 0 1.249-0.559 1.249-1.249 0-0 0-0 0-0v0-24c0-0 0-0.001 0-0.001 0-0.347-0.142-0.661-0.371-0.888l-0-0zM3.25 28.033v-20.77l1.5 0.016v18.722c0 0.619 0.449 1.133 1.039 1.233l0.007 0.001c-0.988 0.225-1.838 0.5-2.655 0.839l0.108-0.040zM7.25 24.785v-21.494c0.054-0.001 0.117-0.002 0.181-0.002 2.878 0 5.475 1.204 7.315 3.136l0.004 0.004v20.635c-2.119-1.39-4.707-2.234-7.488-2.279l-0.012-0zM24.75 24.785c-2.793 0.045-5.381 0.889-7.554 2.313l0.054-0.033v-20.635c1.844-1.936 4.442-3.14 7.32-3.14 0.063 0 0.126 0.001 0.189 0.002l-0.009-0zM28.75 28.033c-0.709-0.3-1.56-0.574-2.437-0.777l-0.109-0.021c0.597-0.102 1.047-0.616 1.047-1.234v-18.722l1.5-0.016z" />
        </svg>
      )
    case 'auditory':
      return (
        <svg width={size} height={size} fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.97 0.75c-5.108 0-10.28 3.864-10.28 11.25 0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0c0-6.012 4.033-8.75 7.78-8.75s7.78 2.738 7.78 8.75c0.005 0.124 0.008 0.27 0.008 0.416 0 0.717-0.067 1.418-0.194 2.098l0.011-0.070c-0.241 1.112-0.633 2.096-1.162 2.991l0.025-0.046c-0.286 0.493-0.583 0.917-0.911 1.315l0.013-0.016c-0.188 0.227-0.393 0.432-0.598 0.635-0.378 0.359-0.72 0.747-1.026 1.163l-0.017 0.024c-0.429 0.631-0.849 1.359-1.216 2.118l-0.046 0.105c-0.266 0.49-0.52 1.069-0.726 1.67l-0.024 0.082c-0.098 0.328-0.168 0.711-0.196 1.105l-0.001 0.018c-0.013 0.22-0.046 0.426-0.097 0.624l0.005-0.022c-0.083 0.282-0.177 0.522-0.288 0.752l0.013-0.029c-0.221 0.427-0.505 0.79-0.845 1.092l-0.004 0.003c-0.733 0.622-1.657 1.040-2.672 1.156l-0.023 0.002c-0.235 0.033-0.506 0.052-0.781 0.052-0.818 0-1.597-0.167-2.304-0.469l0.038 0.015c-0.893-0.371-1.607-1.022-2.049-1.842l-0.011-0.022c-0.266-0.544-0.422-1.183-0.422-1.859 0-0.021 0-0.043 0-0.064l-0 0.003c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0c-0 0.018-0 0.038-0 0.059 0 1.085 0.254 2.111 0.706 3.021l-0.018-0.040c0.72 1.368 1.868 2.429 3.262 3.023l0.043 0.016c0.947 0.415 2.051 0.656 3.211 0.656 0.011 0 0.022-0 0.034-0h-0.002c0.392-0 0.778-0.026 1.156-0.075l-0.045 0.005c1.561-0.182 2.947-0.821 4.049-1.779l-0.009 0.008c0.574-0.512 1.049-1.12 1.402-1.801l0.016-0.035c0.155-0.309 0.301-0.675 0.417-1.055l0.013-0.050c0.096-0.323 0.165-0.699 0.192-1.087l0.001-0.017c0.013-0.226 0.048-0.437 0.101-0.64l-0.005 0.023c0.187-0.542 0.39-0.999 0.625-1.436l-0.025 0.051c0.354-0.743 0.713-1.369 1.113-1.965l-0.035 0.055c0.235-0.314 0.484-0.591 0.754-0.844l0.003-0.003c0.262-0.26 0.521-0.523 0.762-0.814 1.214-1.476 2.104-3.266 2.534-5.228l0.015-0.083c0.151-0.76 0.238-1.634 0.238-2.528 0-0.154-0.003-0.307-0.008-0.459l0.001 0.022c0-7.386-5.172-11.25-10.28-11.25zM16.656 16.35c-2.227 0.358-3.907 2.266-3.907 4.566 0 0.030 0 0.059 0.001 0.089l-0-0.004c0 0.727-0.294 1.195-0.75 1.195s-0.75-0.469-0.75-1.195c0-0.69-0.56-1.25-1.25-1.25s-1.25 0.56-1.25 1.25v0c-0.010 0.098-0.016 0.212-0.016 0.327 0 1.825 1.45 3.31 3.261 3.368l0.005 0c1.816-0.058 3.266-1.543 3.266-3.368 0-0.115-0.006-0.229-0.017-0.341l0.001 0.014c-0-0.011-0-0.024-0-0.037 0-1.086 0.796-1.985 1.837-2.147l0.012-0.002c0.384-0.025 0.739-0.129 1.057-0.294l-0.015 0.007c0.308-0.182 0.565-0.416 0.768-0.692l0.005-0.007c0.773-0.948 1.241-2.171 1.241-3.503 0-1.208-0.385-2.327-1.040-3.239l0.011 0.017c-0.998-1.28-2.54-2.096-4.273-2.096-0.065 0-0.13 0.001-0.194 0.003l0.009-0c-0.413 0.024-0.801 0.093-1.17 0.203l0.037-0.009c0.659-1.288 1.976-2.154 3.496-2.154 1.083 0 2.063 0.44 2.771 1.15l0 0c0.827 0.934 1.331 2.17 1.331 3.524 0 0.097-0.003 0.194-0.008 0.29l0.001-0.013c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0c0.019-0.193 0.030-0.417 0.030-0.644 0-3.71-2.955-6.73-6.64-6.834l-0.010-0c-3.694 0.105-6.649 3.124-6.649 6.834 0 0.227 0.011 0.451 0.033 0.672l-0.002-0.028c0 0 0 0.001 0 0.001 0 0.69 0.559 1.249 1.249 1.249 0.511 0 0.95-0.306 1.143-0.746l0.003-0.008c0.017-0.017 0.039-0.023 0.055-0.041 0.509-0.584 1.254-0.951 2.084-0.951 0.899 0 1.698 0.43 2.202 1.096l0.005 0.007c0.334 0.495 0.534 1.106 0.534 1.763 0 0.731-0.247 1.405-0.662 1.942l0.005-0.007z" />
        </svg>
      )
    case 'kinesthetic':
      return (
        <svg width={size} height={size} fill="currentColor" viewBox="-4 -4 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 14.75h-17c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h17c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM13 6.25h17c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-17c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0zM6 22.75h-2c-1.794 0.002-3.248 1.456-3.25 3.25v2c0.002 1.794 1.456 3.248 3.25 3.25h2c1.794-0.002 3.248-1.456 3.25-3.25v-2c-0.002-1.794-1.456-3.248-3.25-3.25h-0zM6.75 28c-0 0.414-0.336 0.75-0.75 0.75h-2c-0.414-0-0.75-0.336-0.75-0.75v-2c0-0.414 0.336-0.75 0.75-0.75h2c0.414 0 0.75 0.336 0.75 0.75v0zM30 25.75h-17c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h17c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM9.078 11.877l-5.121 5.598-1.076-1.069c-0.226-0.225-0.537-0.363-0.881-0.363-0.69 0-1.25 0.559-1.25 1.25 0 0.346 0.141 0.66 0.369 0.886l2 1.988 0.022 0.015 0.015 0.021c0.073 0.059 0.156 0.112 0.246 0.153l0.007 0.003c0.038 0.028 0.082 0.055 0.128 0.080l0.006 0.003c0.135 0.056 0.292 0.088 0.457 0.088 0.175 0 0.341-0.037 0.491-0.103l-0.008 0.003c0.053-0.031 0.098-0.061 0.14-0.094l-0.003 0.002c0.102-0.050 0.189-0.11 0.268-0.179l-0.001 0.001 0.015-0.023 0.020-0.014 6-6.559c0.205-0.222 0.331-0.52 0.331-0.847 0-0.69-0.56-1.25-1.25-1.25-0.366 0-0.696 0.158-0.924 0.409l-0.001 0.001zM9.078 0.877l-5.121 5.598-1.076-1.069c-0.226-0.223-0.536-0.361-0.878-0.361-0.69 0-1.25 0.56-1.25 1.25 0 0.345 0.14 0.658 0.366 0.884v0l2 1.987 0.022 0.015 0.015 0.021c0.072 0.058 0.153 0.109 0.24 0.15l0.007 0.003c0.040 0.029 0.086 0.058 0.134 0.084l0.007 0.003c0.135 0.056 0.292 0.088 0.456 0.088 0.175 0 0.341-0.037 0.491-0.103l-0.008 0.003c0.053-0.031 0.098-0.061 0.14-0.094l-0.003 0.002c0.102-0.050 0.189-0.11 0.268-0.179l-0.001 0.001 0.015-0.023 0.020-0.014 6-6.559c0.206-0.222 0.332-0.521 0.332-0.848 0-0.69-0.56-1.25-1.25-1.25-0.367 0-0.697 0.158-0.925 0.41l-0.001 0.001z" />
        </svg>
      )
    default:
      return null
  }
}

interface DashboardModule {
  id: string
  naziv: string
  opis: string
  tezavnost: number
  uciteljImePriimek: string
  color: string
  casNaModulu: number // seconds
}

const STAR_LABELS: Record<number, string> = { 1: '★', 2: '★★', 3: '★★★', 4: '★★★★', 5: '★★★★★' }

function formatCas(sekunde: number): string {
  if (sekunde < 60) return `${sekunde}s`
  const min = Math.floor(sekunde / 60)
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}


function ModuleRow({ mod, onClick }: { mod: DashboardModule; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const isMobile = useBreakpoint() === 'mobile'
  const wrapStyle = { border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(hovered ? 'lg' : 'base'), cursor: 'pointer', transform: hovered ? 'translate(-1px,-1px)' : 'none', transition: 'transform 0.1s, box-shadow 0.1s', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }
  const contentStyle = { flex: 1, minWidth: 0, background: hovered ? C.yellowLt : C.paper, transition: 'background 0.1s' }

  const tags = (
    <div style={{ display: 'flex', gap: S[1], flexWrap: 'nowrap' }}>
      <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
      {mod.casNaModulu > 0 && <Tag label={`⏱ ${formatCas(mod.casNaModulu)} SPENT`} bg={C.cyan} />}
    </div>
  )

  if (isMobile) {
    return (
      <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={wrapStyle}>
        <div style={{ width: 6, background: mod.color, flexShrink: 0 }} />
        <div style={{ ...contentStyle, display: 'flex', flexDirection: 'column', gap: S[1], padding: S[2] }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{mod.naziv}</div>
          <div style={{ fontSize: FS.xs, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.opis}</div>
          {tags}
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={wrapStyle}>
      <div style={{ width: 6, background: mod.color, flexShrink: 0 }} />
      <div style={{ ...contentStyle, display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2]} ${S[3]}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{mod.naziv}</div>
          <div style={{ fontSize: FS.xs, color: C.muted, marginTop: S[0.5], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.opis}</div>
        </div>
        {tags}
      </div>
    </div>
  )
}

function QuestRow({ q, onToggle }: { q: { id: string; label: string; xp: number; done: boolean }; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], background: q.done ? C.greenLt : hovered ? C.yellowLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(hovered ? 'lg' : 'base'), opacity: q.done ? 0.75 : 1, cursor: 'pointer', transform: hovered && !q.done ? 'translate(-1px,-1px)' : 'none', transition: 'background 0.1s, transform 0.1s, box-shadow 0.1s' }}
    >
      <div style={{ width: 20, height: 20, borderRadius: R.sm, border: `${BW.base} solid ${C.ink}`, background: q.done ? C.green : C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, flexShrink: 0 }}>
        {q.done ? '✓' : ''}
      </div>
      <span style={{ flex: 1, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, textDecoration: q.done ? 'line-through' : 'none', color: C.ink }}>{q.label}</span>
      <Tag label={`+${q.xp} XP`} bg={q.done ? C.green : C.yellowLt} />
    </div>
  )
}


export function StudentDashboard() {
  const navigate = useNavigate()
  const { profil, session } = useAuth()
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const [quests, setQuests] = useState(() => STUDENT_DAILY_QUESTS.map(q => ({ ...q })))
  const doneCount = quests.filter(q => q.done).length
  const totalXpToday = quests.filter(q => q.done).reduce((a, q) => a + q.xp, 0)

  const [quizAvg, setQuizAvg] = useState<number | null>(null)
  const [quizCount, setQuizCount] = useState<number | null>(null)
  const [recentModules, setRecentModules] = useState<DashboardModule[]>([])
  const [allQuizzes, setAllQuizzes] = useState<{ id: string; naziv: string; status: string; casIzvajanja: number | null; predmetId: string }[] | null>(null)
  const [completedQuizIds, setCompletedQuizIds] = useState<Set<string>>(new Set())
  const [completedScores, setCompletedScores] = useState<Record<string, number>>({})
  const [moduleMap, setModuleMap] = useState<Record<string, string>>({})
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null)
  const [bitPicks, setBitPicks] = useState<DashboardModule[]>([])
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null)
  const [earnedBadges, setEarnedBadges] = useState<BadgeResponse[]>([])

  useEffect(() => {
    if (!session?.access_token) return

    getMojeZnacke(session.access_token).then(setEarnedBadges).catch(console.error)
    
    getMojiRezultati(session.access_token).then((data: { kvizId: string; odstotek: number }[]) => {
      if (!Array.isArray(data) || data.length === 0) {
        setQuizCount(0)
        setQuizAvg(null)
      } else {
        setQuizCount(data.length)
        setQuizAvg(Math.round(data.reduce((sum, r) => sum + r.odstotek, 0) / data.length))
        setCompletedQuizIds(new Set(data.map(r => r.kvizId)))
        setCompletedScores(Object.fromEntries(data.map(r => [r.kvizId, r.odstotek])))
      }
    })
    getMojiKvizi(session.access_token).then(setAllQuizzes).catch(() => setAllQuizzes([]))
    getLeaderboard(session.access_token).then(setLeaderboard).catch(() => setLeaderboard([]))
    getProgressStats(session.access_token).then(setProgressStats).catch(() => {})
    Promise.all([getModuliJavni(), getMojiVpisi(session.access_token)]).then(
      ([allMods, vpisi]: [{ id: string; naziv: string; opis: string; tezavnost: number; uciteljImePriimek: string }[], { predmetId: string; casNaModulu: number }[]]) => {
        const casMap = Object.fromEntries(vpisi.map(v => [v.predmetId, v.casNaModulu ?? 0]))
        const enrolledIds = new Set(vpisi.map(v => v.predmetId))
        setModuleMap(Object.fromEntries(allMods.map(m => [m.id, m.naziv])))
        const enrolled = allMods
          .filter(m => enrolledIds.has(m.id))
          .slice(0, 5)
          .map((m, i) => ({ ...m, color: MODULE_COLORS[i % MODULE_COLORS.length], casNaModulu: casMap[m.id] ?? 0 }))
        setRecentModules(enrolled)
        const picks = allMods
          .filter(m => !enrolledIds.has(m.id))
          .slice(0, 3)
          .map((m, i) => ({ ...m, color: MODULE_COLORS[(i + 3) % MODULE_COLORS.length], casNaModulu: 0 }))
        setBitPicks(picks)
      }
    )
  }, [session])

  const quizAvgValue = quizCount === null ? '…'
    : quizCount === 0 ? '—'
    : `${quizAvg}%`

  const myRank = leaderboard?.find(e => e.isMe)?.rank ?? null
  const rankValue = leaderboard === null ? '…' : myRank === null ? '—' : `#${myRank}`

  const streak = progressStats?.streak ?? 0
  const streakBest = progressStats?.streakBest ?? 0

  const STAT_COLS = [
    { label: 'XP POINTS',       value: (profil?.xp ?? 0).toLocaleString(), accent: C.yellow },
    { label: 'DAY STREAK',      value: `${streak}d`,                        accent: C.orange, sub: `best: ${streakBest} days` },
    { label: 'QUIZ AVG',        value: quizAvgValue, accent: quizCount === 0 ? C.mutedLt : C.cyan, noData: quizCount === 0 },
    { label: 'LEADERBOARD RANK', value: rankValue,                          accent: C.purple },
  ]

  const styleKey = profil?.ucniTip && VARK_PROFILES[profil.ucniTip] ? profil.ucniTip : null
  const styleProfile = styleKey ? VARK_PROFILES[styleKey] : null
  const info = styleKey ? STYLE_INFO[styleKey as keyof typeof STYLE_INFO] : STYLE_INFO.visual
  const earnedTypes = new Set(earnedBadges.map(b => b.type))

  function toggleQuest(id: string) {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, done: !q.done } : q))
  }

  return (
    <div className="dashboard-main">
      <Topbar
        title="DASHBOARD"
        subtitle={`Level ${profil?.nivo ?? 1} · ${(profil?.xp ?? 0).toLocaleString()} XP earned`}
        actions={<ComicBtn sm color={C.cyan} onClick={() => navigate('/notifications')}><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> 2 NEW</ComicBtn>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* YOUR STATISTICS */}
        <Panel title="YOUR STATISTICS" accent={C.yellow} p={0}>
          <div className="stat-grid">
            {STAT_COLS.map((s, i) => (
              <div key={s.label} className="stat-grid-cell" style={{ borderRight: i < STAT_COLS.length - 1 ? `${BW.base} solid ${C.divider}` : 'none', display: 'flex', flexDirection: 'column', gap: S[1], background: s.noData ? C.cream : undefined }}>
                <div className="stat-grid-value" style={{ color: s.noData ? C.muted : undefined }}>{s.value}</div>
                <div className="stat-grid-label" style={{ color: s.noData ? C.muted : undefined }}>{s.label}</div>
                {'sub' in s && s.sub && (
                  <div style={{ fontSize: FS['2xs'], color: C.muted, fontFamily: "'Space Mono', monospace" }}>{s.sub}</div>
                )}
                {s.noData && (
                  <div style={{ fontSize: FS['2xs'], color: C.muted, fontFamily: "'Space Mono', monospace" }}>NO QUIZZES COMPLETED YET</div>
                )}
              </div>
            ))}
          </div>
        </Panel>

        {/* Row 1: Learning Type (wide) + Quests (narrow) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          <Panel title="YOUR LEARNING TYPE" accent={info.bg} p={S[4]}
            action={styleProfile ? <Tag label={styleProfile.label} bg={info.color} /> : <Tag label="NOT SET" bg={C.mutedLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {!styleProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[4]} 0`, color: C.muted }}>
                  <BitMascot size={48} mood="thinking" float />
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center' }}>COMPLETE THE VARK QUIZ TO DISCOVER YOUR STYLE</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: info.color, border: `${BW.base} solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.ink }}>
                      <LearningTypeIcon type={styleKey ?? 'visual'} size={28} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink }}>{styleProfile.label}</div>
                      <div style={{ fontSize: FS.xs, color: C.muted, marginTop: S[0.5] }}>Based on your VARK profile</div>
                    </div>
                  </div>
                  <div style={{ fontSize: FS.xs, color: C.ink, lineHeight: 1.6 }}>{styleProfile.description}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
                    {([
                      { key: 'V', field: 'visual'      , color: C.purple },
                      { key: 'A', field: 'auditory'    , color: C.cyan   },
                      { key: 'R', field: 'reading'     , color: C.green  },
                      { key: 'K', field: 'kinesthetic' , color: C.orange },
                    ] as { key: string; field: keyof NonNullable<NonNullable<typeof profil>['varkScores']>; color: string }[]).map(({ key, field, color }) => {
                      const score = profil?.varkScores?.[field] ?? 0
                      return (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, width: 20, flexShrink: 0, color: C.ink }}>{key}</span>
                          <div style={{ flex: 1 }}><Bar value={score} max={16} color={color} shadow /></div>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, width: 28, textAlign: 'right', color: C.muted }}>{score}</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </Panel>

          <Panel title="BIT PICKS FOR YOU" accent={C.cyan} p={S[4]}
            action={<Tag label={`${bitPicks.length} PICKS`} bg={C.cyanLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {bitPicks.length === 0 ? (
                <div style={{ padding: `${S[4]} 0`, textAlign: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>
                  ALL MODULES ENROLLED
                </div>
              ) : bitPicks.map((pick, i) => {
                const reasons = [
                  profil?.ucniTip ? `Suits your ${profil.ucniTip} learning style` : 'Explore something new',
                  'Trending among students',
                  'Expand your knowledge',
                ]
                return (
                  <div key={pick.id} onClick={() => navigate(`/modules/${pick.id}`)}
                    style={{ padding: S[2], background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.yellowLt; e.currentTarget.style.transform = 'translate(-1px,-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.paper; e.currentTarget.style.transform = 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                      {!isMobile && (
                        <div style={{ width: 32, height: 32, background: pick.color, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>
                          {pick.naziv.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pick.naziv}</div>
                        <div style={{ fontSize: FS['2xs'], color: C.muted, marginTop: S[0.5] }}>{reasons[i]}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: S[1], marginTop: S[2] }}>
                      <Tag label={STAR_LABELS[pick.tezavnost] ?? '★'} bg={C.yellowLt} />
                      <Tag label={pick.uciteljImePriimek} bg={C.cyanLt} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>

        {/* Row 2: Modules (wide) + Quests (narrow) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          <Panel title="YOUR MODULES" accent={C.pink} p={S[4]}
            action={<ComicBtn sm color={C.yellow} onClick={() => navigate('/modules')}>SEE ALL →</ComicBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {recentModules.length === 0 ? (
                <div style={{ padding: `${S[4]} 0`, textAlign: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>
                  NO ENROLLED MODULES YET
                </div>
              ) : (
                recentModules.map((mod) => (
                  <ModuleRow key={mod.id} mod={mod} onClick={() => navigate(`/modules/${mod.id}`)} />
                ))
              )}
            </div>
          </Panel>

          {(() => {
            const due = (allQuizzes ?? []).filter(q => !completedQuizIds.has(q.id))
            const done = (allQuizzes ?? []).filter(q => completedQuizIds.has(q.id))
            const loading = allQuizzes === null
            return (
              <Panel title="QUIZZES" accent={C.red} p={S[4]}
                action={(() => {
                  const passed = done.filter(q => (completedScores[q.id] ?? 0) >= 50).length
                  const failed = done.length - passed
                  return loading ? <Tag label="…" bg={C.redLt} /> : (
                    <div style={{ display: 'flex', gap: S[1] }}>
                      <Tag label={`${due.length} DUE`} bg={C.yellowLt} />
                      <Tag label={`${passed} PASSED`} bg={C.greenLt} />
                      <Tag label={`${failed} FAILED`} bg={C.redLt} />
                    </div>
                  )
                })()}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                  {loading ? (
                    [C.red, C.yellow, C.green].map((color, i) => (
                      <div key={i} className="skeleton-pulse" style={{ padding: S[2], border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: C.paper }}>
                        <div style={{ height: 12, background: color, opacity: 0.35, borderRadius: R.sm, marginBottom: S[1] }} />
                        <div style={{ height: 10, width: '60%', background: C.mutedLt, borderRadius: R.sm }} />
                      </div>
                    ))
                  ) : allQuizzes!.length === 0 ? (
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[4] }}>NO QUIZZES YET</div>
                  ) : (
                    [...due, ...done].map(q => {
                      const isDone = completedQuizIds.has(q.id)
                      const score = completedScores[q.id]
                      const isPublished = q.status === 'PUBLISHED' || q.status === 'active'
                      const stripeColor = isDone ? C.green : isPublished ? C.red : C.muted
                      return (
                        <div key={q.id} style={{ display: 'flex', alignItems: 'stretch', border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
                          <div style={{ width: 4, background: stripeColor, flexShrink: 0 }} />
                          <div style={{ flex: 1, padding: `${S[1.5]} ${S[2]}`, background: C.paper, display: 'flex', flexDirection: 'column', gap: S[1] }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.naziv}</span>
                              {q.casIzvajanja && <Tag label={`⏱ ${q.casIzvajanja} MIN`} bg={C.mutedLt} />}
                              {isPublished ? <Tag label="● LIVE" bg={C.greenLt} /> : <Tag label="○ DRAFT" bg={C.mutedLt} />}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                              <Tag label={moduleMap[q.predmetId] ?? '—'} bg={C.yellowLt} />
                              {isDone && <Tag label={`LAST SCORE ${score}%`} bg={score >= 50 ? C.greenLt : C.redLt} />}
                              {isPublished && (
                                <div style={{ marginLeft: 'auto' }}>
                                  <ComicBtn sm color={C.yellow} onClick={() => navigate('/quiz', { state: { quizId: q.id } })}>GO →</ComicBtn>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </Panel>
            )
          })()}
        </div>

        {/* Row 3: Leaderboard (left) + Quests (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          <Panel title="LEADERBOARD" accent={C.purple} p={S[4]}
            action={<ComicBtn sm color={C.yellow} onClick={() => navigate('/leaderboard')}>SEE ALL →</ComicBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {leaderboard === null ? (
                [C.purple, C.yellow, C.cyan, C.green, C.mutedLt].map((color, i) => (
                  <div key={i} className="skeleton-pulse" style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: C.paper, overflow: 'hidden' }}>
                    <div style={{ padding: `${S[1.5]} ${S[2]}`, display: 'flex', alignItems: 'center', gap: S[2] }}>
                      <div style={{ width: 28, height: 28, background: color, opacity: 0.25, borderRadius: R.sm, flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1] }}>
                        <div style={{ height: 10, width: '55%', background: C.mutedLt, borderRadius: R.sm }} />
                        <div style={{ height: 8, width: '35%', background: C.divider, borderRadius: R.sm }} />
                      </div>
                      <div style={{ width: 40, height: 18, background: color, opacity: 0.2, borderRadius: R.sm }} />
                    </div>
                    <div style={{ height: 3, background: C.divider }} />
                  </div>
                ))
              ) : leaderboard.length === 0 ? (
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[4] }}>NO DATA YET</div>
              ) : (
                leaderboard.slice(0, 5).map((entry) => {
                  const nivo = entry.nivo ?? 1
                  const medalColor = entry.rank === 1 ? C.yellow : entry.rank === 2 ? C.cyan : entry.rank === 3 ? C.orange : null
                  const xpInLevel = entry.xp % 200
                  const barPct = Math.round((xpInLevel / 200) * 100)
                  const barColor = entry.isMe ? C.yellow : medalColor ?? C.purple
                  return (
                    <div key={entry.rank} style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), background: entry.isMe ? C.yellowLt : C.paper, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[2]}` }}>
                        <div style={{ width: 32, height: 32, borderRadius: R.sm, background: medalColor ?? C.cream, border: `${BW.base} solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flexShrink: 0 }}>
                          #{entry.rank}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: S[1.5] }}>
                            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.username}</span>
                            {entry.isMe && <Tag label="YOU" bg={C.yellow} />}
                          </div>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{entry.xp.toLocaleString()} XP</div>
                        </div>
                        <Tag label={`LVL ${nivo}`} bg={medalColor ?? C.purpleLt} />
                        <Tag label={`${entry.quizzesTaken} QUIZ${entry.quizzesTaken !== 1 ? 'ZES' : ''}`} bg={C.cyanLt} />
                        {entry.quizzesTaken > 0 && <Tag label={`AVG ${entry.avgScore}%`} bg={entry.avgScore >= 50 ? C.greenLt : C.redLt} />}
                      </div>
                      <div style={{ height: 3, background: C.divider }}>
                        <div style={{ height: '100%', width: `${barPct}%`, background: barColor, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Panel>

          <Panel title="TODAY'S QUESTS" accent={C.green} p={S[4]}
            action={<div style={{ display: 'flex', gap: S[1.5] }}><Tag label="WIP" bg={C.mutedLt} /><Tag label={`+${totalXpToday}XP`} bg={C.greenLt} /></div>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {quests.map((q) => (
                <QuestRow key={q.id} q={q} onToggle={() => toggleQuest(q.id)} />
              ))}
              <div style={{ marginTop: S[1] }}>
                <Bar value={(doneCount / quests.length) * 100} color={C.green} shadow />
              </div>
            </div>
          </Panel>
        </div>

        {/* Badges — full width */}
        <Panel 
          title="BADGES" 
          accent={C.orange} p={S[4]}
          action={
            <div 
              style={{ 
                display: 'flex', 
                gap: S[1.5] 
              }}
            >
              <Tag 
                label="WIP" 
                bg={C.mutedLt} 
              />
              
              <Tag 
                label={`${earnedBadges.length} EARNED`} 
                bg={C.orangeLt} 
              />
            </div>
          }
        >
          <div className="badge-grid">
            {Object.entries(BADGE_DEFINITIONS).map(([badgeType, def]) => {
              const unlocked = earnedTypes.has(badgeType)

              return (
                <div
                  key={badgeType}
                  className="badge-grid-item"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: S[1],
                    padding: S[3],

                    background: unlocked
                      ? def.colorLt
                      : C.cream,

                    opacity: unlocked ? 1 : 0.45,

                    border: `${BW.base} solid ${C.ink}`,
                    borderRadius: R.sm,
                    boxShadow: mkShadow(),
                    textAlign: 'center',
                  }}
                >
                  <IconBox size={24} />

                  <div
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: FS['2xs'],
                      color: C.ink,
                      lineHeight: 1.3,
                    }}
                  >
                    {def.label}
                  </div>

                  <div
                    style={{
                      fontSize: FS['2xs'],
                      color: C.ink,
                      opacity: 0.6,
                    }}
                  >
                    {def.description}
                  </div>

                  {!unlocked && (
                    <Tag
                      label="LOCKED"
                      bg={C.mutedLt}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </Panel>

      </div>
    </div>
  )
}
