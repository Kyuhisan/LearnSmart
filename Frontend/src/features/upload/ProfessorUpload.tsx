import { useState } from 'react'
import { ComicBox } from '../../components/ui/ComicBox'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Tag } from '../../components/ui/Tag'
import { Topbar } from '../../components/ui/Topbar'
import { IconBox } from '../../components/ui/IconBox'
import { C, S, FS, BW, R } from '../../styles/tokens'
import { UPLOADED_FILES, UPLOAD_MODULE_OPTIONS, ACCEPTED_FILE_TYPES, type UploadedFile } from './mockData'

const TYPE_COLOR: Record<UploadedFile['type'], string> = {
  pdf:   C.redLt,
  video: C.purpleLt,
  audio: C.greenLt,
  image: C.cyanLt,
  doc:   C.yellowLt,
}

const STATUS_CONFIG: Record<UploadedFile['status'], { label: string; bg: string }> = {
  ready:      { label: 'READY',       bg: C.green    },
  processing: { label: 'PROCESSING',  bg: C.yellow   },
  error:      { label: 'ERROR',       bg: C.red      },
}

function FileRow({ file }: { file: UploadedFile }) {
  const status = STATUS_CONFIG[file.status]
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: S[3],
      padding: `${S[2]} ${S[3]}`,
      background: C.cream,
      border: `${BW.base} solid ${C.ink}`,
      borderRadius: R.sm,
    }}>
      <div style={{
        width: 36, height: 36,
        background: TYPE_COLOR[file.type],
        border: `${BW.base} solid ${C.ink}`,
        borderRadius: R.sm,
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
        <ComicBtn sm color={C.redLt}>✕</ComicBtn>
      </div>
    </div>
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
        actions={<Tag label={`ACCEPTED: ${ACCEPTED_FILE_TYPES.join(' ')}`} bg={C.cream} />}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: S[4], alignItems: 'start' }}>

        {/* Left — upload form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

          {/* Drop zone */}
          <ComicBox bg={dragOver ? C.yellowLt : C.paper} p={S[6]}>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false) }}
              style={{
                border: `2px dashed ${dragOver ? C.yellow : C.muted}`,
                borderRadius: R.base,
                padding: S[8],
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
          </ComicBox>

          {/* Module selector + submit */}
          <ComicBox bg={C.paper} p={S[4]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              <div style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: FS.sm,
                color: C.ink,
                letterSpacing: '0.05em',
              }}>
                ASSIGN TO MODULE
              </div>
              <select
                value={selectedModule}
                onChange={e => setSelectedModule(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${S[2]} ${S[3]}`,
                  border: `${BW.base} solid ${C.ink}`,
                  borderRadius: R.sm,
                  background: C.cream,
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: FS.sm,
                  color: C.ink,
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: `2px 2px 0 ${C.ink}`,
                }}
              >
                {UPLOAD_MODULE_OPTIONS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ComicBtn color={C.yellow} style={{ width: '100%', justifyContent: 'center' }}>
                UPLOAD FILES
              </ComicBtn>
            </div>
          </ComicBox>

        </div>

        {/* Right — recent uploads */}
        <ComicBox bg={C.paper} p={S[4]}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: S[3],
          }}>
            <div style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontSize: FS.sm,
              letterSpacing: '0.05em',
              color: C.ink,
            }}>
              RECENT UPLOADS
            </div>
            <div style={{ fontSize: FS.xs, color: C.muted, fontWeight: 700 }}>
              {UPLOADED_FILES.length} files
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {UPLOADED_FILES.map(file => (
              <FileRow key={file.id} file={file} />
            ))}
          </div>
        </ComicBox>

      </div>
    </div>
  )
}
