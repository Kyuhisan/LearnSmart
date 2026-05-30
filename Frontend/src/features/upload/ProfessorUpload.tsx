import { useState, useEffect, useRef, useCallback } from 'react'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { IconBox } from '../../components/ui/IconBox'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { getModuliUcitelj } from '../modules/moduleApi'
import { ACCEPTED_FILE_TYPES } from './mockData'

const API = import.meta.env.VITE_API_URL

interface Modul { id: string; naziv: string }

interface UploadedFileReal {
  id: string
  imeDatoteke: string
  tip: string
  velikostBytes: number
  processingStatus: string
  ustvarjenOb: string
  predmetId: string
  predmetNaziv: string
}

async function getMojeUploade(token: string): Promise<UploadedFileReal[]> {
  const res = await fetch(`${API}/content/moje`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

async function deleteUpload(fileId: string, token: string): Promise<void> {
  const res = await fetch(`${API}/content/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    throw new Error("Delete failed")
  }
}

type StagedFileType = 'pdf' | 'video' | 'audio' | 'image' | 'doc'

const TYPE_COLOR: Record<StagedFileType, string> = {
  pdf:   C.redLt,
  video: C.purpleLt,
  audio: C.greenLt,
  image: C.cyanLt,
  doc:   C.yellowLt,
}

const TYPE_LABEL: Record<StagedFileType, string> = {
  pdf: 'PDF', video: 'VIDEO', audio: 'AUDIO', image: 'IMG', doc: 'DOC',
}


function getFileType(file: File): StagedFileType {
  if (file.type === 'application/pdf') return 'pdf'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  if (file.type.startsWith('image/')) return 'image'
  return 'doc'
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ModuleSelect({ value, options, onChange, loading }: {
  value: Modul | null
  options: Modul[]
  onChange: (v: Modul) => void
  loading: boolean
}) {
  const [open, setOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const label = loading ? 'Loading modules…' : value ? value.naziv : options.length === 0 ? 'No modules yet' : 'Select a module'

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => { if (!loading && options.length > 0) setOpen(o => !o) }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: S[2], padding: `${S[2.5]} ${S[3]}`,
          border: `${BW.base} solid ${C.ink}`, borderRadius: R.base,
          background: C.paper, cursor: loading || options.length === 0 ? 'not-allowed' : 'pointer',
          fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm,
          color: loading || !value ? C.muted : C.ink, boxShadow: mkShadow(), userSelect: 'none',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        {!loading && options.length > 0 && (
          <span style={{ fontSize: FS.xs, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: `calc(100% + ${S[1]})`, left: 0, right: 0, zIndex: 50,
          background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.base,
          boxShadow: mkShadow('lg'), overflow: 'hidden',
        }}>
          {options.map((opt, i) => (
            <div
              key={opt.id}
              onClick={() => { onChange(opt); setOpen(false) }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: `${S[2.5]} ${S[3]}`, cursor: 'pointer',
                fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink,
                background: opt.id === value?.id ? C.yellow : hoveredIndex === i ? C.yellowLt : 'transparent',
                borderBottom: i < options.length - 1 ? `1.5px solid ${C.divider}` : 'none',
              }}
            >
              {opt.naziv}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StagedFileRow({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isMobile = useBreakpoint() === 'mobile'
  const type = getFileType(file)

  return (
    <ComicBox bg={C.cream} p={S[2]} style={{ display: 'flex', alignItems: 'center', gap: S[3], minWidth: 0 }}>
      {!isMobile && (
        <div style={{
          width: 36, height: 36, background: TYPE_COLOR[type],
          border: `${BW.base} solid ${C.ink}`, borderRadius: R.base,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <IconBox size={16} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file.name}
        </div>
        <div style={{ fontSize: FS.xs, color: C.muted, marginTop: 2 }}>
          {TYPE_LABEL[type]} · {formatSize(file.size)}
        </div>
      </div>
      <Tag label={TYPE_LABEL[type]} bg={TYPE_COLOR[type]} />
      <div onClick={e => { e.stopPropagation(); onRemove() }}>
        <ComicBtn sm color={C.redLt} style={{ width: S[8], height: S[8], padding: 0, justifyContent: 'center', fontSize: FS.md, lineHeight: 1 }}>✕</ComicBtn>
      </div>
    </ComicBox>
  )
}

function tipToStagedType(tip: string): StagedFileType {
  switch (tip.toUpperCase()) {
    case 'PDF':   return 'pdf'
    case 'VIDEO': return 'video'
    case 'AUDIO': return 'audio'
    case 'IMG':   return 'image'
    default:      return 'doc'
  }
}

const PROCESSING_STATUS: Record<string, { label: string; bg: string }> = {
  pending:  { label: 'PROCESSING', bg: C.yellow },
  done:     { label: 'READY',      bg: C.green  },
  failed:   { label: 'ERROR',      bg: C.red    },
}

function RecentFileRow({ file, onDelete }: { 
  file: UploadedFileReal 
  onDelete: (id: string) => void 
}) {
  const isMobile = useBreakpoint() === 'mobile'
  const type = tipToStagedType(file.tip)
  const status = PROCESSING_STATUS[file.processingStatus] ?? { label: file.processingStatus.toUpperCase(), bg: C.mutedLt }
  const date = new Date(file.ustvarjenOb).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <ComicBox bg={C.cream} p={S[2]} style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
        {!isMobile && (
          <div style={{
            width: 36, height: 36, background: TYPE_COLOR[type],
            border: `${BW.base} solid ${C.ink}`, borderRadius: R.base,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <IconBox size={16} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {file.imeDatoteke}
          </div>
          <div style={{ fontSize: FS.xs, color: C.muted, marginTop: 2 }}>
            {file.predmetNaziv} · {formatSize(file.velikostBytes)} · {date}
          </div>
        </div>
        {!isMobile && (
          <>
            <Tag label={status.label} bg={status.bg} />

            <ComicBtn
              sm
              color = {C.red}
              onClick = {() => onDelete(file.id)}
            >
              DELETE
            </ComicBtn>
          </>
        )}
      </div>
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tag label={status.label} bg={status.bg} />

            <ComicBtn
              sm
              color = {C.red}
              style = {{}}
              onClick = {() => onDelete(file.id)}
            >
              DELETE
            </ComicBtn>

        </div>
      )}
    </ComicBox>
  )
}

function DropZonePanel({ dragOver, setDragOver, stagedFiles, onFiles, onRemove }: {
  dragOver: boolean
  setDragOver: (v: boolean) => void
  stagedFiles: File[]
  onFiles: (files: File[]) => void
  onRemove: (index: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) onFiles(files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onFiles(files)
    e.target.value = ''
  }

  return (
    <Panel
      title="DROP FILES HERE"
      accent={C.yellow}
      action={<Tag label={`${ACCEPTED_FILE_TYPES.length} TYPES`} bg={C.yellowLt} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_FILE_TYPES.join(',')}
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `${BW.base} dashed ${dragOver ? C.yellow : C.muted}`,
            borderRadius: R.base, padding: S[8],
            background: dragOver ? C.yellowLt : 'transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3],
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
        >
          <IconBox size={48} />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xl, color: C.ink, textAlign: 'center' }}>
            DRAG & DROP FILES HERE
          </div>
          <div style={{ fontSize: FS.sm, color: C.muted, textAlign: 'center' }}>
            or click to browse from your computer
          </div>
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', justifyContent: 'center', marginTop: S[1] }}>
            {ACCEPTED_FILE_TYPES.map(ext => (
              <Tag key={ext} label={ext.toUpperCase()} bg={C.cream} />
            ))}
          </div>
        </div>

        {stagedFiles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {stagedFiles.map((file, i) => (
              <StagedFileRow key={`${file.name}-${i}`} file={file} onRemove={() => onRemove(i)} />
            ))}
          </div>
        )}
      </div>
    </Panel>
  )
}

function AssignModulePanel({ selectedModule, setSelectedModule, modules, loadingModules, stagedFiles, onUpload, uploading }: {
  selectedModule: Modul | null
  setSelectedModule: (v: Modul) => void
  modules: Modul[]
  loadingModules: boolean
  stagedFiles: File[]
  onUpload: () => void
  uploading: boolean
}) {
  const canUpload = !!selectedModule && stagedFiles.length > 0 && !uploading

  return (
    <Panel title="ASSIGN TO MODULE" accent={C.cyan} action={<Tag label="SELECT" bg={C.cyanLt} />} overflow="visible">
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <ModuleSelect value={selectedModule} options={modules} onChange={setSelectedModule} loading={loadingModules} />
        <ComicBtn color={C.yellow} style={{ width: '100%', justifyContent: 'center' }} disabled={!canUpload} onClick={onUpload}>
          {uploading ? 'UPLOADING…' : stagedFiles.length > 0 ? `UPLOAD ${stagedFiles.length} FILE${stagedFiles.length > 1 ? 'S' : ''}` : 'UPLOAD FILES'}
        </ComicBtn>
      </div>
    </Panel>
  )
}

function RecentUploadsPanel({ files, loading, onDelete }: { 
  files: UploadedFileReal[]
  loading: boolean
  onDelete: (id: string) => void 
}) {
  return (
    <Panel
      title="RECENT UPLOADS"
      accent={C.purple}
      action={<Tag label={loading ? '…' : `${files.length} FILES`} bg={C.purpleLt} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        {loading
          ? [C.purple, C.cyan, C.green].map((color, i) => (
              <div key={i} className="skeleton-pulse">
                <ComicBox bg={C.cream} p={S[2]} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                  <div style={{ width: 36, height: 36, background: color, opacity: 0.3, border: `${BW.base} solid ${C.ink}`, borderRadius: R.base, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 14, background: C.mutedLt, borderRadius: R.sm, width: '65%' }} />
                    <div style={{ height: 11, background: C.divider, borderRadius: R.sm, width: '45%', marginTop: S[1] }} />
                  </div>
                  <div style={{ width: 60, height: 20, background: C.mutedLt, borderRadius: R.sm }} />
                </ComicBox>
              </div>
            ))
          : files.length === 0
          ? <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted, textAlign: 'center', padding: S[4] }}>NO UPLOADS YET</div>
          : files.map(file => <RecentFileRow key={file.id} file={file} onDelete = {onDelete} />)
        }
      </div>
    </Panel>
  )
}

export function ProfessorUpload() {
  const { session } = useAuth()
  const [selectedModule, setSelectedModule] = useState<Modul | null>(null)
  const [modules, setModules] = useState<Modul[]>([])
  const [loadingModules, setLoadingModules] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [recentFiles, setRecentFiles] = useState<UploadedFileReal[]>([])
  const [loadingRecent, setLoadingRecent] = useState(true)
  const isTablet = useBreakpoint() === 'tablet'

  const fetchRecent = useCallback(async () => {
    if (!session?.access_token) return
    const data = await getMojeUploade(session.access_token)
    setRecentFiles(data)
    setLoadingRecent(false)
  }, [session])

  useEffect(() => {
    if (!session?.access_token) return
    getModuliUcitelj(session.access_token).then((data: Modul[]) => {
      setModules(data)
      if (data.length > 0) setSelectedModule(data[0])
      setLoadingModules(false)
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecent()
  }, [session, fetchRecent])

  const handleFiles = useCallback((incoming: File[]) => {
    setStagedFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name))
      return [...prev, ...incoming.filter(f => !existingNames.has(f.name))]
    })
  }, [])

  const handleRemove = useCallback((index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpload = async () => {
    if (!selectedModule || stagedFiles.length === 0 || !session?.access_token) return
    setUploading(true)
    try {
      const formData = new FormData()
      stagedFiles.forEach(f => formData.append('file', f))
      formData.append('predmetId', selectedModule.id)
      const res = await fetch(`${API}/content/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      })
      const result = await res.json()
      if (result.success) {
        setStagedFiles([])
        fetchRecent()
      } else {
        alert(result.error ?? 'Upload failed')
      }
    } catch {
      alert('Upload failed — check your connection')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!session) {
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this file?')

    if (!confirmed) {
      return
    }

    try {
      await deleteUpload(fileId, session.access_token)
      await fetchRecent()
    } catch {
      alert('Delete failed.')
    }
  }

  return (
    <div className="dashboard-main">
      <Topbar
        title="UPLOAD"
        subtitle={loadingRecent ? 'Loading…' : `${recentFiles.length} files uploaded · add PDFs, videos or audio to your modules`}
      />

      {isTablet ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <AssignModulePanel
            selectedModule={selectedModule} setSelectedModule={setSelectedModule}
            modules={modules} loadingModules={loadingModules}
            stagedFiles={stagedFiles} onUpload={handleUpload} uploading={uploading}
          />
          <DropZonePanel
            dragOver={dragOver} setDragOver={setDragOver}
            stagedFiles={stagedFiles} onFiles={handleFiles} onRemove={handleRemove}
          />
          <RecentUploadsPanel files={recentFiles} loading={loadingRecent} onDelete = {handleDelete} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: S[4], alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], minWidth: 0 }}>
            <DropZonePanel
              dragOver={dragOver} setDragOver={setDragOver}
              stagedFiles={stagedFiles} onFiles={handleFiles} onRemove={handleRemove}
            />
            <AssignModulePanel
              selectedModule={selectedModule} setSelectedModule={setSelectedModule}
              modules={modules} loadingModules={loadingModules}
              stagedFiles={stagedFiles} onUpload={handleUpload} uploading={uploading}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <RecentUploadsPanel files={recentFiles} loading={loadingRecent} onDelete = {handleDelete} />
          </div>
        </div>
      )}
    </div>
  )
}
