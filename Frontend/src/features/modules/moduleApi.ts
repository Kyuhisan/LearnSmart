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