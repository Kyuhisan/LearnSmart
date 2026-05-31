import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Topbar } from '../../components/ui/Topbar'
import { Panel } from '../../components/ui/Panel'
import { Tag } from '../../components/ui/Tag'
import { ComicBtn } from '../../components/ui/ComicBtn'
import { C, S } from '../../styles/tokens'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useAuth } from '../../context/AuthContext'
import { getModuliUcitelj } from '../modules/moduleApi'
import {
  generirajVprasanja, shraniVBanko, getVprasanjaBanka,
  ustvariKviz, getKviziZaPredmet, getVprasanjaZaKviz,
  dodajVprasanjeNaKviz, odstraniIzKviza, izbrisiVprasanje, objaviKviz, izbrisiKviz
} from './quizApi'
import type { AIDifficulty } from './mockData'
import type { Modul, BackendQuestion, BankaQuestion, KvizQuestion, Kviz, QuestionState, View } from './quizBuilderTypes'
import { Dropdown } from './QuizBuilderCards'
import { GenerateView, BankaView, NewQuizView, KvizView } from './QuizBuilderViews'

export function ProfessorAIQuizBuilder() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile' || bp === 'tablet'

  const [modules, setModules] = useState<Modul[]>([])
  const [loadingModules, setLoadingModules] = useState(true)
  const [module, setModule] = useState<Modul | null>(null)
  const [view, setView] = useState<View>('generate')

  const [difficulty, setDifficulty] = useState<AIDifficulty>('MEDIUM')
  const [count, setCount] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [generatingMore, setGeneratingMore] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[] | null>(null)
  const [savingToBank, setSavingToBank] = useState(false)
  const [savedToBank, setSavedToBank] = useState(false)

  const [banka, setBanka] = useState<BankaQuestion[]>([])
  const [loadingBanka, setLoadingBanka] = useState(false)
  const [deletingBankaId, setDeletingBankaId] = useState<string | null>(null)

  const [kvizi, setKvizi] = useState<Kviz[]>([])
  const [loadingKvizi, setLoadingKvizi] = useState(false)
  const [selectedKviz, setSelectedKviz] = useState<Kviz | null>(null)
  const [kvizVprasanja, setKvizVprasanja] = useState<KvizQuestion[]>([])
  const [loadingKvizVprasanja, setLoadingKvizVprasanja] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [deletingKviz, setDeletingKviz] = useState(false)
  const [addingToKvizId, setAddingToKvizId] = useState<string | null>(null)

  const [newKvizNaziv, setNewKvizNaziv] = useState('')
  const [newKvizCas, setNewKvizCas] = useState(10)
  const [selectedBankaIds, setSelectedBankaIds] = useState<Set<string>>(new Set())
  const [creatingKviz, setCreatingKviz] = useState(false)

  const difficultyColor = { EASY: C.green, MEDIUM: C.yellow, HARD: C.red }

  useEffect(() => {
    if (!session?.access_token) return
    getModuliUcitelj(session.access_token).then((data: Modul[]) => {
      setModules(data)
      if (data.length > 0) setModule(data[0])
      setLoadingModules(false)
    })
  }, [session])

  const naloziModulData = useCallback(async () => {
    if (!module || !session?.access_token) return
    setLoadingBanka(true)
    setLoadingKvizi(true)
    try {
      const [b, k] = await Promise.all([
        getVprasanjaBanka(session.access_token, module.id),
        getKviziZaPredmet(session.access_token, module.id)
      ])
      setBanka(b)
      setKvizi(k)
      if (k.length > 0) setSelectedKviz(prev => prev ?? k[0])
    } catch (e) {
      console.error('Failed to load module data:', e)
    } finally {
      setLoadingBanka(false)
      setLoadingKvizi(false)
    }
  }, [module, session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    naloziModulData()
  }, [naloziModulData])

  const naloziKvizVprasanja = useCallback(async () => {
    if (!selectedKviz || !session?.access_token) return
    setLoadingKvizVprasanja(true)
    try {
      const data = await getVprasanjaZaKviz(session.access_token, selectedKviz.id)
      setKvizVprasanja(data)
    } catch (e) {
      console.error('Failed to load quiz questions:', e)
    } finally {
      setLoadingKvizVprasanja(false)
    }
  }, [selectedKviz, session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    naloziKvizVprasanja()
  }, [naloziKvizVprasanja])

  const approvedCount = questions?.filter(q => q.approved === true).length ?? 0
  const rejectedCount = questions?.filter(q => q.approved === false).length ?? 0
  const pendingCount = questions?.filter(q => q.approved === null).length ?? 0

  async function generate() {
    if (!module || !session?.access_token) return
    setGenerating(true)
    setQuestions(null)
    setSavedToBank(false)
    try {
      const data: BackendQuestion[] = await generirajVprasanja(session.access_token, module.id, count, difficulty)
      setQuestions(data.map((q, i) => ({ ...q, id: i, approved: null })))
    } catch (e) { console.error('Generation failed:', e) }
    finally { setGenerating(false) }
  }

  async function generateMore() {
    if (!module || !session?.access_token) return
    setGeneratingMore(true)
    try {
      const data: BackendQuestion[] = await generirajVprasanja(session.access_token, module.id, count, difficulty)
      const maxId = questions ? Math.max(...questions.map(q => q.id)) : 0
      setQuestions(prev => [...(prev ?? []), ...data.map((q, i) => ({ ...q, id: maxId + i + 1, approved: null as boolean | null }))])
    } catch (e) { console.error('Generate more failed:', e) }
    finally { setGeneratingMore(false) }
  }

  function setApproval(id: number, value: boolean | null) {
    setQuestions(prev => prev!.map(q => q.id === id ? { ...q, approved: q.approved === value ? null : value } : q))
  }

  async function saveApprovedToBank() {
    if (!module || !session?.access_token || !questions) return
    const odobrena = questions.filter(q => q.approved === true)
    if (odobrena.length === 0) return
    setSavingToBank(true)
    try {
      await shraniVBanko(session.access_token, module.id, odobrena.map(q => ({
        besediloVprasanja: q.besediloVprasanja, moznosti: q.moznosti,
        indeksPravilnegaOdgovora: q.indeksPravilnegaOdgovora, razlaga: q.razlaga,
        tezavnost: difficulty
      })))
      setSavedToBank(true)
      setQuestions(null)
      const b = await getVprasanjaBanka(session.access_token, module.id)
      setBanka(b)
    } catch (e) { console.error('Save to bank failed:', e) }
    finally { setSavingToBank(false) }
  }

  async function handleDeleteFromBank(vprasanjeId: string) {
    if (!session?.access_token) return
    setDeletingBankaId(vprasanjeId)
    try {
      await izbrisiVprasanje(session.access_token, vprasanjeId)
      setBanka(prev => prev.filter(q => q.id !== vprasanjeId))
    } catch (e) { console.error('Delete failed:', e) }
    finally { setDeletingBankaId(null) }
  }

  async function handleCreateKviz() {
    if (!module || !session?.access_token || !newKvizNaziv.trim() || selectedBankaIds.size === 0) return
    setCreatingKviz(true)
    try {
      const novKviz = await ustvariKviz(session.access_token, {
        predmetId: module.id, naziv: newKvizNaziv.trim(),
        casIzvajanja: newKvizCas, vprasanjaIds: Array.from(selectedBankaIds)
      })
      setKvizi(prev => [...prev, novKviz])
      setSelectedKviz(novKviz)
      setNewKvizNaziv('')
      setSelectedBankaIds(new Set())
      setView('kviz')
      const b = await getVprasanjaBanka(session.access_token, module.id)
      setBanka(b)
    } catch (e) { console.error('Create quiz failed:', e) }
    finally { setCreatingKviz(false) }
  }

  async function handleAddToKviz(vprasanjeId: string) {
    if (!selectedKviz || !session?.access_token) return
    setAddingToKvizId(vprasanjeId)
    try {
      await dodajVprasanjeNaKviz(session.access_token, selectedKviz.id, vprasanjeId)
      await naloziKvizVprasanja()
      const b = await getVprasanjaBanka(session.access_token, module!.id)
      setBanka(b)
    } catch (e) { console.error('Add to quiz failed:', e) }
    finally { setAddingToKvizId(null) }
  }

  async function handleRemoveFromKviz(vprasanjeId: string) {
    if (!session?.access_token) return
    setRemovingId(vprasanjeId)
    try {
      await odstraniIzKviza(session.access_token, vprasanjeId)
      setKvizVprasanja(prev => prev.filter(q => q.id !== vprasanjeId))
      const b = await getVprasanjaBanka(session.access_token, module!.id)
      setBanka(b)
    } catch (e) { console.error('Remove from quiz failed:', e) }
    finally { setRemovingId(null) }
  }

  async function handlePublish() {
    if (!selectedKviz || !session?.access_token) return
    setPublishing(true)
    try {
      const updated = await objaviKviz(session.access_token, selectedKviz.id)
      setKvizi(prev => prev.map(k => k.id === updated.id ? updated : k))
      setSelectedKviz(updated)
    } catch (e) { console.error('Publish failed:', e) }
    finally { setPublishing(false) }
  }

  async function handleDeleteKviz() {
    if (!selectedKviz || !session?.access_token) return
    setDeletingKviz(true)
    try {
      await izbrisiKviz(session.access_token, selectedKviz.id)
      const remaining = kvizi.filter(k => k.id !== selectedKviz.id)
      setKvizi(remaining)
      setSelectedKviz(remaining.length > 0 ? remaining[0] : null)
    } catch (e) { console.error('Delete quiz failed:', e) }
    finally { setDeletingKviz(false) }
  }

  const tabs: { key: View; label: string }[] = [
    { key: 'generate', label: 'STEP 1 · GENERATE QUESTIONS' },
    { key: 'banka',    label: `STEP 2 · AVAILABLE QUESTIONS (${banka.length})` },
    { key: 'newquiz',  label: 'STEP 3 · NEW QUIZ' },
    { key: 'kviz',     label: `STEP 4 · QUIZZES (${kvizi.length})` },
  ]

  return (
    <div className="dashboard-main">
      <Topbar title="AI QUIZ BUILDER" subtitle="Generate · Bank · Publish" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <Panel title="SELECT WORKFLOW" accent={C.cyan} action={<Tag label="STEP 1" bg={C.yellow} />}>
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <ComicBtn key={t.key} sm color={view === t.key ? C.yellow : C.paper} onClick={() => setView(t.key)}>
                {t.label}
              </ComicBtn>
            ))}
          </div>
        </Panel>

        <Panel title="SELECT MODULE" accent={C.yellow} action={<Tag label="STEP 2" bg={C.yellow} />} overflow="visible">
          <Dropdown value={module} options={modules} onChange={m => { setModule(m); setSelectedKviz(null) }} loading={loadingModules} placeholder="Select a module" />
        </Panel>
      </div>

      <hr style={{ border: 'none', borderTop: `2px solid ${C.divider}`, margin: 0 }} />

      {view === 'generate' && (
        <GenerateView isMobile={isMobile} module={module} difficulty={difficulty} setDifficulty={setDifficulty} count={count} setCount={setCount} generating={generating} generatingMore={generatingMore} questions={questions} approvedCount={approvedCount} rejectedCount={rejectedCount} pendingCount={pendingCount} savedToBank={savedToBank} savingToBank={savingToBank} difficultyColor={difficultyColor} onGenerate={generate} onGenerateMore={generateMore} onApproval={setApproval} onSaveToBank={saveApprovedToBank} onGoUpload={() => navigate('/upload')} />
      )}
      {view === 'banka' && (
        <BankaView banka={banka} loadingBanka={loadingBanka} deletingBankaId={deletingBankaId} onDelete={handleDeleteFromBank} onGoGenerate={() => setView('generate')} />
      )}
      {view === 'newquiz' && (
        <NewQuizView isMobile={isMobile} banka={banka} newKvizNaziv={newKvizNaziv} setNewKvizNaziv={setNewKvizNaziv} newKvizCas={newKvizCas} setNewKvizCas={setNewKvizCas} selectedBankaIds={selectedBankaIds} setSelectedBankaIds={setSelectedBankaIds} creatingKviz={creatingKviz} onCreate={handleCreateKviz} onGoGenerate={() => setView('generate')} />
      )}
      {view === 'kviz' && (
        <KvizView isMobile={isMobile} kvizi={kvizi} loadingKvizi={loadingKvizi} selectedKviz={selectedKviz} setSelectedKviz={setSelectedKviz} kvizVprasanja={kvizVprasanja} loadingKvizVprasanja={loadingKvizVprasanja} banka={banka} loadingBanka={loadingBanka} removingId={removingId} addingToKvizId={addingToKvizId} publishing={publishing} deletingKviz={deletingKviz} onRemove={handleRemoveFromKviz} onAdd={handleAddToKviz} onPublish={handlePublish} onDelete={handleDeleteKviz} onNewQuiz={() => setView('newquiz')} />
      )}
      </div>
    </div>
  )
}