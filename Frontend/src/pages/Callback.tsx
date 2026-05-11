import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function Callback() {
  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href).then(() => {
      window.location.href = '/'
    })
  }, [])

  return <p>Signing you in...</p>
}