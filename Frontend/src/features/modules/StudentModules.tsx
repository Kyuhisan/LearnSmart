import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { ComicBox } from '../../components/ui/ComicBox'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { getModuliJavni } from './moduleApi'
import { Panel } from '../../components/ui/Panel'
import '../../styles/moduleLibrary.css'

const COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red]

const MOCK_CATEGORIES = ['CORE', 'MATH', 'HANDS-ON', 'ADVANCED', 'THEORY']
const CATEGORY_COLORS: Record<string, string> = {
  CORE:       C.cyanLt,
  ADVANCED:   C.purpleLt,
  THEORY:     C.greenLt,
  MATH:       C.yellowLt,
  'HANDS-ON': C.pinkLt,
}
const STAR_LABELS: Record<number, string> = { 1:'★', 2:'★★', 3:'★★★', 4:'★★★★', 5:'★★★★★' }

function getCategory(index: number): string {
  return MOCK_CATEGORIES[index % MOCK_CATEGORIES.length]
}

function isNew(ustvarjenOb: string): boolean {
  return (Date.now() - new Date(ustvarjenOb).getTime()) / (1000 * 60 * 60 * 24) <= 30
}

interface BackendModul {
  id: string
  naziv: string
  opis: string
  jeObjavljen: boolean
  tezavnost: number
  ustvarjenOb: string
  uciteljImePriimek: string
}

function ModuleCard({ mod, color, index }: { mod: BackendModul; color: string; index: number }) {
  const navigate = useNavigate()
  const category = getCategory(index)
  const showNew = isNew(mod.ustvarjenOb)

  return (
    <ComicBox p={0} onClick={() => navigate(`/modules/${mod.id}`)} hoverBg={C.yellowLt}
      style={{ display: 'flex', flexDirection: 'column' }}>

      {/* NEW stamp — only for recently added modules */}
      {showNew && (
        <div style={{
          position: 'absolute', top: -10, right: -10, zIndex: 1,
          background: C.red,
          border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm,
          padding: `${S[1]} ${S[3]}`,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.sm,
          color: C.paper,
          boxShadow: mkShadow('base'),
          transform: 'rotate(8deg)',
        }}>
          NEW!
        </div>
      )}

      {/* Colored header */}
      <div style={{
        background: color,
        borderBottom: `1px solid ${C.ink}`,
        borderTopLeftRadius: R.sm, borderTopRightRadius: R.sm,
        padding: S[3], paddingTop: S[5],
        display: 'flex', flexDirection: 'column', gap: S[2],
      }}>
        {/* Stars + category tags */}
        <div style={{ display: 'flex', gap: S[1.5], alignSelf: 'flex-start' }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          <Tag label={category} bg={CATEGORY_COLORS[category]} />
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink, lineHeight: 1.25, wordBreak: 'break-word' }}>
          {mod.naziv}
        </div>

        {/* Meta */}
        <div style={{ fontSize: FS.sm, color: C.ink, opacity: 0.7 }}>
          Prof. {mod.uciteljImePriimek}
        </div>
      </div>

      {/* White footer — progress */}
      <div style={{
        background: C.paper,
        borderBottomLeftRadius: R.sm, borderBottomRightRadius: R.sm,
        padding: `${S[2.5]} ${S[3]}`,
        display: 'flex', flexDirection: 'column', gap: S[1.5], flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>NOT STARTED</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink }}>0%</span>
        </div>
        <Bar value={0} color={C.mutedLt} />
      </div>
    </ComicBox>
  )
}

function ModuleListRow({ mod, color, index }: { mod: BackendModul; color: string; index: number }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const category = getCategory(index)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/modules/${mod.id}`)}
      style={{ cursor: 'pointer', transform: hovered ? 'translate(-2px, -4px) scale(1.01)' : 'none', transition: 'transform 0.1s ease' }}
    >
      <ComicBox p={0} shadowSize={hovered ? 'lg' : 'base'}
        style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Left color stripe */}
        <div style={{ width: 8, background: color, flexShrink: 0, borderTopLeftRadius: R.sm, borderBottomLeftRadius: R.sm }} />

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[4], padding: `${S[3]} ${S[4]}`, background: hovered ? C.yellowLt : C.paper, transition: 'background 0.12s ease', borderTopRightRadius: R.sm, borderBottomRightRadius: R.sm }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink, lineHeight: 1.3 }}>
            {mod.naziv}
          </div>
          <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>Prof. {mod.uciteljImePriimek}</div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[1.5] }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          <Tag label={category} bg={CATEGORY_COLORS[category]} />
        </div>

        {/* Divider */}
        <div style={{ width: BW.base, alignSelf: 'stretch', background: C.divider }} />

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], minWidth: 140 }}>
          <div style={{ flex: 1 }}><Bar value={0} color={C.mutedLt} /></div>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink, flexShrink: 0 }}>0%</span>
        </div>
        </div>
      </ComicBox>
    </div>
  )
}

const STUDENT_CATEGORIES = ['ALL', ...MOCK_CATEGORIES]

function SkeletonCard({ color }: { color: string }) {
  return (
    <div className="skeleton-pulse"><ComicBox p={0} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: color, opacity: 0.45, borderBottom: `1px solid ${C.ink}`, borderTopLeftRadius: R.sm, borderTopRightRadius: R.sm, padding: S[3], paddingTop: S[5], display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <div style={{ display: 'flex', gap: S[1.5] }}>
          <div style={{ width: 32, height: 18, background: C.ink, opacity: 0.2, borderRadius: R.sm }} />
          <div style={{ width: 56, height: 18, background: C.ink, opacity: 0.2, borderRadius: R.sm }} />
        </div>
        <div style={{ height: 22, background: C.ink, opacity: 0.15, borderRadius: R.sm, width: '75%' }} />
        <div style={{ height: 22, background: C.ink, opacity: 0.15, borderRadius: R.sm, width: '50%' }} />
        <div style={{ height: 13, background: C.ink, opacity: 0.1, borderRadius: R.sm, width: '55%' }} />
      </div>
      <div style={{ background: C.paper, borderBottomLeftRadius: R.sm, borderBottomRightRadius: R.sm, padding: `${S[2.5]} ${S[3]}`, display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: 80, height: 12, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 28, height: 12, background: C.mutedLt, borderRadius: R.sm }} />
        </div>
        <div style={{ height: 6, background: C.mutedLt, borderRadius: R.sm }} />
      </div>
    </ComicBox></div>
  )
}

function SkeletonRow({ color }: { color: string }) {
  return (
    <div className="skeleton-pulse"><ComicBox p={0} style={{ display: 'flex', alignItems: 'stretch' }}>
      <div style={{ width: 8, background: color, opacity: 0.45, flexShrink: 0, borderTopLeftRadius: R.sm, borderBottomLeftRadius: R.sm }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[4], padding: `${S[3]} ${S[4]}`, borderTopRightRadius: R.sm, borderBottomRightRadius: R.sm }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, background: C.mutedLt, borderRadius: R.sm, width: '55%' }} />
          <div style={{ height: 12, background: C.divider, borderRadius: R.sm, width: '35%', marginTop: S[0.5] }} />
        </div>
        <div style={{ display: 'flex', gap: S[1.5] }}>
          <div style={{ width: 36, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 56, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: C.divider }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], minWidth: 140 }}>
          <div style={{ flex: 1, height: 6, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 24, height: 12, background: C.mutedLt, borderRadius: R.sm }} />
        </div>
      </div>
    </ComicBox></div>
  )
}

export function StudentModules() {
  const [moduli, setModuli] = useState<BackendModul[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [activeCategory, setActiveCategory] = useState('ALL')

  useEffect(() => {
    getModuliJavni().then(data => {
      setModuli(data)
      setLoading(false)
    })
  }, [])

  const getCategoryCount = (cat: string): number => {
    if (cat === 'ALL') return moduli.length
    return moduli.filter((_, i) => getCategory(i) === cat).length
  }

  const filtered = moduli.filter((m, i) => {
    const matchesSearch = m.naziv.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'ALL' || getCategory(i) === activeCategory
    return matchesSearch && matchesCategory
  })

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
          <div className="modules-view-toggle">
            <button className={`modules-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>▪▪</button>
            <button className={`modules-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>≡</button>
          </div>
        </div>
        <div className="modules-filter-row">
          <div className="modules-filters">
            {STUDENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`modules-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat} <span className="modules-filter-count">{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="modules-grid">
          {loading
            ? COLORS.map((color, i) => <SkeletonCard key={i} color={color} />)
            : filtered.map((mod, i) => (
                <ModuleCard key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} index={i} />
              ))
          }
        </div>
      ) : (
        <Panel title={loading ? '— MODULES' : `${filtered.length} MODULES`} accent={C.yellow} p={S[3]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {loading
              ? COLORS.map((color, i) => <SkeletonRow key={i} color={color} />)
              : filtered.map((mod, i) => (
                  <ModuleListRow key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} index={i} />
                ))
            }
          </div>
        </Panel>
      )}
    </div>
  )
}
