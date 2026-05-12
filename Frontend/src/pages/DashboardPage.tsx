import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { C, S, FS } from '../styles/tokens'
import { BitMascot } from '../components/ui/BitMascot'
import { ComicBox } from '../components/ui/ComicBox'
import { ComicBtn } from '../components/ui/ComicBtn'
import { Tag } from '../components/ui/Tag'

const API_URL = import.meta.env.VITE_API_URL

interface Profil {
  username: string
  vloga: string
}

export function DashboardPage() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const [profil, setProfil] = useState<Profil | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfil = async () => {
      const response = await fetch(`${API_URL}/api/me/status`, {
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      })
      const data = await response.json()
      setProfil({
        username: data.username,
        vloga: data.vloga
      })
      setLoading(false)
    }
    if (session) fetchProfil()
  }, [session])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: C.cream,
    }}>
      <BitMascot size={80} mood="thinking" float />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: C.cream,
      backgroundImage: `radial-gradient(${C.divider} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      padding: S[8],
    }}>
      <ComicBox bg={C.paper} shadowSize="lg" p={S[6]} style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
            <BitMascot size={60} mood="happy" />
            <div>
              <div style={{ display: 'inline-block', marginBottom: S[1] }}>
                <Tag
                  label={profil?.vloga === 'ucitelj' ? 'Teacher' : 'Student'}
                  bg={profil?.vloga === 'ucitelj' ? C.purpleLt : C.cyanLt}
                />
              </div>
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS['3xl'],
                color: C.ink,
              }}>
                Hey, {profil?.username}!
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <div style={{ fontSize: FS.md, color: C.muted }}>
              📧 {session?.user.email}
            </div>
            <div style={{ fontSize: FS.md, color: C.muted }}>
              👤 @{profil?.username}
            </div>
            <div style={{ fontSize: FS.md, color: C.muted }}>
              🎓 {profil?.vloga === 'ucitelj' ? 'Teacher' : 'Student'}
            </div>
          </div>

          <ComicBtn
            onClick={handleLogout}
            color={C.redLt}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign out
          </ComicBtn>

        </div>
      </ComicBox>
    </div>
  )
}