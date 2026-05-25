import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { StatCard } from '../../components/ui/StatCard'
import { Panel } from '../../components/ui/Panel'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { BADGES, PROGRESS_MODULES, BIWEEKLY_XP, CALENDAR_DAYS, PROGRESS_STATS } from './mockData'

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// 5 rows × 7 cols
const WEEKS = [
  CALENDAR_DAYS.slice(0,  7),
  CALENDAR_DAYS.slice(7,  14),
  CALENDAR_DAYS.slice(14, 21),
  CALENDAR_DAYS.slice(21, 28),
  CALENDAR_DAYS.slice(28, 35),
]

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

function StreakCalendarPanel() {
  return (
    <Panel title="STREAK CALENDAR" accent={C.orange}
      action={<Tag label={`${PROGRESS_STATS.streak}D STREAK`} bg={C.orangeLt} />}>
      <div style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: S[1] }}>
          {DAY_HEADERS.map((d, i) => (
            <div key={i} style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, textAlign: 'center', letterSpacing: 0.5 }}>
              {d}
            </div>
          ))}
        </div>
        {WEEKS.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: S[1] }}>
            {week.map((day, di) => (
              <div key={di}
                title={day.future ? 'Upcoming' : `${day.date}${day.xp > 0 ? ` · +${day.xp} XP` : ' · no activity'}`}
                style={{ aspectRatio: '1', background: xpToColor(day.xp, day.future), border: `${BW.base} solid ${xpToBorder(day.xp, day.future)}`, borderRadius: R.sm, boxShadow: day.future ? 'none' : day.xp > 0 ? mkShadow('base', C.green) : mkShadow('base', C.red), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[0.5] }}
              >
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: day.future ? C.divider : C.ink, lineHeight: 1 }}>
                  {new Date(day.date).getDate()}
                </span>
                {!day.future && (
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.ink, lineHeight: 1 }}>
                    {day.xp > 0 ? `+${day.xp} XP` : 'N/A'}
                  </span>
                )}
              </div>
            ))}
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

function StreakCalendarPanelMobile() {
  const thisWeek = WEEKS[WEEKS.length - 1]
  return (
    <Panel title="STREAK CALENDAR" accent={C.orange}
      action={<Tag label={`${PROGRESS_STATS.streak}D STREAK`} bg={C.orangeLt} />}>
      <div style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: S[3] }}>

        {/* This week — large day cards */}
        <div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: '0.07em', marginBottom: S[1.5] }}>THIS WEEK</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: S[1] }}>
            {DAY_HEADERS.map((d, i) => {
              const day = thisWeek[i]
              const bg   = xpToColor(day.xp, day.future)
              const bdr  = xpToBorder(day.xp, day.future)
              return (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[0.5],
                  padding: `${S[1.5]} ${S[0.5]}`,
                  background: bg,
                  border: `${BW.base} solid ${bdr}`,
                  borderRadius: R.sm,
                  boxShadow: day.future ? 'none' : day.xp > 0 ? mkShadow('base', C.green) : mkShadow('base', C.red),
                }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: '0.05em' }}>{d}</span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: day.future ? C.divider : C.ink, lineHeight: 1 }}>
                    {new Date(day.date).getDate()}
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.ink, lineHeight: 1 }}>
                    {day.future ? '·' : day.xp > 0 ? `+${day.xp}` : '✗'}
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

function BadgesPanel({ limit, cols, useClass }: { limit?: number; cols: number; useClass?: boolean }) {
  const badges = limit ? BADGES.slice(0, limit) : BADGES
  return (
    <Panel title="BADGES" accent={C.purple} action={<Tag label={`${PROGRESS_STATS.totalBadges} EARNED`} bg={C.purpleLt} />}>
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

function ModuleProgressPanel({ navigate, isMobile }: { navigate: (path: string) => void; isMobile?: boolean }) {
  return (
    <Panel title="MODULE PROGRESS" accent={C.cyan}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
        {PROGRESS_MODULES.map(m => (
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

  return (
    <div className="dashboard-main">
      <Topbar
        title="MY PROGRESS"
        subtitle="XP · streaks · modules · badges"
        actions={<Tag label={PROGRESS_STATS.xpDelta} bg={C.greenLt} />}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Stat cards */}
        <div className="quiz-stat-grid">
          <StatCard label="TOTAL XP"  value={PROGRESS_STATS.xp.toLocaleString()}                                      sub={PROGRESS_STATS.xpDelta}                                                          bg={C.yellowLt} />
          <StatCard label="STREAK"    value={`${PROGRESS_STATS.streak}d`}                                              sub={`best: ${PROGRESS_STATS.streakBest} days`}                                      bg={C.redLt}    />
          <StatCard label="MODULES"   value={`${PROGRESS_STATS.modulesCompleted} / ${PROGRESS_STATS.modulesTotal}`}   sub={`${PROGRESS_STATS.modulesTotal - PROGRESS_STATS.modulesCompleted} in progress`}  bg={C.cyanLt}   />
          <StatCard label="BADGES"    value={`${PROGRESS_STATS.totalBadges} / ${PROGRESS_STATS.badgesTotal}`}         sub={`${PROGRESS_STATS.badgesTotal - PROGRESS_STATS.totalBadges} remaining`}           bg={C.purpleLt} />
        </div>

        {/* XP chart */}
        {isMobile ? (
          <Panel title="XP ACTIVITY" accent={C.yellow}
            action={<Tag label={`+${PROGRESS_STATS.biweeklyGain}%`} bg={C.greenLt} />}>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[1.5], height: 140 }}>
                {BIWEEKLY_XP.slice(7).map((d) => {
                  const maxXp = Math.max(...BIWEEKLY_XP.slice(7).map(d => d.xp), 1)
                  const barH = d.xp === 0 ? 4 : Math.round((d.xp / maxXp) * 110)
                  return (
                    <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1] }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>
                        {d.xp > 0 ? `+${d.xp}` : '—'}
                      </span>
                      <div style={{ width: '100%', height: barH, background: d.xp === 0 ? C.cream : C.yellow, border: `${BW.base} solid ${C.ink}`, borderRadius: `${R.sm} ${R.sm} 0 0`, boxShadow: d.xp > 0 ? mkShadow() : 'none' }} />
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.muted, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                        {d.label.split(' ')[1]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="XP ACTIVITY" accent={C.yellow}
            action={<Tag label={`+${PROGRESS_STATS.biweeklyGain}% VS PREV WEEK`} bg={C.greenLt} />}>
            <div style={{ padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[1.5], height: 140 }}>
                {BIWEEKLY_XP.map((d, i) => {
                  const maxXp = Math.max(...BIWEEKLY_XP.map(d => d.xp), 1)
                  const barH = d.xp === 0 ? 4 : Math.round((d.xp / maxXp) * 110)
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
            {/* Mobile: calendar redesign + modules + badges stacked */}
            <StreakCalendarPanelMobile />
            <ModuleProgressPanel navigate={navigate} isMobile />
            <BadgesPanel cols={1} />
          </>
        ) : isTablet ? (
          <>
            {/* Tablet: Module progress full width, then Streak + Badges 50:50 */}
            <ModuleProgressPanel navigate={navigate} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], alignItems: 'stretch' }}>
              <StreakCalendarPanel />
              <BadgesPanel limit={4} cols={2} />
            </div>
          </>
        ) : (
          <>
            {/* Desktop: Streak calendar + Module progress 2fr 3fr, Badges full width */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: S[4], alignItems: 'stretch' }}>
              <StreakCalendarPanel />
              <ModuleProgressPanel navigate={navigate} />
            </div>
            <BadgesPanel cols={4} />
          </>
        )}

      </div>
    </div>
  )
}
