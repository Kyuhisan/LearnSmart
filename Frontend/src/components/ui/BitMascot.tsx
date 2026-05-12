import { C } from '../../styles/tokens'

interface BitMascotProps {
  size?: number
  mood?: 'happy' | 'wink' | 'thinking'
  float?: boolean
}

export function BitMascot({ size = 60, mood = 'happy', float = false }: BitMascotProps) {
  return (
    <div style={{
      width: size, height: size,
      position: 'relative', flexShrink: 0,
      animation: float ? 'wiggle 3s ease-in-out infinite' : 'none',
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Antenna */}
        <line x1="50" y1="10" x2="50" y2="22" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="9" r="4" fill={C.yellow} stroke={C.ink} strokeWidth="2.5" />
        {/* Head */}
        <rect x="20" y="22" width="60" height="54" rx="14" fill={C.cyan} stroke={C.ink} strokeWidth="3" />
        {/* Screen face */}
        <rect x="28" y="32" width="44" height="30" rx="6" fill={C.cream} stroke={C.ink} strokeWidth="2.5" />
        {/* Eyes + mouth per mood */}
        {mood === 'happy' && <>
          <circle cx="40" cy="46" r="4" fill={C.ink} />
          <circle cx="60" cy="46" r="4" fill={C.ink} />
          <circle cx="41" cy="45" r="1.4" fill="#fff" />
          <circle cx="61" cy="45" r="1.4" fill="#fff" />
          <path d="M42 54 Q50 58 58 54" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>}
        {mood === 'wink' && <>
          <path d="M36 46 Q40 42 44 46" stroke={C.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="60" cy="46" r="4" fill={C.ink} />
          <circle cx="61" cy="45" r="1.4" fill="#fff" />
          <path d="M42 54 Q50 58 58 54" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>}
        {mood === 'thinking' && <>
          <circle cx="40" cy="46" r="4" fill={C.ink} />
          <circle cx="60" cy="46" r="4" fill={C.ink} />
          <circle cx="41" cy="45" r="1.4" fill="#fff" />
          <circle cx="61" cy="45" r="1.4" fill="#fff" />
          <path d="M42 55 Q50 52 58 55" stroke={C.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="66" cy="34" r="2" fill={C.yellow} stroke={C.ink} strokeWidth="1.5" />
          <circle cx="72" cy="30" r="3" fill={C.yellow} stroke={C.ink} strokeWidth="1.5" />
          <circle cx="80" cy="24" r="4" fill={C.yellow} stroke={C.ink} strokeWidth="1.5" />
        </>}
        {/* Side bolts/ears */}
        <circle cx="20" cy="48" r="4" fill={C.yellow} stroke={C.ink} strokeWidth="2.5" />
        <circle cx="80" cy="48" r="4" fill={C.yellow} stroke={C.ink} strokeWidth="2.5" />
        {/* Neck */}
        <rect x="42" y="76" width="16" height="6" fill={C.cyan} stroke={C.ink} strokeWidth="2.5" />
        {/* Body base */}
        <rect x="30" y="82" width="40" height="14" rx="4" fill={C.purple} stroke={C.ink} strokeWidth="2.5" />
        <circle cx="40" cy="89" r="2" fill={C.green} />
        <circle cx="50" cy="89" r="2" fill={C.yellow} />
        <circle cx="60" cy="89" r="2" fill={C.red} />
      </svg>
    </div>
  )
}
