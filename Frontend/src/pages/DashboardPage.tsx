import { useAuth } from '../context/AuthContext'
import { C } from '../styles/tokens'
import { BitMascot } from '../components/ui/BitMascot'
import { SpeechBubble } from '../components/ui/SpeechBubble'
import { Sidebar } from '../components/ui/Sidebar'
import "../styles/pages.css"

export function DashboardPage() {
  const { profil } = useAuth()

  if (!profil) return (
    <div className="page-loader">
      <BitMascot size={80} mood="thinking" float />
    </div>
  )

  const isTeacher = profil.vloga === 'ucitelj'

  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil.vloga} username={profil.username} />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-header-title">
            {isTeacher ? 'HOME BASE — PROF' : 'HOME BASE'}
          </div>
          <div className="dashboard-header-sub">
            {isTeacher ? '0 quizzes need approval' : 'Welcome back!'}
          </div>
        </div>

        <div className="dashboard-bit-row">
          <BitMascot size={60} mood="happy" />
          <SpeechBubble color={C.yellow} side="left">
            <div className="dashboard-bit-title">BIT SAYS:</div>
            <div className="dashboard-bit-text">
              {isTeacher
                ? `Hi ${profil.username}! Welcome to your dashboard. 🎓`
                : `Hey ${profil.username}! Ready to learn something new today? 🚀`
              }
            </div>
          </SpeechBubble>
        </div>

        <div className="dashboard-placeholder">
          {isTeacher ? '📊 Teacher dashboard coming soon...' : '📚 Student dashboard coming soon...'}
        </div>
      </div>
    </div>
  )
}