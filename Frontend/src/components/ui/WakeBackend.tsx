import { useState, useEffect, useRef, type ReactNode } from 'react'
import { BitMascot } from './BitMascot'
import { SpeechBubble } from './SpeechBubble'
import { C, S, FS } from '../../styles/tokens'

const API = import.meta.env.VITE_API_URL
const POLL_INTERVAL_MS = 4000

type State = 'checking' | 'waking' | 'awake'

const CONFIG: Record<'checking' | 'waking', { bg: string; accent: string; title: string; bubble: string }> = {
  checking: {
    bg: C.yellowLt,
    accent: C.yellow,
    title: 'CONNECTING…',
    bubble: 'Hold on, checking if the server is awake!',
  },
  waking: {
    bg: C.cream,
    accent: C.orange,
    title: 'WAKING UP…',
    bubble: "The server was asleep. Waking it up — this usually takes under a minute!",
  },
}

export function WakeBackend({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>('checking')
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let alive = true

    const tryWake = async () => {
      try {
        const res = await fetch(`${API}/health`)
        if (res.ok && alive) {
          cleanup()
          setState('awake')
        }
      } catch {
        // still waking — keep polling
      }
    }

    const cleanup = () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (pollRef.current) clearInterval(pollRef.current)
    }

    // First check immediately — if it fails, switch to waking and start polling
    tryWake().then(() => {
      if (!alive) return
      setState(prev => {
        if (prev !== 'checking') return prev  // already awake or waking
        // First check failed — start waking flow
        startRef.current = Date.now()
        timerRef.current = setInterval(() => {
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
        }, 1000)
        pollRef.current = setInterval(tryWake, POLL_INTERVAL_MS)
        return 'waking'
      })
    })

    return () => {
      alive = false
      cleanup()
    }
  }, [])

  if (state === 'awake') return <>{children}</>

  const cfg = CONFIG[state]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: cfg.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: S[6],
    }}>
      {/* Title */}
      <div style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS['2xl'],
        color: C.ink,
        letterSpacing: '0.05em',
      }}>
        {cfg.title}
      </div>

      {/* Mascot + speech bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: S[3] }}>
        <BitMascot size={100} mood={state === 'checking' ? 'thinking' : 'wink'} float />
        <SpeechBubble color={cfg.accent} side="left">
          {cfg.bubble}
        </SpeechBubble>
      </div>

      {/* Elapsed timer — only while waking */}
      {state === 'waking' && (
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: FS.sm,
          color: C.muted,
        }}>
          {elapsed}s elapsed
        </div>
      )}

      {/* Animated dots */}
      <div style={{ display: 'flex', gap: S[2] }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 10, height: 10,
            borderRadius: '50%',
            background: cfg.accent,
            border: `2px solid ${C.ink}`,
            animation: `skeleton-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}
