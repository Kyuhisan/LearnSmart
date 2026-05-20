import { BitMascot } from './BitMascot'
import { ComicBtn } from './ComicBtn'
import { useTopbarContext } from '../../context/TopbarContext'
import { C, S, FS, BW } from '../../styles/tokens'

export function AppHeader() {
  const { config } = useTopbarContext()
  const { title, subtitle, back, actions } = config

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--ls-header-h)',
      display: 'flex',
      borderBottom: `${BW.thick} solid ${C.ink}`,
      zIndex: 100,
    }}>

      {/* Logo section — yellow with dots */}
      <div style={{
        width: '220px',
        flexShrink: 0,
        background: C.yellow,
        borderRight: `${BW.thick} solid ${C.ink}`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${S[4]}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dot pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          opacity: 0.13,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: S[2] }}>
          <BitMascot size={32} mood="happy" />
          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], color: C.ink, lineHeight: 1 }}>
              LEARNSMART
            </div>
            <div style={{ fontSize: FS.xs, color: C.ink, fontWeight: 700 }}>
              w/ BIT
            </div>
          </div>
        </div>
      </div>

      {/* Page title section */}
      <div style={{
        flex: 1,
        background: C.cream,
        display: 'flex',
        alignItems: 'center',
        gap: S[4],
        padding: `0 ${S[6]}`,
      }}>
        {back && (
          <ComicBtn sm color={C.paper} onClick={back}>← BACK</ComicBtn>
        )}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: FS['4xl'],
            lineHeight: 1,
            letterSpacing: -0.5,
            color: C.ink,
          }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5], fontWeight: 700 }}>
              {subtitle}
            </div>
          )}
        </div>
        {actions}
      </div>

    </div>
  )
}
