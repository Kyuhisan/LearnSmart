import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BitMascot } from '../components/ui/BitMascot'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { ComicBtn } from '../components/ui/ComicBtn'
import { Tag } from '../components/ui/Tag'
import { C } from '../styles/tokens'
import '../styles/moduleDetailPage.css'
import '../styles/pages.css'
import { Sidebar } from '../components/ui/Sidebar'

type Tab = 'visual' | 'reading' | 'auditory' | 'kinesthetic'

const tabConfig = {
  visual:      { label: 'VISUAL',      icon: '👁',  color: C.purpleLt, bitMsg: '"Visual mode engaged! Diagrams incoming. 🎨"' },
  reading:     { label: 'READING',     icon: '📖', color: C.cyanLt,   bitMsg: '"Reading mode active. Loading notes... 📋"' },
  auditory:    { label: 'AUDITORY',    icon: '🎧', color: C.greenLt,  bitMsg: '"Audio mode online. Press play. 🎵"' },
  kinesthetic: { label: 'KINESTHETIC', icon: '🤸', color: C.redLt,    bitMsg: '"Practice mode initiated. Let\'s go! 💪"' },
}

const dummyModule = {
  id: '1',
  title: 'Binary Trees',
  subject: 'Algorithms',
  progress: 72,
  professor: 'Prof. Novak',
}

function VisualContent() {
  return (
    <div className="module-detail-content">
      <div className="module-detail-video">
        <div className="module-detail-play">▶</div>
        <div className="module-detail-video-label">BINARY-TREES.MP4 · 14:00</div>
      </div>
      <div className="module-detail-panel">
        <Tag label="Concept Map" bg={C.purpleLt} />
        <div className="module-detail-concept-placeholder">
          🌳 Concept map diagram here
        </div>
      </div>
      <div className="module-detail-grid">
        <div className="module-detail-card" style={{ background: C.purpleLt }}>
          <div className="module-detail-card-title">ROOT NODE</div>
          <div className="module-detail-card-text">Top of the tree, no parent</div>
        </div>
        <div className="module-detail-card" style={{ background: C.cyanLt }}>
          <div className="module-detail-card-title">LEFT SUBTREE</div>
          <div className="module-detail-card-text">All values &lt; parent</div>
        </div>
      </div>
    </div>
  )
}

function ReadingContent() {
  return (
    <div className="module-detail-content">
      <div className="module-detail-panel" style={{ background: C.cyanLt }}>
        <Tag label="Definition" bg={C.cyan} />
        <p className="module-detail-definition">
          <strong>Binary Tree</strong> — A hierarchical data structure in which each node has at most two children,
          referred to as the <em>left child</em> and the <em>right child</em>.
        </p>
      </div>
      <div className="module-detail-panel">
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
      </div>
      <div className="module-detail-panel">
        <Tag label="Glossary" bg={C.cyan} />
        <div className="module-detail-glossary">
          <div className="module-detail-glossary-row">
            <span className="module-detail-glossary-term">NODE</span>
            <span className="module-detail-glossary-def">Basic unit with value + child pointers</span>
          </div>
          <div className="module-detail-glossary-row">
            <span className="module-detail-glossary-term">ROOT</span>
            <span className="module-detail-glossary-def">Topmost node with no parent</span>
          </div>
          <div className="module-detail-glossary-row">
            <span className="module-detail-glossary-term">LEAF</span>
            <span className="module-detail-glossary-def">Node with no children</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuditoryContent() {
  return (
    <div className="module-detail-content">
      <div className="module-detail-audio-player">
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
      </div>
      <div className="module-detail-panel" style={{ background: C.greenLt }}>
        <Tag label="Highlights" bg={C.green} />
        <div className="module-detail-highlights">
          {[
            { time: '1:24', quote: '"Think of a binary tree like a family tree — every parent has at most two children."' },
            { time: '4:50', quote: '"The BST property is everything. Left is smaller, right is larger. Always."' },
            { time: '9:15', quote: '"In-order traversal on a BST gives you a sorted sequence. That\'s the magic."' },
          ].map((h, i) => (
            <div key={i} className="module-detail-highlight-row">
              <Tag label={`@ ${h.time}`} bg={C.green} />
              <span className="module-detail-highlight-text">{h.quote}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KinestheticContent() {
  const [checked, setChecked] = useState<number[]>([])
  const toggle = (i: number) => setChecked(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  )
  const tasks = [
    'Understand what a node is',
    'Draw a binary tree with 7 nodes by hand',
    'Trace an insertion into a BST step by step',
    'Write the in-order traversal of a sample tree',
    'Implement a BST insert function',
  ]

  return (
    <div className="module-detail-content">
      <div className="module-detail-panel">
        <div className="module-detail-checklist-header">
          <Tag label="Checklist" bg={C.red} />
          <span className="module-detail-checklist-count">{checked.length}/{tasks.length} DONE</span>
        </div>
        <div className="module-detail-checklist">
          {tasks.map((task, i) => (
            <div key={i} className={`module-detail-check-row ${checked.includes(i) ? 'checked' : ''}`}
              onClick={() => toggle(i)}>
              <div className="module-detail-checkbox">
                {checked.includes(i) && '✓'}
              </div>
              <span className="module-detail-check-text">{task}</span>
              <span className="module-detail-check-num">0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="module-detail-panel" style={{ background: C.redLt }}>
        <Tag label="Problem 01" bg={C.red} />
        <p className="module-detail-problem-text">Insert value 5 into BST: root=8, left=3, right=10</p>
        <div className="module-detail-hint">▶ SHOW HINT 💡</div>
      </div>
      <div className="module-detail-panel" style={{ background: C.redLt }}>
        <Tag label="Problem 02" bg={C.red} />
        <p className="module-detail-problem-text">In-order traversal of: root=4, left=2, right=6?</p>
        <div className="module-detail-hint">▶ SHOW HINT 💡</div>
      </div>
    </div>
  )
}

export function ModuleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profil } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('visual')

  const tab = tabConfig[activeTab]

  const contentMap = {
    visual: <VisualContent />,
    reading: <ReadingContent />,
    auditory: <AuditoryContent />,
    kinesthetic: <KinestheticContent />,
  }

  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil?.vloga ?? 'ucenec'} username={profil?.username ?? ''} />

      <div className="module-detail-page">
        <div className="module-detail-topbar">
          <div className="module-detail-topbar-left">
            <ComicBtn sm color={C.paper} onClick={() => navigate('/modules')}>← BACK</ComicBtn>
            <div>
              <div className="module-detail-topbar-title">{dummyModule.title}</div>
              <div className="module-detail-topbar-sub">{dummyModule.subject} · {dummyModule.progress}% complete</div>
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
            <div className="module-detail-progress-tag">{dummyModule.progress}% DONE</div>
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
    </div>
  )
}