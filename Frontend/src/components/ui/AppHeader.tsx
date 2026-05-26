import { useNavigate } from 'react-router-dom'
import { BitMascot } from './BitMascot'
import { ComicBtn } from './ComicBtn'
import { useTopbarContext } from '../../context/TopbarContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { C, S, FS, BW } from '../../styles/tokens'

export function AppHeader() {
  const { config } = useTopbarContext()
  const { title, subtitle, back, actions } = config
  const bp = useBreakpoint()
  const { profil } = useAuth()
  const navigate = useNavigate()
  const isTablet = bp === 'tablet'
  const isMobile = bp === 'mobile'

  // ─── Mobile header ───────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 'var(--ls-header-h)',
        background: C.yellow,
        borderBottom: `${BW.thick} solid ${C.ink}`,
        display: 'flex',
        alignItems: 'center',
        gap: S[2],
        padding: `0 ${S[3]}`,
        zIndex: 100,
      }}>
        {/* Logo */}
        <BitMascot size={28} mood="happy" />

        {back && (
          <ComicBtn sm color={C.paper} onClick={back}>BACK</ComicBtn>
        )}
        <div style={{
          flex: 1,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS['2xl'],
          color: C.ink,
          lineHeight: 1,
          letterSpacing: -0.5,
          paddingTop: '3px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </div>
        <div
          onClick={() => navigate('/profile')}
          style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: C.ink,
            border: `2px solid ${C.ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.yellow,
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: FS.md,
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          {profil?.username?.[0]?.toUpperCase() ?? '?'}
        </div>
      </div>
    )
  }

  // ─── Tablet / Desktop header ─────────────────────────────────────────────────
  const logoWidth = isTablet ? '64px' : '220px'
  const bitSize   = isTablet ? 40 : 48

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
        width: logoWidth,
        flexShrink: 0,
        background: C.yellow,
        borderRight: `${BW.thick} solid ${C.ink}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: isTablet ? 'center' : 'flex-start',
        paddingLeft: isTablet ? 0 : S[2],
        paddingRight: isTablet ? 0 : S[4],
        position: 'relative',
        overflow: 'hidden',
        transition: 'width 0.2s ease',
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
          <BitMascot size={bitSize} mood="happy" />
          {!isTablet && (
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], color: C.ink, lineHeight: 1 }}>
                LEARNSMART
              </div>
              <div style={{ fontSize: FS.xs, color: C.ink, fontWeight: 700 }}>
                w/ BIT
              </div>
            </div>
          )}
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
          <ComicBtn sm color={C.paper} onClick={back}>BACK</ComicBtn>
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
