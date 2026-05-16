import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { C, S } from '../../styles/tokens'

export function StudentSettings() {
  return (
    <div className="dashboard-main">
      <ComicBox bg={C.cyanLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
        <BitMascot size={60} mood="thinking" float />
        <Tag label="STUDENT" bg={C.cyan} />
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.25rem', color: C.ink }}>
          COMING SOON — STUDENT
        </div>
        <div style={{ fontSize: '0.875rem', color: C.muted }}>
          Account, display preferences, retake VARK quiz
        </div>
      </ComicBox>
    </div>
  )
}
