import { C } from '../../styles/tokens'
import type { LearningStyle } from '../../styles/tokens'

// ── Student ───────────────────────────────────────────────────────────────────

export const STUDENT_STATS = {
  streak: 12,
  xp: 3240,
  rank: 4,
  modulesInProgress: 3,
  avgQuizScore: 84,
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

export const STUDENT_LEARNING_TYPE = {
  style: 'visual' as LearningStyle,
  label: 'VISUAL LEARNER',
  description: 'You absorb information best through diagrams, charts, and visual representations. Modules are tailored to show you concept maps and video content first.',
  tips: ['Look for diagram-heavy modules', 'Try color-coding your notes', 'Use concept maps to review'],
  vark: [
    { key: 'V', label: 'Visual',      score: 82, color: C.purple },
    { key: 'A', label: 'Auditory',    score: 25, color: C.cyan   },
    { key: 'R', label: 'Reading',     score: 55, color: C.green  },
    { key: 'K', label: 'Kinesthetic', score: 38, color: C.orange },
  ],
}

export interface DailyQuest {
  id: string
  label: string
  xp: number
  done: boolean
}

export const STUDENT_DAILY_QUESTS: DailyQuest[] = [
  { id: '1', label: 'Complete 1 quiz',           xp: 50,  done: true  },
  { id: '2', label: 'Study for 20 minutes',       xp: 30,  done: true  },
  { id: '3', label: 'Finish a module chapter',    xp: 80,  done: false },
  { id: '4', label: 'Review yesterday\'s notes',  xp: 20,  done: false },
]

export interface BitPick {
  id: string
  title: string
  reason: string
  color: string
  xp: number
  duration: string
}

export const STUDENT_BIT_PICKS: BitPick[] = [
  { id: '5', title: 'Data Structures',   reason: 'Matches your visual learning style', color: C.purple, xp: 120, duration: '45 min' },
  { id: '6', title: 'Computer Networks', reason: 'Trending among top students',         color: C.cyan,   xp: 90,  duration: '30 min' },
  { id: '7', title: 'Algorithm Design',  reason: 'Builds on your Algorithms progress',  color: C.green,  xp: 150, duration: '60 min' },
]

export interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  isMe?: boolean
}

export const STUDENT_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sara Horvat', xp: 5120 },
  { rank: 2, name: 'Matic Kuhar', xp: 4870 },
  { rank: 3, name: 'Jure Kovač',  xp: 4210 },
  { rank: 4, name: 'You',         xp: 3240, isMe: true },
  { rank: 5, name: 'Nina Žagar',  xp: 3190 },
]

export interface Badge {
  id: string
  label: string
  earned: string
  bg: string
}

export const STUDENT_BADGES: Badge[] = [
  { id: '1', label: '10-DAY STREAK',   earned: 'May 10', bg: C.yellow   },
  { id: '2', label: 'QUIZ MASTER',     earned: 'May 8',  bg: C.red      },
  { id: '3', label: 'PERFECT SCORE',   earned: 'May 3',  bg: C.cyan     },
  { id: '4', label: 'BOOKWORM',        earned: 'Apr 28', bg: C.green    },
  { id: '5', label: 'FAST LEARNER',    earned: 'Apr 20', bg: C.mutedLt  },
  { id: '6', label: 'TOP 5 THIS WEEK', earned: 'Apr 14', bg: C.mutedLt  },
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
  colorLt: string
}

export const PROFESSOR_STYLE_MIX: StyleMix[] = [
  { label: 'Visual',      count: 62, percent: 46, color: C.purple, colorLt: C.purpleLt },
  { label: 'Kinesthetic', count: 31, percent: 23, color: C.red,    colorLt: C.redLt    },
  { label: 'Reading',     count: 25, percent: 19, color: C.cyan,   colorLt: C.cyanLt   },
  { label: 'Auditory',    count: 16, percent: 12, color: C.green,  colorLt: C.greenLt  },
]

export interface TopPerformer {
  id: string
  name: string
  style: LearningStyle
  score: string
}

export const PROFESSOR_TOP_PERFORMERS: TopPerformer[] = [
  { id: '1', name: 'Sara Horvat', style: 'visual',      score: '96%' },
  { id: '2', name: 'Matic Kuhar', style: 'visual',      score: '92%' },
  { id: '3', name: 'Jure Kovač',  style: 'auditory',    score: '84%' },
  { id: '4', name: 'Nina Žagar',  style: 'kinesthetic', score: '78%' },
]
