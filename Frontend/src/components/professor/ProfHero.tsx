import { ComicBox } from '../ui/ComicBox'
import { ComicBtn } from '../ui/ComicBtn'
import { Tag } from '../ui/Tag'
import { C, S, FS, BW, mkShadow } from '../../styles/tokens'

interface ProfHeroProps {
  username: string
  isTeacher: boolean
  onSignOut: () => void
}

export function ProfHero({ username, isTeacher, onSignOut }: ProfHeroProps) {
  return (
    <ComicBox bg={C.cyan} p={S[5]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[5] }}>

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
          <div style={{ display: 'flex', gap: S[1.5] }}>
            <Tag label={isTeacher ? 'EDUCATOR' : 'STUDENT'} bg={C.paper} />
            <Tag label="4 MODULES" bg={C.paper} />
          </div>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: FS['3xl'],
            color: C.ink,
            lineHeight: 1.1,
          }}>
            {isTeacher ? `Prof. ${username}` : username}
          </div>
          <div style={{ fontSize: FS.md, color: C.navy, fontWeight: 600 }}>
            {username}@uni-lj.si · Faculty of Informatics
          </div>
          <div style={{ display: 'flex', gap: S[2], marginTop: S[1] }}>
            <ComicBtn color={C.paper}>SETTINGS</ComicBtn>
            <ComicBtn color={C.red} dark onClick={onSignOut}>SIGN OUT</ComicBtn>
          </div>
        </div>

      </div>
    </ComicBox>
  )
}
