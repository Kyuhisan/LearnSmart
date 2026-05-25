import { useState } from 'react'
import { Panel } from '../../components/ui/Panel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import {
  MOCK_NOTIFICATIONS,
  TYPE_META,
  FILTER_TABS,
  type FilterTab,
  type Notification,
} from './mockData'

function NotifRow({ n, onToggle }: { n: Notification & { isNew: boolean }; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  const meta = TYPE_META[n.type]
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: S[1], padding: S[3],
        background: hovered ? C.yellowLt : n.read ? C.paper : C.cream,
        border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
        boxShadow: mkShadow(hovered ? 'lg' : 'base'),
        transform: hovered ? 'translate(-1px,-1px)' : 'none',
        transition: 'background 0.1s, transform 0.1s, box-shadow 0.1s',
        cursor: 'pointer',
      }}
    >
      {/* Row 1: dot + tags + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? C.mutedLt : meta.color, border: `1.5px solid ${n.read ? C.muted : 'transparent'}`, flexShrink: 0 }} />
        <Tag label={meta.label} bg={meta.bg} />
        {n.isNew && !n.read && <Tag label="NEW" bg={meta.color} />}
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted, whiteSpace: 'nowrap', marginLeft: 'auto' }}>{n.time}</span>
      </div>
      {/* Row 2: title */}
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{n.title}</span>
      {/* Row 3: body */}
      <div style={{ fontSize: FS.sm, color: C.muted, lineHeight: 1.5 }}>{n.body}</div>
    </div>
  )
}

export function Notifications() {
  const [filter, setFilter] = useState<FilterTab>('ALL')
  const [notifs, setNotifs] = useState(() => MOCK_NOTIFICATIONS.map(n => ({ ...n, isNew: !n.read })))

  const unreadCount = notifs.filter(n => !n.read).length

  function toggleRead(id: string) {
    setNotifs(prev => prev.map(n => {
      if (n.id !== id) return n
      const nowRead = !n.read
      return { ...n, read: nowRead, isNew: nowRead ? false : n.isNew }
    }))
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const filtered = notifs.filter(n => {
    if (filter === 'UNREAD')        return !n.read
    if (filter === 'QUIZZES')       return n.type === 'quiz'
    if (filter === 'MODULES')       return n.type === 'module'
    if (filter === 'ANNOUNCEMENTS') return n.type === 'announcement'
    return true
  })

  const groups = (['Today', 'Yesterday', 'Older'] as const).filter(g =>
    filtered.some(n => n.group === g)
  )

  return (
    <div className="dashboard-main">
      <Topbar
        title="NOTIFICATIONS"
        subtitle="Quiz alerts, module updates, announcements"
        actions={unreadCount > 0 ? <ComicBtn sm color={C.paper} onClick={markAllRead}>MARK ALL READ</ComicBtn> : undefined}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          {FILTER_TABS.map(tab => {
            const active = filter === tab
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, letterSpacing: 0.5,
                  padding: `${S[1]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
                  background: active ? C.ink : C.paper, color: active ? C.paper : C.ink,
                  boxShadow: mkShadow(active ? 'lg' : 'base'),
                  transform: active ? 'translate(-1px,-1px)' : 'none',
                  cursor: 'pointer', transition: 'background 0.1s, transform 0.1s',
                }}
              >
                {tab}{tab === 'UNREAD' && unreadCount > 0 ? ` (${unreadCount})` : ''}
              </button>
            )
          })}
        </div>

        {/* Notification groups */}
        {groups.length === 0 ? (
          <Panel title="NO NOTIFICATIONS" accent={C.muted} p={S[6]}>
            <div style={{ textAlign: 'center', color: C.muted, fontSize: FS.sm }}>Nothing here yet.</div>
          </Panel>
        ) : (
          groups.map(group => {
            const groupItems = filtered.filter(n => n.group === group)
            const groupUnread = groupItems.filter(n => !n.read).length
            const accent = group === 'Today' ? C.yellow : C.muted
            return (
            <Panel key={group} title={group.toUpperCase()} accent={accent} p={S[4]}
              action={groupUnread > 0 ? <Tag label={`${groupUnread} UNREAD`} bg={accent} /> : <Tag label="ALL READ" bg={C.mutedLt} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {groupItems.map(n => (
                  <NotifRow key={n.id} n={n} onToggle={() => toggleRead(n.id)} />
                ))}
              </div>
            </Panel>
          )})
        )}

      </div>
    </div>
  )
}
