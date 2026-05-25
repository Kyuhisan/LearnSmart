import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "../../components/ui/Tag";
import { Bar } from "../../components/ui/Bar";
import { ComicBox } from "../../components/ui/ComicBox";
import { ComicBtn } from "../../components/ui/ComicBtn";
import { Topbar } from "../../components/ui/Topbar";
import { C, S, FS, BW, R, mkShadow } from "../../styles/tokens";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { getModuliUcitelj, getModuliJavni, izbrisiModul, objaviModul, umaknjiModul } from "./moduleApi";
import { useAuth } from "../../context/AuthContext";
import { EditModuleModal } from "./EditModuleModal";
import { NewModuleModal } from "./NewModulModal";
import { Panel } from "../../components/ui/Panel";
import "../../styles/moduleLibrary.css";

const COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red]

import { ALL_TAGS, TAG_COLORS } from './moduleTags'
const STAR_LABELS: Record<number, string> = { 1:'★', 2:'★★', 3:'★★★', 4:'★★★★', 5:'★★★★★' }

interface BackendModul {
  id: string;
  naziv: string;
  opis: string;
  kodaVpisa: string;
  jeObjavljen: boolean;
  tezavnost: number;
  ustvarjenOb: string;
  uciteljImePriimek: string;
  kategorije: string[] | null;
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">⚠ CONFIRM</span>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <p style={{ fontFamily: "inherit", fontSize: "0.875rem", margin: 0 }}>
          {message}
        </p>
        <div className="modal-actions">
          <ComicBtn color={C.muted} onClick={onCancel}>CANCEL</ComicBtn>
          <ComicBtn color={C.red} onClick={onConfirm}>DELETE</ComicBtn>
        </div>
      </div>
    </div>
  );
}

function ProfModuleCard({
  mod, color, onIzbrisi, onObjavi, onUmakni, onUredi,
}: {
  mod: BackendModul;
  color: string;
  onIzbrisi: (e: React.MouseEvent, id: string) => void;
  onObjavi: (e: React.MouseEvent, id: string) => void;
  onUmakni: (e: React.MouseEvent, id: string) => void;
  onUredi: (e: React.MouseEvent, mod: BackendModul) => void;
}) {
  const navigate = useNavigate();
  const tags = mod.kategorije ?? [];

  return (
    <ComicBox p={0} onClick={() => navigate(`/modules/${mod.id}`)} hoverBg={C.yellowLt}
      style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Status stamp — inside ComicBox so it moves with hover translate */}
      <div style={{
        position: 'absolute', top: -10, right: -10, zIndex: 1,
        background: mod.jeObjavljen ? C.green : C.mutedLt,
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: R.sm,
        padding: `${S[1]} ${S[3]}`,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: FS.sm,
        color: C.ink,
        boxShadow: mkShadow('base'),
        transform: 'rotate(8deg)',
      }}>
        {mod.jeObjavljen ? 'LIVE' : 'DRAFT'}
      </div>

      {/* Colored header — explicit top-radius since no overflow:hidden */}
      <div style={{
        background: color,
        borderBottom: `1px solid ${C.ink}`,
        borderTopLeftRadius: R.sm, borderTopRightRadius: R.sm,
        padding: S[3], paddingTop: S[5],
        display: 'flex', flexDirection: 'column', gap: S[2],
      }}>
        {/* Stars + category tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1.5], alignSelf: 'flex-start' }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          {tags.map(t => <Tag key={t} label={t} bg={TAG_COLORS[t] ?? C.mutedLt} />)}
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink, lineHeight: 1.25, wordBreak: 'break-word' }}>
          {mod.naziv}
        </div>

        {/* Meta */}
        <div style={{ fontSize: FS.sm, color: C.ink, opacity: 0.7 }}>
          Prof. {mod.uciteljImePriimek}
        </div>
      </div>

      {/* White footer — actions, right-aligned */}
      <div style={{
        background: C.paper,
        borderBottomLeftRadius: R.sm, borderBottomRightRadius: R.sm,
        padding: `${S[2.5]} ${S[3]}`,
        display: 'flex', justifyContent: 'flex-end', gap: S[2], flexShrink: 0,
      }} onClick={(e) => e.stopPropagation()}>
        {mod.jeObjavljen
          ? <div onClick={(e) => onUmakni(e, mod.id)}><ComicBtn sm color={C.orange}>UNPUBLISH</ComicBtn></div>
          : <div onClick={(e) => onObjavi(e, mod.id)}><ComicBtn sm color={C.green}>PUBLISH</ComicBtn></div>
        }
        <div onClick={(e) => onUredi(e, mod)}><ComicBtn sm color={C.yellow}>EDIT</ComicBtn></div>
        <div onClick={(e) => onIzbrisi(e, mod.id)}><ComicBtn sm color={C.red}>DELETE</ComicBtn></div>
      </div>
    </ComicBox>
  );
}

function ProfModuleListRow({
  mod, color, onIzbrisi, onObjavi, onUmakni, onUredi,
}: {
  mod: BackendModul;
  color: string;
  onIzbrisi: (e: React.MouseEvent, id: string) => void;
  onObjavi: (e: React.MouseEvent, id: string) => void;
  onUmakni: (e: React.MouseEvent, id: string) => void;
  onUredi: (e: React.MouseEvent, mod: BackendModul) => void;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const tags = mod.kategorije ?? [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/modules/${mod.id}`)}
      style={{ cursor: 'pointer', transform: hovered ? 'translate(-2px, -4px) scale(1.01)' : 'none', transition: 'transform 0.1s ease' }}
    >
      <ComicBox p={0} shadowSize={hovered ? 'lg' : 'base'}
        style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* Left color stripe */}
        <div style={{ width: 8, background: color, flexShrink: 0, borderTopLeftRadius: R.sm, borderBottomLeftRadius: R.sm }} />

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[4], padding: `${S[3]} ${S[4]}`, background: hovered ? C.yellowLt : C.paper, transition: 'background 0.12s ease', borderTopRightRadius: R.sm, borderBottomRightRadius: R.sm }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink, lineHeight: 1.3 }}>
            {mod.naziv}
          </div>
          <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>Prof. {mod.uciteljImePriimek}</div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: S[1.5] }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          {tags.map(t => <Tag key={t} label={t} bg={TAG_COLORS[t] ?? C.mutedLt} />)}
          <Tag label={mod.jeObjavljen ? '● LIVE' : '○ DRAFT'} bg={mod.jeObjavljen ? C.green : C.mutedLt} />
        </div>

        {/* Divider */}
        <div style={{ width: BW.base, alignSelf: 'stretch', background: C.divider }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: S[2] }} onClick={(e) => e.stopPropagation()}>
          {mod.jeObjavljen
            ? <div onClick={(e) => onUmakni(e, mod.id)}><ComicBtn sm color={C.orange}>UNPUBLISH</ComicBtn></div>
            : <div onClick={(e) => onObjavi(e, mod.id)}><ComicBtn sm color={C.green}>PUBLISH</ComicBtn></div>
          }
          <div onClick={(e) => onUredi(e, mod)}><ComicBtn sm color={C.yellow}>EDIT</ComicBtn></div>
          <div onClick={(e) => onIzbrisi(e, mod.id)}><ComicBtn sm color={C.red}>DELETE</ComicBtn></div>
        </div>
        </div>
      </ComicBox>
    </div>
  );
}

function SkeletonCard({ color }: { color: string }) {
  return (
    <div className="skeleton-pulse"><ComicBox p={0} style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: color, opacity: 0.45, borderBottom: `1px solid ${C.ink}`, borderTopLeftRadius: R.sm, borderTopRightRadius: R.sm, padding: S[3], paddingTop: S[5], display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <div style={{ display: 'flex', gap: S[1.5] }}>
          <div style={{ width: 32, height: 18, background: C.ink, opacity: 0.2, borderRadius: R.sm }} />
          <div style={{ width: 56, height: 18, background: C.ink, opacity: 0.2, borderRadius: R.sm }} />
        </div>
        <div style={{ height: 22, background: C.ink, opacity: 0.15, borderRadius: R.sm, width: '75%' }} />
        <div style={{ height: 22, background: C.ink, opacity: 0.15, borderRadius: R.sm, width: '50%' }} />
        <div style={{ height: 13, background: C.ink, opacity: 0.1, borderRadius: R.sm, width: '55%' }} />
      </div>
      <div style={{ background: C.paper, borderBottomLeftRadius: R.sm, borderBottomRightRadius: R.sm, padding: `${S[2.5]} ${S[3]}`, display: 'flex', justifyContent: 'flex-end', gap: S[2] }}>
        <div style={{ width: 70, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
        <div style={{ width: 42, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
        <div style={{ width: 58, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
      </div>
    </ComicBox></div>
  )
}

function SkeletonRow({ color }: { color: string }) {
  return (
    <div className="skeleton-pulse"><ComicBox p={0} style={{ display: 'flex', alignItems: 'stretch' }}>
      <div style={{ width: 8, background: color, opacity: 0.45, flexShrink: 0, borderTopLeftRadius: R.sm, borderBottomLeftRadius: R.sm }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[4], padding: `${S[3]} ${S[4]}`, borderTopRightRadius: R.sm, borderBottomRightRadius: R.sm }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, background: C.mutedLt, borderRadius: R.sm, width: '55%' }} />
          <div style={{ height: 12, background: C.divider, borderRadius: R.sm, width: '35%', marginTop: S[0.5] }} />
        </div>
        <div style={{ display: 'flex', gap: S[1.5] }}>
          <div style={{ width: 36, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 56, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 48, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', background: C.divider }} />
        <div style={{ display: 'flex', gap: S[2] }}>
          <div style={{ width: 70, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 42, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
          <div style={{ width: 58, height: 26, background: C.mutedLt, borderRadius: R.sm }} />
        </div>
      </div>
    </ComicBox></div>
  )
}

function isNew(ustvarjenOb: string): boolean {
  return (Date.now() - new Date(ustvarjenOb).getTime()) / (1000 * 60 * 60 * 24) <= 30
}

function PublicModuleCard({ mod, color, isOwn }: { mod: BackendModul; color: string; isOwn: boolean }) {
  const navigate = useNavigate()
  const tags = mod.kategorije ?? []
  const showNew = isNew(mod.ustvarjenOb)

  return (
    <ComicBox p={0} onClick={() => navigate(`/modules/${mod.id}`)} hoverBg={C.yellowLt}
      style={{ display: 'flex', flexDirection: 'column' }}>

      {(isOwn || showNew) && (
        <div style={{
          position: 'absolute', top: -10, right: -10, zIndex: 1,
          background: isOwn ? C.yellow : C.red,
          border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm,
          padding: `${S[1]} ${S[3]}`, fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.sm, color: isOwn ? C.ink : C.paper,
          boxShadow: mkShadow('base'), transform: 'rotate(8deg)',
        }}>
          {isOwn ? 'YOURS' : 'NEW!'}
        </div>
      )}

      <div style={{
        background: color, borderBottom: `1px solid ${C.ink}`,
        borderTopLeftRadius: R.sm, borderTopRightRadius: R.sm,
        padding: S[3], paddingTop: S[5], display: 'flex', flexDirection: 'column', gap: S[2],
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1.5], alignSelf: 'flex-start' }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          {tags.map(t => <Tag key={t} label={t} bg={TAG_COLORS[t] ?? C.mutedLt} />)}
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink, lineHeight: 1.25, wordBreak: 'break-word' }}>
          {mod.naziv}
        </div>
        <div style={{ fontSize: FS.sm, color: C.ink, opacity: 0.7 }}>
          Prof. {mod.uciteljImePriimek}
        </div>
      </div>

      <div style={{
        background: C.paper, borderBottomLeftRadius: R.sm, borderBottomRightRadius: R.sm,
        padding: `${S[2.5]} ${S[3]}`, display: 'flex', flexDirection: 'column', gap: S[1.5], flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>NOT STARTED</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink }}>0%</span>
        </div>
        <Bar value={0} color={C.mutedLt} />
      </div>
    </ComicBox>
  )
}

function PublicModuleListRow({ mod, color, isOwn }: { mod: BackendModul; color: string; isOwn: boolean }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const tags = mod.kategorije ?? []

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/modules/${mod.id}`)}
      style={{ cursor: 'pointer', transform: hovered ? 'translate(-2px, -4px) scale(1.01)' : 'none', transition: 'transform 0.1s ease' }}
    >
      <ComicBox p={0} shadowSize={hovered ? 'lg' : 'base'} style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 8, background: isOwn ? C.yellow : color, flexShrink: 0, borderTopLeftRadius: R.sm, borderBottomLeftRadius: R.sm }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[4], padding: `${S[3]} ${S[4]}`, background: hovered ? C.yellowLt : (isOwn ? C.yellowLt : C.paper), transition: 'background 0.12s ease', borderTopRightRadius: R.sm, borderBottomRightRadius: R.sm }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink, lineHeight: 1.3 }}>{mod.naziv}</div>
            <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>Prof. {mod.uciteljImePriimek}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: S[1.5] }}>
            {isOwn && <Tag label="YOURS" bg={C.yellow} />}
            <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
            {tags.map(t => <Tag key={t} label={t} bg={TAG_COLORS[t] ?? C.mutedLt} />)}
          </div>
          <div style={{ width: BW.base, alignSelf: 'stretch', background: C.divider }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], minWidth: 140 }}>
            <div style={{ flex: 1 }}><Bar value={0} color={C.mutedLt} /></div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: FS.xs, color: C.ink, flexShrink: 0 }}>0%</span>
          </div>
        </div>
      </ComicBox>
    </div>
  )
}

export function ProfessorModules() {
  const { session } = useAuth();
  const isTablet = useBreakpoint() === 'tablet';
  const [moduli, setModuli] = useState<BackendModul[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModul, setNewModul] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editMod, setEditMod] = useState<BackendModul | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const [publModuli, setPublModuli] = useState<BackendModul[]>([]);
  const [loadingPubl, setLoadingPubl] = useState(true);

  const nalozi = useCallback(async () => {
    if (!session?.access_token) return;
    const data = await getModuliUcitelj(session.access_token);
    setModuli(data);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    nalozi();
  }, [nalozi]);

  const naloziPubl = useCallback(async () => {
    const data = await getModuliJavni();
    setPublModuli(data);
    setLoadingPubl(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    naloziPubl();
  }, [naloziPubl]);

  const getCategoryCount = (cat: string): number => {
    if (cat === 'ALL') return moduli.length + publModuli.length
    return [...moduli, ...publModuli].filter(m => m.kategorije?.includes(cat)).length
  }

  const handleIzbrisi = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmId(id);
  };

  const handleConfirmIzbrisi = async () => {
    if (!confirmId) return;
    await izbrisiModul(session!.access_token, confirmId);
    setConfirmId(null);
    nalozi();
  };

  const handleObjavi = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await objaviModul(session!.access_token, id);
    } finally {
      nalozi();
      naloziPubl();
    }
  };

  const handleUmakni = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await umaknjiModul(session!.access_token, id);
    } finally {
      nalozi();
      naloziPubl();
    }
  };

  const handleUredi = (e: React.MouseEvent, mod: BackendModul) => {
    e.stopPropagation();
    setEditMod(mod);
  };

  const filtered = moduli.filter(m => {
    const matchesSearch = m.naziv.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'ALL' || m.kategorije?.includes(activeCategory)
    return matchesSearch && matchesCategory
  });

  const published = moduli.filter((m) => m.jeObjavljen).length;
  const draft = moduli.filter((m) => !m.jeObjavljen).length;

  const ownIds = new Set(moduli.map(m => m.id));

  const filteredPubl = publModuli.filter(m => {
    const matchesSearch = m.naziv.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'ALL' || m.kategorije?.includes(activeCategory)
    return matchesSearch && matchesCategory
  });

  return (
    <div className="dashboard-main">
      <Topbar
        title="MODULES — PROF"
        subtitle={`${published} published · ${draft} drafts`}
        actions={
          <ComicBtn color={C.green} onClick={() => setNewModul(true)}>
            + NEW MODULE
          </ComicBtn>
        }
      />

      <div className="modules-toolbar">
        <div className="modules-search-row">
          <div className="modules-search-wrap">
            <input
              className="modules-search"
              placeholder="Search your modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="modules-view-toggle">
            <button className={`modules-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>▪▪</button>
            <button className={`modules-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>≡</button>
          </div>
        </div>
        <div className="modules-filter-row">
          <div className="modules-filters">
            {['ALL', ...ALL_TAGS].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`modules-filter-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat} <span className="modules-filter-count">{getCategoryCount(cat)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.lg, color: C.ink, marginBottom: S[2] }}>
        YOUR MODULES
      </div>

      {view === 'grid' ? (
        <div className={`modules-grid${isTablet ? ' modules-grid--2col' : ''}`}>
          {loading ? (
            COLORS.map((color, i) => <SkeletonCard key={i} color={color} />)
          ) : filtered.length === 0 ? (
            <div className="modules-empty">
              NO MODULES YET —{" "}
              <span className="modules-empty-link" onClick={() => setNewModul(true)}>
                CREATE NEW MODULE
              </span>
            </div>
          ) : (
            filtered.map((mod, i) => (
              <ProfModuleCard key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} onIzbrisi={handleIzbrisi} onObjavi={handleObjavi} onUmakni={handleUmakni} onUredi={handleUredi} />
            ))
          )}
        </div>
      ) : (
        <Panel title={loading ? '— MODULES' : `${filtered.length} MODULES`} accent={C.yellow} p={S[3]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {loading ? (
              COLORS.map((color, i) => <SkeletonRow key={i} color={color} />)
            ) : filtered.length === 0 ? (
              <div className="modules-empty">
                NO MODULES YET —{" "}
                <span className="modules-empty-link" onClick={() => setNewModul(true)}>
                  CREATE NEW MODULE
                </span>
              </div>
            ) : (
              filtered.map((mod, i) => (
                <ProfModuleListRow key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} onIzbrisi={handleIzbrisi} onObjavi={handleObjavi} onUmakni={handleUmakni} onUredi={handleUredi} />
              ))
            )}
          </div>
        </Panel>
      )}

      {/* All Published Modules — student view */}
      <div style={{ marginTop: S[6] }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.lg, color: C.ink, marginBottom: S[3] }}>
          OTHER PUBLISHED MODULES
        </div>

        {view === 'grid' ? (
          <div className={`modules-grid${isTablet ? ' modules-grid--2col' : ''}`}>
            {loadingPubl
              ? COLORS.map((color, i) => <SkeletonCard key={i} color={color} />)
              : filteredPubl.map((mod, i) => (
                  <PublicModuleCard key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} isOwn={ownIds.has(mod.id)} />
                ))
            }
          </div>
        ) : (
          <Panel title={loadingPubl ? '— MODULES' : `${filteredPubl.length} MODULES`} accent={C.cyan} p={S[3]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {loadingPubl
                ? COLORS.map((color, i) => <SkeletonRow key={i} color={color} />)
                : filteredPubl.map((mod, i) => (
                    <PublicModuleListRow key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} isOwn={ownIds.has(mod.id)} />
                  ))
              }
            </div>
          </Panel>
        )}
      </div>

      {editMod && (
        <EditModuleModal
          mod={editMod}
          onClose={() => setEditMod(null)}
          onSave={nalozi}
        />
      )}

      {newModul && (
        <NewModuleModal onClose={() => setNewModul(false)} onSave={nalozi} />
      )}

      {confirmId && (
        <ConfirmDialog
          message="Are you sure you want to delete this module?"
          onConfirm={handleConfirmIzbrisi}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
