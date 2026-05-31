const API = import.meta.env.VITE_API_URL

export async function getMojiKvizi(token: string) {
  const res = await fetch(`${API}/kvizi/moji`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getVprasanjaZaKviz(token: string, kvizId: string) {
  const res = await fetch(`${API}/kvizi/${kvizId}/vprasanja`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function shraniRezultat(token: string, kvizId: string, data: object) {
  const res = await fetch(`${API}/kvizi/${kvizId}/rezultat`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function getMojiRezultati(token: string) {
  const res = await fetch(`${API}/kvizi/rezultati/moji`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export interface ModuleCompletion { total: number; completed: number; avgScore: number }

export async function getModuleCompletion(token: string): Promise<Record<string, ModuleCompletion>> {
  const res = await fetch(`${API}/kvizi/completion`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}
