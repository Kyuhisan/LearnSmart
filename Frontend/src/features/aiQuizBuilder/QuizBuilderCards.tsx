import { useState, useRef, useEffect } from 'react'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import type { QuestionState, BankaQuestion, KvizQuestion } from './quizBuilderTypes'
import { DIFFICULTY_COLOR } from './mockData'

export function QuestionOptions({ moznosti, correct }: { moznosti: string[]; correct: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: S[3] }}>
      {moznosti.map((opt, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[1]} ${S[2]}`, background: i === correct ? C.greenLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: i === correct ? C.green : C.muted, width: 18, flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
          <span style={{ fontSize: FS.xs, color: i === correct ? C.ink : C.muted, fontWeight: i === correct ? 700 : 400 }}>{opt}</span>
          {i === correct && <span style={{ marginLeft: 'auto', fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xs'], color: C.green }}>CORRECT</span>}
        </div>
      ))}
    </div>
  )
}

export function GeneratedQuestionCard({ q, index, onApprove, onReject }: {
  q: QuestionState; index: number; onApprove: () => void; onReject: () => void
}) {
  const approved = q.approved === true
  const rejected = q.approved === false
  const isMobile = useBreakpoint() === 'mobile'

  return (
    <div style={{ background: approved ? C.greenLt : rejected ? C.redLt : C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, borderBottom: `${BW.base} solid ${C.ink}`, background: approved ? C.green : rejected ? C.red : C.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <Tag label={`Q${index + 1}`} bg={C.mutedLt} />
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: approved || rejected ? C.paper : C.ink, lineHeight: 1.4, textDecoration: rejected ? 'line-through' : 'none', opacity: rejected ? 0.7 : 1, flex: 1 }}>
            {q.besediloVprasanja}
          </span>
          {!isMobile && <>
            <ComicBtn sm color={approved ? C.paper : C.green} onClick={onApprove}>{approved ? 'APPROVED' : 'APPROVE'}</ComicBtn>
            <ComicBtn sm color={rejected ? C.paper : C.red} onClick={onReject}>{rejected ? 'REJECTED' : 'REJECT'}</ComicBtn>
          </>}
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: S[2] }}>
            <ComicBtn sm color={approved ? C.paper : C.green} onClick={onApprove} style={{ flex: 1, justifyContent: 'center' }}>{approved ? 'APPROVED' : 'APPROVE'}</ComicBtn>
            <ComicBtn sm color={rejected ? C.paper : C.red} onClick={onReject} style={{ flex: 1, justifyContent: 'center' }}>{rejected ? 'REJECTED' : 'REJECT'}</ComicBtn>
          </div>
        )}
      </div>
      <QuestionOptions moznosti={q.moznosti} correct={q.indeksPravilnegaOdgovora} />
      {q.razlaga && (
        <div style={{ margin: `0 ${S[3]} ${S[3]}`, padding: `${S[1]} ${S[2]}`, background: C.cyanLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, fontSize: FS.xs, color: C.muted }}>
          💡 {q.razlaga}
        </div>
      )}
    </div>
  )
}

export function BankaQuestionCard({ q, index, selected, onToggle, onDelete, deleting }: {
  q: BankaQuestion; index: number; selected?: boolean
  onToggle?: () => void; onDelete?: () => void; deleting?: boolean
}) {
  const isMobile = useBreakpoint() === 'mobile'
  return (
    <div style={{ background: selected ? C.greenLt : C.paper, border: `${BW.base} solid ${selected ? C.green : C.ink}`, borderRadius: R.sm, boxShadow: mkShadow('base', selected ? C.green : C.ink), overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, borderBottom: `${BW.base} solid ${selected ? C.green : C.ink}`, background: selected ? C.green : C.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <Tag label={`Q${index + 1}`} bg={C.mutedLt} />
          {q.tezavnost && <Tag label={q.tezavnost} bg={DIFFICULTY_COLOR[q.tezavnost as keyof typeof DIFFICULTY_COLOR] ?? C.mutedLt} />}
          {!isMobile && <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: selected ? C.paper : C.ink, lineHeight: 1.4, flex: 1 }}>{q.besediloVprasanja}</span>}
          {onToggle && (
            <ComicBtn sm color={selected ? C.paper : C.green} onClick={onToggle} style={{ marginLeft: isMobile ? 'auto' : undefined }}>
              {selected ? '✓ SELECTED' : '+ SELECT'}
            </ComicBtn>
          )}
          {onDelete && (
            <ComicBtn sm color={C.red} onClick={onDelete} disabled={deleting} style={{ marginLeft: isMobile ? 'auto' : undefined }}>
              {deleting ? '...' : '✕'}
            </ComicBtn>
          )}
        </div>
        {isMobile && (
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: selected ? C.paper : C.ink, lineHeight: 1.4 }}>
            {q.besediloVprasanja}
          </span>
        )}
      </div>
      <QuestionOptions moznosti={q.moznosti} correct={q.indeksPravilnegaOdgovora} />
    </div>
  )
}

export function KvizQuestionCard({ q, index, onRemove, removing }: {
  q: KvizQuestion; index: number; onRemove: () => void; removing: boolean
}) {
  const isMobile = useBreakpoint() === 'mobile'
  return (
    <div style={{ background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, borderBottom: `${BW.base} solid ${C.ink}`, background: C.cream }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <Tag label={`Q${index + 1}`} bg={C.mutedLt} />
          {q.tezavnost && <Tag label={q.tezavnost} bg={DIFFICULTY_COLOR[q.tezavnost as keyof typeof DIFFICULTY_COLOR] ?? C.mutedLt} />}
          {!isMobile && <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, lineHeight: 1.4, flex: 1 }}>{q.besediloVprasanja}</span>}
          <ComicBtn sm color={C.orange} onClick={onRemove} disabled={removing} style={{ marginLeft: isMobile ? 'auto' : undefined }}>
            {removing ? '...' : '↩ REMOVE'}
          </ComicBtn>
        </div>
        {isMobile && (
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, lineHeight: 1.4 }}>
            {q.besediloVprasanja}
          </span>
        )}
      </div>
      <QuestionOptions moznosti={q.moznosti} correct={q.indeksPravilnegaOdgovora} />
    </div>
  )
}

export function Dropdown<T extends { id: string; naziv: string }>({ value, options, onChange, loading, placeholder }: {
  value: T | null; options: T[]; onChange: (v: T) => void; loading: boolean; placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const label = loading ? 'Loading…' : value ? value.naziv : options.length === 0 ? 'None available' : (placeholder ?? 'Select…')
  const canOpen = !loading && options.length > 0

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => { if (canOpen) setOpen(o => !o) }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[2]} ${S[3]}`, minHeight: '2.5rem', background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), cursor: canOpen ? 'pointer' : 'not-allowed', fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: loading || !value ? C.muted : C.ink, textTransform: 'uppercase' }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 }}>{label}</span>
        {canOpen && <span style={{ fontSize: FS.xs, marginLeft: S[2], flexShrink: 0 }}>{open ? '▲' : '▼'}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100, background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), overflow: 'hidden' }}>
          {options.map(m => (
            <button key={m.id} onClick={() => { onChange(m); setOpen(false) }} onMouseEnter={() => setHoveredId(m.id)} onMouseLeave={() => setHoveredId(null)}
              style={{ padding: `${S[2]} ${S[3]}`, cursor: 'pointer', background: hoveredId === m.id ? C.yellowLt : m.id === value?.id ? C.cream : C.paper, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, textTransform: 'uppercase', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: `1px solid ${C.divider}`, transition: 'background 0.1s', width: '100%', textAlign: 'left', display: 'block' }}>
              {m.naziv}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function StepperField({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (fn: (v: number) => number) => void; min: number; max: number
}) {
  return (
    <div>
      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <ComicBtn sm color={C.paper} onClick={() => onChange(v => Math.max(min, v - 1))} disabled={value <= min}>−</ComicBtn>
        <input type="number" min={min} max={max} value={value}
          onChange={e => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) onChange(() => Math.min(max, Math.max(min, n))) }}
          style={{ flex: 1, textAlign: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: FS['3xl'], color: C.ink, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, background: C.paper, padding: `${S[1]} 0`, boxShadow: mkShadow(), outline: 'none' }}
        />
        <ComicBtn sm color={C.paper} onClick={() => onChange(v => Math.min(max, v + 1))} disabled={value >= max}>+</ComicBtn>
      </div>
    </div>
  )
}