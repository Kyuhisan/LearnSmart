import { C, type LearningStyle } from '../../styles/tokens'
import type { ActivityItem } from '../../components/professor/ActivityPanel'

export const STUDENT_STATS = {
  xp: 2450,
  xpRankDelta: +3,
  quizzes: 12,
  avgScore: 78,
  streak: 7,
  bestStreak: 14,
  badges: 8,
  badgesInProgress: 3,
}

export const STUDENT_PROFILE = {
  level: 5,
  learningStyle: 'visual' as LearningStyle,
  streak: 7,
  varkScores: { visual: 5, reading: 2, auditory: 1, kinesthetic: 0 } as Record<LearningStyle, number>,
}

export const STUDENT_ACTIVITY: ActivityItem[] = [
  { iconBg: C.cyanLt,   title: 'Completed Quiz #12 — Binary Trees',       time: '2H AGO',  badge: '84%'     },
  { iconBg: C.yellowLt, title: 'Resumed: Machine Learning Fundamentals',   time: '4H AGO',  badge: 'CH. 3'   },
  { iconBg: C.greenLt,  title: 'Moved to rank #4 on leaderboard',          time: 'TODAY',   badge: '+150 XP' },
  { iconBg: C.purpleLt, title: 'Completed module: Linear Algebra',         time: '2D AGO',  badge: 'DONE'    },
]

export const PROFESSOR_STATS = {
  students: 248,
  activeToday: 134,
  modules: 12,
  published: 4,
  quizzes: 89,
  aiPending: 11,
  avgScore: 78,
  avgScoreDelta: '+4%',
}

export const PROFESSOR_ACTIVITY: ActivityItem[] = [
  { iconBg: C.purpleLt, title: 'AI generated: 8 quiz questions', time: '1H AGO', badge: 'PENDING' },
  { iconBg: C.yellowLt, title: 'Uploaded: Lecture 7 slides.pdf',  time: '3H AGO', badge: '12 MB'  },
  { iconBg: C.cyanLt,   title: '32 students started Quiz #14',    time: 'TODAY',  badge: 'LIVE'   },
  { iconBg: C.greenLt,  title: 'Weekly report exported',          time: '2D AGO', badge: 'CSV'    },
]
