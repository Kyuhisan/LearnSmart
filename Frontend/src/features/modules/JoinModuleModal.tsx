import { useState } from 'react'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { C } from '../../styles/tokens'
import { vpisZKodo } from './moduleApi'
import { useAuth } from '../../context/AuthContext'
import '../../styles/moduleLibrary.css'

interface Props {
  onClose: () => void
  onSave: () => void
}

export function JoinModuleModal({ onClose, onSave }: Props) {
  const { session } = useAuth()
  const [kodaVpisa, setKodaVpisa] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (!kodaVpisa.trim()) { setError('Enter enrollment code'); return }
    setSaving(true)
    setError('')
    try {
      await vpisZKodo(session!.access_token, kodaVpisa.trim())
      onSave()
      onClose()
    } catch {
      setError('Invalid code or already enrolled')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">JOIN MODULE</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontFamily: 'inherit', fontSize: '0.875rem', margin: 0, color: C.muted }}>
          Enter the enrollment code provided by your professor.
        </p>
        <div className="modal-field">
          <label className="modal-label">ENROLLMENT CODE</label>
          <input
            className="modal-input"
            value={kodaVpisa}
            onChange={e => setKodaVpisa(e.target.value)}
            placeholder="e.g. MAT-001"
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
          />
        </div>
        {error && <div className="modal-error">{error}</div>}
        <div className="modal-actions">
          <ComicBtn color={C.muted} onClick={onClose}>CANCEL</ComicBtn>
          <ComicBtn color={C.green} onClick={handleJoin}>
            {saving ? 'JOINING...' : 'JOIN'}
          </ComicBtn>
        </div>
      </div>
    </div>
  )
}