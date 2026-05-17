import { C } from '../../styles/tokens'
import type { LearningStyle } from '../../styles/tokens'

// ── Student ───────────────────────────────────────────────────────────────────

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
  { id: '1', title: 'Machine Learning Fundamentals', progress: 68, color: C.yellow,  nextUp: 'Ch. 4 — Gradient Descent'   },
  { id: '2', title: 'Neural Networks Deep Dive',     progress: 24, color: C.purple,  nextUp: 'Ch. 2 — Backpropagation'    },
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
  { id: '1', title: 'Quiz #14 — Decision Trees',    module: 'Machine Learning', due: 'TODAY',    urgent: true  },
  { id: '2', title: 'Quiz #08 — Matrix Operations', module: 'Linear Algebra',  due: 'IN 2 DAYS', urgent: false },
]

// ── Professor ─────────────────────────────────────────────────────────────────

export interface ProfStatCard {
  value: string
  label: string
  bg: string
  dark?: boolean
}

export const PROFESSOR_STATS: ProfStatCard[] = [
  { value: '134', label: 'STUDENTS',   bg: C.purple, dark: true },
  { value: '4',   label: 'MODULES',    bg: C.yellow             },
  { value: '3',   label: 'PENDING',    bg: C.red,    dark: true },
  { value: '71%', label: 'COMPLETION', bg: C.green              },
]

export interface ProfModule {
  title: string
  students: number
  completion: number
  draft?: boolean
}

export const PROFESSOR_MODULES: ProfModule[] = [
  { title: 'Algorithms',        students: 42, completion: 74             },
  { title: 'Web Dev',           students: 61, completion: 89             },
  { title: 'Databases',         students: 38, completion: 51             },
  { title: 'Operating Systems', students: 29, completion: 0,  draft: true},
]

export interface PendingQuiz {
  module: string
  topic: string
  questions: number
}

export const PROFESSOR_PENDING_QUIZZES: PendingQuiz[] = [
  { module: 'Algorithms', topic: 'Graph Traversal', questions: 8 },
  { module: 'Web Dev',    topic: 'React Hooks',     questions: 5 },
  { module: 'Databases',  topic: 'Indexing',        questions: 6 },
]

export interface StyleMix {
  label: string
  count: number
  percent: number
  color: string
}

export const PROFESSOR_STYLE_MIX: StyleMix[] = [
  { label: 'Visual',      count: 62, percent: 46, color: C.purple },
  { label: 'Kinesthetic', count: 31, percent: 23, color: C.red    },
  { label: 'Reading',     count: 25, percent: 19, color: C.cyan   },
  { label: 'Auditory',    count: 16, percent: 12, color: C.green  },
]

export interface TopPerformer {
  name: string
  style: LearningStyle
  score: string
}

export const PROFESSOR_TOP_PERFORMERS: TopPerformer[] = [
  { name: 'Sara Horvat', style: 'visual',      score: '96%' },
  { name: 'Matic Kuhar', style: 'visual',      score: '92%' },
  { name: 'Jure Kovač',  style: 'auditory',    score: '84%' },
  { name: 'Nina Žagar',  style: 'kinesthetic', score: '78%' },
]
