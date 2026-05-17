import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S } from '../../styles/tokens'

export function StudentLeaderboard() {
  return (
    <div className="dashboard-main">
      <Topbar title="LEADERBOARD" subtitle="Weekly XP rankings" />
      <ComicBox bg={C.cyanLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
        <BitMascot size={60} mood="happy" float />
        <Tag label="STUDENT" bg={C.cyan} />
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.25rem', color: C.ink }}>
          COMING SOON — STUDENT
        </div>
        <div style={{ fontSize: '0.875rem', color: C.muted }}>
          Weekly XP rankings, badges, streak leaderboard
        </div>
      </ComicBox>
    </div>
  )
}
