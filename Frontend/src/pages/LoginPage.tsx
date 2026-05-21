import { Navigate } from "react-router-dom"
import { C, S } from "../styles/tokens"
import { BitMascot } from "../components/ui/BitMascot"
import { SpeechBubble } from "../components/ui/SpeechBubble"
import { ComicBox } from "../components/ui/ComicBox"
import { ComicBtn } from "../components/ui/ComicBtn"
import { Tag } from "../components/ui/Tag"
import { useAuth } from "../context/AuthContext"


export function LoginPage() {
  const { signInWithGoogle, session } = useAuth()

  if (session) return <Navigate to="/dashboard" />

  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <div className="login-mascot-row">
          <BitMascot size={130} mood="happy" float />
          <SpeechBubble color={C.yellow} side="left">
            <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", color: C.ink }}>BEEP!</span><br />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: C.ink }}>Ready to learn smarter?</span>
            </div>
          </SpeechBubble>
        </div>

        <div className="login-powered-by">
          <span className="login-powered-by-text">POWERED BY AI</span>
        </div>

        <div className="login-headline">
          <div className="login-headline-learn">LEARN</div>
          <div className="login-headline-smarter">SMARTER!</div>
        </div>

        <p className="login-subtitle">
          AI personalises every lesson to <strong>your learning style</strong>.
          BIT helps you stay on track. 
        </p>
      </div>

      {/* RIGHT */}
      <ComicBox bg={C.paper} shadowSize="xl" p={S[8]} style={{ width: '420px', flex: '0 0 420px' }}>
        <div className="login-card-inner">
          <div className="page-tag-wrapper">
            <Tag label="Sign In" bg={C.yellow} />
          </div>

          <div>
            <div className="login-welcome-title">Welcome back!</div>
            <p className="login-welcome-subtitle">Use your university Google account.</p>
          </div>

          <ComicBtn
            onClick={signInWithGoogle}
            color={C.paper}
            style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: S[4] }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </ComicBtn>

          <div className="login-divider" />

          <ComicBox
            bg={C.yellow}
            shadowSize="base"
            p={S[3]}
            style={{ width: '100%' }}
          >
            <div className="login-new-here-title">NEW HERE?</div>
            <p className="login-new-here-text">
              Take a short quiz so we can match content to your brain.
            </p>
          </ComicBox>
        </div>
      </ComicBox>
    </div>
  )
}