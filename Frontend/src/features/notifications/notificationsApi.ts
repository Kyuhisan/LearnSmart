const API = import.meta.env.VITE_API_URL

export async function getMojaObvestila(token: string) {
  const res = await fetch(`${API}/obvestila`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function getNeprebranaStevilo(token: string) {
  const res = await fetch(`${API}/obvestila/stevilo`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function oznaciPrebrano(token: string, id: string) {
  await fetch(`${API}/obvestila/${id}/prebrano`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
}

export async function oznaciVsePrebrano(token: string) {
  await fetch(`${API}/obvestila/vse-prebrano`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  })
}