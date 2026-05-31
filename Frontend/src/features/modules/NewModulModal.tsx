import { useState } from 'react'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { C, FS } from '../../styles/tokens'
import { ustvariModul, checkKodaVpisa } from './moduleApi'
import { useAuth } from '../../context/AuthContext'
import '../../styles/moduleLibrary.css'

import { ALL_TAGS, TAG_COLORS } from './moduleTags'

const COURSE_CODE_RE = /^[A-Z]{3}-\d{3}$/

function formatKoda(raw: string): string {
  const upper = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const letters = upper.slice(0, 3)
  const digits = upper.slice(3).replace(/[^0-9]/g, '').slice(0, 3)
  return digits.length > 0 ? `${letters}-${digits}` : letters
}

interface Props {
  onClose: () => void
  onSave: () => void
}

export function NewModuleModal({ onClose, onSave }: Props) {
  const { session } = useAuth()
  const [naziv, setNaziv] = useState('')
  const [opis, setOpis] = useState('')
  const [kodaVpisa, setKodaVpisa] = useState('')
  const [kodaError, setKodaError] = useState('')
  const [tezavnost, setTezavnost] = useState(1)
  const [kategorije, setKategorije] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const validateKoda = async (koda: string): Promise<boolean> => {
    if (!COURSE_CODE_RE.test(koda)) {
      setKodaError('Must follow the format ABC-000')
      return false
    }
    const taken = await checkKodaVpisa(session!.access_token, koda)
    if (taken) {
      setKodaError('This course code is already in use')
      return false
    }
    setKodaError('')
    return true
  }

  const handleSave = async () => {
    if (!naziv.trim()) { setError('Title cannot be empty'); return }
    if (!kodaVpisa.trim()) { setError('Course code cannot be empty'); return }
    const kodaOk = await validateKoda(kodaVpisa)
    if (!kodaOk) return
    setSaving(true)
    await ustvariModul(session!.access_token, { naziv, opis, kodaVpisa, tezavnost, kategorije, jeObjavljen: false })
    setSaving(false)
    onSave()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <span className="modal-title">NEW MODULE</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label className="modal-label">TITLE</label>
            <span style={{ fontSize: FS.xs, color: naziv.length > 40 ? C.red : C.muted, fontFamily: "'Space Mono', monospace" }}>
              {naziv.length}/45
            </span>
          </div>
          <input
            className="modal-input"
            value={naziv}
            maxLength={45}
            onChange={e => setNaziv(e.target.value.toUpperCase())}
            placeholder="E.G., MATHEMATICS"
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">DESCRIPTION <span style={{ fontWeight: 400, opacity: 0.6 }}>(OPTIONAL)</span></label>
          <textarea className="modal-input modal-textarea" value={opis} onChange={e => setOpis(e.target.value)} placeholder="Brief description of the module..." />
        </div>

        <div className="modal-field">
          <label className="modal-label">COURSE CODE</label>
          <input
            className="modal-input"
            value={kodaVpisa}
            onChange={e => { setKodaVpisa(formatKoda(e.target.value)); setKodaError('') }}
            onBlur={() => { if (COURSE_CODE_RE.test(kodaVpisa)) validateKoda(kodaVpisa) }}
            placeholder="ABC-000"
            maxLength={7}
            style={kodaError ? { borderColor: C.red } : undefined}
          />
          {kodaError && <div style={{ fontSize: FS.xs, color: C.red, marginTop: '0.25rem', fontFamily: "'Space Mono', monospace" }}>{kodaError}</div>}
        </div>

        <div className="modal-field">
          <label className="modal-label">CATEGORY <span style={{ fontWeight: 400, opacity: 0.6 }}>(OPTIONAL)</span></label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ALL_TAGS.map(cat => (
              <button
                key={cat}
                onClick={() => setKategorije(prev => prev.includes(cat) ? prev.filter(t => t !== cat) : [...prev, cat])}
                className={`modules-filter-btn ${kategorije.includes(cat) ? 'active' : ''}`}
                style={kategorije.includes(cat) ? { background: TAG_COLORS[cat] } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-label">DIFFICULTY (1–5)</label>
          <input
            type="range" min={1} max={5} value={tezavnost}
            onChange={e => setTezavnost(Number(e.target.value))}
            className="modal-range"
          />
          <div className="modal-range-value">{'⭐'.repeat(tezavnost)}</div>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-actions">
          <ComicBtn color={C.muted} onClick={onClose}>Cancel</ComicBtn>
          <ComicBtn color={C.green} onClick={handleSave}>
            {saving ? 'CREATING...' : 'CREATE'}
          </ComicBtn>
        </div>

      </div>
    </div>
  )
}
