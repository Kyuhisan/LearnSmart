import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S } from '../../styles/tokens'

export function StudentDashboard() {
  return (
    <div className="dashboard-main">
      <Topbar
        title="HOME BASE"
        subtitle="Keep up the streak! Your modules await."
        actions={<><ComicBtn sm color={C.cyan}>2 NEW</ComicBtn><ComicBtn sm color={C.paper}>SEARCH</ComicBtn></>}
      />
      <ComicBox bg={C.cyanLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
        <BitMascot size={60} mood="happy" float />
        <Tag label="STUDENT" bg={C.cyan} />
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.25rem', color: C.ink }}>
          COMING SOON — STUDENT
        </div>
        <div style={{ fontSize: '0.875rem', color: C.muted }}>
          Home base: streak, quests, modules, leaderboard preview
        </div>
      </ComicBox>
    </div>
  )
}
