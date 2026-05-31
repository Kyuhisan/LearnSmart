const API = import.meta.env.VITE_API_URL

export interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  nivo: number
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
