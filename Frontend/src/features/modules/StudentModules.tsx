import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C } from '../../styles/tokens'
import { getModuliJavni } from './moduleApi'
import '../../styles/moduleLibrary.css'

const COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red]

interface BackendModul {
  id: string
  naziv: string
  opis: string
  jeObjavljen: boolean
  tezavnost: number
  ustvarjenOb: string
  uciteljImePriimek: string
}

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

function ModuleCard({ mod, color }: { mod: BackendModul, color: string }) {
  const navigate = useNavigate()

  return (
    <div className="module-card" style={{ background: color }} onClick={() => navigate(`/modules/${mod.id}`)}>
      <div className="module-card-top">
        <Tag label={mod.jeObjavljen ? 'LIVE' : 'DRAFT'} bg="rgba(255,255,255,0.5)" />
        <div className="module-card-title">{mod.naziv}</div>
        <div className="module-card-meta" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {mod.uciteljImePriimek} · 0h · 
          <DifficultyIcons value={mod.tezavnost ?? 0} />
        </div>
      </div>
      <div className="module-card-bottom">
        <div className="module-card-status-row">
          <span className="module-card-status">NOT STARTED</span>
          <span className="module-card-percent">0%</span>
        </div>
        <Bar value={0} color={C.mutedLt} />
      </div>
    </div>
  )
}

export function StudentModules() {
  const [moduli, setModuli] = useState<BackendModul[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getModuliJavni().then(data => {
      setModuli(data)
      setLoading(false)
    })
  }, [])

  const filtered = moduli.filter(m =>
    m.naziv.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div>loading...</div>

  return (
    <div className="dashboard-main">
      <Topbar title="MODULE LIBRARY" subtitle={`${moduli.length} modules`} />

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
          <div className="modules-view-toggle">
            <button className="modules-view-btn active">▪</button>
            <button className="modules-view-btn">≡</button>
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {filtered.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} />
        ))}
      </div>
    </div>
  )
}