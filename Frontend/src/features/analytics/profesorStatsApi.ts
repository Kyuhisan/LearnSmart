const API = import.meta.env.VITE_API_URL

export interface DayStats {
  day: string
  xpSum: number
  avgScore: number
}

export interface WeeklyStats {
  days: DayStats[]
}

export async function getWeeklyStats(token: string, predmetId?: string | null): Promise<WeeklyStats> {
  const url = predmetId
    ? `${API}/kvizi/profesor/weekly-stats?predmetId=${predmetId}`
    : `${API}/kvizi/profesor/weekly-stats`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export interface ProfActivityItem {
  type: string
  title: string
  badge: string
  date: string
}

export async function getProfActivity(token: string): Promise<ProfActivityItem[]> {
  const res = await fetch(`${API}/kvizi/profesor/activity`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}