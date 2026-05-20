import { C } from '../../styles/tokens'

export interface StudentDetailProfile {
  id: string
  username: string
  fullName: string
  email: string
  learningStyle: 'VISUAL' | 'READING' | 'AUDITORY' | 'KINESTHETIC'
  xp: number
  avgScore: number
  streak: number
  rank: number
  joinedDate: string
  lastActive: string
}

export interface StudentModuleProgress {
  id: string
  title: string
  progress: number
  color: string
  avgQuizScore: number
  quizzesDone: number
  lastActivity: string
}

export interface StudentQuizRecord {
  id: string
  title: string
  module: string
  score: number
  date: string
}

export const STUDENT_DETAIL: StudentDetailProfile = {
  id: '1',
  username: 'ana.k',
  fullName: 'Ana Kovač',
  email: 'ana.k@learnsmart.si',
  learningStyle: 'VISUAL',
  xp: 5820,
  avgScore: 94,
  streak: 31,
  rank: 1,
  joinedDate: '2026-03-01',
  lastActive: 'TODAY',
}

export const STUDENT_MODULE_PROGRESS: StudentModuleProgress[] = [
  { id: '1', title: 'Machine Learning Fundamentals', progress: 92, color: C.yellow, avgQuizScore: 94, quizzesDone: 13, lastActivity: 'TODAY'     },
  { id: '2', title: 'Neural Networks Deep Dive',     progress: 78, color: C.purple, avgQuizScore: 88, quizzesDone: 8,  lastActivity: 'YESTERDAY' },
  { id: '3', title: 'Linear Algebra Refresher',      progress: 100, color: C.cyan,  avgQuizScore: 96, quizzesDone: 8,  lastActivity: '4D AGO'    },
  { id: '4', title: 'Statistics for Data Science',   progress: 55, color: C.green,  avgQuizScore: 85, quizzesDone: 5,  lastActivity: '2D AGO'    },
]

export const STUDENT_QUIZ_RECORDS: StudentQuizRecord[] = [
  { id: '1', title: 'Quiz #14 — Decision Trees',  module: 'Machine Learning', score: 96, date: '2026-05-15' },
  { id: '2', title: 'Quiz #12 — Binary Trees',    module: 'Algorithms',       score: 92, date: '2026-05-10' },
  { id: '3', title: 'Quiz #09 — Neural Layers',   module: 'Neural Networks',  score: 88, date: '2026-05-06' },
  { id: '4', title: 'Quiz #08 — Matrix Ops',      module: 'Linear Algebra',   score: 100,date: '2026-04-28' },
]
