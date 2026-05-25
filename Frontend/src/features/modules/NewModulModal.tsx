import { useState } from 'react'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { C } from '../../styles/tokens'
import { ustvariModul } from './moduleApi'
import { useAuth } from '../../context/AuthContext'
import '../../styles/moduleLibrary.css'

import { ALL_TAGS, TAG_COLORS } from './moduleTags'

interface Props {
  onClose: () => void
  onSave: () => void
}

export function NewModuleModal({ onClose, onSave }: Props) {
  const { session } = useAuth()
  const [naziv, setNaziv] = useState('')
  const [opis, setOpis] = useState('')
  const [kodaVpisa, setKodaVpisa] = useState('')
  const [tezavnost, setTezavnost] = useState(1)
  const [kategorije, setKategorije] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!naziv.trim()) { setError('Naziv ne sme biti prazen'); return }
    if (!kodaVpisa.trim()) { setError('Koda vpisa ne sme biti prazna'); return }
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
          <label className="modal-label">TITLE</label>
          <input className="modal-input" value={naziv} onChange={e => setNaziv(e.target.value)} placeholder="E.g., Mathematics" />
        </div>

        <div className="modal-field">
          <label className="modal-label">DESCRIPTION</label>
          <textarea className="modal-input modal-textarea" value={opis} onChange={e => setOpis(e.target.value)} placeholder="Brief description of the module..." />
        </div>

        <div className="modal-field">
          <label className="modal-label">COURSE CODE</label>
          <input className="modal-input" value={kodaVpisa} onChange={e => setKodaVpisa(e.target.value)} placeholder="E.g., MAT-001" />
        </div>

        <div className="modal-field">
          <label className="modal-label">CATEGORY</label>
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