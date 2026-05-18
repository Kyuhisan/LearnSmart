import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "../../components/ui/Tag";
import { ComicBtn } from "../../components/ui/ComicBtn";
import { Topbar } from "../../components/ui/Topbar";
import { C, S } from "../../styles/tokens";
import { PROF_CATEGORIES } from "./mockData";
import { getModuliUcitelj, izbrisiModul, objaviModul } from "./moduleApi";
import { useAuth } from "../../context/AuthContext";
import { EditModuleModal } from "./EditModuleModal";
import { NewModuleModal } from "./NewModulModal";
import "../../styles/moduleLibrary.css";

const COLORS = [C.yellow, C.purple, C.cyan, C.green, C.pink, C.orange, C.red];

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
  mod, color, onIzbrisi, onObjavi, onUredi,
}: {
  mod: BackendModul;
  color: string;
  onIzbrisi: (e: React.MouseEvent, id: string) => void;
  onObjavi: (e: React.MouseEvent, id: string) => void;
  onUredi: (e: React.MouseEvent, mod: BackendModul) => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="module-card" style={{ background: color }}
      onClick={() => navigate(`/modules/${mod.id}`)}>
      <div className="module-card-top">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: S[2] }}>
          <Tag label={`⭐ ${mod.tezavnost ?? "-"}`} bg="rgba(255,255,255,0.5)" />
          <Tag
            label={mod.jeObjavljen ? "● LIVE" : "○ DRAFT"}
            bg={mod.jeObjavljen ? C.green : C.muted}
          />
        </div>
        <div className="module-card-title">{mod.naziv}</div>
        <div className="module-card-meta">
          {mod.opis ?? ""} <br />
          {mod.uciteljImePriimek}
        </div>
      </div>
      <div className="module-card-bottom" style={{ display: "flex", flexDirection: "column", gap: S[2] }}>
        <div style={{ display: "flex", alignItems: "center", gap: S[2] }}>
          <div onClick={(e) => onUredi(e, mod)}>
            <ComicBtn sm color={C.yellow}>EDIT</ComicBtn>
          </div>
          {!mod.jeObjavljen && (
            <div onClick={(e) => onObjavi(e, mod.id)}>
              <ComicBtn sm color={C.green}>PUBLISH</ComicBtn>
            </div>
          )}
          <div onClick={(e) => onIzbrisi(e, mod.id)}>
            <ComicBtn sm color={C.red}>DELETE</ComicBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfessorModules() {
  const { session } = useAuth();
  const [moduli, setModuli] = useState<BackendModul[]>([]);
  const [newModul, setNewModul] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMod, setEditMod] = useState<BackendModul | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const nalozi = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    const data = await getModuliUcitelj(session.access_token);
    setModuli(data);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    nalozi();
  }, [nalozi]);

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

  const filtered = moduli.filter((m) =>
    m.naziv.toLowerCase().includes(search.toLowerCase())
  );

  const published = moduli.filter((m) => m.jeObjavljen).length;
  const draft = moduli.filter((m) => !m.jeObjavljen).length;

  if (loading) return <div>Nalagam...</div>;

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
        </div>
        <div className="modules-filter-row">
          <div className="modules-filters">
            {PROF_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`modules-filter-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="modules-grid">
        {filtered.length === 0 ? (
          <div className="modules-empty">
            NO MODULES YET —{" "}
            <span className="modules-empty-link" onClick={() => setNewModul(true)}>
              CREATE NEW MODULE
            </span>
          </div>
        ) : (
          filtered.map((mod, i) => (
            <ProfModuleCard
              key={mod.id}
              mod={mod}
              color={COLORS[i % COLORS.length]}
              onIzbrisi={handleIzbrisi}
              onObjavi={handleObjavi}
              onUredi={handleUredi}
            />
          ))
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