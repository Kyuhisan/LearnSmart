import { C } from '../../styles/tokens'

export const STUDENT_STATS = {
  streak: 12,
  xp: 3240,
  rank: 4,
  modulesInProgress: 3,
}

export interface RecentModule {
  id: string
  title: string
  progress: number
  color: string
  nextUp: string
}

export const STUDENT_RECENT_MODULES: RecentModule[] = [
  { id: '1', title: 'Machine Learning Fundamentals', progress: 68, color: C.yellow,  nextUp: 'Ch. 4 — Gradient Descent'  },
  { id: '2', title: 'Neural Networks Deep Dive',     progress: 24, color: C.purple,  nextUp: 'Ch. 2 — Backpropagation'   },
  { id: '4', title: 'Statistics for Data Science',   progress: 42, color: C.green,   nextUp: 'Ch. 3 — Hypothesis Testing' },
]

export interface UpcomingQuiz {
  id: string
  title: string
  module: string
  due: string
  urgent: boolean
}

export const STUDENT_UPCOMING_QUIZZES: UpcomingQuiz[] = [
  { id: '1', title: 'Quiz #14 — Decision Trees',   module: 'Machine Learning', due: 'TODAY',    urgent: true  },
  { id: '2', title: 'Quiz #08 — Matrix Operations', module: 'Linear Algebra',  due: 'IN 2 DAYS', urgent: false },
]

export const PROFESSOR_STATS = {
  students: 248,
  activeToday: 134,
  modules: 12,
  pendingQuizzes: 3,
  avgScore: 78,
}

export interface PendingQuiz {
  id: string
  title: string
  module: string
  submissions: number
}

export const PROFESSOR_PENDING_QUIZZES: PendingQuiz[] = [
  { id: '1', title: 'Quiz #14 — Decision Trees',    module: 'Machine Learning', submissions: 32 },
  { id: '2', title: 'Quiz #06 — Bayes Theorem',     module: 'Statistics',       submissions: 18 },
  { id: '3', title: 'Quiz #11 — Conv. Networks',    module: 'Computer Vision',  submissions: 41 },
]

export interface StyleMix {
  label: string
  percent: number
  color: string
}

export const PROFESSOR_STYLE_MIX: StyleMix[] = [
  { label: 'VISUAL',      percent: 38, color: C.purple },
  { label: 'READING',     percent: 27, color: C.cyan   },
  { label: 'AUDITORY',    percent: 21, color: C.green  },
  { label: 'KINESTHETIC', percent: 14, color: C.red    },
]
