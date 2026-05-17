import { useNavigate } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S } from '../../styles/tokens'
import '../../styles/moduleDetailPage.css'

export function ProfessorModuleDetail() {
  const navigate = useNavigate()

  return (
    <div className="module-detail-page">
      <Topbar
        escape={false}
        title="MODULE DETAIL — PROF"
        subtitle="Professor view"
        back={() => navigate('/modules')}
      />

      <div style={{ padding: S[6] }}>
        <ComicBox bg={C.yellowLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
          <BitMascot size={60} mood="happy" float />
          <Tag label="TEACHER" bg={C.yellow} />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.25rem', color: C.ink }}>
            COMING SOON — TEACHER
          </div>
          <div style={{ fontSize: '0.875rem', color: C.muted }}>
            Edit content, manage VARK variants, view student progress per module
          </div>
        </ComicBox>
      </div>
    </div>
  )
}
