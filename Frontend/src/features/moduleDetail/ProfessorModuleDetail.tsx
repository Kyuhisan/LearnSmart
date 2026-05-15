import { useNavigate } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { C, S } from '../../styles/tokens'
import '../../styles/moduleDetailPage.css'

export function ProfessorModuleDetail() {
  const navigate = useNavigate()

  return (
    <div className="module-detail-page">
      <div className="module-detail-topbar">
        <div className="module-detail-topbar-left">
          <ComicBtn sm color={C.paper} onClick={() => navigate('/modules')}>← BACK</ComicBtn>
          <div>
            <div className="module-detail-topbar-title">MODULE DETAIL</div>
            <div className="module-detail-topbar-sub">Professor view</div>
          </div>
        </div>
      </div>

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
