import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { Panel } from '../../components/ui/Panel'
import { Topbar } from '../../components/ui/Topbar'
import { C, S } from '../../styles/tokens'
import { PROF_MODULE, CHECKLIST_TASKS, PRACTICE_PROBLEMS, AUDIO_HIGHLIGHTS, GLOSSARY } from './mockData'
import '../../styles/moduleDetailPage.css'

type Tab = 'visual' | 'reading' | 'auditory' | 'kinesthetic'

const tabConfig = {
  visual:      { label: 'VISUAL',      color: C.purpleLt, bitMsg: '"Students see this visual layout. Edit the video or concept map below."' },
  reading:     { label: 'READING',     color: C.cyanLt,   bitMsg: '"This is what reading-style students get. Edit notes, definitions, glossary."' },
  auditory:    { label: 'AUDITORY',    color: C.greenLt,  bitMsg: '"Audio variant — replace the lecture file or edit timestamp highlights."' },
  kinesthetic: { label: 'KINESTHETIC', color: C.redLt,    bitMsg: '"Hands-on tasks live here. Add problems, adjust the checklist."' },
}

const WAVEFORM_HEIGHTS = Array.from({ length: 60 }, () => Math.random() * 24 + 8)

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

function ReadingContent() {
  return (
    <div className="module-detail-content">
      <Panel title="DEFINITION" accent={C.cyan} bg={C.cyanLt} p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
        <p className="module-detail-definition">
          <strong>Binary Tree</strong> — A hierarchical data structure in which each node has at most two children,
          referred to as the <em>left child</em> and the <em>right child</em>.
        </p>
      </Panel>
      <Panel title="STRUCTURED NOTES" accent={C.cyan} p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
        <div className="module-detail-notes">
          <div className="module-detail-notes-section">1. CORE PROPERTIES</div>
          <ul className="module-detail-notes-list">
            <li>Max 2 children per node</li>
            <li>Root has no parent; leaves have no children</li>
            <li>Height = longest root-to-leaf path</li>
          </ul>
          <div className="module-detail-notes-section">2. BINARY SEARCH TREE</div>
          <ul className="module-detail-notes-list">
            <li>Left subtree: values &lt; parent</li>
            <li>Right subtree: values &gt; parent</li>
            <li>O(log n) search in balanced trees</li>
          </ul>
          <div className="module-detail-notes-section">3. TRAVERSAL METHODS</div>
          <ul className="module-detail-notes-list">
            <li>In-order (L→Root→R): sorted output</li>
            <li>Pre-order (Root→L→R): copying trees</li>
            <li>Post-order (L→R→Root): deletion</li>
          </ul>
        </div>
      </Panel>
      <Panel title="GLOSSARY" accent={C.cyan} p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
        <div className="module-detail-glossary">
          {GLOSSARY.map(g => (
            <div key={g.term} className="module-detail-glossary-row">
              <span className="module-detail-glossary-term">{g.term}</span>
              <span className="module-detail-glossary-def">{g.def}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function AuditoryContent() {
  return (
    <div className="module-detail-content">
      <Panel title="LECTURE" accent={C.green} bg={C.navy} p={S[5]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div className="module-detail-audio-title">BINARY TREES — FULL LECTURE</div>
          <div className="module-detail-audio-sub">Prof. Novak · 14 min</div>
          <div className="module-detail-waveform">
            {WAVEFORM_HEIGHTS.map((h, i) => (
              <div key={i} className="module-detail-waveform-bar" style={{ height: `${h}px` }} />
            ))}
          </div>
          <div className="module-detail-audio-controls">
            <button className="module-detail-play-btn">▶</button>
            <div className="module-detail-progress-bar">
              <div className="module-detail-progress-fill" style={{ width: '0%' }} />
            </div>
            <span className="module-detail-time">0:00/14:00</span>
          </div>
        </div>
      </Panel>
      <Panel title="HIGHLIGHTS" accent={C.green} bg={C.greenLt} p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
        <div className="module-detail-highlights">
          {AUDIO_HIGHLIGHTS.map((h, i) => (
            <div key={i} className="module-detail-highlight-row">
              <Tag label={`@ ${h.time}`} bg={C.green} />
              <span className="module-detail-highlight-text">{h.quote}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function KinestheticContent() {
  return (
    <div className="module-detail-content">
      <Panel title="CHECKLIST" accent={C.red} p={S[4]}
        action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
        <div className="module-detail-checklist">
          {CHECKLIST_TASKS.map((task, i) => (
            <div key={i} className="module-detail-check-row">
              <div className="module-detail-checkbox" />
              <span className="module-detail-check-text">{task}</span>
              <span className="module-detail-check-num">0{i + 1}</span>
            </div>
          ))}
        </div>
      </Panel>
      {PRACTICE_PROBLEMS.map(p => (
        <Panel key={p.label} title={p.label} accent={C.red} bg={C.redLt} p={S[4]}
          action={<ComicBtn sm color={C.yellow}>EDIT</ComicBtn>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <p className="module-detail-problem-text">{p.text}</p>
            <div className="module-detail-hint">▶ SHOW HINT 💡</div>
          </div>
        </Panel>
      ))}
    </div>
  )
}

export function ProfessorModuleDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('visual')
  const tab = tabConfig[activeTab]

  const contentMap = {
    visual: <VisualContent />,
    reading: <ReadingContent />,
    auditory: <AuditoryContent />,
    kinesthetic: <KinestheticContent />,
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
