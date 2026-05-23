import { useState } from 'react'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { IconBox } from '../../components/ui/IconBox'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { UPLOADED_FILES, UPLOAD_MODULE_OPTIONS, ACCEPTED_FILE_TYPES, type UploadedFile } from './mockData'

const TYPE_COLOR: Record<UploadedFile['type'], string> = {
  pdf:   C.redLt,
  video: C.purpleLt,
  audio: C.greenLt,
  image: C.cyanLt,
  doc:   C.yellowLt,
}

const STATUS_CONFIG: Record<UploadedFile['status'], { label: string; bg: string }> = {
  ready:      { label: 'READY',      bg: C.green  },
  processing: { label: 'PROCESSING', bg: C.yellow },
  error:      { label: 'ERROR',      bg: C.red    },
}

function ModuleSelect({ value, options, onChange }: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: S[2],
          padding: `${S[2.5]} ${S[3]}`,
          border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.base,
          background: C.paper,
          cursor: 'pointer',
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.sm,
          color: C.ink,
          boxShadow: mkShadow(),
          userSelect: 'none',
        }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
        <span style={{ fontSize: FS.xs, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: `calc(100% + ${S[1]})`,
          left: 0,
          right: 0,
          zIndex: 50,
          background: C.paper,
          border: `${BW.base} solid ${C.ink}`,
          borderRadius: R.base,
          boxShadow: mkShadow('lg'),
          overflow: 'hidden',
        }}>
          {options.map((opt, i) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: `${S[2.5]} ${S[3]}`,
                cursor: 'pointer',
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS.sm,
                color: C.ink,
                background: opt === value ? C.yellow : hoveredIndex === i ? C.yellowLt : 'transparent',
                borderBottom: i < options.length - 1 ? `1.5px solid ${C.divider}` : 'none',
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FileRow({ file }: { file: UploadedFile }) {
  const status = STATUS_CONFIG[file.status]
  return (
    <ComicBox bg={C.cream} p={S[2]} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
      <div style={{
        width: 36, height: 36,
        background: TYPE_COLOR[file.type],
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: R.base,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <IconBox size={16} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: FS.sm,
          color: C.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {file.name}
        </div>
        <div style={{ fontSize: FS.xs, color: C.muted, marginTop: 2 }}>
          {file.module} · {file.size} · {file.uploadedAt}
        </div>
      </div>

      <Tag label={status.label} bg={status.bg} />

      <div onClick={e => e.stopPropagation()}>
        <ComicBtn sm color={C.redLt} style={{ width: S[8], height: S[8], padding: 0, justifyContent: 'center', fontSize: FS.md, lineHeight: 1 }}>✕</ComicBtn>
      </div>
    </ComicBox>
  )
}

export function ProfessorUpload() {
  const [selectedModule, setSelectedModule] = useState(UPLOAD_MODULE_OPTIONS[0])
  const [dragOver, setDragOver] = useState(false)

  return (
    <div className="dashboard-main">
      <Topbar
        title="UPLOAD"
        subtitle={`${UPLOADED_FILES.length} files uploaded · add PDFs, videos or audio to your modules`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: S[4], alignItems: 'start' }}>

        {/* Left — upload form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

          {/* Drop zone */}
          <Panel
            title="DROP FILES HERE"
            accent={C.yellow}
            action={<Tag label={`${ACCEPTED_FILE_TYPES.length} TYPES`} bg={C.yellowLt} />}
          >
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false) }}
              style={{
                border: `${BW.base} dashed ${dragOver ? C.yellow : C.muted}`,
                borderRadius: R.base,
                padding: S[8],
                background: dragOver ? C.yellowLt : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: S[3],
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <IconBox size={48} />
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS.xl,
                color: C.ink,
                textAlign: 'center',
              }}>
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
          </Panel>

          {/* Module selector + submit */}
          <Panel
            title="ASSIGN TO MODULE"
            accent={C.cyan}
            action={<Tag label="SELECT" bg={C.cyanLt} />}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              <ModuleSelect
                value={selectedModule}
                options={UPLOAD_MODULE_OPTIONS}
                onChange={setSelectedModule}
              />
              <ComicBtn color={C.yellow} style={{ width: '100%', justifyContent: 'center' }}>
                UPLOAD FILES
              </ComicBtn>
            </div>
          </Panel>

        </div>

        {/* Right — recent uploads */}
        <Panel
          title="RECENT UPLOADS"
          accent={C.purple}
          action={<Tag label={`${UPLOADED_FILES.length} FILES`} bg={C.purpleLt} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {UPLOADED_FILES.map(file => (
              <FileRow key={file.id} file={file} />
            ))}
          </div>
        </Panel>

      </div>
    </div>
  )
}
