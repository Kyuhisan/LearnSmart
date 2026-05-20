import { Panel } from '../ui/Panel'
import { IconBox } from '../ui/IconBox'
import { C, S, FS, BW, R } from '../../styles/tokens'

export interface ActivityItem {
  iconBg: string
  title: string
  time: string
  badge: string
}

interface ActivityPanelProps {
  items: ActivityItem[]
  title?: string
  accent?: string
}

export function ActivityPanel({ items, title = 'TEACHING ACTIVITY', accent = C.yellow }: ActivityPanelProps) {
  return (
    <Panel title={title} accent={accent}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: S[3],
            paddingTop: i === 0 ? 0 : S[2.5],
            paddingBottom: i === items.length - 1 ? 0 : S[2.5],
            borderBottom: i < items.length - 1 ? `1.5px solid ${C.divider}` : 'none',
          }}>

            <div style={{
              width: S[9],
              height: S[9],
              background: item.iconBg,
              border: `${BW.thin} solid ${C.ink}`,
              borderRadius: R.base,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: FS.xl,
              flexShrink: 0,
            }}>
              <IconBox size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: FS.md, color: C.ink, fontWeight: 600, lineHeight: 1.3 }}>
                {item.title}
              </div>
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: FS.xs,
                color: C.mutedLt,
                marginTop: S[0.5],
              }}>
                {item.time}
              </div>
            </div>

            <div style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS['2xs'],
              color: C.ink,
              border: `${BW.thin} solid ${C.ink}`,
              borderRadius: R.sm,
              padding: `${S[1]} ${S[2]}`,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}>
              {item.badge}
            </div>

          </div>
        ))}
      </div>
    </Panel>
  )
}
