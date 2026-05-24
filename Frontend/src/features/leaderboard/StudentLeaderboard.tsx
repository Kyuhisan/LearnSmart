import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '../../components/ui/StatCard'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { LEADERBOARD, LEADERBOARD_STATS, type LeaderboardEntry } from './mockData'

const MEDAL = ['#1', '#2', '#3']
const PODIUM_COLOR = [C.yellow, C.mutedLt, C.orange]
const PODIUM_COLOR_LT = [C.yellowLt, C.cream, C.orangeLt]
const PODIUM_HEIGHT = ['7rem', '5.5rem', '4.5rem']

type Filter = 'ALL TIME' | 'THIS WEEK'

function PodiumCard({ entry, position }: { entry: LeaderboardEntry; position: 0 | 1 | 2 }) {
  const xp = entry.xp
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[2], flex: 1 }}>
      {/* Avatar */}
      <div style={{
        width: position === 0 ? '4.5rem' : '3.5rem',
        height: position === 0 ? '4.5rem' : '3.5rem',
        borderRadius: '50%',
        background: PODIUM_COLOR[position],
        border: `${BW.base} solid ${C.ink}`,
        boxShadow: mkShadow('lg'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: position === 0 ? FS['4xl'] : FS['3xl'],
        flexShrink: 0,
      }}>
        {entry.username[0].toUpperCase()}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{entry.username}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted, marginTop: S[0.5] }}>{xp.toLocaleString()} XP</div>
      </div>
      {/* Podium block */}
      <div style={{
        width: '100%', height: PODIUM_HEIGHT[position],
        background: PODIUM_COLOR_LT[position],
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: `${R.sm} ${R.sm} 0 0`,
        boxShadow: mkShadow(),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS['3xl'], color: C.ink,
      }}>
        {MEDAL[position]}
      </div>
    </div>
  )
}

function LeaderboardRow({ entry, filter }: { entry: LeaderboardEntry; filter: Filter }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const isTop3 = entry.rank <= 3
  const xp = filter === 'THIS WEEK' ? entry.weeklyXp : entry.xp

  const handleClick = () => {
    if (entry.isCurrentUser) navigate('/profile')
    else navigate(`/students/${entry.id}`)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: S[3],
        padding: `${S[2.5]} ${S[3]}`,
        background: entry.isCurrentUser ? C.yellow : hovered ? C.yellowLt : C.paper,
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: R.sm,
        boxShadow: entry.isCurrentUser ? mkShadow('lg') : mkShadow(hovered ? 'lg' : 'base'),
        transform: hovered ? 'translate(-1px, -1px)' : 'none',
        transition: 'all 0.1s ease',
        cursor: 'pointer',
      }}
    >
      {/* Rank */}
      <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: isTop3 ? C.ink : C.muted }}>#{entry.rank}</span>
      </div>

      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: C.cream,
        border: `${BW.base} solid ${C.ink}`,
        boxShadow: mkShadow(),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm,
        flexShrink: 0,
      }}>
        {entry.username[0].toUpperCase()}
      </div>

      {/* Username */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>
            {entry.username}{entry.isCurrentUser && ' (you)'}
          </span>
          <Tag label={entry.style} bg={entry.styleColor} />
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>
          +{entry.weeklyXp} XP this week
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>{xp.toLocaleString()}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>XP</div>
        </div>
        <Tag label={`${entry.streak}D STREAK`} bg={C.redLt} />
        <Tag label={`${entry.badges} BADGES`} bg={C.purpleLt} />
      </div>
    </div>
  )
}

export function StudentLeaderboard() {
  const [filter, setFilter] = useState<Filter>('ALL TIME')
  const top3 = LEADERBOARD.slice(0, 3)
  const sorted = filter === 'THIS WEEK'
    ? [...LEADERBOARD].sort((a, b) => b.weeklyXp - a.weeklyXp).map((e, i) => ({ ...e, rank: i + 1 }))
    : LEADERBOARD

  return (
    <div className="dashboard-main">
      <Topbar
        title="LEADERBOARD"
        subtitle="XP rankings · streaks · badges"
        actions={<Tag label={`${LEADERBOARD_STATS.totalStudents} STUDENTS`} bg={C.yellowLt} />}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
          <StatCard label="MY RANK"       value={`#${LEADERBOARD_STATS.myRank}`}             sub={LEADERBOARD_STATS.rankDelta}   bg={C.yellowLt} />
          <StatCard label="MY XP"         value={LEADERBOARD_STATS.myXp.toLocaleString()}    sub="total earned"                  bg={C.purpleLt} />
          <StatCard label="THIS WEEK"     value={`+${LEADERBOARD_STATS.myWeeklyXp}`}         sub="XP this week"                  bg={C.cyanLt}   />
          <StatCard label="MY STREAK"     value={`${LEADERBOARD_STATS.myStreak}d`}           sub="keep it going!"                bg={C.redLt}    />
        </div>

        {/* Podium */}
        <Panel title="TOP 3" accent={C.yellow} action={<Tag label="HALL OF FAME" bg={C.yellowLt} />}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[3], padding: 0 }}>
            <PodiumCard entry={top3[1]} position={1} />
            <PodiumCard entry={top3[0]} position={0} />
            <PodiumCard entry={top3[2]} position={2} />
          </div>
        </Panel>

        {/* Full rankings */}
        <Panel
          title="RANKINGS"
          accent={C.cyan}
          action={
            <div style={{ display: 'flex', gap: S[1.5] }}>
              {(['ALL TIME', 'THIS WEEK'] as Filter[]).map(f => (
                <div
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: `${S[1]} ${S[2.5]}`,
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: FS.xs, letterSpacing: 0.5,
                    background: filter === f ? C.yellow : C.paper,
                    color: C.ink,
                    border: `${BW.base} solid ${C.ink}`,
                    borderRadius: R.sm,
                    boxShadow: mkShadow(),
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {f}
                </div>
              ))}
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: 0 }}>
            {sorted.map(entry => (
              <LeaderboardRow key={entry.username} entry={entry} filter={filter} />
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}
