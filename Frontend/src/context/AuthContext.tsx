import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

const API_URL = import.meta.env.VITE_API_URL

interface Profil {
  username: string
  vloga: string
  ucniTip: string
}

interface AuthContextType {
  session: Session | null
  loading: boolean
  profil: Profil | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfil: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profil, setProfil] = useState<Profil | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // tukaj pridobimo profil uporabnika (username in vloga) da lahko potem prilagodis pages in sidebar glede na vlogo
  useEffect(() => {
    const fetchProfil = async () => {
      if (!session) { setProfil(null); return }
      const response = await fetch(`${API_URL}/api/me/status`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const data = await response.json()
      setProfil({ username: data.username, vloga: data.vloga, ucniTip: data.ucniTip ?? '' })
    }
    fetchProfil()
  }, [session])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`,
        queryParams: { prompt: 'select_account' }
      }
    })
  }

  const refreshProfil = async () => {
    const { data: { session: current } } = await supabase.auth.getSession()
    if (!current) return
    const response = await fetch(`${API_URL}/api/me/status`, {
      headers: { 'Authorization': `Bearer ${current.access_token}` }
    })
    const data = await response.json()
    setProfil({ username: data.username, vloga: data.vloga, ucniTip: data.ucniTip ?? '' })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfil(null)
  }

  return (
    <AuthContext.Provider value={{ session, loading, profil, signInWithGoogle, signOut, refreshProfil }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth mora biti znotraj AuthProvider')
  return ctx
}