import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, S } from "../styles/tokens";
import { ComicBox } from "../components/ui/ComicBox";
import { ComicBtn } from "../components/ui/ComicBtn";
import { Tag } from "../components/ui/Tag";
import { BitMascot } from "../components/ui/BitMascot";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";


const API_URL = import.meta.env.VITE_API_URL;

export function RegisterPage() {
  const navigate = useNavigate();
  const { refreshProfil } = useAuth();
  const [username, setUsername] = useState("");
  const [vloga, setVloga] = useState<"ucenec" | "ucitelj">("ucenec");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      const response = await fetch(`${API_URL}/api/me/status`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const status = await response.json();
      if (!status.isNewUser) {
        navigate("/dashboard");
        return;
      }
      setChecking(false);
    };
    checkStatus();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Please enter a username!");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters!");
      return;
    }
    if (username.length > 20) {
      setError("Username must be less than 20 characters!");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setError("Username can only contain letters, numbers and underscores!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const response = await fetch(`${API_URL}/api/me/complete-registration`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, vloga }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Registration failed. Please try again.");
        return;
      }

      const result = await response.json();
      await refreshProfil();
      navigate(result.vloga === "ucitelj" ? "/dashboard" : "/questionnaire");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking)
    return (
      <div className="page-loader">
        <BitMascot size={80} mood="thinking" float />
      </div>
    );

  return (
    <div className="register-page">
      <ComicBox
        bg={C.paper}
        shadowSize="xl"
        p={S[8]}
        style={{ width: "420px" }}
      >
        <div className="register-card-inner">
          <div className="register-header">
            <div className="register-top">
              <div className="page-tag-wrapper">
                <Tag label="Welcome!" bg={C.yellow} />
              </div>
              <div className="register-title">Complete your profile!</div>
            </div>
            <BitMascot size={60} mood="wink" />
          </div>

          <div className="register-field-group">
            <label className="register-label">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="e.g. johndoe"
              maxLength={20}
              className="register-input"
            />
          </div>

          <div className="register-field-group">
            <label className="register-label">I AM A...</label>
            <div className="register-role-row">
              <ComicBox
                bg={vloga === "ucenec" ? C.cyanLt : C.paper}
                shadowSize="sm"
                shadowColor={vloga === "ucenec" ? C.cyan : C.ink}
                p={S[3]}
                onClick={() => setVloga("ucenec")}
                borderColor={vloga === "ucenec" ? C.cyan : C.ink}
                style={{ flex: 1, cursor: "pointer", textAlign: "center" }}
              >
                <div className="register-role-emoji">
                  {/* Graduation cap */}
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="18,6 34,14 18,22 2,14" fill={vloga === "ucenec" ? C.cyan : C.muted} stroke={C.ink} strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M8 17v8c0 0 4 5 10 5s10-5 10-5v-8" fill={vloga === "ucenec" ? C.cyanLt : C.paper} stroke={C.ink} strokeWidth="2" strokeLinejoin="round"/>
                    <line x1="34" y1="14" x2="34" y2="22" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="34" cy="23" r="2" fill={vloga === "ucenec" ? C.cyan : C.muted} stroke={C.ink} strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="register-role-label">STUDENT</div>
              </ComicBox>

              <ComicBox
                bg={vloga === "ucitelj" ? C.purpleLt : C.paper}
                shadowSize="sm"
                shadowColor={vloga === "ucitelj" ? C.purple : C.ink}
                p={S[3]}
                onClick={() => setVloga("ucitelj")}
                borderColor={vloga === "ucitelj" ? C.purple : C.ink}
                style={{ flex: 1, cursor: "pointer", textAlign: "center" }}
              >
                <div className="register-role-emoji">
                  {/* Chalkboard with person */}
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="28" height="18" rx="2" fill={vloga === "ucitelj" ? C.purple : C.muted} stroke={C.ink} strokeWidth="2"/>
                    <line x1="6" y1="10" x2="18" y2="10" stroke={C.paper} strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="15" x2="14" y2="15" stroke={C.paper} strokeWidth="2" strokeLinecap="round"/>
                    <line x1="15" y1="22" x2="15" y2="26" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>
                    <line x1="9" y1="26" x2="21" y2="26" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="27" cy="10" r="4" fill={vloga === "ucitelj" ? C.purpleLt : C.paper} stroke={C.ink} strokeWidth="2"/>
                    <path d="M21 27c0-3.3 2.7-6 6-6s6 2.7 6 6" fill={vloga === "ucitelj" ? C.purpleLt : C.paper} stroke={C.ink} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="register-role-label">TEACHER</div>
              </ComicBox>
            </div>
          </div>

          {error && <div className="register-error">{error}</div>}

          <ComicBtn
            onClick={handleSubmit}
            color={C.yellow}
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Saving..." : (
              <>
                {vloga === "ucitelj" ? "Start Teaching" : "Start Learning"}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </ComicBtn>
        </div>
      </ComicBox>
    </div>
  );
}
