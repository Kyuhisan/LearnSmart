import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Bar } from '../../components/ui/Bar'
import { Panel } from '../../components/ui/Panel'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import { IconBox } from '../../components/ui/IconBox'
import {
  STUDENT_STATS,
  STUDENT_RECENT_MODULES,
  STUDENT_UPCOMING_QUIZZES,
  STUDENT_DAILY_QUESTS,
  STUDENT_BIT_PICKS,
  STUDENT_LEADERBOARD,
  STUDENT_BADGES,
  VARK_PROFILES,
} from './mockData'

const STAT_COLS = [
  { label: 'XP POINTS',  value: STUDENT_STATS.xp.toLocaleString(), accent: C.yellow },
  { label: 'DAY STREAK', value: `${STUDENT_STATS.streak}`,          accent: C.orange },
  { label: 'QUIZ AVG',   value: `${STUDENT_STATS.avgQuizScore}%`,   accent: C.cyan   },
  { label: 'CLASS RANK', value: `#${STUDENT_STATS.rank}`,           accent: C.purple },
]

function ModuleRow({ mod, onClick }: { mod: typeof STUDENT_RECENT_MODULES[number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const isMobile = useBreakpoint() === 'mobile'
  const baseStyle = { padding: S[2], background: hovered ? C.yellowLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(hovered ? 'lg' : 'base'), cursor: 'pointer', transform: hovered ? 'translate(-1px,-1px)' : 'none', transition: 'background 0.1s, transform 0.1s, box-shadow 0.1s' }

  if (isMobile) {
    return (
      <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ ...baseStyle, display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, minWidth: 0 }}>{mod.title}</div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, flexShrink: 0 }}>{mod.progress}% DONE</div>
        </div>
        <div style={{ fontSize: FS.xs, color: C.muted }}>Next: {mod.nextUp}</div>
        <Bar value={mod.progress} color={mod.color} shadow />
      </div>
    )
  }

  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...baseStyle, display: 'flex', alignItems: 'center', gap: S[3] }}>
      <div style={{ width: 36, height: 36, background: mod.color, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <IconBox size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{mod.title}</div>
        <div style={{ fontSize: FS.xs, color: C.muted, marginTop: S[0.5] }}>Next: {mod.nextUp}</div>
        <div style={{ marginTop: S[1] }}><Bar value={mod.progress} color={mod.color} shadow /></div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{mod.progress}%</div>
        <div style={{ fontSize: FS['2xs'], color: C.muted, fontWeight: 700 }}>DONE</div>
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

function QuizItem({ q }: { q: typeof STUDENT_UPCOMING_QUIZZES[number] }) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: S[2], background: q.urgent ? C.redLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>{q.title}</div>
            <div style={{ fontSize: FS['2xs'], color: C.muted, marginTop: S[0.5] }}>{q.module}</div>
          </div>
          <Tag label={q.due} bg={q.urgent ? C.red : C.mutedLt} />
        </div>
        <ComicBtn sm color={q.urgent ? C.red : C.yellow}>GO →</ComicBtn>
      </div>
    )
  }

  if (isTablet) {
    return (
      <div style={{ padding: S[2], background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: 32, height: 32, background: q.urgent ? C.redLt : C.mutedLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>{q.title}</div>
            <div style={{ fontSize: FS['2xs'], color: C.muted, marginTop: S[0.5] }}>{q.module}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: S[2] }}>
          <Tag label={q.due} bg={q.urgent ? C.red : C.mutedLt} />
          <ComicBtn sm color={q.urgent ? C.red : C.yellow}>GO →</ComicBtn>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], background: q.urgent ? C.redLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>{q.title}</div>
        <div style={{ fontSize: FS['2xs'], color: C.muted, marginTop: S[0.5] }}>{q.module}</div>
      </div>
      <Tag label={q.due} bg={q.urgent ? C.red : C.mutedLt} />
      <ComicBtn sm color={q.urgent ? C.red : C.yellow}>GO →</ComicBtn>
    </div>
  )
}

export function StudentDashboard() {
  const navigate = useNavigate()
  const { profil } = useAuth()
  const bp = useBreakpoint()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'
  const [quests, setQuests] = useState(() => STUDENT_DAILY_QUESTS.map(q => ({ ...q })))
  const doneCount = quests.filter(q => q.done).length
  const totalXpToday = quests.filter(q => q.done).reduce((a, q) => a + q.xp, 0)

  const styleKey = profil?.ucniTip && VARK_PROFILES[profil.ucniTip] ? profil.ucniTip : null
  const styleProfile = styleKey ? VARK_PROFILES[styleKey] : null
  const info = styleKey ? STYLE_INFO[styleKey as keyof typeof STYLE_INFO] : STYLE_INFO.visual

  function toggleQuest(id: string) {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, done: !q.done } : q))
  }

  return (
    <div className="dashboard-main">
      <Topbar
        title="HOME BASE"
        subtitle={`Day ${STUDENT_STATS.streak} streak · Keep it going!`}
        actions={<ComicBtn sm color={C.cyan} onClick={() => navigate('/notifications')}>2 NEW</ComicBtn>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* BIT greeting */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <BitMascot size={70} mood="happy" float />
          <SpeechBubble color={C.cyan} style={{ flex: 1, maxWidth: 480 }}>
            <div style={{ fontSize: FS.xs, fontFamily: "'Archivo Black', sans-serif", letterSpacing: 1 }}>BIT SAYS:</div>
            <div style={{ fontSize: FS.lg, fontWeight: 700, marginTop: S[1], lineHeight: 1.4 }}>
              You're on a <strong>{STUDENT_STATS.streak}-day streak!</strong> {STUDENT_STATS.modulesInProgress} modules in progress. Keep pushing!
            </div>
          </SpeechBubble>
        </div>

        {/* YOUR STATISTICS */}
        <Panel title="YOUR STATISTICS" accent={C.yellow} p={0}>
          <div className="stat-grid">
            {STAT_COLS.map((s, i) => (
              <div key={s.label} className="stat-grid-cell" style={{ borderRight: i < STAT_COLS.length - 1 ? `${BW.base} solid ${C.divider}` : 'none', display: 'flex', flexDirection: 'column', gap: S[1] }}>
                <div className="stat-grid-value">{s.value}</div>
                <div className="stat-grid-label">{s.label}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Row 1: Learning Type (wide) + Quests (narrow) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          <Panel title="YOUR LEARNING TYPE" accent={info.bg} p={S[4]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {!styleProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[4]} 0`, color: C.muted }}>
                  <BitMascot size={48} mood="thinking" float />
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center' }}>COMPLETE THE VARK QUIZ TO DISCOVER YOUR STYLE</div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: info.bg, border: `${BW.base} solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconBox size={20} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink }}>{styleProfile.label}</div>
                      <div style={{ fontSize: FS.xs, color: C.muted, marginTop: S[0.5] }}>Based on your VARK profile</div>
                    </div>
                  </div>
                  <div style={{ fontSize: FS.xs, color: C.ink, lineHeight: 1.6 }}>{styleProfile.description}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
                    {styleProfile.vark.map((v) => (
                      <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, width: 20, flexShrink: 0, color: C.ink }}>{v.key}</span>
                        <div style={{ flex: 1 }}><Bar value={v.score} color={v.color} shadow /></div>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, width: 28, textAlign: 'right', color: C.muted }}>{v.score}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Panel>

          <Panel title="TODAY'S QUESTS" accent={C.green} p={S[4]}
            action={<Tag label={`+${totalXpToday}XP`} bg={C.greenLt} />}>
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

        {/* Row 2: Modules (wide) + BIT Picks / Upcoming Quizzes (narrow stacked) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          <Panel title="YOUR MODULES" accent={C.yellow} p={S[4]}
            action={<ComicBtn sm color={C.yellow} onClick={() => navigate('/modules')}>SEE ALL →</ComicBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {STUDENT_RECENT_MODULES.map((mod) => (
                <ModuleRow key={mod.id} mod={mod} onClick={() => navigate(`/modules/${mod.id}`)} />
              ))}
            </div>
          </Panel>

          <Panel title="BIT PICKS FOR YOU" accent={C.cyan} p={S[4]}
            action={<Tag label="FOR YOU" bg={C.cyanLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {STUDENT_BIT_PICKS.map((pick) => (
                <div key={pick.id} onClick={() => navigate(`/modules/${pick.id}`)}
                  style={{ padding: S[2], background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.yellowLt; e.currentTarget.style.transform = 'translate(-1px,-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.paper; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    {!isMobile && (
                      <div style={{ width: 32, height: 32, background: pick.color, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconBox size={14} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>{pick.title}</div>
                      <div style={{ fontSize: FS['2xs'], color: C.muted, marginTop: S[0.5] }}>{pick.reason}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: S[1], marginTop: S[2] }}>
                    <Tag label={`+${pick.xp} XP`} bg={C.yellowLt} />
                    <Tag label={pick.duration} bg={C.mutedLt} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Row 3: Leaderboard (left) + Upcoming Quizzes (right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: S[3], alignItems: 'stretch' }}>

          <Panel title="THIS WEEK · LEADERBOARD" accent={C.purple} p={S[4]}
            action={<ComicBtn sm color={C.purple} onClick={() => navigate('/leaderboard')}>SEE ALL →</ComicBtn>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {STUDENT_LEADERBOARD.map((entry) => (
                <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: S[2], background: entry.isMe ? C.yellowLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                  <div style={{ width: 28, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: entry.rank <= 3 ? C.yellow : C.muted, flexShrink: 0, textAlign: 'center' }}>#{entry.rank}</div>
                  <span style={{ flex: 1, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{entry.name}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{entry.xp.toLocaleString()} XP</span>
                  {entry.isMe && <Tag label="YOU" bg={C.yellow} />}
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="UPCOMING QUIZZES" accent={C.red} p={S[4]}
            action={<Tag label={`${STUDENT_UPCOMING_QUIZZES.length} DUE`} bg={C.redLt} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {STUDENT_UPCOMING_QUIZZES.map((q) => (
                <QuizItem key={q.id} q={q} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Badges — full width */}
        <Panel title="BADGES" accent={C.orange} p={S[4]}
          action={<Tag label={`${STUDENT_BADGES.length} EARNED`} bg={C.orangeLt} />}>
          <div className="badge-grid">
            {(isTablet ? STUDENT_BADGES.slice(0, 4) : STUDENT_BADGES).map((badge) => (
              <div key={badge.id} className="badge-grid-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[1], padding: S[3], background: badge.bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), textAlign: 'center' }}>
                <IconBox size={24} />
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.ink, lineHeight: 1.3 }}>{badge.label}</div>
                <div style={{ fontSize: FS['2xs'], color: C.ink, opacity: 0.6 }}>{badge.earned}</div>
              </div>
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}
