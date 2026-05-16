import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BitMascot } from '../../components/ui/BitMascot'
import { SpeechBubble } from '../../components/ui/SpeechBubble'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { ComicBox } from '../../components/ui/ComicBox'
import { Tag } from '../../components/ui/Tag'
import { C, S } from '../../styles/tokens'
import { MODULE, CHECKLIST_TASKS, PRACTICE_PROBLEMS, AUDIO_HIGHLIGHTS, GLOSSARY } from './mockData'
import '../../styles/moduleDetailPage.css'

type Tab = 'visual' | 'reading' | 'auditory' | 'kinesthetic'

const tabConfig = {
  visual:      { label: 'VISUAL',      icon: '👁',  color: C.purpleLt, bitMsg: '"Visual mode engaged! Diagrams incoming. 🎨"' },
  reading:     { label: 'READING',     icon: '📖', color: C.cyanLt,   bitMsg: '"Reading mode active. Loading notes... 📋"' },
  auditory:    { label: 'AUDITORY',    icon: '🎧', color: C.greenLt,  bitMsg: '"Audio mode online. Press play. 🎵"' },
  kinesthetic: { label: 'KINESTHETIC', icon: '🤸', color: C.redLt,    bitMsg: '"Practice mode initiated. Let\'s go! 💪"' },
}


function VisualContent() {
  return (
    <div className="module-detail-content">
      <div className="module-detail-video">
        <div className="module-detail-play">▶</div>
        <div className="module-detail-video-label">BINARY-TREES.MP4 · 14:00</div>
      </div>
      <ComicBox bg={C.paper} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Tag label="Concept Map" bg={C.purpleLt} />
        <div className="module-detail-concept-placeholder">🌳 Concept map diagram here</div>
      </ComicBox>
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
      <ComicBox bg={C.cyanLt} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Tag label="Definition" bg={C.cyan} />
        <p className="module-detail-definition">
          <strong>Binary Tree</strong> — A hierarchical data structure in which each node has at most two children,
          referred to as the <em>left child</em> and the <em>right child</em>.
        </p>
      </ComicBox>
      <ComicBox bg={C.paper} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Tag label="Structured Notes" bg={C.cyan} />
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
      </ComicBox>
      <ComicBox bg={C.paper} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Tag label="Glossary" bg={C.cyan} />
        <div className="module-detail-glossary">
          {GLOSSARY.map(g => (
            <div key={g.term} className="module-detail-glossary-row">
              <span className="module-detail-glossary-term">{g.term}</span>
              <span className="module-detail-glossary-def">{g.def}</span>
            </div>
          ))}
        </div>
      </ComicBox>
    </div>
  )
}

function AuditoryContent() {
  return (
    <div className="module-detail-content">
      <ComicBox bg={C.navy} p={S[5]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Tag label="Lecture" bg={C.green} />
        <div className="module-detail-audio-title">BINARY TREES — FULL LECTURE</div>
        <div className="module-detail-audio-sub">Prof. Novak · 14 min</div>
        <div className="module-detail-waveform">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="module-detail-waveform-bar"
              style={{ height: `${Math.random() * 24 + 8}px` }} />
          ))}
        </div>
        <div className="module-detail-audio-controls">
          <button className="module-detail-play-btn">▶</button>
          <div className="module-detail-progress-bar">
            <div className="module-detail-progress-fill" style={{ width: '0%' }} />
          </div>
          <span className="module-detail-time">0:00/14:00</span>
        </div>
      </ComicBox>
      <ComicBox bg={C.greenLt} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Tag label="Highlights" bg={C.green} />
        <div className="module-detail-highlights">
          {AUDIO_HIGHLIGHTS.map((h, i) => (
            <div key={i} className="module-detail-highlight-row">
              <Tag label={`@ ${h.time}`} bg={C.green} />
              <span className="module-detail-highlight-text">{h.quote}</span>
            </div>
          ))}
        </div>
      </ComicBox>
    </div>
  )
}

function KinestheticContent() {
  const [checked, setChecked] = useState<number[]>([])
  const toggle = (i: number) => setChecked(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  )

  return (
    <div className="module-detail-content">
      <ComicBox bg={C.paper} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <div className="module-detail-checklist-header">
          <Tag label="Checklist" bg={C.red} />
          <span className="module-detail-checklist-count">{checked.length}/{CHECKLIST_TASKS.length} DONE</span>
        </div>
        <div className="module-detail-checklist">
          {CHECKLIST_TASKS.map((task, i) => (
            <div key={i} className={`module-detail-check-row ${checked.includes(i) ? 'checked' : ''}`}
              onClick={() => toggle(i)}>
              <div className="module-detail-checkbox">{checked.includes(i) && '✓'}</div>
              <span className="module-detail-check-text">{task}</span>
              <span className="module-detail-check-num">0{i + 1}</span>
            </div>
          ))}
        </div>
      </ComicBox>
      {PRACTICE_PROBLEMS.map(p => (
        <ComicBox key={p.label} bg={C.redLt} p={S[4]} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <Tag label={p.label} bg={C.red} />
          <p className="module-detail-problem-text">{p.text}</p>
          <div className="module-detail-hint">▶ SHOW HINT 💡</div>
        </ComicBox>
      ))}
    </div>
  )
}

export function StudentModuleDetail() {
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
      <div className="module-detail-topbar">
        <div className="module-detail-topbar-left">
          <ComicBtn sm color={C.paper} onClick={() => navigate('/modules')}>← BACK</ComicBtn>
          <div>
            <div className="module-detail-topbar-title">{MODULE.title}</div>
            <div className="module-detail-topbar-sub">{MODULE.subject} · {MODULE.progress}% complete</div>
          </div>
        </div>
        <ComicBtn color={C.yellow}>✦ PRESENT</ComicBtn>
      </div>

      <div className="module-detail-tabbar">
        <div className="module-detail-tabs">
          <span className="module-detail-view-as">VIEW AS:</span>
          {(Object.keys(tabConfig) as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`module-detail-tab ${activeTab === t ? 'active' : ''}`}
              style={activeTab === t ? { background: tabConfig[t].color } : {}}
            >
              {tabConfig[t].icon} {tabConfig[t].label}
            </button>
          ))}
        </div>
        <div className="module-detail-tabbar-right">
          <div className="module-detail-progress-tag">{MODULE.progress}% DONE</div>
          <ComicBtn color={C.red} sm>QUIZ ME →</ComicBtn>
        </div>
      </div>

      <div className="module-detail-bit-row">
        <BitMascot size={50} mood="happy" />
        <SpeechBubble color={tab.color} side="left">
          <span className="module-detail-bit-text">{tab.bitMsg}</span>
        </SpeechBubble>
      </div>

      {contentMap[activeTab]}
    </div>
  )
}
