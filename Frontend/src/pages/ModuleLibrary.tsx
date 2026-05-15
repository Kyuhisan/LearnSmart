import { Sidebar } from '../components/ui/Sidebar'
import { Bar } from '../components/ui/Bar'
import { Tag } from '../components/ui/Tag'
import { ComicBtn } from '../components/ui/ComicBtn'
import { BitMascot } from '../components/ui/BitMascot'
import { useAuth } from '../context/AuthContext'
import { C, S } from '../styles/tokens'
import { useState } from 'react'
import "../styles/moduleLibrary.css"
import { useNavigate } from 'react-router-dom'



interface Module {
  id: string
  title: string
  professor: string
  hours: number
  stars: number
  category: string
  progress: number
  status: 'in-progress' | 'complete' | 'not-started'
  isNew?: boolean
  color: string
}

const dummyModules: Module[] = [
  { id: '1', title: 'Machine Learning Fundamentals', professor: 'Prof. Novak', hours: 6, stars: 3, category: 'CORE', progress: 68, status: 'in-progress', color: C.yellow },
  { id: '2', title: 'Neural Networks Deep Dive', professor: 'Prof. Novak', hours: 8, stars: 3, category: 'CORE', progress: 24, status: 'in-progress', isNew: true, color: C.purple },
  { id: '3', title: 'Linear Algebra Refresher', professor: 'Prof. Horvat', hours: 4, stars: 3, category: 'MATH', progress: 100, status: 'complete', color: C.cyan },
  { id: '4', title: 'Statistics for Data Science', professor: 'Prof. Horvat', hours: 5, stars: 3, category: 'MATH', progress: 42, status: 'in-progress', color: C.green },
  { id: '5', title: 'Python for ML Pipelines', professor: 'Prof. Kovač', hours: 7, stars: 3, category: 'PRACTICAL', progress: 12, status: 'in-progress', isNew: true, color: C.pink },
  { id: '6', title: 'Computer Vision Basics', professor: 'Prof. Novak', hours: 9, stars: 3, category: 'CORE', progress: 0, status: 'not-started', isNew: true, color: C.orange },
  { id: '7', title: 'NLP & Transformers', professor: 'Prof. Novak', hours: 10, stars: 3, category: 'ADVANCED', progress: 0, status: 'not-started', isNew: true, color: C.red },
  { id: '8', title: 'Ethics in AI', professor: 'Prof. Kovač', hours: 3, stars: 3, category: 'THEORY', progress: 88, status: 'in-progress', color: C.yellowLt },
]

const categories = ['ALL', 'CORE', 'MATH', 'HANDS-ON', 'ADVANCED', 'THEORY']
const categoryCount: Record<string, number> = {
  ALL: 8, CORE: 3, MATH: 2, 'HANDS-ON': 1, ADVANCED: 1, THEORY: 1
}

function ModuleCard({ mod, isTeacher }: { mod: Module, isTeacher: boolean }) {
    const navigate = useNavigate()
  const statusLabel = mod.status === 'complete' ? '✓ COMPLETE'
    : mod.status === 'in-progress' ? 'IN PROGRESS'
    : 'NOT STARTED'
  const barColor = mod.status === 'complete' ? C.green
    : mod.status === 'in-progress' ? mod.color
    : C.mutedLt

  return (
    <div className="module-card" style={{ background: mod.color }} onClick={() => navigate(`/modules/${mod.id}`)}>
      {mod.isNew && <div className="module-card-new">NEW!</div>}
      <div className="module-card-top">
        <Tag label={mod.category} bg="rgba(255,255,255,0.5)" />
        <div className="module-card-title">{mod.title}</div>
        <div className="module-card-meta">
          {mod.professor} · {mod.hours}h · {'★'.repeat(mod.stars)}
        </div>
      </div>
      <div className="module-card-bottom">
        <div className="module-card-status-row">
          <span className="module-card-status">{statusLabel}</span>
          <span className="module-card-percent">{mod.progress}%</span>
        </div>
        <Bar value={mod.progress} color={barColor} />
        {isTeacher && (
          <div style={{ marginTop: S[2] }}>
            <ComicBtn sm color={C.paper}>EDIT</ComicBtn>
          </div>
        )}
      </div>
    </div>
  )
}

export function ModuleLibrary() {
  const { profil } = useAuth()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('')

  if (!profil) return (
    <div className="page-loader">
      <BitMascot size={80} mood="thinking" float />
    </div>
  )

  const isTeacher = profil.vloga === 'ucitelj'

  const filtered = dummyModules.filter(m => {
    const matchCat = activeCategory === 'ALL' || m.category === activeCategory
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.professor.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil.vloga} username={profil.username} />

      <div className="dashboard-main">
        <div className="modules-header">
          <div className="modules-header-title">MODULE LIBRARY</div>
          <div className="modules-header-sub">
            {dummyModules.length} modules · {isTeacher ? '4 published' : '3 in progress'}
          </div>
        </div>

        <div className="modules-toolbar">
          <div className="modules-search-row">
            <div className="modules-search-wrap">
              <span className="modules-search-icon">🔍</span>
              <input
                className="modules-search"
                placeholder="Search modules, topics, professors..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {isTeacher && (
              <ComicBtn color={C.pink}>+ NEW MODULE</ComicBtn>
            )}
          </div>
          <div className="modules-filter-row">
            <div className="modules-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`modules-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat} {categoryCount[cat] ?? ''}
                </button>
              ))}
            </div>
            <div className="modules-view-toggle">
              <button className="modules-view-btn active">▪</button>
              <button className="modules-view-btn">≡</button>
            </div>
          </div>
        </div>

        <div className="modules-grid">
          {filtered.map(mod => (
            <ModuleCard key={mod.id} mod={mod} isTeacher={isTeacher} />
          ))}
        </div>
      </div>
    </div>
  )
}