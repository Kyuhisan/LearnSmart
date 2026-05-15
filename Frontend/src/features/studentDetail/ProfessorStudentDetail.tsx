import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { C, S } from '../../styles/tokens'

export function ProfessorStudentDetail() {
  return (
    <div className="dashboard-main">
      <ComicBox bg={C.yellowLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
        <BitMascot size={60} mood="happy" float />
        <Tag label="TEACHER" bg={C.yellow} />
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.25rem', color: C.ink }}>
          COMING SOON — TEACHER
        </div>
        <div style={{ fontSize: '0.875rem', color: C.muted }}>
          Individual student: VARK profile, module progress, quiz history
        </div>
      </ComicBox>
    </div>
  )
}
