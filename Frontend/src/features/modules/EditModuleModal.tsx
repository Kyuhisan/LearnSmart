import { useState } from 'react'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { C } from '../../styles/tokens'
import { urediModul } from './moduleApi'
import { useAuth } from '../../context/AuthContext'
import '../../styles/moduleLibrary.css'

interface BackendModul {
  id: string
  naziv: string
  opis: string
  kodaVpisa: string
  jeObjavljen: boolean
  tezavnost: number
}

interface Props {
  mod: BackendModul
  onClose: () => void
  onSave: () => void
}

export function EditModuleModal({ mod, onClose, onSave }: Props) {
  const { session } = useAuth()
  const [naziv, setNaziv] = useState(mod.naziv)
  const [opis, setOpis] = useState(mod.opis ?? '')
  const [kodaVpisa, setKodaVpisa] = useState(mod.kodaVpisa ?? '')
  const [tezavnost, setTezavnost] = useState(mod.tezavnost ?? 1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!naziv.trim()) { setError('Title can not be empty'); return }
    if (!kodaVpisa.trim()) { setError('Course code can not be empty'); return }
    setSaving(true)
    await urediModul(session!.access_token, mod.id, { naziv, opis, kodaVpisa, tezavnost })
    setSaving(false)
    onSave()
    onClose()
  }


  return (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>

      <div className="modal-header">
        <span className="modal-title">EDIT MODULE</span>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>

      <div className="modal-field">
        <label className="modal-label">TITLE</label>
        <input className="modal-input" value={naziv} onChange={e => setNaziv(e.target.value)} />
      </div>

      <div className="modal-field">
        <label className="modal-label">DESCRIPTION</label>
        <textarea className="modal-input modal-textarea" value={opis} onChange={e => setOpis(e.target.value)} />
      </div>

      <div className="modal-field">
        <label className="modal-label">COURSE CODE</label>
        <input className="modal-input" value={kodaVpisa} onChange={e => setKodaVpisa(e.target.value)} />
      </div>

      <div className="modal-field">
        <label className="modal-label">DIFFICULTY (1–5)</label>
        <input type="range" min={1} max={5} value={tezavnost}
          onChange={e => setTezavnost(Number(e.target.value))}
          className="modal-range"
        />
        <div className="modal-range-value">{'⭐'.repeat(tezavnost)}</div>
      </div>

      {error && <div className="modal-error">{error}</div>}

      <div className="modal-actions">
        <ComicBtn color={C.muted} onClick={onClose}>CANCEL</ComicBtn>
        <ComicBtn color={C.green} onClick={handleSave}>
          {saving ? 'SAVING...' : 'SAVE'}
        </ComicBtn>
      </div>

    </div>
  </div>
)
}