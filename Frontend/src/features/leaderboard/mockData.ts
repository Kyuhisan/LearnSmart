import { C } from '../../styles/tokens'

export interface LeaderboardEntry {
  id: string
  rank: number
  username: string
  xp: number
  weeklyXp: number
  streak: number
  badges: number
  style: string
  styleColor: string
  isCurrentUser?: boolean
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1',  rank: 1,  username: 'ana.k',     xp: 5820, weeklyXp: 420, streak: 31, badges: 14, style: 'VISUAL',      styleColor: C.purpleLt },
  { id: 'u2',  rank: 2,  username: 'miha.p',    xp: 5410, weeklyXp: 380, streak: 22, badges: 11, style: 'AUDITORY',    styleColor: C.greenLt  },
  { id: 'u3',  rank: 3,  username: 'teja.m',    xp: 4990, weeklyXp: 310, streak: 18, badges: 10, style: 'READING',     styleColor: C.cyanLt   },
  { id: 'me',  rank: 4,  username: 'me',        xp: 3240, weeklyXp: 260, streak: 12, badges:  7, style: 'KINESTHETIC', styleColor: C.redLt,    isCurrentUser: true },
  { id: 'u5',  rank: 5,  username: 'rok.z',     xp: 3100, weeklyXp: 195, streak:  9, badges:  6, style: 'VISUAL',      styleColor: C.purpleLt },
  { id: 'u6',  rank: 6,  username: 'maja.s',    xp: 2870, weeklyXp: 180, streak:  7, badges:  5, style: 'READING',     styleColor: C.cyanLt   },
  { id: 'u7',  rank: 7,  username: 'luka.h',    xp: 2640, weeklyXp: 150, streak:  5, badges:  4, style: 'AUDITORY',    styleColor: C.greenLt  },
  { id: 'u8',  rank: 8,  username: 'nika.b',    xp: 2310, weeklyXp: 130, streak:  3, badges:  3, style: 'VISUAL',      styleColor: C.purpleLt },
  { id: 'u9',  rank: 9,  username: 'peter.v',   xp: 1980, weeklyXp:  90, streak:  2, badges:  2, style: 'KINESTHETIC', styleColor: C.redLt    },
  { id: 'u10', rank: 10, username: 'sara.n',    xp: 1540, weeklyXp:  60, streak:  1, badges:  1, style: 'READING',     styleColor: C.cyanLt   },
]

export const LEADERBOARD_STATS = {
  myRank: 4,
  totalStudents: 248,
  myXp: 3240,
  myWeeklyXp: 260,
  myStreak: 12,
  rankDelta: '+2 this week',
  xpToNext: 3100 - 3240 + 3240,   // XP needed to overtake rank 3
}
