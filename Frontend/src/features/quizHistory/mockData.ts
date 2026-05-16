export interface QuizResult {
  id: string
  title: string
  module: string
  score: number    // percent 0–100
  correct: number
  total: number
  date: string
  duration: string // e.g. "4m 32s"
}

export const QUIZ_HISTORY: QuizResult[] = [
  { id: '1', title: 'Quiz #12 — Binary Trees',      module: 'Algorithms',                score: 84, correct: 21, total: 25, date: '2026-05-14', duration: '6m 10s' },
  { id: '2', title: 'Quiz #09 — Neural Layers',     module: 'Neural Networks Deep Dive', score: 60, correct: 15, total: 25, date: '2026-05-11', duration: '8m 45s' },
  { id: '3', title: 'Quiz #07 — Gradient Descent',  module: 'Machine Learning',          score: 92, correct: 23, total: 25, date: '2026-05-08', duration: '5m 02s' },
  { id: '4', title: 'Quiz #06 — Bayes Theorem',     module: 'Statistics',                score: 72, correct: 18, total: 25, date: '2026-05-05', duration: '7m 18s' },
  { id: '5', title: 'Quiz #04 — Matrix Operations', module: 'Linear Algebra',            score: 88, correct: 22, total: 25, date: '2026-04-29', duration: '5m 50s' },
  { id: '6', title: 'Quiz #03 — Python Basics',     module: 'Python for ML Pipelines',   score: 96, correct: 24, total: 25, date: '2026-04-22', duration: '3m 40s' },
]

export const QUIZ_HISTORY_STATS = {
  avgScore: 82,
  totalQuizzes: 12,
  bestScore: 96,
  totalTime: '1h 14m',
}
