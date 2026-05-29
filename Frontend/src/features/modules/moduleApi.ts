const API = import.meta.env.VITE_API_URL

export async function getModuliUcitelj(token: string) {
  const res = await fetch(`${API}/moduli/moji`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getModuliJavni() {
  const res = await fetch(`${API}/moduli`)
  return res.json()
}

export async function ustvariModul(token: string, data: object) {
  const res = await fetch(`${API}/moduli`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function urediModul(token: string, id: string, data: object) {
  const res = await fetch(`${API}/moduli/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function izbrisiModul(token: string, id: string) {
  await fetch(`${API}/moduli/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function objaviModul(token: string, id: string) {
  const res = await fetch(`${API}/moduli/${id}/objavi`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function umaknjiModul(token: string, id: string) {
  const res = await fetch(`${API}/moduli/${id}/umakni`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Vpis z kodo
export async function vpisZKodo(token: string, kodaVpisa: string) {
  const res = await fetch(`${API}/vpisi/vpis`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ kodaVpisa })
  })
  return res.json()
}

// Moji vpisi
export async function getMojiVpisi(token: string) {
  const res = await fetch(`${API}/vpisi/moji`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Posodobi cas
export async function posodobiCas(token: string, predmetId: string, cas: number) {
  const res = await fetch(`${API}/vpisi/${predmetId}/cas`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ cas })
  })
  return res.json()
}

// Stevilo vpisanih ucencev za modul
export async function getSteviloVpisanih(token: string, predmetId: string): Promise<number> {
  const res = await fetch(`${API}/vpisi/predmet/${predmetId}/stevilo`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Stil mix studentov za ucitelja
export async function getStilMix(token: string): Promise<Record<string, number>> {
  const res = await fetch(`${API}/vpisi/ucitelj/stilMix`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Students for professor (flat list + by module)
export interface StudentSummary {
  ucenecId: string
  imePriimek: string
  ucniTip: string | null
  avgScore: number
  steviloModulov: number
}

export interface ModuleStudents {
  predmetId: string
  naziv: string
  studenti: StudentSummary[]
}

export async function getStudentiZaUcitelja(token: string): Promise<StudentSummary[]> {
  const res = await fetch(`${API}/vpisi/ucitelj/studenti`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getStudentiPoModulih(token: string): Promise<ModuleStudents[]> {
  const res = await fetch(`${API}/vpisi/ucitelj/moduliStudenti`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Top performing students za ucitelja
export interface TopStudent {
  ucenecId: string
  imePriimek: string
  ucniTip: string | null
  score: number
}

export async function getTopStudents(token: string): Promise<TopStudent[]> {
  const res = await fetch(`${API}/kvizi/ucitelj/topStudents`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Kvizi za ucitelja (vsi moduli)
export interface QuizDTO {
  id: string
  naziv: string
  status: string
  casIzvajanja: number | null
  predmetId: string
  ustvarjenOb: string
}

export async function getKviziUcitelja(token: string): Promise<QuizDTO[]> {
  const res = await fetch(`${API}/kvizi/ucitelj/vsi`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Analytics stats za ucitelja
export interface AnalyticsStats {
  totalStudents: number
  avgScore: number
  avgCompletion: number
  passRate: number
}

export async function getAnalyticsStats(token: string): Promise<AnalyticsStats> {
  const res = await fetch(`${API}/kvizi/ucitelj/analyticsStats`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getAnalyticsStatsByModule(token: string, predmetId: string): Promise<AnalyticsStats> {
  const res = await fetch(`${API}/kvizi/ucitelj/analyticsStats/${predmetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

// Odjava
export async function odjavaIzModula(token: string, predmetId: string) {
  await fetch(`${API}/vpisi/${predmetId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}