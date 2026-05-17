import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C } from '../../styles/tokens'

function DifficultyIcons({ value }: { value: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < value
        const s = 9
        return (
          <svg key={i} width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>
            <rect x="0.75" y="0.75" width={s - 1.5} height={s - 1.5} rx="1.5"
              fill={filled ? C.yellow : 'none'}
              stroke="currentColor"
              strokeWidth="1.5"
              opacity={filled ? 1 : 0.35}
            />
            {!filled && <line x1="0.75" y1="0.75" x2={s - 0.75} y2={s - 0.75}
              stroke="currentColor" strokeWidth="1.5" opacity={0.35}
            />}
          </svg>
        )
      })}
    </span>
  )
}
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
        <div className="module-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {mod.professor} · {mod.hours}h · <DifficultyIcons value={mod.difficulty} />
        </div>
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
