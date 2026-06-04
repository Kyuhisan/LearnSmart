const API = import.meta.env.VITE_API_URL

export interface BadgeResponse {
  type: string
  opis: string
  pridobljenOb: string
}

export async function getMojeZnacke(token: string): Promise<BadgeResponse[]> {
  const response = await fetch(`${API}/znacke/moje`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch badges')
  }

  return response.json()
}