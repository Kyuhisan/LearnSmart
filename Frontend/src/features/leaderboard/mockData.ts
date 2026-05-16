export interface LeaderboardEntry {
  rank: number
  username: string
  xp: number
  streak: number
  badges: number
  isCurrentUser?: boolean
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'ana.k',     xp: 5820, streak: 31, badges: 14 },
  { rank: 2, username: 'miha.p',    xp: 5410, streak: 22, badges: 11 },
  { rank: 3, username: 'teja.m',    xp: 4990, streak: 18, badges: 10 },
  { rank: 4, username: 'me',        xp: 3240, streak: 12, badges: 7, isCurrentUser: true },
  { rank: 5, username: 'rok.z',     xp: 3100, streak: 9,  badges: 6 },
  { rank: 6, username: 'maja.s',    xp: 2870, streak: 7,  badges: 5 },
  { rank: 7, username: 'luka.h',    xp: 2640, streak: 5,  badges: 4 },
  { rank: 8, username: 'nika.b',    xp: 2310, streak: 3,  badges: 3 },
  { rank: 9, username: 'peter.v',   xp: 1980, streak: 2,  badges: 2 },
  { rank: 10, username: 'sara.n',   xp: 1540, streak: 1,  badges: 1 },
]

export const LEADERBOARD_STATS = {
  myRank: 4,
  totalStudents: 248,
  myXp: 3240,
  myStreak: 12,
}
