import { useState, useRef, useEffect } from 'react'
import { Bar } from '../../components/ui/Bar'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { StatCard } from '../../components/ui/StatCard'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { getModuliUcitelj, getAnalyticsStats, getAnalyticsStatsByModule, getStilMix, getModulePerformance, type AnalyticsStats, type ModulePerformance } from '../modules/moduleApi'
import { getWeeklyStats, type WeeklyStats } from '../analytics/profesorStatsApi'

const PERF_COLORS    = [C.cyan,   C.purple,   C.green,   C.yellow,   C.red]
const PERF_COLORS_LT = [C.cyanLt, C.purpleLt, C.greenLt, C.yellowLt, C.redLt]
const DAY_ORDER      = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

interface BackendModul { id: string; naziv: string }

function todayIndex(): number {
  return (new Date().getDay() + 6) % 7
}

function ModuleOverviewRow({ m, color, colorLt, onDetails }: { m: ModulePerformance; color: string; colorLt: string; onDetails: () => void }) {
  const isMobile = useBreakpoint() === 'mobile'
  return (
    <div style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', background: colorLt, borderBottom: `${BW.base} solid ${C.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}` }}>
          {!isMobile && <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: `${BW.base} solid ${C.ink}`, flexShrink: 0 }} />}
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flex: 1 }}>{m.naziv}</span>
          {!isMobile && <Tag label={`${m.totalStudents} students`} bg={C.mutedLt} />}
          {!isMobile && <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />}
          <ComicBtn sm color={C.yellow} onClick={onDetails}>DETAILS</ComicBtn>
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', padding: `0 ${S[3]} ${S[2]}` }}>
            <Tag label={`${m.totalStudents} students`} bg={C.mutedLt} />
            <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />
          </div>
        )}
      </div>
      <div style={{ padding: `${S[2]} ${S[3]}`, background: C.paper }}>
        <Bar value={m.avgCompletion} color={color} height={12} shadow />
      </div>
    </div>
  )
}

function ModuleDetailView({ m, color, isMobile }: { m: ModulePerformance; color: string; colorLt?: string; isMobile: boolean }) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], paddingBottom: S[3], borderBottom: `${BW.base} solid ${C.divider}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          {!isMobile && <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: `${BW.base} solid ${C.ink}`, flexShrink: 0 }} />}
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flex: 1 }}>{m.naziv}</span>
          {!isMobile && <Tag label={`${m.totalStudents} students`} bg={C.mutedLt} />}
          {!isMobile && <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />}
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            <Tag label={`${m.totalStudents} students`} bg={C.mutedLt} />
            <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />
          </div>
        )}
      </div>
      {!isMobile && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: S[3], paddingBottom: S[2], borderBottom: `${BW.base} solid ${C.divider}` }}>
          {['QUIZ', 'AVG SCORE', 'SUBMISSIONS', 'PASS RATE'].map(h => (
            <span key={h} style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 1 }}>{h}</span>
          ))}
        </div>
      )}
      {m.kvizi.map(q => (
        <div key={q.kvizId} style={isMobile ? { display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} 0`, borderBottom: `1px solid ${C.divider}` } : { display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: S[3], alignItems: 'center' }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{q.naziv}</span>
          {isMobile ? (
            <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
              <Tag label={`AVG ${q.avgScore}%`} bg={q.avgScore >= 80 ? C.greenLt : q.avgScore >= 70 ? C.yellowLt : C.redLt} />
              <Tag label={`${q.submissions} submitted`} bg={C.mutedLt} />
              <Tag label={`${q.passRate}% passed`} bg={q.passRate >= 80 ? C.greenLt : q.passRate >= 65 ? C.yellowLt : C.redLt} />
            </div>
          ) : (
            <>
              <Tag label={`${q.avgScore}%`} bg={q.avgScore >= 80 ? C.greenLt : q.avgScore >= 70 ? C.yellowLt : C.redLt} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.sm, color: C.ink }}>{q.submissions}</span>
              <Tag label={`${q.passRate}%`} bg={q.passRate >= 80 ? C.greenLt : q.passRate >= 65 ? C.yellowLt : C.redLt} />
            </>
          )}
        </div>
      ))}
    </>
  )
}

function ModuleDropdown({ value, options, loading, onChange }: {
  value: string | null
  options: BackendModul[]
  loading: boolean
  onChange: (id: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = value ? options.find(m => m.id === value) : null
  const label = loading ? 'Loading modules…' : selected ? selected.naziv : 'ALL MODULES'
  const canOpen = !loading

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 240 }}>
      <button
        onClick={() => { if (canOpen) setOpen(o => !o) }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${S[2]} ${S[3]}`, background: C.paper, border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm, boxShadow: mkShadow(), cursor: canOpen ? 'pointer' : 'not-allowed',
          fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm,
          color: loading ? C.muted : C.ink, textTransform: 'uppercase',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {canOpen && <span style={{ fontSize: FS.xs, marginLeft: S[2], flexShrink: 0 }}>{open ? '▲' : '▼'}</span>}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
          background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
          boxShadow: mkShadow(), overflow: 'hidden',
        }}>
          {[{ id: null as string | null, naziv: 'ALL MODULES' }, ...options].map(m => (
            <div
              key={m.id ?? 'all'}
              onClick={() => { onChange(m.id); setOpen(false) }}
              onMouseEnter={() => setHovered(m.id ?? 'all')}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: `${S[2]} ${S[3]}`, cursor: 'pointer',
                background: hovered === (m.id ?? 'all') ? C.yellowLt : (m.id === value || (m.id === null && value === null)) ? C.cream : C.paper,
                fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink,
                textTransform: 'uppercase', borderBottom: `1px solid ${C.divider}`,
                transition: 'background 0.1s',
              }}
            >
              {m.naziv}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProfessorAnalytics() {
  const { session } = useAuth()
  const [modules, setModules] = useState<BackendModul[]>([])
  const [loadingModules, setLoadingModules] = useState(true)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null)
  const [moduleStats, setModuleStats] = useState<AnalyticsStats | null>(null)
  const [loadingModuleStats, setLoadingModuleStats] = useState(false)
  const [stilMixData, setStilMixData] = useState<Record<string, number> | null>(null)
  const [modulePerformance, setModulePerformance] = useState<ModulePerformance[]>([])
  const [loadingPerformance, setLoadingPerformance] = useState(true)
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [loadingWeekly, setLoadingWeekly] = useState(false)
  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'

  useEffect(() => {
    if (!session?.access_token) return
    getModuliUcitelj(session.access_token).then((data: BackendModul[]) => {
      setModules(data)
      setLoadingModules(false)
    })
    getAnalyticsStats(session.access_token).then(setAnalyticsStats).catch(() => {})
    getStilMix(session.access_token).then(setStilMixData).catch(() => {})
    getModulePerformance(session.access_token)
      .then(data => { setModulePerformance(data); setLoadingPerformance(false) })
      .catch(() => setLoadingPerformance(false))
    getWeeklyStats(session.access_token, null)
      .then(setWeeklyStats)
      .catch(() => {})
  }, [session])

  useEffect(() => {
    if (!session?.access_token) return
    getWeeklyStats(session.access_token, selectedModule)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      .then(data => { setWeeklyStats(data); setLoadingWeekly(false) })
      .catch(() => setLoadingWeekly(false))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingWeekly(true)
  }, [selectedModule, session])

  useEffect(() => {
    if (!selectedModule || !session?.access_token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModuleStats(null)
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingModuleStats(true)
    getAnalyticsStatsByModule(session.access_token, selectedModule)
      .then(data => { setModuleStats(data); setLoadingModuleStats(false) })
      .catch(() => setLoadingModuleStats(false))
  }, [selectedModule, session])

  const weeklyData = weeklyStats?.days ?? []
  const maxXp = Math.max(...weeklyData.map(d => d.xpSum), 1)
  const today = todayIndex()
  const selectedModuleName = selectedModule ? modules.find(m => m.id === selectedModule)?.naziv ?? null : null

  const perfToShow = selectedModule
    ? modulePerformance.filter(m => m.predmetId === selectedModule)
    : modulePerformance
  const activePerf = modulePerformance.find(m => m.predmetId === selectedModule) ?? null

  return (
    <div className="dashboard-main">
      <Topbar title="ANALYTICS" subtitle="Class performance and engagement overview" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        <Panel title="VIEW" accent={C.yellow} overflow="visible"
          action={!isMobile ? (selectedModuleName ? <Tag label={selectedModuleName} bg={C.yellowLt} /> : <Tag label="ALL MODULES" bg={C.yellowLt} />) : undefined}>
          <div style={{ padding: 0 }}>
            <ModuleDropdown value={selectedModule} options={modules} loading={loadingModules} onChange={setSelectedModule} />
          </div>
        </Panel>

        {(() => {
          const stats = selectedModule ? moduleStats : analyticsStats
          const loading = selectedModule ? loadingModuleStats : stats === null
          const moduleName = selectedModuleName ?? ''
          return (
            <div className="quiz-stat-grid">
              <StatCard label="TOTAL STUDENTS" value={loading ? '…' : String(stats?.totalStudents ?? 0)} sub={loading ? '' : selectedModule ? `enrolled in ${moduleName}` : stats?.totalStudents === 0 ? 'no enrollments yet' : 'enrolled across all modules'} bg={C.purpleLt} />
              <StatCard label="AVG SCORE" value={loading ? '…' : stats?.avgScore === 0 && stats?.totalStudents === 0 ? '—' : `${stats?.avgScore ?? 0}%`} sub={loading ? '' : stats?.avgScore === 0 && stats?.totalStudents === 0 ? 'no quiz results yet' : 'across all quiz attempts'} bg={C.greenLt} />
              <StatCard label="AVG COMPLETION" value={loading ? '…' : stats?.avgCompletion === 0 && stats?.totalStudents === 0 ? '—' : `${stats?.avgCompletion ?? 0}%`} sub={loading ? '' : 'students with 50%+ quiz score'} bg={C.yellowLt} />
              <StatCard label="PASS RATE" value={loading ? '…' : stats?.passRate === 0 && stats?.totalStudents === 0 ? '—' : `${stats?.passRate ?? 0}%`} sub={loading ? '' : stats?.passRate === 0 && stats?.totalStudents === 0 ? 'no quiz attempts yet' : 'of attempts scored 50%+'} bg={C.cyanLt} />
            </div>
          )
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[4], alignItems: 'stretch' }}>

          <Panel title="WEEKLY ACTIVITY" accent={C.yellow}
            action={<div style={{ display: 'flex', gap: S[1.5] }}>
              {loadingWeekly && <Tag label="..." bg={C.mutedLt} />}
              {!isMobile && (selectedModuleName ? <Tag label={selectedModuleName} bg={C.yellowLt} /> : <Tag label="ALL MODULES" bg={C.yellowLt} />)}
            </div>}>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[2], height: 160 }}>
                {weeklyData.map(d => {
                  const dayIdx   = DAY_ORDER.indexOf(d.day)
                  const isFuture = dayIdx > today
                  const isToday  = dayIdx === today
                  const barH     = isFuture || d.xpSum === 0 ? 4 : Math.round((d.xpSum / maxXp) * 130)
                  return (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1], opacity: isFuture ? 0.35 : 1 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>
                        {isFuture ? '·' : d.xpSum > 0 ? `+${d.xpSum}` : '—'}
                      </span>
                      <div style={{
                        width: '100%', height: barH,
                        background: isFuture ? C.cream : d.xpSum === 0 ? C.cream : activePerf ? PERF_COLORS[modulePerformance.indexOf(activePerf) % PERF_COLORS.length] : C.yellow,
                        border: `${BW.base} solid ${isFuture ? C.divider : C.ink}`,
                        borderRadius: `${R.sm} ${R.sm} 0 0`,
                        boxShadow: isFuture || d.xpSum === 0 ? 'none' : mkShadow(),
                      }} />
                      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isToday && (
                          <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: C.orange, border: `${BW.base} solid ${C.ink}` }} />
                        )}
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: isToday ? C.orange : isFuture ? C.divider : C.muted, letterSpacing: 0.5, marginTop: isToday ? S[2] : 0 }}>
                          {d.day}
                        </span>
                        {isToday && (
                          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.orange, letterSpacing: 0.3 }}>TODAY</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Panel>

          {(() => {
            const styles = ['visual', 'reading', 'auditory', 'kinesthetic'] as const
            const totalStudents = (stilMixData?.['_total'] as number) ?? 0
            const rows = styles.map(key => ({
              key,
              label: STYLE_INFO[key].label,
              color: STYLE_INFO[key].color,
              colorLt: STYLE_INFO[key].bg,
              count: stilMixData?.[key] ?? 0,
              percent: totalStudents > 0 ? Math.round(((stilMixData?.[key] ?? 0) / totalStudents) * 100) : 0,
            })).sort((a, b) => b.count - a.count)
            return (
              <Panel title="STUDENT STYLE MIX" accent={C.purple} p={0}
                action={<Tag label={stilMixData === null ? '…' : `${totalStudents} ${totalStudents === 1 ? 'STUDENT' : 'STUDENTS'}`} bg={C.purpleLt} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: S[4] }}>
                  {rows.map(t => (
                    <div key={t.key} style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[1.5]} ${S[3]}`, background: t.colorLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, width: (isTablet || isMobile) ? undefined : 100, flex: (isTablet || isMobile) ? 1 : undefined, flexShrink: 0, letterSpacing: 0.5 }}>{t.label.toUpperCase()}</span>
                        {!(isTablet || isMobile) && <div style={{ flex: 1 }}><Bar value={t.percent} color={t.color} height={12} shadow /></div>}
                        <Tag label={`${t.percent}%`} bg={t.color} />
                      </div>
                      {(isTablet || isMobile) && <Bar value={t.percent} color={t.color} height={12} shadow />}
                    </div>
                  ))}
                </div>
              </Panel>
            )
          })()}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: S[4], alignItems: 'stretch' }}>

          <Panel title="AVG QUIZ SCORE BY DAY" accent={C.green}
            action={<div style={{ display: 'flex', gap: S[1.5] }}>
              {loadingWeekly && <Tag label="..." bg={C.mutedLt} />}
              <Tag label="THIS WEEK" bg={C.greenLt} />
            </div>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
              {weeklyData.map(d => {
                const dayIdx   = DAY_ORDER.indexOf(d.day)
                const isFuture = dayIdx > today
                const isToday  = dayIdx === today
                return (
                  <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: S[3], opacity: isFuture ? 0.35 : 1 }}>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: isToday ? C.orange : isFuture ? C.divider : C.muted, letterSpacing: 0.5, width: 28, flexShrink: 0, textDecoration: isToday ? 'underline' : 'none' }}>{d.day}</span>
                    <div style={{ flex: 1 }}>
                      <Bar value={isFuture ? 0 : d.avgScore} color={isFuture ? C.divider : d.avgScore === 0 ? C.divider : d.avgScore >= 80 ? C.green : d.avgScore >= 70 ? C.yellow : C.red} height={12} shadow={!isFuture && d.avgScore > 0} />
                    </div>
                    <Tag label={isFuture ? '·' : d.avgScore === 0 ? '—' : `${d.avgScore}%`} bg={isToday && d.avgScore > 0 ? C.orangeLt : isFuture ? C.mutedLt : d.avgScore === 0 ? C.mutedLt : d.avgScore >= 80 ? C.greenLt : d.avgScore >= 70 ? C.yellowLt : C.redLt} />
                  </div>
                )
              })}
            </div>
          </Panel>

          <Panel title="MODULE PERFORMANCE" accent={C.cyan}
            action={activePerf
              ? <ComicBtn sm color={C.yellow} onClick={() => setSelectedModule(null)}>← BACK</ComicBtn>
              : <Tag label={loadingPerformance ? '…' : `${modulePerformance.length} MODULES`} bg={C.cyanLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], padding: 0 }}>
              {loadingPerformance && <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>LOADING...</span>}
              {!loadingPerformance && !activePerf && perfToShow.map((m, i) => (
                <ModuleOverviewRow key={m.predmetId} m={m} color={PERF_COLORS[i % PERF_COLORS.length]} colorLt={PERF_COLORS_LT[i % PERF_COLORS_LT.length]} onDetails={() => setSelectedModule(m.predmetId)} />
              ))}
              {!loadingPerformance && activePerf && (() => {
                const idx = modulePerformance.indexOf(activePerf)
                return <ModuleDetailView m={activePerf} color={PERF_COLORS[idx % PERF_COLORS.length]} colorLt={PERF_COLORS_LT[idx % PERF_COLORS_LT.length]} isMobile={isMobile} />
              })()}
            </div>
          </Panel>

        </div>

      </div>
    </div>
  )
}