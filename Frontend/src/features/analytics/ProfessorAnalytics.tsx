import { useState, useRef, useEffect } from 'react'
import { Bar } from '../../components/ui/Bar'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { StatCard } from '../../components/ui/StatCard'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import {
  ANALYTICS_STATS,
  WEEKLY_ACTIVITY,
  MODULE_STATS,
  STYLE_BREAKDOWN,
  CONCEPT_MASTERY,
  MODULE_DETAILS,
  type ModuleStats,
  type ModuleDetail,
} from './mockData'


function ModuleOverviewRow({ m, onDetails }: { m: ModuleStats; onDetails: () => void }) {
  const isMobile = useBreakpoint() === 'mobile'
  return (
    <div style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', background: m.colorLt, borderBottom: `${BW.base} solid ${C.ink}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}` }}>
          {!isMobile && <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, border: `${BW.base} solid ${C.ink}`, flexShrink: 0 }} />}
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flex: 1 }}>{m.title}</span>
          {!isMobile && <Tag label={`${m.students} students`} bg={C.mutedLt} />}
          {!isMobile && <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />}
          <ComicBtn sm color={C.paper} hoverColor={C.yellowLt} onClick={onDetails}>DETAILS</ComicBtn>
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', padding: `0 ${S[3]} ${S[2]}` }}>
            <Tag label={`${m.students} students`} bg={C.mutedLt} />
            <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />
          </div>
        )}
      </div>
      <div style={{ padding: `${S[2]} ${S[3]}`, background: C.paper }}>
        <Bar value={m.avgCompletion} color={m.color} height={12} shadow />
      </div>
    </div>
  )
}

function ModuleDetailView({ detail, module: m, isMobile }: { detail: ModuleDetail; module: ModuleStats; isMobile: boolean }) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], paddingBottom: S[3], borderBottom: `${BW.base} solid ${C.divider}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          {!isMobile && <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, border: `${BW.base} solid ${C.ink}`, flexShrink: 0 }} />}
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flex: 1 }}>{m.title}</span>
          {!isMobile && <Tag label={`${m.students} students`} bg={C.mutedLt} />}
          {!isMobile && <Tag label={`${m.avgCompletion}% completion`} bg={m.avgCompletion >= 75 ? C.greenLt : m.avgCompletion >= 50 ? C.yellowLt : C.redLt} />}
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            <Tag label={`${m.students} students`} bg={C.mutedLt} />
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
      {detail.quizzes.map(q => (
        <div key={q.quiz} style={isMobile ? { display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} 0`, borderBottom: `1px solid ${C.divider}` } : { display: 'grid', gridTemplateColumns: '2fr repeat(3, 1fr)', gap: S[3], alignItems: 'center' }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{q.quiz}</span>
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

function ModuleDropdown({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
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

  const selected = value ? MODULE_STATS.find(m => m.id === value) : null
  const label = selected ? selected.title : 'ALL MODULES'

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 240 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${S[2]} ${S[3]}`, background: C.paper, border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm, boxShadow: mkShadow(), cursor: 'pointer',
          fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink,
          textTransform: 'uppercase',
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: FS.xs, marginLeft: S[2] }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
          background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
          boxShadow: mkShadow(), overflow: 'hidden',
        }}>
          {[{ id: null, title: 'ALL MODULES' }, ...MODULE_STATS].map(m => (
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
              {m.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProfessorAnalytics() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'

  const maxSessions = Math.max(...WEEKLY_ACTIVITY.map(d => d.sessions))
  const filteredModules = selectedModule
    ? MODULE_STATS.filter(m => m.id === selectedModule)
    : MODULE_STATS

  const activeModule = selectedModule ? MODULE_STATS.find(m => m.id === selectedModule) : null
  const activeModuleDetail = selectedModule ? MODULE_DETAILS.find(d => d.moduleId === selectedModule) : null

  return (
    <div className="dashboard-main">
      <Topbar title="ANALYTICS" subtitle="Class performance and engagement overview" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Module selector */}
        <Panel title="VIEW" accent={C.yellow} overflow="visible"
          action={!isMobile ? (activeModule ? <Tag label={activeModule.title} bg={activeModule.colorLt} /> : <Tag label="ALL MODULES" bg={C.yellowLt} />) : undefined}>
          <div style={{ padding: 0 }}>
            <ModuleDropdown value={selectedModule} onChange={setSelectedModule} />
          </div>
        </Panel>

        {/* Stats row */}
        <div className="quiz-stat-grid">
          <StatCard
            label="ACTIVE STUDENTS"
            value={activeModule ? activeModule.students : `${ANALYTICS_STATS.activeStudents} / ${ANALYTICS_STATS.totalStudents}`}
            sub={activeModule ? '' : ANALYTICS_STATS.activeStudentsDelta}
            bg={C.purpleLt}
          />
          <StatCard
            label="AVG SCORE"
            value={`${activeModule ? activeModule.avgScore : ANALYTICS_STATS.avgScore}%`}
            sub={activeModule ? '' : ANALYTICS_STATS.avgScoreDelta}
            bg={C.greenLt}
          />
          <StatCard
            label="AVG COMPLETION"
            value={`${activeModule ? activeModule.avgCompletion : ANALYTICS_STATS.avgCompletion}%`}
            sub={activeModule ? '' : ANALYTICS_STATS.avgCompletionDelta}
            bg={C.yellowLt}
          />
          <StatCard
            label="QUIZZES GRADED"
            value={ANALYTICS_STATS.quizzesGraded}
            sub={`${ANALYTICS_STATS.quizzesPending} pending`}
            bg={C.cyanLt}
          />
        </div>

        {/* Weekly activity + Style breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[4], alignItems: 'stretch' }}>

          {/* Weekly activity chart */}
          <Panel title="WEEKLY ACTIVITY" accent={C.yellow}
            action={!isMobile ? (activeModule ? <Tag label={activeModule.title} bg={activeModule.colorLt} /> : <Tag label="ALL MODULES" bg={C.yellowLt} />) : undefined}>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[2], height: 160 }}>
                {WEEKLY_ACTIVITY.map(d => {
                  const barH = Math.round((d.sessions / maxSessions) * 130)
                  return (
                    <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1] }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>{d.sessions}</span>
                      <div style={{ width: '100%', height: barH, background: activeModule ? activeModule.color : C.yellow, border: `${BW.base} solid ${C.ink}`, borderRadius: `${R.sm} ${R.sm} 0 0`, boxShadow: mkShadow() }} />
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.5 }}>{d.day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Panel>

          {/* VARK style breakdown */}
          <Panel title="LEARNING STYLES" accent={C.purple}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
              {STYLE_BREAKDOWN.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[1.5]} ${S[3]}`, background: s.colorLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, width: (isTablet || isMobile) ? undefined : 100, flex: (isTablet || isMobile) ? 1 : undefined, flexShrink: 0, letterSpacing: 0.5 }}>{s.label}</span>
                  {!(isTablet || isMobile) && <div style={{ flex: 1 }}><Bar value={s.percent} color={s.color} height={12} shadow /></div>}
                  <Tag label={`${s.percent}%`} bg={s.color} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Avg quiz score by day + Concept mastery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: S[4], alignItems: 'stretch' }}>

          {/* Avg quiz score by day */}
          <Panel title="AVG QUIZ SCORE BY DAY" accent={C.green}
            action={<Tag label="THIS WEEK" bg={C.greenLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
              {WEEKLY_ACTIVITY.map(d => (
                <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.5, width: 28, flexShrink: 0 }}>{d.day}</span>
                  <div style={{ flex: 1 }}>
                    <Bar value={d.avgScore} color={d.avgScore >= 80 ? C.green : d.avgScore >= 70 ? C.yellow : C.red} height={12} shadow />
                  </div>
                  <Tag
                    label={`${d.avgScore}%`}
                    bg={d.avgScore >= 80 ? C.greenLt : d.avgScore >= 70 ? C.yellowLt : C.redLt}
                  />
                </div>
              ))}
            </div>
          </Panel>

          {/* Concept mastery */}
          <Panel title="CONCEPT MASTERY" accent={C.cyan}
            action={<Tag label={`${CONCEPT_MASTERY.length} CONCEPTS`} bg={C.cyanLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
              {CONCEPT_MASTERY.map(c => (
                <div key={c.concept} style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[1.5]} ${S[3]}`, background: c.colorLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, width: isMobile ? undefined : 160, flex: isMobile ? 1 : undefined, flexShrink: 0 }}>{c.concept}</span>
                  {!isMobile && <div style={{ flex: 1 }}><Bar value={c.mastery} color={c.color} height={12} shadow /></div>}
                  <Tag label={`${c.mastery}%`} bg={c.mastery >= 75 ? C.greenLt : c.mastery >= 50 ? C.yellowLt : C.redLt} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Module performance */}
        <Panel title="MODULE PERFORMANCE" accent={C.cyan}
          action={<Tag label={selectedModule ? '1 MODULE' : `${MODULE_STATS.length} MODULES`} bg={C.cyanLt} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], padding: 0 }}>

            {!activeModuleDetail && filteredModules.map(m => (
              <ModuleOverviewRow key={m.id} m={m} onDetails={() => setSelectedModule(m.id)} />
            ))}

            {activeModuleDetail && activeModule && (
              <ModuleDetailView detail={activeModuleDetail} module={activeModule} isMobile={isMobile} />
            )}
          </div>
        </Panel>

      </div>
    </div>
  )
}
