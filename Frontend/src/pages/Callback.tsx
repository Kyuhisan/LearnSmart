import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function Callback() {
  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href).then(() => {
      window.location.href = '/dashboard'
    })
  }, [])

  return <p>comming soon...</p>
}