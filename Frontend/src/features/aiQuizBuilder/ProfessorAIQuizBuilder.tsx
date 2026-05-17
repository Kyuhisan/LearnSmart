import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S } from '../../styles/tokens'

export function ProfessorAIQuizBuilder() {
  return (
    <div className="dashboard-main">
      <Topbar title="AI QUIZ BUILDER" subtitle="Generate quizzes with Gemini 2.5 Flash ✨" />
      <ComicBox bg={C.yellowLt} p={S[6]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3] }}>
        <BitMascot size={60} mood="thinking" float />
        <Tag label="TEACHER" bg={C.yellow} />
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: '1.25rem', color: C.ink }}>
          COMING SOON — TEACHER
        </div>
        <div style={{ fontSize: '0.875rem', color: C.muted }}>
          Generate quiz questions with Gemini AI, review and publish
        </div>
      </ComicBox>
    </div>
  )
}
