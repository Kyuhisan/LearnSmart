import { C } from '../../styles/tokens'

export interface Badge {
  id: string
  label: string
  description: string
  earned: boolean
  earnedDate?: string
  color: string
  colorLt: string
}

export interface ProgressModule {
  id: string
  title: string
  progress: number
  color: string
  colorLt: string
  quizzesPassed: number
  quizzesTotal: number
  avgScore: number
}

export interface DailyXp {
  label: string  // e.g. 'May 10'
  xp: number
}

export interface CalendarDay {
  date: string   // 'YYYY-MM-DD'
  xp: number
  future?: boolean
}

export const BADGES: Badge[] = [
  { id: '1', label: 'FIRST STEP',    description: 'Complete your first module',         earned: true,  earnedDate: 'Apr 1',  color: C.green,  colorLt: C.greenLt  },
  { id: '2', label: 'STREAK 7',      description: 'Maintain a 7-day learning streak',   earned: true,  earnedDate: 'Apr 15', color: C.orange, colorLt: C.orangeLt },
  { id: '3', label: 'QUIZ ACE',      description: 'Score 90%+ on any quiz',             earned: true,  earnedDate: 'May 8',  color: C.cyan,   colorLt: C.cyanLt   },
  { id: '4', label: 'TOP 5',         description: 'Reach top 5 on the leaderboard',     earned: true,  earnedDate: 'May 13', color: C.yellow, colorLt: C.yellowLt },
  { id: '5', label: 'COMPLETIONIST', description: 'Complete 5 modules',                  earned: false, color: C.purple, colorLt: C.purpleLt },
  { id: '6', label: 'STREAK 30',     description: 'Maintain a 30-day learning streak',  earned: false, color: C.red,    colorLt: C.redLt    },
  { id: '7', label: 'PERFECT SCORE', description: 'Score 100% on any quiz',             earned: false, color: C.pink,   colorLt: C.pinkLt   },
  { id: '8', label: 'SPEED RUN',     description: 'Finish a quiz in under 2 minutes',   earned: false, color: C.green,  colorLt: C.greenLt  },
]

export const PROGRESS_MODULES: ProgressModule[] = [
  { id: '1', title: 'Machine Learning Fundamentals', progress: 68,  color: C.yellow, colorLt: C.yellowLt, quizzesPassed: 9,  quizzesTotal: 14, avgScore: 81 },
  { id: '2', title: 'Neural Networks Deep Dive',     progress: 24,  color: C.purple, colorLt: C.purpleLt, quizzesPassed: 3,  quizzesTotal: 11, avgScore: 69 },
  { id: '3', title: 'Linear Algebra Refresher',      progress: 100, color: C.cyan,   colorLt: C.cyanLt,   quizzesPassed: 8,  quizzesTotal: 8,  avgScore: 91 },
  { id: '4', title: 'Statistics for Data Science',   progress: 42,  color: C.green,  colorLt: C.greenLt,  quizzesPassed: 5,  quizzesTotal: 10, avgScore: 74 },
  { id: '5', title: 'Python for ML Pipelines',       progress: 12,  color: C.pink,   colorLt: C.pinkLt,   quizzesPassed: 1,  quizzesTotal: 9,  avgScore: 62 },
]

// 14 days ending today (May 10–23). Week 1 sum = 420, Week 2 sum = 700 → +67%
export const BIWEEKLY_XP: DailyXp[] = [
  { label: 'May 10', xp: 60  },
  { label: 'May 11', xp: 50  },
  { label: 'May 12', xp: 80  },
  { label: 'May 13', xp: 100 },
  { label: 'May 14', xp: 60  },
  { label: 'May 15', xp: 40  },
  { label: 'May 16', xp: 30  },
  { label: 'May 17', xp: 80  },
  { label: 'May 18', xp: 120 },
  { label: 'May 19', xp: 0   },
  { label: 'May 20', xp: 200 },
  { label: 'May 21', xp: 150 },
  { label: 'May 22', xp: 60  },
  { label: 'May 23', xp: 90  },
]

// 5 weeks (Mon Apr 20 – Sun May 24), rows = weeks, cols = Mon–Sun
// May 24 is future (marked future: true)
export const CALENDAR_DAYS: CalendarDay[] = [
  { date: '2026-04-20', xp: 130 }, { date: '2026-04-21', xp: 90  }, { date: '2026-04-22', xp: 180 }, { date: '2026-04-23', xp: 70  }, { date: '2026-04-24', xp: 0   }, { date: '2026-04-25', xp: 50  }, { date: '2026-04-26', xp: 160 },
  { date: '2026-04-27', xp: 200 }, { date: '2026-04-28', xp: 140 }, { date: '2026-04-29', xp: 0   }, { date: '2026-04-30', xp: 220 }, { date: '2026-05-01', xp: 100 }, { date: '2026-05-02', xp: 80  }, { date: '2026-05-03', xp: 0   },
  { date: '2026-05-04', xp: 120 }, { date: '2026-05-05', xp: 200 }, { date: '2026-05-06', xp: 180 }, { date: '2026-05-07', xp: 160 }, { date: '2026-05-08', xp: 90  }, { date: '2026-05-09', xp: 60  }, { date: '2026-05-10', xp: 60  },
  { date: '2026-05-11', xp: 50  }, { date: '2026-05-12', xp: 80  }, { date: '2026-05-13', xp: 100 }, { date: '2026-05-14', xp: 60  }, { date: '2026-05-15', xp: 40  }, { date: '2026-05-16', xp: 30  }, { date: '2026-05-17', xp: 80  },
  { date: '2026-05-18', xp: 120 }, { date: '2026-05-19', xp: 0   }, { date: '2026-05-20', xp: 200 }, { date: '2026-05-21', xp: 150 }, { date: '2026-05-22', xp: 60  }, { date: '2026-05-23', xp: 90  }, { date: '2026-05-24', xp: 0, future: true },
]

export const PROGRESS_STATS = {
  xp: 3240,
  xpDelta: '+260 this week',
  streak: 12,
  streakBest: 18,
  modulesCompleted: 1,
  modulesTotal: 5,
  totalBadges: 4,
  badgesTotal: 8,
  biweeklyGain: 67,  // % XP gained vs previous 7 days
}
