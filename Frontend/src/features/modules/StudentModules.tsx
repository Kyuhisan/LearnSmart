import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C } from '../../styles/tokens'
import { type Module, MODULES, CATEGORIES, CATEGORY_COUNT } from './mockData'
import '../../styles/moduleLibrary.css'

function ModuleCard({ mod }: { mod: Module }) {
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
        <div className="module-card-meta">{mod.professor} · {mod.hours}h · {'★'.repeat(mod.stars)}</div>
      </div>
      <div className="module-card-bottom">
        <div className="module-card-status-row">
          <span className="module-card-status">{statusLabel}</span>
          <span className="module-card-percent">{mod.progress}%</span>
        </div>
        <Bar value={mod.progress} color={barColor} />
      </div>
    </div>
  )
}

export function StudentModules() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = MODULES.filter(m => {
    const matchCat = activeCategory === 'ALL' || m.category === activeCategory
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.professor.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="dashboard-main">
      <Topbar title="MODULE LIBRARY" subtitle={`${MODULES.length} modules · 3 in progress`} />

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
        </div>
        <div className="modules-filter-row">
          <div className="modules-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`modules-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat} {CATEGORY_COUNT[cat] ?? ''}
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
          <ModuleCard key={mod.id} mod={mod} />
        ))}
      </div>
    </div>
  )
}
