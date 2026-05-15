import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { C, S } from "../styles/tokens";
import { ComicBox } from "../components/ui/ComicBox";
import { ComicBtn } from "../components/ui/ComicBtn";
import { Tag } from "../components/ui/Tag";
import { BitMascot } from "../components/ui/BitMascot";
import { supabase } from "../lib/supabaseClient";
import "../styles/pages.css";

const API_URL = import.meta.env.VITE_API_URL;

export function RegisterPage() {
  const navigate = useNavigate();
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
  }, []);

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
      navigate(result.vloga === "ucitelj" ? "/dashboard" : "/questionnaire");
    } catch (e) {
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
            <BitMascot size={60} mood="wink" />
            <div className="register-top">
              <div className="register-tag-wrapper">
                <Tag label="Welcome!" bg={C.yellow} />
              </div>
              <div className="register-title">Complete your profile</div>
            </div>
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
                p={S[3]}
                onClick={() => setVloga("ucenec")}
                borderColor={vloga === "ucenec" ? C.cyan : C.ink}
                style={{ flex: 1, cursor: "pointer", textAlign: "center" }}
              >
                <div className="register-role-emoji">🎓</div>
                <div className="register-role-label">STUDENT</div>
              </ComicBox>

              <ComicBox
                bg={vloga === "ucitelj" ? C.purpleLt : C.paper}
                shadowSize="sm"
                p={S[3]}
                onClick={() => setVloga("ucitelj")}
                borderColor={vloga === "ucitelj" ? C.purple : C.ink}
                style={{ flex: 1, cursor: "pointer", textAlign: "center" }}
              >
                <div className="register-role-emoji">👨‍🏫</div>
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
            {loading ? "Saving..." : "Start Learning →"}
          </ComicBtn>
        </div>
      </ComicBox>
    </div>
  );
}
