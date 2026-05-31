const API = import.meta.env.VITE_API_URL

export interface LeaderboardEntry {
  id: string
  rank: number
  username: string
  xp: number
  weeklyXp: number
  nivo: number
  ucniTip: string | null
  quizzesTaken: number
  avgScore: number
  isMe: boolean
}

export async function getLeaderboard(token: string): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API}/api/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}
