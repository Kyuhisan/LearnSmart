const API = import.meta.env.VITE_API_URL

export async function generirajVprasanja(token: string, predmetId: string, steviloVprasanj: number, tezavnost: string) {
  const res = await fetch(`${API}/kvizi/generiraj`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ predmetId, steviloVprasanj, tezavnost })
  })
  return res.json()
}

export async function shraniKviz(token: string, data: object) {
  const res = await fetch(`${API}/kvizi/shrani`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function getKviziZaPredmet(token: string, predmetId: string) {
  const res = await fetch(`${API}/kvizi/predmet/${predmetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getKvizZaPredmet(token: string, predmetId: string) {
  const res = await fetch(`${API}/kvizi/predmet/${predmetId}`, {
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

export async function izbrisiVprasanje(token: string, vprasanjeId: string) {
  await fetch(`${API}/kvizi/vprasanje/${vprasanjeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

// ── NOVO ──

export async function shraniVBanko(token: string, predmetId: string, vprasanja: object[]) {
  const res = await fetch(`${API}/kvizi/vprasanja/banka`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ predmetId, vprasanja })
  })
  return res.json()
}

export async function getVprasanjaBanka(token: string, predmetId: string) {
  const res = await fetch(`${API}/kvizi/vprasanja/banka/${predmetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function ustvariKviz(token: string, data: object) {
  const res = await fetch(`${API}/kvizi/ustvari`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function dodajVprasanjeNaKviz(token: string, kvizId: string, vprasanjeId: string) {
  await fetch(`${API}/kvizi/${kvizId}/dodaj/${vprasanjeId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function odstraniIzKviza(token: string, vprasanjeId: string) {
  await fetch(`${API}/kvizi/vprasanje/${vprasanjeId}/odstrani`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function izbrisiKviz(token: string, kvizId: string) {
  await fetch(`${API}/kvizi/${kvizId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function objaviKviz(token: string, kvizId: string) {
  const res = await fetch(`${API}/kvizi/${kvizId}/objavi`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getKviziUcitelja(token: string) {
  const res = await fetch(`${API}/kvizi/ucitelj/vsi`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}