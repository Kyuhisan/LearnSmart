import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { C, S, FS } from '../styles/tokens'
import { BitMascot } from '../components/ui/BitMascot'

const API_URL = import.meta.env.VITE_API_URL

export function Callback() {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        window.location.href = '/'
        return
      }

      const response = await fetch(`${API_URL}/api/me/status`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const status = await response.json()
      console.log('Status:', status)

      if (status.isNewUser) {
        window.location.href = '/register'
      } else {
        window.location.href = '/dashboard'
      }
    })
  }, [])

 return (
  <div style={{
    minHeight: '100vh',
    width: '100%',
    background: C.cream,
    backgroundImage: `radial-gradient(${C.divider} 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: S[4],
  }}>
    <BitMascot size={80} mood="thinking" float />
    <div style={{
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: FS.md,
      color: C.ink,
    }}>
      Setting up your account...
    </div>
  </div>
)
}