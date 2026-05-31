import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "../../components/ui/Bar";
import { Tag } from "../../components/ui/Tag";
import { Topbar } from "../../components/ui/Topbar";
import { ComicBox } from "../../components/ui/ComicBox";
import { ComicBtn } from "../../components/ui/ComicBtn";
import { C, S, FS, BW, R, mkShadow } from "../../styles/tokens";
import { getModuliJavni, getMojiVpisi, vpisZKodo, odjavaIzModula } from "./moduleApi";
import { getModuleCompletion, type ModuleCompletion } from "../quiz/quizStudentApi";
import { ALL_TAGS, TAG_COLORS } from "./moduleTags";
import { Panel } from "../../components/ui/Panel";
import { JoinModuleModal } from "./JoinModuleModal";
import { useAuth } from "../../context/AuthContext";
import "../../styles/moduleLibrary.css";

const COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red];

const STAR_LABELS: Record<number, string> = {
  1: "★",
  2: "★★",
  3: "★★★",
  4: "★★★★",
  5: "★★★★★",
};

function isNew(ustvarjenOb: string): boolean {
  return (
    (Date.now() - new Date(ustvarjenOb).getTime()) / (1000 * 60 * 60 * 24) <= 1
  );
}

function formatCas(sekunde: number): string {
  if (sekunde < 60) return `${sekunde}s`;
  const min = Math.floor(sekunde / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

interface BackendModul {
  id: string;
  naziv: string;
  opis: string;
  jeObjavljen: boolean;
  tezavnost: number;
  ustvarjenOb: string;
  uciteljImePriimek: string;
  kategorije: string[] | null;
  kodaVpisa?: string;
}

interface VpisInfo {
  id: string;
  predmetId: string;
  casNaModulu: number;
}

function ModuleCard({
  mod,
  color,
  isVpisan,
  casNaModulu,
  completedQuizzes,
  totalQuizzes,
  onJoin,
  onLeave,
}: {
  mod: BackendModul;
  color: string;
  isVpisan: boolean;
  casNaModulu?: number;
  completedQuizzes?: number;
  totalQuizzes?: number;
  onJoin?: () => Promise<void>;
  onLeave?: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const tags = mod.kategorije ?? [];
  const showNew = isNew(mod.ustvarjenOb);

  return (
    <ComicBox
      p={0}
      onClick={() => navigate(`/modules/${mod.id}`)}
      hoverBg={C.yellowLt}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {showNew && (
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            zIndex: 1,
            background: C.red,
            border: `${BW.base} solid ${C.ink}`,
            borderRadius: R.sm,
            padding: `${S[1]} ${S[3]}`,
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: FS.sm,
            color: C.paper,
            boxShadow: mkShadow("base"),
            transform: "rotate(8deg)",
          }}
        >
          NEW!
        </div>
      )}

      <div
        style={{
          background: color,
          borderBottom: `1px solid ${C.ink}`,
          borderTopLeftRadius: R.sm,
          borderTopRightRadius: R.sm,
          padding: S[3],
          paddingTop: S[5],
          display: "flex",
          flexDirection: "column",
          gap: S[2],
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tag label={STAR_LABELS[mod.tezavnost] ?? "★"} bg={C.yellowLt} />
          {isVpisan && <Tag label="✓ ENROLLED" bg={C.greenLt} />}
        </div>

        <div
          style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: FS.xl,
            color: C.ink,
            lineHeight: 1.25,
            wordBreak: "break-word",
          }}
        >
          {mod.naziv}
        </div>

        <div style={{ fontSize: FS.sm, color: C.ink, opacity: 0.7 }}>
          Prof. {mod.uciteljImePriimek}
        </div>

        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: S[1.5] }}>
            {tags.map((t) => (
              <Tag key={t} label={t} bg={TAG_COLORS[t] ?? C.mutedLt} />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          background: C.paper,
          borderBottomLeftRadius: R.sm,
          borderBottomRightRadius: R.sm,
          padding: `${S[2.5]} ${S[3]}`,
          display: "flex",
          flexDirection: "column",
          gap: S[1.5],
          flexShrink: 0,
        }}
      >
        {(() => {
          const total = totalQuizzes ?? 0
          const done = completedQuizzes ?? 0
          const pct = total > 0 ? Math.round(done / total * 100) : 0
          return (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>
                  {isVpisan ? (total > 0 ? `${done}/${total} QUIZZES` : "ENROLLED") : "NOT STARTED"}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink }}>
                  {isVpisan && total > 0 ? `${pct}%` : isVpisan ? "" : "0%"}
                </span>
              </div>
              <Bar value={isVpisan ? pct : 0} color={isVpisan ? C.green : C.mutedLt} />
            </>
          )
        })()}
        {(isVpisan || onJoin || onLeave) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} onClick={e => e.stopPropagation()}>
            {isVpisan && casNaModulu !== undefined
              ? <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.muted }}>⏱ {formatCas(casNaModulu)} spent</span>
              : <span />
            }
            <div style={{ display: "flex", gap: S[2] }}>
              {onJoin && (
                <ComicBtn sm color={C.green} onClick={async () => { setJoining(true); await onJoin(); setJoining(false); }}>
                  {joining ? 'JOINING...' : 'JOIN'}
                </ComicBtn>
              )}
              {onLeave && (
                <ComicBtn sm color={C.redLt} onClick={async () => { setLeaving(true); await onLeave(); setLeaving(false); }}>
                  {leaving ? 'LEAVING...' : 'LEAVE'}
                </ComicBtn>
              )}
            </div>
          </div>
        )}
      </div>
    </ComicBox>
  );
}

function ModuleListRow({
  mod,
  color,
  isVpisan,
  casNaModulu,
  completedQuizzes,
  totalQuizzes,
  onJoin,
  onLeave,
}: {
  mod: BackendModul;
  color: string;
  isVpisan: boolean;
  casNaModulu?: number;
  completedQuizzes?: number;
  totalQuizzes?: number;
  onJoin?: () => Promise<void>;
  onLeave?: () => Promise<void>;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const tags = mod.kategorije ?? [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/modules/${mod.id}`)}
      style={{
        cursor: "pointer",
        transform: hovered ? "translate(-2px, -4px) scale(1.01)" : "none",
        transition: "transform 0.1s ease",
      }}
    >
      <ComicBox
        p={0}
        shadowSize={hovered ? "lg" : "base"}
        style={{ display: "flex", alignItems: "stretch" }}
      >
        <div
          style={{
            width: 8,
            background: color,
            flexShrink: 0,
            borderTopLeftRadius: R.sm,
            borderBottomLeftRadius: R.sm,
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: S[4],
            padding: `${S[3]} ${S[4]}`,
            background: hovered ? C.yellowLt : C.paper,
            transition: "background 0.12s ease",
            borderTopRightRadius: R.sm,
            borderBottomRightRadius: R.sm,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS.md,
                color: C.ink,
                lineHeight: 1.3,
              }}
            >
              {mod.naziv}
            </div>
            <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>
              Prof. {mod.uciteljImePriimek}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: S[1.5],
            }}
          >
            <Tag label={STAR_LABELS[mod.tezavnost] ?? "★"} bg={C.yellowLt} />
            {isVpisan && <Tag label="✓" bg={C.greenLt} />}
            {isVpisan && casNaModulu !== undefined && (
              <Tag label={`⏱ ${formatCas(casNaModulu)}`} bg={C.cyanLt} />
            )}
            {tags.map((t) => (
              <Tag key={t} label={t} bg={TAG_COLORS[t] ?? C.mutedLt} />
            ))}
          </div>

          <div
            style={{
              width: BW.base,
              alignSelf: "stretch",
              background: C.divider,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: S[2], minWidth: 140 }}>
            {(() => {
              const total = totalQuizzes ?? 0
              const done = completedQuizzes ?? 0
              const pct = total > 0 ? Math.round(done / total * 100) : 0
              return (
                <>
                  <div style={{ flex: 1 }}>
                    <Bar value={isVpisan ? pct : 0} color={isVpisan ? C.green : C.mutedLt} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink, flexShrink: 0 }}>
                    {isVpisan && total > 0 ? `${done}/${total}` : isVpisan ? "—" : "0%"}
                  </span>
                </>
              )
            })()}
          </div>

          {(onJoin || onLeave) && (
            <>
              <div style={{ width: BW.base, alignSelf: "stretch", background: C.divider }} />
              <div style={{ display: 'flex', gap: S[2] }} onClick={e => e.stopPropagation()}>
                {onJoin && (
                  <ComicBtn sm color={C.green} onClick={async () => { setJoining(true); await onJoin(); setJoining(false); }}>
                    {joining ? 'JOINING...' : 'JOIN'}
                  </ComicBtn>
                )}
                {onLeave && (
                  <ComicBtn sm color={C.redLt} onClick={async () => { setLeaving(true); await onLeave(); setLeaving(false); }}>
                    {leaving ? 'LEAVING...' : 'LEAVE'}
                  </ComicBtn>
                )}
              </div>
            </>
          )}
        </div>
      </ComicBox>
    </div>
  );
}

const STUDENT_CATEGORIES = ["ALL", ...ALL_TAGS];

function SkeletonCard({ color }: { color: string }) {
  return (
    <div className="skeleton-pulse">
      <ComicBox p={0} style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            background: color,
            opacity: 0.45,
            borderBottom: `1px solid ${C.ink}`,
            borderTopLeftRadius: R.sm,
            borderTopRightRadius: R.sm,
            padding: S[3],
            paddingTop: S[5],
            display: "flex",
            flexDirection: "column",
            gap: S[2],
          }}
        >
          <div style={{ display: "flex", gap: S[1.5] }}>
            <div
              style={{
                width: 32,
                height: 18,
                background: C.ink,
                opacity: 0.2,
                borderRadius: R.sm,
              }}
            />
            <div
              style={{
                width: 56,
                height: 18,
                background: C.ink,
                opacity: 0.2,
                borderRadius: R.sm,
              }}
            />
          </div>
          <div
            style={{
              height: 22,
              background: C.ink,
              opacity: 0.15,
              borderRadius: R.sm,
              width: "75%",
            }}
          />
          <div
            style={{
              height: 22,
              background: C.ink,
              opacity: 0.15,
              borderRadius: R.sm,
              width: "50%",
            }}
          />
          <div
            style={{
              height: 13,
              background: C.ink,
              opacity: 0.1,
              borderRadius: R.sm,
              width: "55%",
            }}
          />
        </div>
        <div
          style={{
            background: C.paper,
            borderBottomLeftRadius: R.sm,
            borderBottomRightRadius: R.sm,
            padding: `${S[2.5]} ${S[3]}`,
            display: "flex",
            flexDirection: "column",
            gap: S[1.5],
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                width: 80,
                height: 12,
                background: C.mutedLt,
                borderRadius: R.sm,
              }}
            />
            <div
              style={{
                width: 28,
                height: 12,
                background: C.mutedLt,
                borderRadius: R.sm,
              }}
            />
          </div>
          <div
            style={{ height: 6, background: C.mutedLt, borderRadius: R.sm }}
          />
        </div>
      </ComicBox>
    </div>
  );
}

function SkeletonRow({ color }: { color: string }) {
  return (
    <div className="skeleton-pulse">
      <ComicBox p={0} style={{ display: "flex", alignItems: "stretch" }}>
        <div
          style={{
            width: 8,
            background: color,
            opacity: 0.45,
            flexShrink: 0,
            borderTopLeftRadius: R.sm,
            borderBottomLeftRadius: R.sm,
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: S[4],
            padding: `${S[3]} ${S[4]}`,
            borderTopRightRadius: R.sm,
            borderBottomRightRadius: R.sm,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 16,
                background: C.mutedLt,
                borderRadius: R.sm,
                width: "55%",
              }}
            />
            <div
              style={{
                height: 12,
                background: C.divider,
                borderRadius: R.sm,
                width: "35%",
                marginTop: S[0.5],
              }}
            />
          </div>
          <div style={{ display: "flex", gap: S[1.5] }}>
            <div
              style={{
                width: 36,
                height: 20,
                background: C.mutedLt,
                borderRadius: R.sm,
              }}
            />
            <div
              style={{
                width: 56,
                height: 20,
                background: C.mutedLt,
                borderRadius: R.sm,
              }}
            />
          </div>
          <div
            style={{ width: 1, alignSelf: "stretch", background: C.divider }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: S[2],
              minWidth: 140,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                background: C.mutedLt,
                borderRadius: R.sm,
              }}
            />
            <div
              style={{
                width: 24,
                height: 12,
                background: C.mutedLt,
                borderRadius: R.sm,
              }}
            />
          </div>
        </div>
      </ComicBox>
    </div>
  );
}

export function StudentModules() {
  const { session } = useAuth();
  const [moduli, setModuli] = useState<BackendModul[]>([]);
  const [mojiVpisi, setMojiVpisi] = useState<VpisInfo[]>([]);
  const [completion, setCompletion] = useState<Record<string, ModuleCompletion>>({});
  const [search, setSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [showJoin, setShowJoin] = useState(false);

  const nalozi = useCallback(async () => {
    const data = await getModuliJavni();
    setModuli(data);
    if (session?.access_token) {
      const [vpisi, comp] = await Promise.all([
        getMojiVpisi(session.access_token),
        getModuleCompletion(session.access_token),
      ]);
      setMojiVpisi(vpisi);
      setCompletion(comp);
    }
    setInitialized(true);
  }, [session]);

  useEffect(() => {
     // eslint-disable-next-line react-hooks/set-state-in-effect
    nalozi();
  }, [nalozi]);

  const isVpisan = (modulId: string) =>
    mojiVpisi.some((v) => v.predmetId === modulId);

  const getCas = (modulId: string): number =>
    mojiVpisi.find((v) => v.predmetId === modulId)?.casNaModulu ?? 0;

  const getComp = (modulId: string) => completion[modulId] ?? { total: 0, completed: 0 };

  const handleJoin = async (mod: BackendModul) => {
    if (!session?.access_token || !mod.kodaVpisa) return
    await vpisZKodo(session.access_token, mod.kodaVpisa)
    await nalozi()
  }

  const handleLeave = async (mod: BackendModul) => {
    if (!session?.access_token) return
    await odjavaIzModula(session.access_token, mod.id)
    await nalozi()
  }

  const getCategoryCount = (cat: string): number => {
    if (cat === "ALL") return moduli.length;
    return moduli.filter((m) => m.kategorije?.includes(cat)).length;
  };

  const baseFiltered = moduli.filter((m) => {
    const matchesSearch = m.naziv.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "ALL" || m.kategorije?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const mojiModuli = baseFiltered.filter((m) => isVpisan(m.id));
  const ostaliModuli = baseFiltered.filter((m) => !isVpisan(m.id));

  return (
    <div className="dashboard-main">
      <Topbar
        title="MODULES"
        subtitle={`${moduli.length} modules · ${mojiVpisi.length} enrolled`}
        actions={
          <ComicBtn color={C.green} onClick={() => setShowJoin(true)}>
            JOIN MODULE WITH CODE
          </ComicBtn>
        }
      />

      <div className="modules-toolbar">
        <div className="modules-search-row">
          <div className="modules-search-wrap">
            <input
              className="modules-search"
              placeholder="Search modules, topics, professors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="modules-view-toggle">
            <button
              className={`modules-view-btn ${view === "grid" ? "active" : ""}`}
              onClick={() => setView("grid")}
            >
              ▪▪
            </button>
            <button
              className={`modules-view-btn ${view === "list" ? "active" : ""}`}
              onClick={() => setView("list")}
            >
              ≡
            </button>
          </div>
        </div>
        <div className="modules-filter-row">
          <div className="modules-filters">
            {STUDENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`modules-filter-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}{" "}
                <span className="modules-filter-count">
                  {getCategoryCount(cat)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: S[6] }}>
          {/* My Modules */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], fontWeight: 800, color: C.ink, marginBottom: S[3] }}>
              <Tag label={!initialized ? "—" : String(mojiModuli.length)} bg={C.greenLt} fontSize={FS.lg} />
              MY MODULES
            </div>
            <div className="modules-grid">
              {!initialized
                ? COLORS.map((color, i) => <SkeletonCard key={i} color={color} />)
                : mojiModuli.length === 0
                  ? (
                    <div style={{
                      gridColumn: "1 / -1",
                      padding: `${S[6]} 0`,
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: FS.sm,
                      color: C.muted,
                      textAlign: "center",
                    }}>
                      You haven't enrolled in any modules yet.
                    </div>
                  )
                  : mojiModuli.map((mod, i) => (
                    <ModuleCard
                      key={mod.id}
                      mod={mod}
                      color={COLORS[i % COLORS.length]}
                      isVpisan
                      casNaModulu={getCas(mod.id)}
                      completedQuizzes={getComp(mod.id).completed}
                      totalQuizzes={getComp(mod.id).total}
                      onLeave={() => handleLeave(mod)}
                    />
                  ))}
            </div>
          </div>

          {/* All Other Modules */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: "'Archivo Black', sans-serif", fontSize: FS['2xl'], fontWeight: 800, color: C.ink, marginBottom: S[3] }}>
              <Tag label={!initialized ? "—" : String(ostaliModuli.length)} bg={C.yellowLt} fontSize={FS.lg} />
              ALL MODULES
            </div>
            <div className="modules-grid">
              {!initialized
                ? COLORS.map((color, i) => <SkeletonCard key={i} color={color} />)
                : ostaliModuli.length === 0
                  ? (
                    <div style={{
                      gridColumn: "1 / -1",
                      padding: `${S[6]} 0`,
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: FS.sm,
                      color: C.muted,
                      textAlign: "center",
                    }}>
                      No other modules available.
                    </div>
                  )
                  : ostaliModuli.map((mod, i) => (
                    <ModuleCard
                      key={mod.id}
                      mod={mod}
                      color={COLORS[i % COLORS.length]}
                      isVpisan={false}
                      casNaModulu={undefined}
                      completedQuizzes={0}
                      totalQuizzes={0}
                      onJoin={() => handleJoin(mod)}
                    />
                  ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: S[4] }}>
          <Panel
            title={!initialized ? "— MY MODULES" : `${mojiModuli.length} MY MODULES`}
            accent={C.green}
            p={S[3]}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: S[2] }}>
              {!initialized
                ? COLORS.map((color, i) => <SkeletonRow key={i} color={color} />)
                : mojiModuli.length === 0
                  ? (
                    <div style={{
                      padding: `${S[4]} 0`,
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: FS.sm,
                      color: C.muted,
                      textAlign: "center",
                    }}>
                      You haven't enrolled in any modules yet.
                    </div>
                  )
                  : mojiModuli.map((mod, i) => (
                    <ModuleListRow
                      key={mod.id}
                      mod={mod}
                      color={COLORS[i % COLORS.length]}
                      isVpisan
                      casNaModulu={getCas(mod.id)}
                      completedQuizzes={getComp(mod.id).completed}
                      totalQuizzes={getComp(mod.id).total}
                      onLeave={() => handleLeave(mod)}
                    />
                  ))}
            </div>
          </Panel>

          <Panel
            title={!initialized ? "— ALL MODULES" : `${ostaliModuli.length} ALL MODULES`}
            accent={C.yellow}
            p={S[3]}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: S[2] }}>
              {!initialized
                ? COLORS.map((color, i) => <SkeletonRow key={i} color={color} />)
                : ostaliModuli.length === 0
                  ? (
                    <div style={{
                      padding: `${S[4]} 0`,
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: FS.sm,
                      color: C.muted,
                      textAlign: "center",
                    }}>
                      No other modules available.
                    </div>
                  )
                  : ostaliModuli.map((mod, i) => (
                    <ModuleListRow
                      key={mod.id}
                      mod={mod}
                      color={COLORS[i % COLORS.length]}
                      isVpisan={false}
                      casNaModulu={undefined}
                      completedQuizzes={0}
                      totalQuizzes={0}
                      onJoin={() => handleJoin(mod)}
                    />
                  ))}
            </div>
          </Panel>
        </div>
      )}

      {showJoin && (
        <JoinModuleModal onClose={() => setShowJoin(false)} onSave={nalozi} />
      )}
    </div>
  );
}
