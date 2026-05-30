import { useState, useEffect, useCallback } from 'react'
import { Panel } from '../../components/ui/Panel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useAuth } from '../../context/AuthContext'
import { getMojaObvestila, oznaciPrebrano, oznaciVsePrebrano } from './notificationsApi'


interface Obvestilo {
  id: string
  tip: string
  naslov: string
  sporocilo: string
  jePrebrano: boolean
  ustvarjenoOb: string
  povezava?: string
}

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  QUIZ:     { label: 'QUIZ',     color: C.red,    bg: C.redLt    },
  MODULE:   { label: 'MODULE',   color: C.yellow,  bg: C.yellowLt },
  SYSTEM:   { label: 'SYSTEM',   color: C.muted,   bg: C.mutedLt  },
  ANNOUNCE: { label: 'ANNOUNCE', color: C.purple,  bg: C.purpleLt },
}

function formatCas(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000)
  const diffD = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffH < 1) return 'Just now'
  if (diffH < 24) return `${diffH}h ago`
  if (diffD === 1) return 'Yesterday'
  return d.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })
}

function getGroup(iso: string): 'Today' | 'Yesterday' | 'Older' {
  const diffD = Math.floor((new Date().getTime() - new Date(iso).getTime()) / 86400000)
  if (diffD === 0) return 'Today'
  if (diffD === 1) return 'Yesterday'
  return 'Older'
}

function NotifRow({ n, onToggle }: { n: Obvestilo; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  const meta = TYPE_META[n.tip] ?? TYPE_META['SYSTEM']
  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', gap: S[1], padding: S[3],
        background: hovered ? C.yellowLt : n.jePrebrano ? C.paper : C.cream,
        border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
        boxShadow: mkShadow(hovered ? 'lg' : 'base'),
        transform: hovered ? 'translate(-1px,-1px)' : 'none',
        transition: 'background 0.1s, transform 0.1s, box-shadow 0.1s',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.jePrebrano ? C.mutedLt : meta.color, border: `1.5px solid ${n.jePrebrano ? C.muted : 'transparent'}`, flexShrink: 0 }} />
        <Tag label={meta.label} bg={meta.bg} />
        {!n.jePrebrano && <Tag label="NEW" bg={meta.color} />}
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted, whiteSpace: 'nowrap', marginLeft: 'auto' }}>{formatCas(n.ustvarjenoOb)}</span>
      </div>
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{n.naslov}</span>
      <div style={{ fontSize: FS.sm, color: C.muted, lineHeight: 1.5 }}>{n.sporocilo}</div>
    </div>
  )
}

function NotificationsBase({ subtitle }: { subtitle: string }) {
  const { session } = useAuth()
  const [obvestila, setObvestila] = useState<Obvestilo[]>([])
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'QUIZ' | 'MODULE'>('ALL')
  const [loading, setLoading] = useState(true)

  const nalozi = useCallback(async () => {
    if (!session?.access_token) return
    try {
      const data = await getMojaObvestila(session.access_token)
      setObvestila(data)
    } catch (e) {
      console.error('Failed to load notifications:', e)
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    nalozi()
  }, [nalozi])

  const unreadCount = obvestila.filter(n => !n.jePrebrano).length

  async function handleToggle(id: string) {
    if (!session?.access_token) return
    await oznaciPrebrano(session.access_token, id)
    setObvestila(prev => prev.map(n => n.id === id ? { ...n, jePrebrano: true } : n))
  }

  async function handleMarkAllRead() {
    if (!session?.access_token) return
    await oznaciVsePrebrano(session.access_token)
    setObvestila(prev => prev.map(n => ({ ...n, jePrebrano: true })))
  }

  const filtered = obvestila.filter(n => {
    if (filter === 'UNREAD') return !n.jePrebrano
    if (filter === 'QUIZ')   return n.tip === 'QUIZ'
    if (filter === 'MODULE') return n.tip === 'MODULE'
    return true
  })

  const groups = (['Today', 'Yesterday', 'Older'] as const).filter(g =>
    filtered.some(n => getGroup(n.ustvarjenoOb) === g)
  )

  const tabs = [
    { key: 'ALL',    label: 'ALL' },
    { key: 'UNREAD', label: `UNREAD${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { key: 'QUIZ',   label: 'QUIZZES' },
    { key: 'MODULE', label: 'MODULES' },
  ] as const

  return (
    <div className="dashboard-main">
      <Topbar
        title="NOTIFICATIONS"
        subtitle={subtitle}
        actions={unreadCount > 0 ? <ComicBtn sm color={C.paper} onClick={handleMarkAllRead}>MARK ALL READ</ComicBtn> : undefined}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          {tabs.map(tab => {
            const active = filter === tab.key
            return (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                style={{
                  fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, letterSpacing: 0.5,
                  padding: `${S[1]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
                  background: active ? C.ink : C.paper, color: active ? C.paper : C.ink,
                  boxShadow: mkShadow(active ? 'lg' : 'base'),
                  transform: active ? 'translate(-1px,-1px)' : 'none',
                  cursor: 'pointer', transition: 'background 0.1s, transform 0.1s',
                }}>
                {tab.label}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div style={{ padding: S[6], textAlign: 'center', color: C.muted, fontFamily: "'Archivo Black', sans-serif" }}>
            LOADING...
          </div>
        ) : groups.length === 0 ? (
          <Panel title="NO NOTIFICATIONS" accent={C.muted} p={S[6]}>
            <div style={{ textAlign: 'center', color: C.muted, fontSize: FS.sm }}>Nothing here yet.</div>
          </Panel>
        ) : groups.map(group => {
          const groupItems = filtered.filter(n => getGroup(n.ustvarjenoOb) === group)
          const groupUnread = groupItems.filter(n => !n.jePrebrano).length
          const accent = group === 'Today' ? C.yellow : C.muted
          return (
            <Panel key={group} title={group.toUpperCase()} accent={accent} p={S[4]}
              action={groupUnread > 0 ? <Tag label={`${groupUnread} UNREAD`} bg={accent} /> : <Tag label="ALL READ" bg={C.mutedLt} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {groupItems.map(n => <NotifRow key={n.id} n={n} onToggle={() => handleToggle(n.id)} />)}
              </div>
            </Panel>
          )
        })}
      </div>
    </div>
  )
}

export function StudentNotifications() {
  return <NotificationsBase subtitle="Quiz alerts, module updates, announcements" />
}

export function ProfessorNotifications() {
  return <NotificationsBase subtitle="Quiz submissions, student activity, confirmations" />
}