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
  emoji: string
  bg: string
  dark?: boolean
}

export const PROFESSOR_STATS: ProfStatCard[] = [
  { value: '134', label: 'STUDENTS',   emoji: '👥', bg: C.purple, dark: true  },
  { value: '4',   label: 'MODULES',    emoji: '📚', bg: C.yellow               },
  { value: '3',   label: 'PENDING',    emoji: '⏳', bg: C.red,    dark: true  },
  { value: '71%', label: 'COMPLETION', emoji: '📈', bg: C.green                },
]

export interface ProfModule {
  title: string
  students: number
  completion: number
  mascot: string
  draft?: boolean
}

export const PROFESSOR_MODULES: ProfModule[] = [
  { title: 'Algorithms',        students: 42, completion: 74, mascot: '🤖'              },
  { title: 'Web Dev',           students: 61, completion: 89, mascot: '🐸'              },
  { title: 'Databases',         students: 38, completion: 51, mascot: '🦊'              },
  { title: 'Operating Systems', students: 29, completion: 0,  mascot: '🐻', draft: true },
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
  emoji: string
}

export const PROFESSOR_STYLE_MIX: StyleMix[] = [
  { label: 'Visual',      count: 62, percent: 46, color: C.purple, emoji: '👁'  },
  { label: 'Kinesthetic', count: 31, percent: 23, color: C.red,    emoji: '🤸' },
  { label: 'Reading',     count: 25, percent: 19, color: C.cyan,   emoji: '📖' },
  { label: 'Auditory',    count: 16, percent: 12, color: C.green,  emoji: '🎧' },
]

export interface TopPerformer {
  name: string
  style: LearningStyle
  score: string
  emoji: string
}

export const PROFESSOR_TOP_PERFORMERS: TopPerformer[] = [
  { name: 'Sara Horvat', style: 'visual',      score: '96%', emoji: '🤖' },
  { name: 'Matic Kuhar', style: 'visual',      score: '92%', emoji: '🤖' },
  { name: 'Jure Kovač',  style: 'auditory',    score: '84%', emoji: '🐸' },
  { name: 'Nina Žagar',  style: 'kinesthetic', score: '78%', emoji: '🐻' },
]
