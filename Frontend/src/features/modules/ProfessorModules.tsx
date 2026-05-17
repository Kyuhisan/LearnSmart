import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag } from '../../components/ui/Tag'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW } from '../../styles/tokens'
import { type ProfModule, PROF_MODULES, PROF_CATEGORIES, PROF_CATEGORY_COUNT } from './mockData'
import '../../styles/moduleLibrary.css'

function ProfModuleCard({ mod }: { mod: ProfModule }) {
  const navigate = useNavigate()

  return (
    <div className="module-card" style={{ background: mod.color }} onClick={() => navigate(`/modules/${mod.id}`)}>
      {mod.isNew && <div className="module-card-new">NEW!</div>}
      <div className="module-card-top">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2] }}>
          <Tag label={mod.category} bg="rgba(255,255,255,0.5)" />
          <Tag
            label={mod.status === 'published' ? '● LIVE' : '○ DRAFT'}
            bg={mod.status === 'published' ? C.green : C.muted}
          />
        </div>
        <div className="module-card-title">{mod.title}</div>
        <div className="module-card-meta">{mod.contentCount} items · {mod.students} students</div>
      </div>
      <div className="module-card-bottom" style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div onClick={e => e.stopPropagation()}>
            <ComicBtn sm color={C.yellow}>EDIT</ComicBtn>
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], border: `${BW.base} solid ${C.ink}`, padding: `2px ${S[2]}`, background: C.paper }}>
            {mod.students} STUDENTS
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfessorModules() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = PROF_MODULES.filter(m => {
    const matchCat = activeCategory === 'ALL' || m.category === activeCategory
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const published = PROF_MODULES.filter(m => m.status === 'published').length
  const draft = PROF_MODULES.filter(m => m.status === 'draft').length

  return (
    <div className="dashboard-main">
      <Topbar
        title="MODULES — PROF"
        subtitle={`${published} published · ${draft} drafts`}
        actions={<ComicBtn color={C.green}>+ NEW MODULE</ComicBtn>}
      />

      <div className="modules-toolbar">
        <div className="modules-search-row">
          <div className="modules-search-wrap">
            <input
              className="modules-search"
              placeholder="Search your modules..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="modules-filter-row">
          <div className="modules-filters">
            {PROF_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`modules-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat} {PROF_CATEGORY_COUNT[cat] ?? ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {filtered.map(mod => (
          <ProfModuleCard key={mod.id} mod={mod} />
        ))}
      </div>
    </div>
  )
}
