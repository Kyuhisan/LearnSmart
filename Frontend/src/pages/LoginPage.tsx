import { useNavigate, Navigate } from "react-router-dom";
import { C, S, FS, BW } from "../styles/tokens";
import { BitMascot } from "../components/ui/BitMascot";
import { SpeechBubble } from "../components/ui/SpeechBubble";
import { ComicBox } from "../components/ui/ComicBox";
import { ComicBtn } from "../components/ui/ComicBtn";
import { Tag } from "../components/ui/Tag";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signInWithGoogle, session } = useAuth();
  const navigate = useNavigate();

  if (session) return <Navigate to="/dashboard" />;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: C.cream,
        backgroundImage: `radial-gradient(${C.divider} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: S[6],
        gap: S[16],
        flexWrap: "wrap",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: S[6],
          maxWidth: "480px",
          flex: "1 1 340px",
        }}
      >
        {/* Robot + speech bubble */}
        <div style={{ display: "flex", alignItems: "center", gap: S[5] }}>
          <BitMascot size={130} mood="happy" float />
          <SpeechBubble color={C.yellow} side="left">
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS.base,
                color: C.ink,
                lineHeight: 1.4,
              }}
            >
              BEEP! 🤖
              <br />
              Ready to learn smarter?
            </div>
          </SpeechBubble>
        </div>

        {/* Powered by AI */}
        <div style={{ display: "flex", alignItems: "center", gap: S[2] }}>
          <span style={{ color: C.red, fontSize: FS.base, fontWeight: 800 }}>
            ✦
          </span>
          <span
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS.sm,
              color: C.red,
              letterSpacing: "0.08em",
            }}
          >
            POWERED BY AI
          </span>
          <span style={{ color: C.red, fontSize: FS.base, fontWeight: 800 }}>
            ✦
          </span>
        </div>

        {/* Main headline */}
        <div style={{ textAlign: "left", width: "100%" }}>
          <div
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS["8xl"],
              color: C.ink,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            LEARN
          </div>
          <div
            style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS["8xl"],
              color: C.ink,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              background: C.yellow,
              border: `${BW.thick} solid ${C.ink}`,
              boxShadow: `6px 6px 0 ${C.ink}`,
              padding: `${S[1]} ${S[3]}`,
              display: "inline-block",
              marginTop: S[1],
              transform: "rotate(1.5deg)",
              transformOrigin: "left center",
            }}
          >
            SMARTER!
          </div>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: FS.base,
            color: C.muted,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: "380px",
            textAlign: "left",
            width: "100%",
          }}
        >
          AI personalises every lesson to <strong>your learning style</strong>.
          BIT helps you stay on track. 🤖
        </p>
      </div>

      {/* RIGHT — sign in card */}
      <ComicBox
        bg={C.paper}
        shadowSize="xl"
        p={S[8]}
        style={{ width: "420px", flex: "0 0 420px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: S[5],
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "inline-block" }}>
            <Tag label="Sign In" bg={C.yellow} />
          </div>

          <div>
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS["4xl"],
                color: C.ink,
                lineHeight: 1.2,
                textAlign: "left",
              }}
            >
              Welcome back!
            </div>
            <p
              style={{
                fontSize: FS.lg,
                color: C.muted,
                margin: `${S[1.5]} 0 0`,
                textAlign: "left",
              }}
            >
              Use your university Google account.
            </p>
          </div>

          <ComicBtn
            onClick={signInWithGoogle}
            color={C.paper}
            style={{
              width: "100%",
              justifyContent: "flex-start",
              fontSize: FS.md,
              paddingLeft: S[4],
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </ComicBtn>

          <div
            style={{ height: BW.base, background: C.divider, width: "100%" }}
          />

          <ComicBox
            bg={C.yellowLt}
            shadowSize="sm"
            p={S[3]}
            onClick={() => navigate("/questionnaire")}
            style={{ width: "100%" }}
          >
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS.sm,
                color: C.ink,
                marginBottom: S[1],
                letterSpacing: "0.05em",
                textAlign: "left",
              }}
            >
              NEW HERE?
            </div>
            <p
              style={{
                fontSize: FS.base,
                color: C.ink,
                margin: 0,
                lineHeight: 1.5,
                textAlign: "left",
              }}
            >
              Take a 5-question quiz so we can match content to your brain. ✨
            </p>
          </ComicBox>
        </div>
      </ComicBox>
    </div>
  );
}
