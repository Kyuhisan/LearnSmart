import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { StatCard } from '../../components/ui/StatCard'
import { Panel } from '../../components/ui/Panel'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { BIWEEKLY_XP, CALENDAR_DAYS, PROGRESS_STATS, type ProgressModule } from './mockData'
import { useAuth } from '../../context/AuthContext'
import { getMojiVpisi, getModuliJavni } from '../modules/moduleApi'
import { getModuleCompletion, getMojiRezultati, type ModuleCompletion } from '../quiz/quizStudentApi'
import { getProgressStats, type ProgressStats } from './progressStatsApi'
import { getMojeZnacke , type BadgeResponse } from './badgesApi'

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const MODULE_COLORS = [
  { color: C.yellow, colorLt: C.yellowLt },
  { color: C.purple, colorLt: C.purpleLt },
  { color: C.cyan,   colorLt: C.cyanLt   },
  { color: C.green,  colorLt: C.greenLt  },
  { color: C.pink,   colorLt: C.pinkLt   },
  { color: C.orange, colorLt: C.orangeLt },
  { color: C.red,    colorLt: C.redLt    },
]

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

function xpToColor(xp: number, future?: boolean): string {
  if (future) return C.paper
  if (xp === 0) return C.redLt
  return C.greenLt
}

function xpToBorder(xp: number, future?: boolean): string {
  if (future) return C.divider
  if (xp === 0) return C.red
  return C.green
}

function StreakCalendarPanel({ calendarDays, streak }: { calendarDays: typeof CALENDAR_DAYS; streak: number }) {
  const weeks = useMemo(() => [
    calendarDays.slice(0,  7),
    calendarDays.slice(7,  14),
    calendarDays.slice(14, 21),
    calendarDays.slice(21, 28),
    calendarDays.slice(28, 35),
  ], [calendarDays])

  return (
    <Panel title="STREAK CALENDAR" accent={C.orange}
      action={<div style={{ display: 'flex', gap: S[1.5] }}><Tag label={`${streak}D STREAK`} bg={C.orangeLt} /></div>}>
      <div style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: S[1] }}>
          {DAY_HEADERS.map((d, i) => (
            <div key={i} style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, textAlign: 'center', letterSpacing: 0.5 }}>
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: S[1] }}>
            {week.map((day, di) => {
              const d = new Date(day.date)
              return (
                <div key={di}
                  title={day.future ? 'Upcoming' : `${day.date}${day.xp > 0 ? ` · +${day.xp} XP` : ' · no activity'}`}
                  style={{ aspectRatio: '1', background: xpToColor(day.xp, day.future), border: `${BW.base} solid ${xpToBorder(day.xp, day.future)}`, borderRadius: R.sm, boxShadow: day.future ? 'none' : day.xp > 0 ? mkShadow('base', C.green) : mkShadow('base', C.red), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[0.5] }}
                >
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: day.future ? C.muted : C.ink, lineHeight: 1 }}>
                    {d.getDate()}
                  </span>
                  {!day.future && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.ink, lineHeight: 1 }}>
                      {day.xp > 0 ? `+${day.xp} XP` : 'N/A'}
                    </span>
                  )}
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, lineHeight: 1, letterSpacing: 0.3 }}>
                    {MONTHS[d.getMonth()]}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[1] }}>
          {[
            { color: C.greenLt, border: C.green,   label: 'DONE'     },
            { color: C.redLt,   border: C.red,     label: 'MISSED'   },
            { color: C.paper,   border: C.divider, label: 'UPCOMING' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <div style={{ width: 14, height: 14, background: item.color, border: `${BW.base} solid ${item.border}`, borderRadius: R.sm, boxShadow: item.border !== C.divider ? mkShadow('base', item.border) : 'none', flexShrink: 0 }} />
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

function StreakCalendarPanelMobile({ calendarDays, streak }: { calendarDays: typeof CALENDAR_DAYS; streak: number }) {
  const weeks = useMemo(() => [
    calendarDays.slice(0,  7),
    calendarDays.slice(7,  14),
    calendarDays.slice(14, 21),
    calendarDays.slice(21, 28),
    calendarDays.slice(28, 35),
  ], [calendarDays])

  const thisWeek = weeks[weeks.length - 1]

  return (
    <Panel title="STREAK CALENDAR" accent={C.orange}
      action={<div style={{ display: 'flex', gap: S[1.5] }}><Tag label={`${streak}D STREAK`} bg={C.orangeLt} /></div>}>
      <div style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: S[3] }}>

        {/* This week — large day cards */}
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: '0.07em', marginBottom: S[1.5] }}>THIS WEEK</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: S[1] }}>
            {DAY_HEADERS.map((header, i) => {
              const day = thisWeek[i]
              const bg   = xpToColor(day.xp, day.future)
              const bdr  = xpToBorder(day.xp, day.future)
              const d = new Date(day.date)
              return (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[0.5],
                  padding: `${S[1.5]} ${S[0.5]}`,
                  background: bg,
                  border: `${BW.base} solid ${bdr}`,
                  borderRadius: R.sm,
                  boxShadow: day.future ? 'none' : day.xp > 0 ? mkShadow('base', C.green) : mkShadow('base', C.red),
                }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: '0.05em' }}>{header}</span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: day.future ? C.muted : C.ink, lineHeight: 1 }}>
                    {d.getDate()}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.ink, lineHeight: 1 }}>
                    {day.future ? '·' : day.xp > 0 ? `+${day.xp}` : '✗'}
                  </span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, lineHeight: 1, letterSpacing: 0.3 }}>
                    {MONTHS[d.getMonth()]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: S[3] }}>
          {[
            { color: C.greenLt, border: C.green,   label: 'DONE'     },
            { color: C.redLt,   border: C.red,     label: 'MISSED'   },
            { color: C.paper,   border: C.divider, label: 'UPCOMING' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <div style={{ width: 12, height: 12, background: item.color, border: `${BW.base} solid ${item.border}`, borderRadius: R.sm, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted }}>{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </Panel>
  )
}

function BadgesPanel({ 
  limit, 
  cols, 
  useClass,
  earnedBadges 
}: { 
  limit?: number
  cols: number
  useClass?: boolean
  earnedBadges: BadgeResponse[] 
}) {
  const badges = Object.entries(BADGE_DEFINITIONS)
  .map(([type, def]) => {
    const earnedBadge = earnedBadges.find(
      b => b.type === type
    )

    return {
      id: type,
      type,
      label: def.label,
      description: def.description,
      color: def.color,
      colorLt: def.colorLt,
      earned: !!earnedBadge,
      earnedDate: earnedBadge?.pridobljenOb
    }
  })
  .slice(0, limit ?? 999)

  return (
    <Panel 
      title="BADGES" 
      accent={C.purple} 
      action={
        <div 
          style={{ 
            display: 'flex', 
            gap: S[1.5] 
          }}
        > 
          <Tag 
            label={`${earnedBadges.length} EARNED`} 
            bg={C.purpleLt} 
          />
        </div>
      }
    >

      <div className={useClass ? 'badge-grid' : undefined} style={{ display: 'grid', gridTemplateColumns: useClass ? undefined : `repeat(${cols}, 1fr)`, gap: S[3], padding: 0 }}>
        {badges.map(b => (
          <div key={b.id} style={{
            display: 'flex', flexDirection: 'column', gap: S[1.5],
            padding: S[3],
            background: b.earned ? b.colorLt : C.cream,
            border: `${BW.base} solid ${b.earned ? C.ink : C.divider}`,
            borderRadius: R.sm,
            boxShadow: b.earned ? mkShadow() : 'none',
            opacity: b.earned ? 1 : 0.55,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tag label={b.earned ? 'EARNED' : 'LOCKED'} bg={b.earned ? b.colorLt : C.mutedLt} />
              {b.earned && b.earnedDate && (
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>{b.earnedDate}</span>
              )}
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink, letterSpacing: 0.5 }}>
              {b.label}
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted, lineHeight: 1.5 }}>
              {b.description}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ModuleProgressPanel({ navigate, isMobile, modules, completed, total }: { navigate: (path: string) => void; isMobile?: boolean; modules: ProgressModule[] | null; completed: number | null; total: number | null }) {
  return (
    <Panel title="MODULE PROGRESS" accent={C.cyan}
      action={completed !== null && total !== null ? <Tag label={`${completed} / ${total} COMPLETED`} bg={C.cyanLt} /> : undefined}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
        {modules === null ? (
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted, padding: `${S[3]} 0` }}>Loading...</div>
        ) : modules.length === 0 ? (
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, padding: `${S[4]} 0`, textAlign: 'center' }}>No enrolled modules yet.</div>
        ) : null}
        {(modules ?? []).map(m => (
          <div
            key={m.id}
            onClick={() => navigate(`/modules/${m.id}`)}
            style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, background: m.colorLt, borderBottom: `${BW.base} solid ${C.ink}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[1.5], flexWrap: 'wrap' }}>
                {!isMobile && <Tag label={`${m.progress}%`} bg={m.progress === 100 ? C.greenLt : m.progress >= 50 ? C.yellowLt : C.mutedLt} />}
                <Tag label={`${m.quizzesPassed}/${m.quizzesTotal} QUIZZES`} bg={C.paper} />
                <Tag label={`AVG ${m.avgScore}%`} bg={m.avgScore >= 80 ? C.greenLt : m.avgScore >= 65 ? C.yellowLt : C.redLt} />
              </div>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{m.title}</span>
            </div>
            <div style={{ padding: `${S[2]} ${S[3]}`, background: C.paper }}>
              <Bar value={m.progress} color={m.progress === 100 ? C.green : m.color} height={10} shadow />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

export function StudentProgress() {
  const navigate = useNavigate()
  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'
  const { profil, session } = useAuth()
  const [modulesTotal, setModulesTotal] = useState<number | null>(null)
  const [modulesCompleted, setModulesCompleted] = useState<number | null>(null)
  const [progressModules, setProgressModules] = useState<ProgressModule[] | null>(null)
  const [weeklyXp, setWeeklyXp] = useState<number | null>(null)
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null)
  const [earnedBadges, setEarnedBadges] = useState<BadgeResponse[]>([])

  useEffect(() => {
    if (!session?.access_token) return
    const token = session.access_token

    getMojeZnacke(token).then(setEarnedBadges).catch(console.error)

    // Weekly XP — independent fetch so failures don't block module data
    getMojiRezultati(token).then((rezultati: { oddanoOb: string; xpZasluzen: number }[]) => {
      if (!Array.isArray(rezultati)) { setWeeklyXp(0); return }
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const xpThisWeek = rezultati
        .filter(r => r.oddanoOb && new Date(r.oddanoOb).getTime() >= weekAgo)
        .reduce((sum, r) => sum + (r.xpZasluzen ?? 0), 0)
      setWeeklyXp(xpThisWeek)
    }).catch(() => setWeeklyXp(0))

    // Progress stats (XP activity + streak calendar)
    getProgressStats(token).then(setProgressStats).catch(() => {})

    Promise.all([
      getMojiVpisi(token),
      getModuleCompletion(token),
      getModuliJavni(),
    ]).then(([vpisi, comp, allMods]: [{ predmetId: string }[], Record<string, ModuleCompletion>, { id: string; naziv: string }[]]) => {
      const modMap = Object.fromEntries(allMods.map(m => [m.id, m]))
      setModulesTotal(vpisi.length)
      const done = vpisi.filter(v => {
        const c = comp[v.predmetId]
        return c && c.total > 0 && c.completed >= c.total
      }).length
      setModulesCompleted(done)

      const mods: ProgressModule[] = vpisi.map((v, i) => {
        const mod = modMap[v.predmetId]
        const c = comp[v.predmetId] ?? { total: 0, completed: 0, avgScore: 0 }
        const progress = c.total > 0 ? Math.round(c.completed / c.total * 100) : 0
        const colors = MODULE_COLORS[i % MODULE_COLORS.length]
        return {
          id: v.predmetId,
          title: mod?.naziv ?? v.predmetId,
          progress,
          color: colors.color,
          colorLt: colors.colorLt,
          quizzesPassed: c.completed,
          quizzesTotal: c.total,
          avgScore: c.avgScore,
        }
      })
      setProgressModules(mods)
    })
  }, [session])

  const xp = profil?.xp ?? 0
  const nivo = profil?.nivo ?? 1
  const xpToNext = 200 - (xp % 200)

  const biweeklyData = progressStats?.biweeklyXp ?? BIWEEKLY_XP
  const calendarData = progressStats?.calendarDays ?? CALENDAR_DAYS
  const streak       = progressStats?.streak      ?? PROGRESS_STATS.streak
  const streakBest   = progressStats?.streakBest  ?? PROGRESS_STATS.streakBest

  const biweeklyGain = useMemo(() => {
    const prev = biweeklyData.slice(0, 7).reduce((s, d) => s + d.xp, 0)
    const curr = biweeklyData.slice(7).reduce((s, d) => s + d.xp, 0)
    if (prev === 0) return curr > 0 ? 100 : 0
    return Math.round((curr - prev) / prev * 100)
  }, [biweeklyData])

  return (
    <div className="dashboard-main">
      <Topbar
        title="MY PROGRESS"
        subtitle="XP · streaks · modules · badges"
        actionsKey={weeklyXp ?? -1}
        actions={weeklyXp !== null && weeklyXp > 0 ? <Tag label={`+${weeklyXp} XP THIS WEEK`} bg={C.greenLt} /> : undefined}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Stat cards */}
        <div className="quiz-stat-grid">
          <StatCard label="TOTAL XP"    value={xp.toLocaleString()} sub={`LVL ${nivo} · ${xpToNext} XP to next`} bg={C.yellowLt} />
          <StatCard label="STREAK" value={`${streak}d`} sub={`best: ${streakBest} days`} bg={C.redLt} />
          <StatCard label="MODULES"     value={modulesTotal === null ? '…' : `${modulesCompleted} / ${modulesTotal}`} sub={modulesTotal === null ? '' : `${(modulesTotal ?? 0) - (modulesCompleted ?? 0)} in progress`}  bg={C.cyanLt}   />
          <StatCard 
            label="BADGES" 
            value={`${earnedBadges.length} / ${Object.keys(BADGE_DEFINITIONS).length}`}     
            sub={`${Object.keys(BADGE_DEFINITIONS).length - earnedBadges.length} remaining`}                       
            bg={C.purpleLt} />
        </div>

        {/* XP chart */}
        {isMobile ? (
          <Panel title="XP ACTIVITY" accent={C.yellow}
            action={<div style={{ display: 'flex', gap: S[1.5] }}><Tag label={`+${biweeklyGain}%`} bg={C.greenLt} /></div>}>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[1.5], height: 140 }}>
                {biweeklyData.slice(7).map((d) => {
                  const maxXp = Math.max(...biweeklyData.slice(7).map(d => d.xp), 1)
                  const barH = d.xp === 0 ? 4 : Math.round((d.xp / maxXp) * 80)
                  return (
                    <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1] }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>
                        {d.xp > 0 ? `+${d.xp}` : '—'}
                      </span>
                      <div style={{ width: '100%', height: barH, background: d.xp === 0 ? C.cream : C.yellow, border: `${BW.base} solid ${C.ink}`, borderRadius: `${R.sm} ${R.sm} 0 0`, boxShadow: d.xp > 0 ? mkShadow() : 'none' }} />
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                        {d.label.split(' ')[1]}
                      </span>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.3, whiteSpace: 'nowrap', opacity: 0.6 }}>
                        {d.label.split(' ')[0].toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="XP ACTIVITY" accent={C.yellow}
            action={<div style={{ display: 'flex', gap: S[1.5] }}><Tag label={`${biweeklyGain >= 0 ? '+' : ''}${biweeklyGain}% VS PREV WEEK`} bg={biweeklyGain >= 0 ? C.greenLt : C.redLt} /></div>}>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[1.5], height: 140 }}>
                {biweeklyData.map((d, i) => {
                  const maxXp = Math.max(...biweeklyData.map(d => d.xp), 1)
                  const barH = d.xp === 0 ? 4 : Math.round((d.xp / maxXp) * (isTablet ? 80 : 110))
                  const isNewWeek = i === 7
                  return (
                    <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1], borderLeft: isNewWeek ? `${BW.base} dashed ${C.divider}` : 'none', paddingLeft: isNewWeek ? S[1] : 0 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>
                        {d.xp > 0 ? `+${d.xp}` : '—'}
                      </span>
                      <div style={{ width: '100%', height: barH, background: d.xp === 0 ? C.cream : i < 7 ? C.mutedLt : C.yellow, border: `${BW.base} solid ${C.ink}`, borderRadius: `${R.sm} ${R.sm} 0 0`, boxShadow: d.xp > 0 ? mkShadow() : 'none' }} />
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                        {d.label.split(' ')[1]}
                      </span>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.3, whiteSpace: 'nowrap', opacity: 0.6 }}>
                        {d.label.split(' ')[0].toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: S[3], marginTop: S[2] }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[1.5] }}>
                  <div style={{ width: 12, height: 12, background: C.mutedLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm }} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted }}>PREV WEEK</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[1.5] }}>
                  <div style={{ width: 12, height: 12, background: C.yellow, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm }} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted }}>THIS WEEK</span>
                </div>
              </div>
            </div>
          </Panel>
        )}

        {isMobile ? (
          <>
            <StreakCalendarPanelMobile calendarDays={calendarData} streak={streak} />
            <ModuleProgressPanel navigate={navigate} isMobile modules={progressModules} completed={modulesCompleted} total={modulesTotal} />
            <BadgesPanel cols={1} earnedBadges = {earnedBadges} />
          </>
        ) : isTablet ? (
          <>
            <ModuleProgressPanel navigate={navigate} modules={progressModules} completed={modulesCompleted} total={modulesTotal} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], alignItems: 'stretch' }}>
              <StreakCalendarPanel calendarDays={calendarData} streak={streak} />
              <BadgesPanel limit={4} cols={2} earnedBadges = {earnedBadges} />
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: S[4], alignItems: 'stretch' }}>
              <StreakCalendarPanel calendarDays={calendarData} streak={streak} />
              <ModuleProgressPanel navigate={navigate} modules={progressModules} completed={modulesCompleted} total={modulesTotal} />
            </div>
            <BadgesPanel cols={4} earnedBadges = {earnedBadges} />
          </>
        )}

      </div>
    </div>
  )
}