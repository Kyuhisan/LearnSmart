import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Panel } from '../../components/ui/Panel'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS } from '../../styles/tokens'
import { PROF_MODULE} from './mockData'
import { getModuleContent, getModul, getVisualContent, updateVsebinaPredmet } from './moduleDetailApi'
import { getSteviloVpisanih } from '../modules/moduleApi'
import { useAuth } from '../../context/AuthContext'
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
  predmetVsebinaId: string,
  predmetId: string
  ucniTip: string
  vsebina: ReadingData | AuditoryData | KinestheticData
}

type VisualContentItem = {
  id: string
  imeDatoteke: string
  url: string
  tip: 'IMG' | 'VIDEO'
}

function ContentUnavailable({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[8]} ${S[4]}`, textAlign: 'center' }}>
      <BitMascot size={64} mood="thinking" float />
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>
        {label} CONTENT NOT AVAILABLE FOR THIS MODULE
      </span>
    </div>
  )
}

const tabConfig = {
  visual:      { label: 'VISUAL',      color: C.purpleLt, bitMsg: '"Students see this visual layout. Edit the video or concept map below."' },
  reading:     { label: 'READING',     color: C.cyanLt,   bitMsg: '"This is what reading-style students get. Edit notes, definitions, glossary."' },
  auditory:    { label: 'AUDITORY',    color: C.greenLt,  bitMsg: '"Audio variant — replace the lecture file or edit timestamp highlights."' },
  kinesthetic: { label: 'KINESTHETIC', color: C.redLt,    bitMsg: '"Hands-on tasks live here. Add problems, adjust the checklist."' },
}

// const WAVEFORM_HEIGHTS = Array.from({ length: 60 }, () => Math.random() * 24 + 8)

function VisualContent({ data }: Readonly<{ data: VisualContentItem[] }>) {
  const video = data.find(item => item.tip === 'VIDEO')
  const images = data.filter(item => item.tip === 'IMG')

  return (
    <div className="module-detail-content">

      {video && (
        <div className="module-detail-video">
          <video
            controls
            className="module-detail-video-player"
          >
            <source src={video.url} />
          </video>
        </div>
      )}

      <Panel
        title="VISUAL MATERIALS"
        accent={C.purpleLt}
        p={S[4]}
        // action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
      >

        <div className="module-detail-grid">

          {images.map(image => (
            <ComicBox
              key={image.id}
              bg={C.purpleLt}
              p={S[3]}
            >

              <img
                src={image.url}
                alt={image.imeDatoteke}
                style={{
                  width: '100%',
                  borderRadius: '8px'
                }}
              />

              <div className="module-detail-card-title">
                {image.imeDatoteke}
              </div>
            </ComicBox>
          ))}
        </div>
      </Panel>
    </div>
  )
}


function ReadingContent({
  data,
  onSaveField
}: {
  data?: ReadingData
  onSaveField: (
    field: keyof ReadingData,
    value: string
  ) => Promise<void>
}) {
  const [editingData, setEditingData] = useState({
    definition: false,
    summary: false,
    keyConcepts: false,
    structuredNotes: false,
    glossary: false
  });

  const [formData, setFormData] = useState(() => ({
    definition: data?.definition ?? '',
    summary: data?.summary ?? '',
    keyConcepts: data?.key_concepts.join('\n') ?? '',
    structuredNotes: data?.structured_notes.join('\n') ?? '',
    glossary: data?.glossary.map(item => `${item.term}: ${item.definition}`).join('\n\n') ?? ''
  }))


  if (!data) return null

  return (
    <div className="module-detail-content">

      <Panel
        title="DEFINITION"
        accent={C.cyan}
        bg={C.cyanLt}
        p={S[4]}
        action={
          <ComicBtn
            sm
            color={editingData.definition ? C.green : C.yellow}
            onClick={async () => {
              if (editingData.definition) {
                await onSaveField('definition', formData.definition)
                alert('Definition saved')
                setEditingData(prev => ({
                  ...prev, 
                  definition: false
                }))
              } else {
                setEditingData(prev => ({
                  ...prev,
                  definition: true
                }))
              }
            }}
          >
            {editingData.definition ? 'SAVE' : 'EDIT'}
          </ComicBtn>
        }
      >
        {editingData.definition ? (
          <textarea
            value = {formData.definition}
            onChange = {(e) => setFormData(prev => ({
              ...prev,
              definition: e.target.value
            }))}
            className = "module-detail-textarea"
          />
        ): (
          <p className="module-detail-definition">
            {data.definition}
          </p>
        )}
      </Panel>

      <Panel
        title="SUMMARY"
        accent={C.cyan}
        p={S[4]}
        action={
          <ComicBtn 
            sm 
            color={editingData.summary ? C.green : C.yellow}
            onClick = {async () => {
              if (editingData.summary) {
                await onSaveField('summary' ,formData.summary)
                alert('Summary saved')

                setEditingData(prev => ({
                  ...prev,
                  summary: false
                }))
              } else {
                setEditingData(prev => ({
                  ...prev,
                  summary: true
                }))
              }
            }}
          >
            {editingData.summary ? 'SAVE' : 'EDIT'}
          </ComicBtn>
        }
      >
        {editingData.summary ? (
          <textarea
            value = {formData.summary}
            onChange = {(e) => 
              setFormData(prev => ({
                ...prev,
                summary: e.target.value
              }))
            }
            className = "module-detail-textarea"
          />
        ) : (
          <p className="module-detail-definition">
            {data.summary}
          </p>
        )}
      </Panel>

      <Panel
        title="KEY CONCEPTS"
        accent={C.cyan}
        p={S[4]}
        action={
          <ComicBtn 
            sm 
            color={C.yellow}
            onClick = {async () => {
              if (editingData.keyConcepts) {
                await onSaveField('key_concepts', formData.keyConcepts)
                alert('Key concepts saved')

                setEditingData(prev => ({
                  ...prev,
                  keyConcepts: false
                }))
              } else {
                setEditingData (prev => ({
                  ...prev,
                  keyConcepts: true
                }))
              }
            }}
          >
            {editingData.keyConcepts ? 'SAVE' : 'EDIT'}
          </ComicBtn>
        }
      >
        {editingData.keyConcepts ? (
          <textarea 
            value = {formData.keyConcepts}
            onChange = {(e) => 
              setFormData(prev => ({
                ...prev,
                keyConcepts: e.target.value
              }))
            }
            className = "module-detail-textarea"
          />
        ) : (
          <div className="module-detail-notes">
            <ul className="module-detail-notes-list">
              {data.key_concepts?.map((concept: string) => (
                <li key={concept}>
                  {concept.replace(/^[-•]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <Panel
        title="STRUCTURED NOTES"
        accent={C.cyan}
        p={S[4]}
        action={
          <ComicBtn 
          sm 
          color={editingData.structuredNotes ? C.green : C.yellow}
          onClick = {async () => {
            if (editingData.structuredNotes) {
              await onSaveField('structured_notes', formData.structuredNotes)
              alert('Structured notes saved')
              setEditingData(prev => ({
                ...prev,
                structuredNotes: false
              }))
            } else {
              setEditingData(prev => ({
                ...prev,
                structuredNotes: true
              }))
            }
          }}
        >
          {editingData.structuredNotes ? 'SAVE' : 'EDIT'}
        </ComicBtn>}
      >
        {editingData.structuredNotes ? (
          <textarea 
            value = {formData.structuredNotes}
            onChange = {(e) => 
              setFormData(prev => ({
                ...prev,
                structuredNotes: e.target.value
              }))
            }
            className = "module-detail-textarea"
          />
        ) : (
          <div className="module-detail-notes">
            <ul className="module-detail-notes-list">
              {data.structured_notes?.map((note: string) => (
                <li key={note}>
                  {note.replace(/^[-•]\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <Panel
        title="GLOSSARY"
        accent={C.cyan}
        p={S[4]}
        action={
          <ComicBtn 
            sm 
            color={editingData.glossary ? C.green : C.yellow}
            onClick = {async () => {
              if (editingData.glossary) {
                await onSaveField('glossary', formData.glossary)
                alert('Glossary saved')

                setEditingData(prev => ({
                  ...prev,
                  glossary: false
                }))
              } else {
                setEditingData(prev => ({
                  ...prev,
                  glossary: true
                }))
              }
            }}
          >
            {editingData.glossary ? 'SAVE' : 'EDIT'}
          </ComicBtn>
        }
      >
        {editingData.glossary ? (
          <textarea 
            value = {formData.glossary}
            onChange = {(e) => 
              setFormData(prev => ({
                ...prev,
                glossary: e.target.value
              }))
            }
            className = "module-detail-textarea"
          />
        ) : (
          <div className="module-detail-glossary">
            {data.glossary?.map((g: GlossaryItem) => (
              <div
                key={g.term}
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
        )}
      </Panel>

    </div>
  )
}


function AuditoryContent({ data }: Readonly<{ data?: AuditoryData }>) {

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

            <track
              kind = "captions"
              src = ""
              srcLang = "en"
              label = "English captions" 
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
          // action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}
        >
          <div className="module-detail-highlights">

            {data.narration_script
              .split('. ')
              .slice(0, 8)
              .map((line: string, i: number) => (

                <div
                  key={`${line}-${i}`}
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

function KinestheticContent({ 
  data,
  onSaveQuestions 
}: {
  data?: KinestheticData,
  onSaveQuestions: (questions: Question[]) => Promise<void>
}) {

  const [revealed, setRevealed] = useState<number[]>([])
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null)
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(data?.questions ?? [])

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

      {editedQuestions.map((q: Question, i: number) => {

        const correctOption = q.options?.find((option: string) =>
          option.startsWith(q.correct_answer)
        )

        const isOpen = revealed.includes(i)

        return (
          <Panel
            key = {i}
            title={`Problem ${String(i + 1).padStart(2, '0')}`}
            accent={C.red}
            bg={C.redLt}
            p={S[4]}
            action={
              <ComicBtn 
                sm 
                color={editingQuestion === i ? C.green : C.yellow}
                onClick = {async () => {
                  if (editingQuestion === i) {
                    await onSaveQuestions(editedQuestions)
                    setEditingQuestion(null)
                    alert('Saved.')
                  } else {
                    setEditingQuestion(i)
                  }
                }}
              >
                {editingQuestion === i ? 'SAVE' : 'EDIT'}
              </ComicBtn>}
          >

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: S[3]
              }}
            >
              {editingQuestion === i ? (
                <textarea 
                  value = {q.question}
                  onChange = {(e) => {
                    const updated = [...editedQuestions]

                    updated[i] = {
                      ...updated[i],
                      question: e.target.value
                    }

                    setEditedQuestions(updated)  
                  }}
                  className = "module-detail-textarea"
                />
              ) : (
                <p className="module-detail-problem-text">
                  {q.question}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: S[2]
                }}
              >

                {q.options?.map((option: string, optionIndex: number) => (
                  editingQuestion === i ? (
                    <input 
                      key={`${i}-${optionIndex}`}
                      value = {option}
                      onChange = {(e) => {
                        const updated = [...editedQuestions]

                        updated[i] = {
                          ...updated[i],
                          options: updated[i].options.map((opt, idx) =>
                            idx === optionIndex ? e.target.value : opt
                          )
                        }
                        setEditedQuestions(updated)
                      }}
                    />
                  ) : (
                    <div
                      key={`${i}-${option}`}
                      className="module-detail-check-text"
                    >
                      {option}
                    </div>
                  )
                ))}

              </div>


              <div //NOSONAR
                className="module-detail-hint"
                onClick={() => toggleReveal(i)}
                style={{ cursor: 'pointer' }}
              >
                ▶ {isOpen ? 'HIDE ANSWER' : 'REVEAL ANSWER'} 
              </div>

              {isOpen && (
                editingQuestion === i ? (
                  <select 
                    value = {q.correct_answer}
                    onChange = {(e) => {
                      const updated = [...editedQuestions]

                      updated[i] = {
                        ...updated[i],
                        correct_answer: e.target.value
                      }

                      setEditedQuestions(updated)
                    }}
                  >
                    <option value = {"A"}>A</option>
                    <option value = {"B"}>B</option>
                    <option value = {"C"}>C</option>
                    <option value = {"D"}>D</option>
                  </select>
                ) : (
                  <div
                    className="module-detail-definition"
                    style={{
                      marginTop: S[2],
                      fontWeight: 700
                    }}
                  >
                    Correct Answer: {correctOption} 
                  </div>
                )
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
  const { session } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('visual')
  const tab = tabConfig[activeTab]

  const { id } = useParams()
  const [moduleContent, setModuleContent] = useState<ModuleContentItem[]>([])
  const [steviloVpisanih, setSteviloVpisanih] = useState<number | null>(null)
  const [modulNaziv, setModulNaziv] = useState<string>('')
  const [visualContent, setVisualContent] = useState<VisualContentItem[]>([])
  const [contentLoaded, setContentLoaded] = useState(false)
  
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

  const auditoryData: AuditoryData | undefined = (auditoryAudio || auditoryScript)
    ? {
        audio_url: (auditoryAudio?.vsebina as AuditoryData | undefined)?.audio_url,
        narration_script: (auditoryScript?.vsebina as AuditoryData | undefined)?.narration_script,
      }
    : undefined

  // KINESTHETIC
  const kinestheticContent = moduleContent.find(
    item => item.ucniTip === 'kinesthetic'
  )
  const kinestheticData = kinestheticContent?.vsebina as KinestheticData | undefined

  useEffect(() => {
    if (!id) {
      return
    }

    const fetchContent = async () => {
      try {
        const data = await getModuleContent(id)
        setModuleContent(data)
      } catch (err) {
        console.error(err)
      } finally {
        setContentLoaded(true)
      }
    }

    fetchContent()
    getModul(id).then((m: { naziv: string }) => setModulNaziv(m.naziv)).catch(() => {})

    if (session?.access_token) {
      getSteviloVpisanih(session.access_token, id).then(setSteviloVpisanih)
    }
  }, [id, session?.access_token])

  useEffect(() => {
    if (!id) {
      return 
    }

    const fetchVisaulContent = async () => {
      try {
        const data = await getVisualContent(id)
        setVisualContent(data)
      } catch(err) {
        console.error(err)
      }
    }
    fetchVisaulContent()
  }, [id])


  const handleSavedField = async (
    field: keyof ReadingData,
    value: string 
  ) => {
    if (!readingContent || !readingData || !id) {
      return
    }

    let parsedValue: string | string[] | GlossaryItem[] = value

    if (field === 'key_concepts' || field === 'structured_notes') {
      parsedValue = (value as string).split('\n').filter(line => line.trim() !== '')
    }

    if (field === 'glossary') {
      parsedValue = (value as string)
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const separatorIndex = line.indexOf(':')

        if (separatorIndex === -1) {
          throw new Error(`Invalid glossary line: ${line}`)
        }

        return {
          term: line.substring(0, separatorIndex).trim(),
          definition: line.substring(separatorIndex + 1).trim()
        }
      })
    }
    const updateContent = {
      ...readingData,
      [field]: parsedValue
    }


    await updateVsebinaPredmet(
      session!.access_token,
      id,
      readingContent.predmetVsebinaId,
      updateContent
    )

    const refreshed = await getModuleContent(id)
    setModuleContent(refreshed)
  }

  const handleSaveKinesthetic = async (
    questions: Question[]
  ) => {
    if (!kinestheticContent || !kinestheticData || !id) {
      return
    }

    const updateContent = {
      questions
    }

    await updateVsebinaPredmet(
      session!.access_token,
      id,
      kinestheticContent.predmetVsebinaId,
      updateContent
    )

    const refreshed = await getModuleContent(id)
    setModuleContent(refreshed)
  }

  const contentMap = {
    visual:      contentLoaded && visualContent.length === 0
                   ? <ContentUnavailable label="VISUAL" />
                   : <VisualContent data={visualContent} />,
    reading:     contentLoaded && !readingData
                   ? <ContentUnavailable label="READING" />
                   : <ReadingContent data={readingData} onSaveField={handleSavedField} />,
    auditory:    contentLoaded && !auditoryData
                   ? <ContentUnavailable label="AUDITORY" />
                   : <AuditoryContent data={auditoryData} />,
    kinesthetic: contentLoaded && !kinestheticData
                   ? <ContentUnavailable label="KINESTHETIC" />
                   : <KinestheticContent data={kinestheticData} onSaveQuestions={handleSaveKinesthetic} />,
  }

  return (
    <div className="module-detail-page">
      <Topbar
        title={modulNaziv || '…'}
        subtitle={steviloVpisanih === null ? '…' : `${steviloVpisanih} ${steviloVpisanih === 1 ? 'student' : 'students'} enrolled`}
        back={() => navigate('/modules')}
        actions={
          <Tag
            label={PROF_MODULE.status === 'published' ? '● LIVE' : '○ DRAFT'}
            bg={PROF_MODULE.status === 'published' ? C.green : C.muted}
          />
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
          <Tag label={steviloVpisanih === null ? '…' : `${steviloVpisanih} ${steviloVpisanih === 1 ? 'STUDENT' : 'STUDENTS'}`} bg={C.cyanLt} />
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
