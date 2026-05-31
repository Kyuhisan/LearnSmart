import { useState } from 'react'
import { ComicBox } from '../ui/ComicBox'
import { ComicBtn } from '../ui/ComicBtn'
import { Tag } from '../ui/Tag'
import { Bar } from '../ui/Bar'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'

interface ProfHeroProps {
  readonly username: string
  readonly isTeacher: boolean
  readonly level?: number
  readonly xp?: number
  readonly learningType?: string
  readonly streak?: number
  readonly onRetakeVark?: () => void
  readonly moduleCount?: number | null
  readonly email?: string
  readonly onDeleteAccount?: () => Promise<void>
}


export function ProfHero({ username, isTeacher, level, xp, learningType, streak, onRetakeVark, moduleCount, email, onDeleteAccount }: ProfHeroProps) {
  const mobile = useBreakpoint() === 'mobile'
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const avatar = (
    <div style={{
      width: mobile ? '2.75rem' : '7rem',
      height: mobile ? '2.75rem' : '7rem',
      borderRadius: '50%',
      background: C.ink,
      border: `${BW.base} solid ${C.ink}`,
      boxShadow: mkShadow(),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: C.yellow,
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: mobile ? FS.lg : FS['7xl'],
      flexShrink: 0,
    }}>
      {username?.[0]?.toUpperCase()}
    </div>
  )

  const tags = (
    <div style={{ display: 'flex', gap: S[1.5], flexWrap: mobile ? 'nowrap' : 'wrap' }}>
      {isTeacher ? (
        <>
          <Tag label="EDUCATOR" bg={C.purpleLt} />
          <Tag label={moduleCount != null ? `${moduleCount} MODULES` : '… MODULES'} bg={C.cyanLt} />
        </>
      ) : (
        <>
          {level !== undefined && <Tag label={`LEVEL ${level}`} bg={C.yellowLt} />}
          {learningType && <Tag label={learningType} bg={C.purpleLt} />}
          {streak !== undefined && <Tag label={`${streak}D STREAK`} bg={C.redLt} />}
        </>
      )}
    </div>
  )

  const name = (
    <div style={{
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: mobile ? FS['2xl'] : FS['5xl'],
      color: C.ink,
      lineHeight: 1.1,
    }}>
      {isTeacher ? `Prof. ${username}` : username}
    </div>
  )

  const affiliation = email ? (
    <div style={{ fontSize: FS.md, color: C.navy, fontWeight: 600 }}>
      {email}
    </div>
  ) : null

  const levelBar = !isTeacher && level !== undefined && xp !== undefined ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>LEVEL {level}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{xp % 200} / 200 XP</span>
      </div>
      <Bar value={xp % 200} max={200} color={C.yellow} shadow />
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{200 - (xp % 200)} XP TO LEVEL {level + 1}</span>
    </div>
  ) : null

  const buttons = (
    <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', alignItems: 'center' }}>
      {!isTeacher && onRetakeVark && (
        <ComicBtn sm color={C.yellow} onClick={onRetakeVark}>RETAKE VARK</ComicBtn>
      )}
      {onDeleteAccount && !confirmDelete && (
        <ComicBtn sm color={C.red} onClick={() => setConfirmDelete(true)}>DELETE ACCOUNT</ComicBtn>
      )}
      {onDeleteAccount && confirmDelete && (
        <>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.red }}>ARE YOU SURE?</span>
          <ComicBtn sm color={C.paper} onClick={() => setConfirmDelete(false)}>CANCEL</ComicBtn>
          <ComicBtn sm color={C.red} onClick={async () => {
            setDeleting(true)
            await onDeleteAccount()
          }}>{deleting ? '…' : 'CONFIRM'}</ComicBtn>
        </>
      )}
    </div>
  )

  return (
    <ComicBox bg={C.cyan} p={mobile ? S[4] : S[5]} style={mobile ? undefined : { paddingLeft: S[8], paddingRight: S[8] }}>

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

      {mobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], position: 'relative', zIndex: 1 }}>
          {/* Row 1: tags full width */}
          {tags}
          {/* Row 2: avatar + name/affiliation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            {avatar}
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[0.5], flex: 1 }}>
              {name}
              {affiliation}
            </div>
          </div>
          {/* Row 3: buttons */}
          {buttons}
          {/* Row 4: level bar */}
          {levelBar}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: S[5], position: 'relative', zIndex: 1 }}>
          {avatar}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5], flex: 1 }}>
            {tags}
            {name}
            {affiliation}
            <div style={{ marginTop: S[1] }}>{buttons}</div>
            {levelBar && <div style={{ marginTop: S[0.5] }}>{levelBar}</div>}
          </div>
        </div>
      )}
    </ComicBox>
  )
}
