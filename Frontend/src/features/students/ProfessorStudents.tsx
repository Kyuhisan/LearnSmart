import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Panel } from '../../components/ui/Panel'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, BW, R, mkShadow, STYLE_INFO } from '../../styles/tokens'
import { STUDENTS, STUDENTS_STATS, type Student } from './mockData'
import '../../styles/studentPage.css'

type LearningStyle = Student['learningStyle']
type Filter = 'All' | 'At risk' | LearningStyle

const FILTERS: Filter[] = ['All', 'At risk', 'VISUAL', 'AUDITORY', 'READING', 'KINESTHETIC']

const FILTER_LABELS: Record<string, string> = {
  All:         'All',
  'At risk':   'At risk',
  VISUAL:      'Visual',
  AUDITORY:    'Auditory',
  READING:     'Reading',
  KINESTHETIC: 'Kinesthetic',
}

function styleInfo(style: LearningStyle) {
  return STYLE_INFO[style.toLowerCase() as keyof typeof STYLE_INFO]
}

function isAtRisk(student: Student): boolean {
  return student.avgScore < 65
}

function StudentRow({ student, atRisk, onClick }: { student: Student; atRisk: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.1s ease',
        transform: hovered ? 'translate(-2px, -4px) scale(1.01)' : 'none',
      }}
    >
      <div className="student-row-inner" style={{
        background: hovered ? C.yellowLt : C.paper,
        boxShadow: hovered ? `2px 4px 0 ${C.ink}` : mkShadow(),
      }}>

        {/* Avatar */}
        <div
          className="student-avatar"
          style={{
            border: `${BW.base} solid ${C.ink}`,
            background: styleInfo(student.learningStyle).bg,
            color: C.ink,
          }}
        >
          {student.fullName.charAt(0)}
        </div>

        {/* Info */}
        <div className="student-info">
          <div className="student-name-row">
            <span className="student-name" style={{ color: C.ink }}>
              {student.fullName}
            </span>
            {atRisk && <Tag label="AT RISK" bg={C.red} />}
          </div>
          <p className="student-meta" style={{ color: C.muted }}>
            Last active {student.lastActive} · {styleInfo(student.learningStyle).label}
          </p>
        </div>

        {/* Stats */}
        <div className="student-stats">
          <div className="student-score" style={{ color: atRisk ? C.red : C.green }}>
            {student.avgScore}%
          </div>
          <div className="student-xp" style={{ color: C.muted }}>
            {student.xp.toLocaleString()} XP
          </div>
        </div>

      </div>
    </div>
  )
}

export function ProfessorStudents() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = STUDENTS.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'All'     ? true :
      filter === 'At risk' ? isAtRisk(s) :
                             s.learningStyle === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="dashboard-main">
      <Topbar
        title="STUDENTS — PROF"
        subtitle={`${STUDENTS_STATS.total} students · ${STUDENTS_STATS.activeToday} active today`}
      />
      <div className="students-page">

        {/* Toolbar */}
        <div className="students-toolbar">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="students-search"
            style={{
              border: `${BW.base} solid ${C.ink}`,
              borderRadius: R.base,
              background: C.paper,
              boxShadow: `2px 2px 0 ${C.ink}`,
              color: C.ink,
            }}
          />

          <div className="students-filters">
            {FILTERS.map((f) => (
              <ComicBtn
                key={f}
                color={filter === f ? C.yellow : C.paper}
                sm
                onClick={() => setFilter(f)}
              >
                {FILTER_LABELS[f]}
              </ComicBtn>
            ))}

            <ComicBtn color={C.cyan} sm onClick={() => {}}>
              EXPORT
            </ComicBtn>
          </div>
        </div>

        {/* Main card */}
        <Panel title={`${filtered.length} STUDENTS`} accent={C.yellow} p={S[3]}>
          <div className="students-rows">
            {filtered.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                atRisk={isAtRisk(student)}
                onClick={() => navigate(`/students/${student.id}`)}
              />
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}
