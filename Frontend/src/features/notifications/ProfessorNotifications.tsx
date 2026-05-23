import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS } from '../../styles/tokens'

export function ProfessorNotifications() {
  return (
    <div className="dashboard-main">
      <Topbar title="NOTIFICATIONS — PROF" subtitle="Quiz submissions, questions, confirmations" />
      <ComicBox bg={C.yellowLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
        <BitMascot size={60} mood="thinking" float />
        <Tag label="TEACHER" bg={C.yellow} />
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink }}>
          COMING SOON — TEACHER
        </div>
        <div style={{ fontSize: FS.sm, color: C.muted }}>
          Quiz submissions, student questions, upload confirmations
        </div>
      </ComicBox>
    </div>
  )
}
