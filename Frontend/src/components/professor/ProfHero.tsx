import { ComicBox } from '../ui/ComicBox'
import { ComicBtn } from '../ui/ComicBtn'
import { Tag } from '../ui/Tag'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'

interface ProfHeroProps {
  username: string
  isTeacher: boolean
  onSignOut: () => void
  level?: number
  learningType?: string
  streak?: number
  onRetakeVark?: () => void
}


export function ProfHero({ username, isTeacher, onSignOut, level, learningType, streak, onRetakeVark }: ProfHeroProps) {
  return (
    <ComicBox bg={C.cyan} p={S[5]}>

      {/* Dot pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        opacity: 0.13,
        borderRadius: R.base,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: S[5], position: 'relative', zIndex: 1 }}>

        {/* Avatar */}
        <div style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: '50%',
          background: C.ink,
          border: `${BW.base} solid ${C.ink}`,
          boxShadow: mkShadow(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.yellow,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS['4xl'],
          flexShrink: 0,
        }}>
          {username?.[0]?.toUpperCase()}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>

          {/* Tags */}
          <div style={{ display: 'flex', gap: S[1.5], flexWrap: 'wrap' }}>
            {isTeacher ? (
              <>
                <Tag label="EDUCATOR" bg={C.paper} />
                <Tag label="4 MODULES" bg={C.paper} />
              </>
            ) : (
              <>
                {level !== undefined && <Tag label={`LEVEL ${level}`} bg={C.yellowLt} />}
                {learningType && <Tag label={learningType} bg={C.purpleLt} />}
                {streak !== undefined && <Tag label={`🔥 ${streak}D STREAK`} bg={C.redLt} />}
              </>
            )}
          </div>

          {/* Name */}
          <div style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: FS['5xl'],
            color: C.ink,
            lineHeight: 1.1,
          }}>
            {isTeacher ? `Prof. ${username}` : username}
          </div>

          {/* Email / affiliation */}
          <div style={{ fontSize: FS.md, color: C.navy, fontWeight: 600 }}>
            {username}@uni-lj.si · Faculty of Informatics
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: S[2], marginTop: S[1], flexWrap: 'wrap' }}>
            <ComicBtn color={C.paper}>SETTINGS</ComicBtn>
            {!isTeacher && onRetakeVark && (
              <ComicBtn color={C.paper} onClick={onRetakeVark}>RETAKE VARK</ComicBtn>
            )}
            <ComicBtn color={C.red} dark onClick={onSignOut}>SIGN OUT</ComicBtn>
          </div>

        </div>
      </div>
    </ComicBox>
  )
}
