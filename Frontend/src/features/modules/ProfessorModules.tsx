import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "../../components/ui/Tag";
import { ComicBox } from "../../components/ui/ComicBox";
import { ComicBtn } from "../../components/ui/ComicBtn";
import { Topbar } from "../../components/ui/Topbar";
import { C, S, FS, BW, R, mkShadow } from "../../styles/tokens";
import { PROF_CATEGORIES } from "./mockData";
import { getModuliUcitelj, izbrisiModul, objaviModul } from "./moduleApi";
import { useAuth } from "../../context/AuthContext";
import { EditModuleModal } from "./EditModuleModal";
import { NewModuleModal } from "./NewModulModal";
import "../../styles/moduleLibrary.css";

const COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red]

const MOCK_CATEGORIES = ['CORE', 'MATH', 'HANDS-ON', 'ADVANCED', 'THEORY']
const CATEGORY_COLORS: Record<string, string> = {
  CORE:       C.cyanLt,
  ADVANCED:   C.purpleLt,
  THEORY:     C.greenLt,
  MATH:       C.yellowLt,
  'HANDS-ON': C.pinkLt,
}
const STAR_LABELS: Record<number, string> = { 1:'★', 2:'★★', 3:'★★★', 4:'★★★★', 5:'★★★★★' }

function getCategory(index: number): string {
  return MOCK_CATEGORIES[index % MOCK_CATEGORIES.length]
}

interface BackendModul {
  id: string;
  naziv: string;
  opis: string;
  kodaVpisa: string;
  jeObjavljen: boolean;
  tezavnost: number;
  ustvarjenOb: string;
  uciteljImePriimek: string;
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
  mod, color, index, onIzbrisi, onObjavi, onUredi,
}: {
  mod: BackendModul;
  color: string;
  index: number;
  onIzbrisi: (e: React.MouseEvent, id: string) => void;
  onObjavi: (e: React.MouseEvent, id: string) => void;
  onUredi: (e: React.MouseEvent, mod: BackendModul) => void;
}) {
  const navigate = useNavigate();
  const category = getCategory(index);

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
        <div style={{ display: 'flex', gap: S[1.5], alignSelf: 'flex-start' }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          <Tag label={category} bg={CATEGORY_COLORS[category]} />
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
        {!mod.jeObjavljen && (
          <div onClick={(e) => onObjavi(e, mod.id)}><ComicBtn sm color={C.green}>PUBLISH</ComicBtn></div>
        )}
        <div onClick={(e) => onUredi(e, mod)}><ComicBtn sm color={C.yellow}>EDIT</ComicBtn></div>
        <div onClick={(e) => onIzbrisi(e, mod.id)}><ComicBtn sm color={C.red}>DELETE</ComicBtn></div>
      </div>
    </ComicBox>
  );
}

function ProfModuleListRow({
  mod, color, index, onIzbrisi, onObjavi, onUredi,
}: {
  mod: BackendModul;
  color: string;
  index: number;
  onIzbrisi: (e: React.MouseEvent, id: string) => void;
  onObjavi: (e: React.MouseEvent, id: string) => void;
  onUredi: (e: React.MouseEvent, mod: BackendModul) => void;
}) {
  const navigate = useNavigate();
  const category = getCategory(index);

  return (
    <ComicBox p={0} onClick={() => navigate(`/modules/${mod.id}`)} hoverBg={C.yellowLt}
      style={{ display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>

      {/* Left color stripe */}
      <div style={{ width: 8, background: color, flexShrink: 0 }} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: S[4], padding: `${S[3]} ${S[4]}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink, lineHeight: 1.3 }}>
            {mod.naziv}
          </div>
          <div style={{ fontSize: FS.sm, color: C.muted, marginTop: S[0.5] }}>Prof. {mod.uciteljImePriimek}</div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[1.5] }}>
          <Tag label={STAR_LABELS[mod.tezavnost] ?? '★'} bg={C.yellowLt} />
          <Tag label={category} bg={CATEGORY_COLORS[category]} />
          <Tag label={mod.jeObjavljen ? '● LIVE' : '○ DRAFT'} bg={mod.jeObjavljen ? C.green : C.mutedLt} />
        </div>

        {/* Divider */}
        <div style={{ width: BW.base, alignSelf: 'stretch', background: C.divider }} />

        {/* Actions — fixed width matching 3-button layout */}
        <div style={{ display: 'flex', gap: S[2] }} onClick={(e) => e.stopPropagation()}>
          <div style={{ visibility: mod.jeObjavljen ? 'hidden' : 'visible' }} onClick={(e) => !mod.jeObjavljen && onObjavi(e, mod.id)}>
            <ComicBtn sm color={C.green}>PUBLISH</ComicBtn>
          </div>
          <div onClick={(e) => onUredi(e, mod)}><ComicBtn sm color={C.yellow}>EDIT</ComicBtn></div>
          <div onClick={(e) => onIzbrisi(e, mod.id)}><ComicBtn sm color={C.red}>DELETE</ComicBtn></div>
        </div>
      </div>
    </ComicBox>
  );
}

export function ProfessorModules() {
  const { session } = useAuth();
  const [moduli, setModuli] = useState<BackendModul[]>([]);
  const [newModul, setNewModul] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [editMod, setEditMod] = useState<BackendModul | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const nalozi = useCallback(async () => {
    if (!session?.access_token) return;
    const data = await getModuliUcitelj(session.access_token);
    setModuli(data);
    setInitialized(true);
  }, [session]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    nalozi();
  }, [nalozi]);

  const getCategoryCount = (cat: string): number => {
    if (cat === 'ALL') return moduli.length
    return moduli.filter((_, i) => getCategory(i) === cat).length
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
    await objaviModul(session!.access_token, id);
    nalozi();
  };

  const handleUredi = (e: React.MouseEvent, mod: BackendModul) => {
    e.stopPropagation();
    setEditMod(mod);
  };

  const filtered = moduli.filter((m, i) => {
    const matchesSearch = m.naziv.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'ALL' || getCategory(i) === activeCategory
    return matchesSearch && matchesCategory
  });

  const published = moduli.filter((m) => m.jeObjavljen).length;
  const draft = moduli.filter((m) => !m.jeObjavljen).length;

  if (!initialized) return <div>Nalagam...</div>;

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
            {PROF_CATEGORIES.map((cat) => (
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

      <div className={view === 'grid' ? 'modules-grid' : 'modules-list'}>
        {filtered.length === 0 ? (
          <div className="modules-empty">
            NO MODULES YET —{" "}
            <span className="modules-empty-link" onClick={() => setNewModul(true)}>
              CREATE NEW MODULE
            </span>
          </div>
        ) : (
          filtered.map((mod, i) =>
            view === 'grid'
              ? <ProfModuleCard key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} index={i} onIzbrisi={handleIzbrisi} onObjavi={handleObjavi} onUredi={handleUredi} />
              : <ProfModuleListRow key={mod.id} mod={mod} color={COLORS[i % COLORS.length]} index={i} onIzbrisi={handleIzbrisi} onObjavi={handleObjavi} onUredi={handleUredi} />
          )
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
