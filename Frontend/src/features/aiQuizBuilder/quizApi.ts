const API = import.meta.env.VITE_API_URL

export async function generirajVprasanja(
  token: string,
  predmetId: string,
  steviloVprasanj: number,
  tezavnost: string
) {
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