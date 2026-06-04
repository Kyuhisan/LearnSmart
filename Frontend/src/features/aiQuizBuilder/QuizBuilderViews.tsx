import { BitMascot } from '../../components/ui/BitMascot'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { C, S, FS, BW, R, mkShadow } from '../../styles/tokens'
import { AI_DIFFICULTY_OPTIONS, DIFFICULTY_COLOR, type AIDifficulty } from './mockData'
import type { QuestionState, BankaQuestion, KvizQuestion, Kviz, Modul, AIDifficultyColor } from './quizBuilderTypes'
import { GeneratedQuestionCard, BankaQuestionCard, KvizQuestionCard, Dropdown, StepperField } from './QuizBuilderCards'

// ── GENERATE VIEW ──
export function GenerateView({ isMobile, module, difficulty, setDifficulty, count, setCount, generating, generatingMore, questions, approvedCount, rejectedCount, pendingCount, savedToBank, savingToBank, difficultyColor, onGenerate, onGenerateMore, onApproval, onSaveToBank, onGoUpload }: {
  isMobile: boolean; module: Modul | null
  difficulty: AIDifficulty; setDifficulty: (d: AIDifficulty) => void
  count: number; setCount: (fn: (v: number) => number) => void
  generating: boolean; generatingMore: boolean
  questions: QuestionState[] | null
  approvedCount: number; rejectedCount: number; pendingCount: number
  savedToBank: boolean; savingToBank: boolean
  difficultyColor: AIDifficultyColor
  onGenerate: () => void; onGenerateMore: () => void
  onApproval: (id: number, value: boolean | null) => void
  onSaveToBank: () => void
  onGoUpload: () => void
}) {
  const noTranscript = module !== null && !module.hasTranscript

  return (
    <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: 'column', ...(isMobile ? {} : { gridTemplateColumns: '1fr 1.5fr' }), gap: S[4], alignItems: 'stretch' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Panel title="GENERATE QUESTIONS" accent={C.yellow} p={S[4]} overflow="visible">
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[2] }}>DIFFICULTY</div>
              <div style={{ display: 'flex', gap: S[2] }}>
                {AI_DIFFICULTY_OPTIONS.map(d => (
                  <ComicBtn key={d} sm color={difficulty === d ? difficultyColor[d] : C.paper} onClick={() => setDifficulty(d)} style={{ flex: 1, justifyContent: 'center', whiteSpace: 'nowrap' }}>{d}</ComicBtn>
                ))}
              </div>
            </div>
            <StepperField label="QUESTION COUNT" value={count} onChange={setCount} min={1} max={15} />
            {noTranscript && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], padding: S[3], background: C.yellowLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.ink }}>NO CONTENT UPLOADED YET</span>
                <span style={{ fontSize: FS.xs, color: C.muted }}>Upload a PDF, video or audio to this module first so AI can generate questions from it.</span>
                <ComicBtn sm color={C.yellow} onClick={onGoUpload}>GO TO UPLOAD →</ComicBtn>
              </div>
            )}
            <ComicBtn color={C.yellow} onClick={onGenerate} disabled={generating || !module || noTranscript}>
              {generating ? 'GENERATING...' : ' GENERATE QUESTIONS'}
            </ComicBtn>
          </div>
        </Panel>

        {questions && (
          <Panel title="REVIEW STATUS" accent={C.cyan} p={S[4]}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {([
                { label: 'PENDING',  value: pendingCount,  bg: C.mutedLt },
                { label: 'APPROVED', value: approvedCount, bg: C.greenLt },
                { label: 'REJECTED', value: rejectedCount, bg: C.redLt },
              ] as const).map(({ label, value, bg }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[2]} ${S[3]}`, background: bg, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{label}</span>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{value}</span>
                </div>
              ))}
              {savedToBank ? (
                <div style={{ padding: `${S[2]} ${S[3]}`, background: C.greenLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, textAlign: 'center' }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>✓ SAVED TO BANK ({approvedCount})</span>
                </div>
              ) : (
                <ComicBtn color={approvedCount > 0 ? C.green : C.muted} disabled={approvedCount === 0 || savingToBank} onClick={onSaveToBank} style={{ width: '100%', justifyContent: 'center' }}>
                  {savingToBank ? 'SAVING...' : ` SAVE QUESTIONS (${approvedCount})`}
                </ComicBtn>
              )}
            </div>
          </Panel>
        )}
      </div>

      <Panel title="REVIEW QUESTIONS" accent={C.purple} p={S[4]} style={{ height: '100%' }}>
        {!questions && !generating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[3], flex: 1 }}>
            <BitMascot size={64} mood="happy" float />
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>SELECT A MODULE AND HIT GENERATE</div>
          </div>
        )}
        {generating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[3], flex: 1 }}>
            <BitMascot size={64} mood="thinking" float />
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.ink }}>GEMINI IS THINKING...</div>
          </div>
        )}
        {questions && !generating && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {questions.map((q, i) => (
              <GeneratedQuestionCard key={q.id} q={q} index={i} onApprove={() => onApproval(q.id, true)} onReject={() => onApproval(q.id, false)} />
            ))}
            {generatingMore ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2], padding: S[3] }}>
                <BitMascot size={32} mood="thinking" float />
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted }}>GENERATING MORE...</span>
              </div>
            ) : (
              <ComicBtn color={C.paper} onClick={onGenerateMore} style={{ width: '100%', justifyContent: 'center' }}>+ GENERATE MORE</ComicBtn>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}

// ── AVAILABLE QUESTIONS VIEW ──
export function BankaView({ banka, loadingBanka, deletingBankaId, onDelete, onGoGenerate }: {
  banka: BankaQuestion[]; loadingBanka: boolean
  deletingBankaId: string | null
  onDelete: (id: string) => void
  onGoGenerate: () => void
}) {
  return (
    <Panel title="AVAILABLE QUESTIONS" accent={C.cyan} p={S[4]} action={<Tag label={`${banka.length} QUESTIONS`} bg={C.cyanLt} />}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        {loadingBanka ? (
          <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>LOADING...</div>
        ) : banka.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0` }}>
            <BitMascot size={48} mood="thinking" float />
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>NO QUESTIONS YET — GENERATE SOME!</div>
            <ComicBtn sm color={C.yellow} onClick={onGoGenerate}> GO GENERATE</ComicBtn>
          </div>
        ) : banka.map((q, i) => (
          <BankaQuestionCard key={q.id} q={q} index={i}
            onDelete={() => onDelete(q.id)}
            deleting={deletingBankaId === q.id} />
        ))}
      </div>
    </Panel>
  )
}

// ── NEW QUIZ VIEW ──
export function NewQuizView({ isMobile, banka, newKvizNaziv, setNewKvizNaziv, newKvizCas, setNewKvizCas, selectedBankaIds, setSelectedBankaIds, creatingKviz, onCreate, onGoGenerate }: {
  isMobile: boolean
  banka: BankaQuestion[]
  newKvizNaziv: string; setNewKvizNaziv: (v: string) => void
  newKvizCas: number; setNewKvizCas: (fn: (v: number) => number) => void
  selectedBankaIds: Set<string>; setSelectedBankaIds: (fn: (prev: Set<string>) => Set<string>) => void
  creatingKviz: boolean; onCreate: () => void; onGoGenerate: () => void
}) {
  return (
    <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: 'column', ...(isMobile ? {} : { gridTemplateColumns: '1fr 1.5fr' }), gap: S[4], alignItems: isMobile ? 'stretch' : 'start' }}>
      <Panel title="NEW QUIZ" accent={C.green} p={S[4]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[1] }}>QUIZ NAME</div>
            <input value={newKvizNaziv} onChange={e => setNewKvizNaziv(e.target.value)}
              placeholder="e.g. Week 3 Quiz"
              style={{ width: '100%', padding: `${S[2]} ${S[3]}`, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink, background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow(), outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <StepperField label="TIME LIMIT (MIN)" value={newKvizCas} onChange={setNewKvizCas} min={1} max={120} />
          <div style={{ padding: `${S[2]} ${S[3]}`, background: selectedBankaIds.size > 0 ? C.greenLt : C.yellowLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, textAlign: 'center' }}>
            <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{selectedBankaIds.size} QUESTIONS SELECTED</span>
          </div>
          <ComicBtn color={C.green} disabled={!newKvizNaziv.trim() || selectedBankaIds.size === 0 || creatingKviz} onClick={onCreate}>
            {creatingKviz ? 'CREATING...' : `CREATE QUIZ (${selectedBankaIds.size} Q)`}
          </ComicBtn>
        </div>
      </Panel>

      <Panel title="SELECT QUESTIONS" accent={C.cyan} p={S[4]} action={<Tag label={`${selectedBankaIds.size} / ${banka.length} SELECTED`} bg={C.cyanLt} />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {banka.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0` }}>
              <BitMascot size={48} mood="thinking" float />
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>NO QUESTIONS YET</div>
              <ComicBtn sm color={C.yellow} onClick={onGoGenerate}> GO GENERATE</ComicBtn>
            </div>
          ) : banka.map((q, i) => (
            <BankaQuestionCard key={q.id} q={q} index={i}
              selected={selectedBankaIds.has(q.id)}
              onToggle={() => setSelectedBankaIds(prev => {
                const next = new Set(prev)
                if (next.has(q.id)) next.delete(q.id)
                else next.add(q.id)
                return next
              })} />
          ))}
        </div>
      </Panel>
    </div>
  )
}

// ── QUIZZES VIEW ──
export function KvizView({ isMobile, kvizi, loadingKvizi, selectedKviz, setSelectedKviz, kvizVprasanja, loadingKvizVprasanja, banka, loadingBanka, removingId, addingToKvizId, publishing, deletingKviz, onRemove, onAdd, onPublish, onDelete, onNewQuiz }: {
  isMobile: boolean
  kvizi: Kviz[]; loadingKvizi: boolean
  selectedKviz: Kviz | null; setSelectedKviz: (k: Kviz) => void
  kvizVprasanja: KvizQuestion[]; loadingKvizVprasanja: boolean
  banka: BankaQuestion[]; loadingBanka: boolean
  removingId: string | null; addingToKvizId: string | null; publishing: boolean; deletingKviz: boolean
  onRemove: (id: string) => void
  onAdd: (id: string) => void
  onPublish: () => void
  onDelete: () => void
  onNewQuiz: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, letterSpacing: 1, marginBottom: S[1] }}>SELECT QUIZ</div>
          <Dropdown<Kviz> value={selectedKviz} options={kvizi} onChange={setSelectedKviz} loading={loadingKvizi} placeholder="No quizzes yet" />
        </div>
        <div style={{ paddingTop: S[5] }}>
          <ComicBtn sm color={C.yellow} onClick={onNewQuiz}>+ NEW QUIZ</ComicBtn>
        </div>
      </div>

      {selectedKviz && (
        <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: 'column', ...(isMobile ? {} : { gridTemplateColumns: '1fr 1.5fr' }), gap: S[4], alignItems: isMobile ? 'stretch' : 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <Panel title="QUIZ INFO" accent={C.orange} p={S[4]}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${S[2]} ${S[3]}`, background: selectedKviz.status === 'PUBLISHED' ? C.greenLt : C.yellowLt, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.ink }}>{selectedKviz.naziv}</span>
                  <Tag label={selectedKviz.status} bg={selectedKviz.status === 'PUBLISHED' ? C.green : C.yellow} />
                </div>
                <div style={{ display: 'flex', gap: S[2] }}>
                  <Tag label={`${selectedKviz.casIzvajanja} MIN`} bg={C.cyanLt} />
                  <Tag label={`${kvizVprasanja.length} QUESTIONS`} bg={C.yellowLt} />
                </div>
                {selectedKviz.status !== 'PUBLISHED' && (
                  <ComicBtn color={C.green} onClick={onPublish} disabled={publishing || kvizVprasanja.length === 0} style={{ width: '100%', justifyContent: 'center' }}>
                    {publishing ? 'PUBLISHING...' : ' PUBLISH QUIZ'}
                  </ComicBtn>
                )}
                <ComicBtn color={C.red} onClick={onDelete} disabled={deletingKviz} style={{ width: '100%', justifyContent: 'center' }}>
                  {deletingKviz ? 'DELETING...' : '✕ DELETE QUIZ'}
                </ComicBtn>
              </div>
            </Panel>

            <Panel title="ADD FROM BANK" accent={C.cyan} p={S[4]} action={<Tag label={`${banka.length} AVAILABLE`} bg={C.cyanLt} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {loadingBanka ? (
                  <div style={{ padding: S[3], textAlign: 'center', color: C.muted, fontSize: FS.xs }}>LOADING...</div>
                ) : banka.length === 0 ? (
                  <div style={{ padding: S[3], textAlign: 'center', color: C.muted, fontSize: FS.xs }}>Bank is empty</div>
                ) : banka.map((q, i) => (
                  <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: S[1], padding: `${S[2]} ${S[3]}`, background: C.paper, border: `${BW.base} solid ${C.ink}`, borderRadius: R.sm, boxShadow: mkShadow() }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.xs, color: C.muted, flexShrink: 0 }}>Q{i + 1}</span>
                      {q.tezavnost && <Tag label={q.tezavnost} bg={DIFFICULTY_COLOR[q.tezavnost as keyof typeof DIFFICULTY_COLOR] ?? C.mutedLt} />}
                      <ComicBtn sm color={C.green} onClick={() => onAdd(q.id)} disabled={addingToKvizId === q.id} style={{ marginLeft: 'auto' }}>
                        {addingToKvizId === q.id ? '...' : '+ ADD'}
                      </ComicBtn>
                    </div>
                    <span style={{ fontSize: FS.xs, color: C.ink }}>{q.besediloVprasanja}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="QUIZ QUESTIONS" accent={C.purple} p={S[4]} action={<Tag label={`${kvizVprasanja.length} QUESTIONS`} bg={C.purpleLt} />}>
            {loadingKvizVprasanja ? (
              <div style={{ padding: S[4], textAlign: 'center', color: C.muted, fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm }}>LOADING...</div>
            ) : kvizVprasanja.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[6]} 0` }}>
                <BitMascot size={48} mood="thinking" float />
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.sm, color: C.muted }}>NO QUESTIONS IN THIS QUIZ YET</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {kvizVprasanja.map((q, i) => (
                  <KvizQuestionCard key={q.id} q={q} index={i} onRemove={() => onRemove(q.id)} removing={removingId === q.id} />
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {!selectedKviz && !loadingKvizi && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[3], padding: `${S[8]} 0` }}>
          <BitMascot size={64} mood="happy" float />
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: FS.md, color: C.muted }}>NO QUIZZES YET</div>
          <ComicBtn color={C.yellow} onClick={onNewQuiz}>+ CREATE FIRST QUIZ</ComicBtn>
        </div>
      )}
    </div>
  )
}