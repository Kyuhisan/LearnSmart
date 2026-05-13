import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { C, S } from '../styles/tokens'
import { BitMascot } from '../components/ui/BitMascot'
import { ComicBox } from '../components/ui/ComicBox'
import { ComicBtn } from '../components/ui/ComicBtn'
import { Tag } from '../components/ui/Tag'
import "../styles/pages.css"

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
      setProfil({ username: data.username, vloga: data.vloga })
      setLoading(false)
    }
    if (session) fetchProfil()
  }, [session])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) return (
    <div className="page-loader">
      <BitMascot size={80} mood="thinking" float />
    </div>
  )

  return (
    <div className="dashboard-page">
      <ComicBox bg={C.paper} shadowSize="lg" p={S[6]} style={{ maxWidth: '480px', margin: '0 auto' }}>
        <div className="dashboard-card-inner">

          <div className="dashboard-profile-header">
            <BitMascot size={60} mood="happy" />
            <div>
              <div className="dashboard-tag-wrapper">
                <Tag
                  label={profil?.vloga === 'ucitelj' ? 'Teacher' : 'Student'}
                  bg={profil?.vloga === 'ucitelj' ? C.purpleLt : C.cyanLt}
                />
              </div>
              <div className="dashboard-username">Hey, {profil?.username}!</div>
            </div>
          </div>

          <div className="dashboard-info-list">
            <div className="dashboard-info-item">📧 {session?.user.email}</div>
            <div className="dashboard-info-item">👤 @{profil?.username}</div>
            <div className="dashboard-info-item">🎓 {profil?.vloga === 'ucitelj' ? 'Teacher' : 'Student'}</div>
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