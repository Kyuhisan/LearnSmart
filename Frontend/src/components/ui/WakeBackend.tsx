import { useState, useEffect, useRef, useCallback } from 'react'
import { BitMascot } from './BitMascot'
import { SpeechBubble } from './SpeechBubble'
import { Tag } from './Tag'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const HEALTH_URL = `${API_URL}/health`
const POLL_MS = 4000
const FETCH_TIMEOUT_MS = 5000

type Status = 'checking' | 'waking' | 'awake'

export function WakeBackend({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('checking')
  const [elapsed, setElapsed] = useState(0)
  const [dots, setDots] = useState('')
  const awakeRef = useRef(false)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleAlive = useCallback(() => {
    if (awakeRef.current) return
    awakeRef.current = true
    if (pollingRef.current) clearInterval(pollingRef.current)
    if (elapsedRef.current) clearInterval(elapsedRef.current)
    setStatus('awake')
  }, [])

  const handleSleeping = useCallback(() => {
    if (!awakeRef.current) setStatus('waking')
  }, [])

  useEffect(() => {
    pollingRef.current = setInterval(() => {
      fetch(HEALTH_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
        .then(res => { if (res.ok) { handleAlive() } else { handleSleeping() } })
        .catch(handleSleeping)
    }, POLL_MS)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
      if (elapsedRef.current) clearInterval(elapsedRef.current)
    }
  }, [handleAlive, handleSleeping])

  // Start elapsed counter once waking is confirmed
  useEffect(() => {
    if (status !== 'waking') return
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current) }
  }, [status])

  // Animate dots
  useEffect(() => {
    if (status === 'awake') return
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    return () => clearInterval(t)
  }, [status])

  if (status === 'awake') return <>{children}</>

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: C.cream,
      backgroundImage: 'radial-gradient(var(--ls-ink) 1px, transparent 1px)',
      backgroundSize: '14px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: S[5], zIndex: 9999,
    }}>

      {/* Mascot + bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[4] }}>
        <BitMascot size={96} mood="thinking" float />

        <SpeechBubble color={C.paper} style={{ maxWidth: 320 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <div style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS.lg, color: C.ink, letterSpacing: 0.5,
            }}>
              {status === 'checking' ? `CHECKING BACKEND${dots}` : `WAKING UP${dots}`}
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: FS.xs, color: C.muted, lineHeight: 1.6,
            }}>
              {status === 'checking'
                ? 'Connecting to the server\u2026'
                : 'The server was sleeping due to\ninactivity. This takes ~30\u201360s.'}
            </div>
          </div>
        </SpeechBubble>
      </div>

      {/* Status card */}
      <div style={{
        background: C.paper,
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: R.base,
        boxShadow: mkShadow('lg'),
        padding: `${S[3]} ${S[5]}`,
        display: 'flex', alignItems: 'center', gap: S[4],
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: status === 'checking' ? C.yellow : C.orange,
          border: `${BW.base} solid ${C.ink}`,
          animation: 'spin 1.2s linear infinite',
          flexShrink: 0,
        }} />

        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: FS.xs, color: C.muted,
        }}>
          {status === 'checking' ? 'Reaching server\u2026' : `Waiting for server\u2026 ${elapsed}s`}
        </div>

        {status === 'waking' && <Tag label="FREE TIER" bg={C.orangeLt} />}
      </div>

      {status === 'waking' && (
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: FS['2xs'], color: C.muted, textAlign: 'center',
        }}>
          Render free tier spins down after 15 min of inactivity.
        </div>
      )}
    </div>
  )
}
