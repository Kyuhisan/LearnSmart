import { useNavigate } from 'react-router-dom'
import { C, S, FS, BW } from '../styles/tokens'
import { ComicBox } from '../components/ui/ComicBox'
import { ComicBtn } from '../components/ui/ComicBtn'
import { Tag } from '../components/ui/Tag'
import { BitMascot } from '../components/ui/BitMascot'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL

export function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [vloga, setVloga] = useState<'ucenec' | 'ucitelj'>('ucenec')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

 useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/')
        return
      }
      const response = await fetch(`${API_URL}/api/me/status`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      })
      const status = await response.json()
      if (!status.isNewUser) {
        navigate('/dashboard')
      }
    }
    checkStatus()
  }, []);
  
  const handleSubmit = async () => {
     if (!username.trim()) {
    setError('Please enter a username!')
    return
  }
  if (username.length < 3) {
    setError('Username must be at least 3 characters!')
    return
  }
  if (username.length > 20) {
    setError('Username must be less than 20 characters!')
    return
  }

  // Samo alfanumerični znaki in podčrtaj
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    setError('Username can only contain letters, numbers and underscores!')
    return
  }

    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/')
        return
      }

      const response = await fetch(`${API_URL}/api/me/complete-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, vloga }),
      })

      if (!response.ok) {
        const err = await response.json()
        setError(err.message || 'Registration failed. Please try again.')
        return
      }

      navigate('/questionnaire')
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
      padding: S[6],
    }}>
      <ComicBox bg={C.paper} shadowSize="xl" p={S[8]} style={{ width: '420px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <BitMascot size={60} mood="wink" />
            <div>
              <div style={{ display: 'inline-block', marginBottom: S[1] }}>
                <Tag label="Welcome!" bg={C.yellow} />
              </div>
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS['3xl'],
                color: C.ink,
                lineHeight: 1.2,
              }}>
                Complete your profile
              </div>
            </div>
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <label style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS.sm,
              color: C.ink,
              letterSpacing: '0.05em',
            }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. RobotPeter"
              maxLength={20}
              style={{
                padding: `${S[2.5]} ${S[3]}`,
                fontSize: FS.md,
                border: `${BW.base} solid ${C.ink}`,
                borderRadius: '0.375rem',
                fontFamily: 'inherit',
                outline: 'none',
                background: C.paper,
              }}
            />
          </div>

          {/* Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <label style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS.sm,
              color: C.ink,
              letterSpacing: '0.05em',
            }}>
              I AM A...
            </label>
            <div style={{ display: 'flex', gap: S[3] }}>
              <ComicBox
                bg={vloga === 'ucenec' ? C.cyanLt : C.paper}
                shadowSize="sm"
                p={S[3]}
                onClick={() => setVloga('ucenec')}
                borderColor={vloga === 'ucenec' ? C.cyan : C.ink}
                style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: S[1] }}>🎓</div>
                <div style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: FS.sm,
                  color: C.ink,
                }}>
                  STUDENT
                </div>
              </ComicBox>

              <ComicBox
                bg={vloga === 'ucitelj' ? C.purpleLt : C.paper}
                shadowSize="sm"
                p={S[3]}
                onClick={() => setVloga('ucitelj')}
                borderColor={vloga === 'ucitelj' ? C.purple : C.ink}
                style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: S[1] }}>👨‍🏫</div>
                <div style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: FS.sm,
                  color: C.ink,
                }}>
                  PROFESSOR
                </div>
              </ComicBox>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: S[3],
              background: C.redLt,
              border: `${BW.base} solid ${C.red}`,
              borderRadius: '0.375rem',
              fontSize: FS.md,
              color: C.red,
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <ComicBtn
            onClick={handleSubmit}
            color={C.yellow}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Saving...' : 'Start Learning →'}
          </ComicBtn>

        </div>
      </ComicBox>
    </div>
  )
}