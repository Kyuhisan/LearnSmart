import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Panel } from '../../components/ui/Panel'
import { Topbar } from '../../components/ui/Topbar'
import { C, S } from '../../styles/tokens'
import { PROF_MODULE} from './mockData'
import { getModuleContent } from './moduleDetailApi'
import '../../styles/moduleDetailPage.css'

type Tab = 'visual' | 'reading' | 'auditory' | 'kinesthetic'

type GlossaryItem = {
  term: string
  definition: string
}

type ReadingData = {
  definition: string
  summary: string
  key_concepts: string[]
  structured_notes: string[]
  glossary: GlossaryItem[]
}

type AuditoryData = {
  audio_url?: string
  narration_script?: string
}

type Question = {
  question: string
  options: string[]
  correct_answer: string
}

type KinestheticData = {
  questions: Question[]
}

type ModuleContentItem = {
  ucniTip: string
  vsebina: ReadingData | AuditoryData | KinestheticData
}

const tabConfig = {
  visual:      { label: 'VISUAL',      color: C.purpleLt, bitMsg: '"Students see this visual layout. Edit the video or concept map below."' },
  reading:     { label: 'READING',     color: C.cyanLt,   bitMsg: '"This is what reading-style students get. Edit notes, definitions, glossary."' },
  auditory:    { label: 'AUDITORY',    color: C.greenLt,  bitMsg: '"Audio variant — replace the lecture file or edit timestamp highlights."' },
  kinesthetic: { label: 'KINESTHETIC', color: C.redLt,    bitMsg: '"Hands-on tasks live here. Add problems, adjust the checklist."' },
}

// const WAVEFORM_HEIGHTS = Array.from({ length: 60 }, () => Math.random() * 24 + 8)

function VisualContent() {
  return (
    <div className="module-detail-content">
      <div className="module-detail-video">
        <div className="module-detail-play">▶</div>
        <div className="module-detail-video-label">BINARY-TREES.MP4 · 14:00</div>
      </div>
      <Panel title="CONCEPT MAP" accent={C.purpleLt} p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
        <div className="module-detail-concept-placeholder">🌳 Concept map diagram here</div>
      </Panel>
      <div className="module-detail-grid">
        <ComicBox bg={C.purpleLt} p={S[4]}>
          <div className="module-detail-card-title">ROOT NODE</div>
          <div className="module-detail-card-text">Top of the tree, no parent</div>
        </ComicBox>
        <ComicBox bg={C.cyanLt} p={S[4]}>
          <div className="module-detail-card-title">LEFT SUBTREE</div>
          <div className="module-detail-card-text">All values &lt; parent</div>
        </ComicBox>
      </div>
    </div>
  )
}

function ReadingContent({ data }: { data?: ReadingData }) {

  if (!data) return null

  return (
    <div className="module-detail-content">

      <Panel
        title="DEFINITION"
        accent={C.cyan}
        bg={C.cyanLt}
        p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >
        <p className="module-detail-definition">
          {data.definition}
        </p>
      </Panel>

      <Panel
        title="SUMMARY"
        accent={C.cyan}
        p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >
        <p className="module-detail-definition">
          {data.summary}
        </p>
      </Panel>

      <Panel
        title="KEY CONCEPTS"
        accent={C.cyan}
        p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >
        <div className="module-detail-notes">
          <ul className="module-detail-notes-list">
            {data.key_concepts?.map((concept: string, i: number) => (
              <li key={i}>{concept}</li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel
        title="STRUCTURED NOTES"
        accent={C.cyan}
        p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >
        <div className="module-detail-notes">
          <ul className="module-detail-notes-list">
            {data.structured_notes?.map((note: string, i: number) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel
        title="GLOSSARY"
        accent={C.cyan}
        p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >
        <div className="module-detail-glossary">
          {data.glossary?.map((g: GlossaryItem, i: number) => (
            <div
              key={i}
              className="module-detail-glossary-row"
            >
              <span className="module-detail-glossary-term">
                {g.term}
              </span>

              <span className="module-detail-glossary-def">
                {g.definition}
              </span>
            </div>
          ))}
        </div>
      </Panel>

    </div>
  )
}

function AuditoryContent({ data }: { data?: AuditoryData }) {

  if (!data) return null

  return (
    <div className="module-detail-content">

      <Panel title="LECTURE" accent={C.green} bg={C.navy} p={S[5]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>

          <div className="module-detail-audio-title">
            FULL LECTURE
          </div>

          <div className="module-detail-audio-sub">
            AI Generated Audio
          </div>

          <audio
            controls
            style={{ width: '100%' }}
          >
            <source
              src={data.audio_url}
              type="audio/mpeg"
            />
          </audio>

          {/* <div className="module-detail-waveform">
            {WAVEFORM_HEIGHTS.map((h, i) => (
              <div
                key={i}
                className="module-detail-waveform-bar"
                style={{ height: `${h}px` }}
              />
            ))}
          </div> */}

        </div>
      </Panel>

      {data.narration_script && (
        <Panel
          title="HIGHLIGHTS"
          accent={C.green}
          bg={C.greenLt}
          p={S[4]}
          action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
        >
          <div className="module-detail-highlights">

            {data.narration_script
              .split('. ')
              .slice(0, 8)
              .map((line: string, i: number) => (

                <div
                  key={i}
                  className="module-detail-highlight-row"
                >
                  <Tag
                    label={`#${i + 1}`}
                    bg={C.green}
                  />

                  <span className="module-detail-highlight-text">
                    {line}
                  </span>
                </div>

              ))}

          </div>
        </Panel>
      )}

    </div>
  )
}

function KinestheticContent({ data }: { data?: KinestheticData }) {

  const [revealed, setRevealed] = useState<number[]>([])

  if (!data) return null

  const toggleReveal = (index: number) => {
    setRevealed(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="module-detail-content">

      {data.questions?.map((q: Question, i: number) => {

        const correctOption = q.options?.find((option: string) =>
          option.startsWith(q.correct_answer)
        )

        const isOpen = revealed.includes(i)

        return (
          <Panel
            key={i}
            title={`Problem ${String(i + 1).padStart(2, '0')}`}
            accent={C.red}
            bg={C.redLt}
            p={S[4]}
            action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
          >

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: S[3]
              }}
            >

              <p className="module-detail-problem-text">
                {q.question}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: S[2]
                }}
              >

                {q.options?.map((option: string, optionIndex: number) => (

                  <div
                    key={optionIndex}
                    className="module-detail-check-text"
                  >
                    {option}
                  </div>

                ))}

              </div>

              <div
                className="module-detail-hint"
                onClick={() => toggleReveal(i)}
                style={{ cursor: 'pointer' }}
              >
                ▶ {isOpen ? 'HIDE ANSWER' : 'REVEAL ANSWER'} 
              </div>

              {isOpen && (
                <div
                  className="module-detail-definition"
                  style={{
                    marginTop: S[2],
                    fontWeight: 700
                  }}
                >
                  Correct Answer: {correctOption} 
                </div>
              )}

            </div>

          </Panel>
        )
      })}

    </div>
  )
}

export function ProfessorModuleDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('visual')
  const tab = tabConfig[activeTab]

  const { id } = useParams()
  const [moduleContent, setModuleContent] = useState<ModuleContentItem[]>([])
  
  // READING
  const readingContent = moduleContent.find(
    item => item.ucniTip === 'reading'
  )

  const readingData =
    readingContent?.vsebina as ReadingData | undefined

  // AUDITORY
  const auditoryAudio = moduleContent.find(
    item =>
      item.ucniTip === 'auditory' &&
      (item.vsebina as AuditoryData).audio_url
  )

  const auditoryScript = moduleContent.find(
    item =>
      item.ucniTip === 'auditory' &&
      (item.vsebina as AuditoryData).narration_script
  )

  const auditoryData: AuditoryData = {
    audio_url:
      (auditoryAudio?.vsebina as AuditoryData | undefined)?.audio_url,

    narration_script:
      (auditoryScript?.vsebina as AuditoryData | undefined)?.narration_script
  }

  // KINESTHETIC
  const kinestheticContent = moduleContent.find(
    item => item.ucniTip === 'kinesthetic'
  )

  const kinestheticData =
    kinestheticContent?.vsebina as KinestheticData | undefined

  useEffect(() => {
    if (!id) {
      return
    }

    const fetchContent = async () => {
      try {
        const data = await getModuleContent(id)
        console.log(data)
        setModuleContent(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchContent()
  }, [id])

  const contentMap = {
    visual: <VisualContent />,
    reading: <ReadingContent data={readingData} />,
    auditory: <AuditoryContent data={auditoryData} />,
    kinesthetic: <KinestheticContent data={kinestheticData} />,
  }

  return (
    <div className="module-detail-page">
      <Topbar
        title={PROF_MODULE.title}
        subtitle={`${PROF_MODULE.subject} · ${PROF_MODULE.students} students enrolled`}
        back={() => navigate('/modules')}
        actions={
          <>
            <Tag
              label={PROF_MODULE.status === 'published' ? '● LIVE' : '○ DRAFT'}
              bg={PROF_MODULE.status === 'published' ? C.green : C.muted}
            />
            <ComicBtn color={C.yellow}>EDIT MODULE</ComicBtn>
          </>
        }
      />

      <div className="module-detail-tabbar">
        <div className="module-detail-tabs">
          <span className="module-detail-view-as">EDIT VIEW:</span>
          {(Object.keys(tabConfig) as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`module-detail-tab ${activeTab === t ? 'active' : ''}`}
              style={activeTab === t ? { background: tabConfig[t].color } : {}}
            >
              {tabConfig[t].label}
            </button>
          ))}
        </div>
        <div className="module-detail-tabbar-right">
          <Tag label={`${PROF_MODULE.students} STUDENTS`} bg={C.cyanLt} />
        </div>
      </div>

      <div className="module-detail-bit-row">
        <BitMascot size={50} mood="wink" />
        <SpeechBubble color={tab.color} side="left">
          <span className="module-detail-bit-text">{tab.bitMsg}</span>
        </SpeechBubble>
      </div>

      {contentMap[activeTab]}
    </div>
  )
}
