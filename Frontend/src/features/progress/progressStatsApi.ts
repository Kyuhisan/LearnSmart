const API = import.meta.env.VITE_API_URL

export interface DailyXp {
  label: string
  xp: number
}

export interface CalendarDay {
  date: string
  xp: number
  future?: boolean
}

export interface ProgressStats {
  biweeklyXp: DailyXp[]
  calendarDays: CalendarDay[]
  streak: number
  streakBest: number
}

export async function getProgressStats(token: string): Promise<ProgressStats> {
  const res = await fetch(`${API}/kvizi/progress-stats`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}