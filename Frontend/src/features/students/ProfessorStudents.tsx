import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import {
  getStudentiZaUcitelja,
  getStudentiPoModulih,
  type StudentSummary,
  type ModuleStudents,
} from '../modules/moduleApi'
import '../../styles/studentPage.css'
import '../../styles/moduleLibrary.css'

type StyleKey = keyof typeof STYLE_INFO
type Filter = 'All' | 'At risk' | StyleKey

const FILTERS: Filter[] = ['All', 'At risk', 'visual', 'auditory', 'reading', 'kinesthetic']

const FILTER_LABELS: Record<string, string> = {
  All:          'All',
  'At risk':    'At risk',
  visual:       'Visual',
  auditory:     'Auditory',
  reading:      'Reading',
  kinesthetic:  'Kinesthetic',
}

function isAtRisk(s: StudentSummary): boolean {
  return s.avgScore > 0 && s.avgScore < 65
}

function styleInfoFor(ucniTip: string | null) {
  if (ucniTip && ucniTip in STYLE_INFO) return STYLE_INFO[ucniTip as StyleKey]
  return null
}

function StudentRow({ student, onClick }: { student: StudentSummary; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const isMobile = useBreakpoint() === 'mobile'
  const atRisk = isAtRisk(student)
  const info = styleInfoFor(student.ucniTip)
  const avatarBg = info?.bg ?? C.mutedLt
  const styleLabel = info?.label ?? '—'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.1s ease',
        transform: hovered ? 'translate(-2px, -4px) scale(1.01)' : 'none',
      }}
    >
      {atRisk && isMobile && (
        <div style={{
          position: 'absolute', top: -8, right: -6, zIndex: 1,
          background: C.red, border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.sm, padding: `${S[0.5]} ${S[2]}`,
          fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'],
          color: C.paper, boxShadow: mkShadow(), transform: 'rotate(6deg)',
        }}>
          AT RISK
        </div>
      )}
      <div className="student-row-inner" style={{
        background: hovered ? C.yellowLt : C.paper,
        boxShadow: hovered ? `2px 4px 0 ${C.ink}` : mkShadow(),
      }}>
        {isMobile ? (
          <div style={{ display: 'flex', gap: S[2], alignItems: 'center', width: '100%' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: `${BW.base} solid ${C.ink}`, background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, flexShrink: 0 }}>
              {student.imePriimek.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.imePriimek}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS['2xs'], color: C.muted }}>{student.steviloModulov} {student.steviloModulov === 1 ? 'module' : 'modules'}</span>
              <Tag label={styleLabel.toUpperCase()} bg={avatarBg} />
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: S[0.5] }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: atRisk ? C.red : student.avgScore > 0 ? C.green : C.muted }}>
                {student.avgScore > 0 ? `${student.avgScore}%` : '—'}
              </span>
              {atRisk && <Tag label="AT RISK" bg={C.red} />}
            </div>
          </div>
        ) : (
          <>
            <div className="student-avatar" style={{ border: `${BW.base} solid ${C.ink}`, background: avatarBg, color: C.ink }}>
              {student.imePriimek.charAt(0)}
            </div>
            <div className="student-info">
              <div className="student-name-row">
                <span className="student-name" style={{ color: C.ink }}>{student.imePriimek}</span>
                {atRisk && <Tag label="AT RISK" bg={C.red} />}
              </div>
              <p className="student-meta" style={{ color: C.muted }}>
                {student.steviloModulov} {student.steviloModulov === 1 ? 'module' : 'modules'} · {styleLabel}
              </p>
            </div>
            <div className="student-stats">
              <div className="student-score" style={{ color: atRisk ? C.red : student.avgScore > 0 ? C.green : C.muted }}>
                {student.avgScore > 0 ? `${student.avgScore}%` : '—'}
              </div>
              <div className="student-xp" style={{ color: C.muted }}>AVG SCORE</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-pulse" style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2]} ${S[3]}`, border: `${BW.base} solid ${C.ink}`, borderRadius: R.base, boxShadow: mkShadow(), background: C.paper }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: C.mutedLt }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: S[1] }}>
            <div style={{ width: '40%', height: 14, background: C.mutedLt, borderRadius: R.sm }} />
            <div style={{ width: '25%', height: 11, background: C.mutedLt, borderRadius: R.sm }} />
          </div>
          <div style={{ width: 48, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 42, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
        </div>
      ))}
    </>
  )
}

export function ProfessorStudents() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('All')
  const [students, setStudents] = useState<StudentSummary[] | null>(null)
  const [byModule, setByModule] = useState<ModuleStudents[] | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    getStudentiZaUcitelja(session.access_token).then(setStudents).catch(() => setStudents([]))
    getStudentiPoModulih(session.access_token).then(setByModule).catch(() => setByModule([]))
  }, [session])

  function matchesFilters(s: StudentSummary): boolean {
    const matchSearch = s.imePriimek.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'All'     ? true :
      filter === 'At risk' ? isAtRisk(s) :
                             s.ucniTip === filter
    return matchSearch && matchFilter
  }

  const filtered = (students ?? []).filter(matchesFilters)
  const filteredByModule = (byModule ?? []).map(mod => ({ ...mod, studenti: mod.studenti.filter(matchesFilters) }))

  const totalStudents = students?.length ?? 0

  function getFilterCount(f: Filter): number {
    const all = students ?? []
    const matchSearch = (s: StudentSummary) => s.imePriimek.toLowerCase().includes(search.toLowerCase())
    if (f === 'All') return all.filter(matchSearch).length
    if (f === 'At risk') return all.filter(s => matchSearch(s) && isAtRisk(s)).length
    return all.filter(s => matchSearch(s) && s.ucniTip === f).length
  }

  return (
    <div className="dashboard-main">
      <Topbar
        title="STUDENTS — PROF"
        subtitle={students === null ? '…' : `${totalStudents} ${totalStudents === 1 ? 'student' : 'students'} enrolled`}
      />
      <div className="students-page">

        {/* Toolbar */}
        <div className="modules-toolbar" style={{ marginBottom: 0 }}>
          <div className="modules-search-row">
            <div className="modules-search-wrap">
              <input
                className="modules-search"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="modules-filter-row">
            <div className="modules-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`modules-filter-btn ${filter === f ? 'active' : ''}`}
                >
                  {FILTER_LABELS[f]} <span className="modules-filter-count">{getFilterCount(f)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 1: All students (flat, searchable) */}
        <Panel
          title={students === null ? 'YOUR STUDENTS' : `${filtered.length} ${filtered.length === 1 ? 'STUDENT' : 'STUDENTS'}`}
          accent={C.yellow}
          p={S[3]}
        >
          <div className="students-rows">
            {students === null ? (
              <SkeletonRows count={5} />
            ) : filtered.length === 0 ? (
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[5] }}>
                {search || filter !== 'All' ? 'NO STUDENTS MATCH' : 'NO STUDENTS YET'}
              </div>
            ) : (
              filtered.map((s) => (
                <StudentRow key={s.ucenecId} student={s} onClick={() => navigate(`/students/${s.ucenecId}`)} />
              ))
            )}
          </div>
        </Panel>

        {/* Panel 2: By module */}
        <Panel title="BY MODULE" accent={C.cyan} p={S[3]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {byModule === null ? (
              <SkeletonRows count={3} />
            ) : filteredByModule.length === 0 ? (
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[5] }}>
                NO MODULES YET
              </div>
            ) : (
              filteredByModule.map((mod) => (
                <div key={mod.predmetId} style={{ border: `${BW.base} solid ${C.ink}`, borderRadius: R.base, boxShadow: mkShadow(), overflow: 'hidden' }}>
                  {/* Module header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} ${S[3]}`, background: C.cyanLt, borderBottom: `${BW.base} solid ${C.ink}` }}>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, fontWeight: 800, color: C.ink, flex: 1 }}>
                      {mod.naziv.toUpperCase()}
                    </span>
                    <Tag
                      label={`${mod.studenti.length} ${mod.studenti.length === 1 ? 'STUDENT' : 'STUDENTS'}`}
                      bg={C.cyanLt}
                    />
                  </div>
                  {/* Students in this module */}
                  <div style={{ padding: mod.studenti.length === 0 ? `${S[3]} ${S[3]}` : `${S[2]} ${S[3]}`, background: C.paper, display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
                    {mod.studenti.length === 0 ? (
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>
                        NO STUDENTS ENROLLED
                      </span>
                    ) : (
                      mod.studenti.map((s) => (
                        <StudentRow key={s.ucenecId} student={s} onClick={() => navigate(`/students/${s.ucenecId}`)} />
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

      </div>
    </div>
  )
}
