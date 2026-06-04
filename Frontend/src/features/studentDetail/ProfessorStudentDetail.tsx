import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { ComicBox } from '../../components/ui/ComicBox'
import { Panel } from '../../components/ui/Panel'
import { BitMascot } from '../../components/ui/BitMascot'
import { Bar } from '../../components/ui/Bar'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { C, S, FS, BW, R, STYLE_INFO, mkShadow } from '../../styles/tokens'
import { useAuth } from '../../context/AuthContext'
import { getStudentiZaUcitelja, getStudentRezultati, type StudentSummary, type StudentQuizResult } from '../modules/moduleApi'

import '../../styles/studentDetailPage.css'

function scoreColor(score: number): string {
  if (score >= 85) return C.green
  if (score >= 65) return C.yellow
  return C.red
}

function scoreBg(score: number): string {
  if (score >= 85) return C.greenLt
  if (score >= 65) return C.yellowLt
  return C.redLt
}

export function ProfessorStudentDetail({ studentId }: { studentId: string }) {
  const navigate = useNavigate()
  const { session } = useAuth()
  const isMobile = useBreakpoint() === 'mobile'
  const [student, setStudent] = useState<StudentSummary | null>(null)
  const [quizResults, setQuizResults] = useState<StudentQuizResult[] | null>(null)

  useEffect(() => {
    if (!session?.access_token) return
    getStudentiZaUcitelja(session.access_token).then(list => {
      setStudent(list.find((s: StudentSummary) => s.ucenecId === studentId) ?? null)
    }).catch(() => {})
    getStudentRezultati(session.access_token, studentId)
      .then(setQuizResults)
      .catch(() => setQuizResults([]))
  }, [session, studentId])

  const info = student?.ucniTip && STYLE_INFO[student.ucniTip as keyof typeof STYLE_INFO]
    ? STYLE_INFO[student.ucniTip as keyof typeof STYLE_INFO]
    : STYLE_INFO['visual']

  const qTotal = quizResults?.length ?? 0
  const qBest = qTotal > 0 ? Math.max(...quizResults!.map(q => q.odstotek)) : 0
  const qPassRate = qTotal > 0 ? Math.round((quizResults!.filter(q => q.odstotek >= 50).length / qTotal) * 100) : 0
  const distGreat = quizResults?.filter(q => q.odstotek >= 85).length ?? 0
  const distGood  = quizResults?.filter(q => q.odstotek >= 65 && q.odstotek < 85).length ?? 0
  const distPoor  = quizResults?.filter(q => q.odstotek < 65).length ?? 0

  if (!student) return (
    <div className="dashboard-main">
      <Topbar title="STUDENT" subtitle="Loading…" back={() => navigate(-1)} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: S[8] }}>
        <BitMascot size={64} mood="thinking" float />
      </div>
    </div>
  )

  return (
    <div className="dashboard-main">
      <Topbar
        title={student.imePriimek.toUpperCase()}
        subtitle="Student profile"
        back={() => navigate(-1)}
      />
      <div className="student-detail-page">

        {/* Hero card */}
        <ComicBox bg={info.bg} p={S[5]} style={{ paddingLeft: isMobile ? S[4] : S[8], paddingRight: isMobile ? S[4] : S[8] }}>

          {/* Dot pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `radial-gradient(${C.ink} 1px, transparent 1px)`,
            backgroundSize: '16px 16px', opacity: 0.13,
            borderRadius: R.base, pointerEvents: 'none', zIndex: 0,
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                <div style={{ display: 'flex', gap: S[1.5], flexWrap: 'nowrap', alignItems: 'center' }}>
                  <Tag label={info.label.toUpperCase()} bg={info.color} color="#fff" />
                  <Tag label={`${student.steviloModulov} ${student.steviloModulov === 1 ? 'MODULE' : 'MODULES'}`} bg={C.paper} />
                  <Tag label={`AVG QUIZ ${student.avgScore}%`} bg={scoreBg(student.avgScore)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: C.ink, border: `${BW.base} solid ${C.ink}`, boxShadow: mkShadow(), display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.yellow, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.lg, flexShrink: 0 }}>
                    {student.imePriimek.charAt(0)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], color: C.ink, lineHeight: 1.1 }}>{student.imePriimek}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: S[1.5], rowGap: S[0.5], alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>NICKNAME:</span>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.xs, color: C.ink, fontWeight: 600 }}>{student.username ?? '—'}</span>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>EMAIL:</span>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.xs, color: C.ink, fontWeight: 600 }}>{student.email ?? '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: S[5] }}>
                <div style={{ width: '7rem', height: '7rem', borderRadius: '50%', background: C.ink, border: `${BW.base} solid ${C.ink}`, boxShadow: mkShadow(), display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.yellow, fontFamily: "'Archivo Black', sans-serif", fontSize: FS['7xl'], flexShrink: 0 }}>
                  {student.imePriimek.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[1.5] }}>
                  <div style={{ display: 'flex', gap: S[1.5], flexWrap: 'wrap', alignItems: 'center' }}>
                    <Tag label={info.label.toUpperCase()} bg={info.color} color="#fff" />
                    <Tag label={`${student.steviloModulov} ${student.steviloModulov === 1 ? 'MODULE' : 'MODULES'}`} bg={C.paper} />
                    <Tag label={`AVG QUIZ ${student.avgScore}%`} bg={scoreBg(student.avgScore)} />
                  </div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS['5xl'], color: C.ink, lineHeight: 1.1 }}>
                    {student.imePriimek}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: S[1.5], rowGap: S[0.5], alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>NICKNAME:</span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.ink, fontWeight: 600 }}>{student.username ?? '—'}</span>
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>EMAIL:</span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: FS.sm, color: C.ink, fontWeight: 600 }}>{student.email ?? '—'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ComicBox>

        {/* Bottom grid */}
        <div className="student-detail-grid">

          {/* Recent quizzes */}
          <Panel title="RECENT QUIZZES" accent={C.yellow} action={<Tag label={quizResults === null ? '…' : `${quizResults.length} QUIZZES`} bg={C.yellowLt} />}>
            <div className="student-detail-quiz-list">
              {quizResults === null ? (
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, padding: S[3] }}>LOADING...</div>
              ) : quizResults.length === 0 ? (
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, padding: S[3] }}>NO QUIZZES TAKEN YET</div>
              ) : quizResults.map((quiz, i) => (
                <div
                  key={quiz.id}
                  className="student-detail-quiz-row"
                  style={{ borderBottom: i < quizResults.length - 1 ? `1.5px dashed ${C.divider}` : 'none' }}
                >
                  <div
                    className="student-detail-quiz-score"
                    style={{ background: scoreBg(quiz.odstotek), color: scoreColor(quiz.odstotek), border: `${BW.base} solid ${scoreColor(quiz.odstotek)}` }}
                  >
                    {quiz.odstotek}
                  </div>
                  <div className="student-detail-quiz-info">
                    <span className="student-detail-quiz-title" style={{ color: C.ink }}>{quiz.kvizNaziv}</span>
                    <span className="student-detail-quiz-meta" style={{ color: C.muted }}>{new Date(quiz.oddanoOb).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Quiz Stats */}
          <Panel title="QUIZ STATS" accent={C.purple}>
            {quizResults === null ? (
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, padding: S[3] }}>LOADING...</div>
            ) : quizResults.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[2], padding: `${S[4]} ${S[3]}` }}>
                <BitMascot size={48} mood="thinking" />
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>NO QUIZ DATA YET</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

                {/* 2×2 stat grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[2] }}>
                  {([
                    { label: 'TOTAL QUIZZES', value: qTotal,              bg: C.cyanLt               },
                    { label: 'BEST SCORE',    value: `${qBest}%`,         bg: C.greenLt              },
                    { label: 'AVG SCORE',     value: `${student.avgScore}%`, bg: scoreBg(student.avgScore) },
                    { label: 'PASS RATE',     value: `${qPassRate}%`,     bg: qPassRate >= 50 ? C.yellowLt : C.redLt },
                  ] as const).map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, padding: `${S[2]} ${S[3]}`, boxShadow: mkShadow() }}>
                      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>{s.label}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xl, color: C.ink, fontWeight: 700, marginTop: S[0.5] }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Score distribution */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1 }}>SCORE DISTRIBUTION</div>
                  {([
                    { label: 'GREAT (≥85%)', count: distGreat, color: C.green  },
                    { label: 'GOOD (65–84%)', count: distGood,  color: C.yellow },
                    { label: 'LOW (<65%)',    count: distPoor,  color: C.red    },
                  ] as const).map(row => (
                    <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: S[0.5] }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>{row.label}</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>{row.count}</span>
                      </div>
                      <Bar value={row.count} max={qTotal} color={row.color} height={8} />
                    </div>
                  ))}
                </div>

              </div>
            )}
          </Panel>

        </div>

      </div>
    </div>
  )
}
