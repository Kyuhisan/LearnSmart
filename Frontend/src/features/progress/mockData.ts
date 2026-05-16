import { C } from '../../styles/tokens'

export interface Badge {
  id: string
  label: string
  icon: string
  description: string
  earned: boolean
  earnedDate?: string
}

export interface ProgressModule {
  id: string
  title: string
  progress: number
  color: string
  quizzesPassed: number
  quizzesTotal: number
}

export const BADGES: Badge[] = [
  { id: '1', label: 'FIRST STEP',    icon: '👣', description: 'Complete your first module',         earned: true,  earnedDate: '2026-04-01' },
  { id: '2', label: 'STREAK 7',      icon: '🔥', description: 'Maintain a 7-day learning streak',   earned: true,  earnedDate: '2026-04-15' },
  { id: '3', label: 'QUIZ ACE',      icon: '⚡', description: 'Score 90%+ on any quiz',             earned: true,  earnedDate: '2026-05-08' },
  { id: '4', label: 'LEADERBOARD',   icon: '🏆', description: 'Reach top 5 on the leaderboard',     earned: true,  earnedDate: '2026-05-13' },
  { id: '5', label: 'COMPLETIONIST', icon: '✅', description: 'Complete 5 modules',                  earned: false  },
  { id: '6', label: 'STREAK 30',     icon: '💎', description: 'Maintain a 30-day learning streak',  earned: false  },
  { id: '7', label: 'PERFECT SCORE', icon: '🌟', description: 'Score 100% on any quiz',             earned: false  },
]

export const PROGRESS_MODULES: ProgressModule[] = [
  { id: '1', title: 'Machine Learning Fundamentals', progress: 68, color: C.yellow, quizzesPassed: 9,  quizzesTotal: 14 },
  { id: '2', title: 'Neural Networks Deep Dive',     progress: 24, color: C.purple, quizzesPassed: 3,  quizzesTotal: 11 },
  { id: '3', title: 'Linear Algebra Refresher',      progress: 100, color: C.cyan,  quizzesPassed: 8,  quizzesTotal: 8  },
  { id: '4', title: 'Statistics for Data Science',   progress: 42, color: C.green,  quizzesPassed: 5,  quizzesTotal: 10 },
  { id: '5', title: 'Python for ML Pipelines',       progress: 12, color: C.pink,   quizzesPassed: 1,  quizzesTotal: 9  },
]

export const PROGRESS_STATS = {
  xp: 3240,
  streak: 12,
  modulesCompleted: 1,
  totalBadges: 4,
}
