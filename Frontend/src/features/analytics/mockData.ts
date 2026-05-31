import { C } from '../../styles/tokens'

export interface WeeklyActivity {
  day: string   // 'MON' | 'TUE' etc.
  sessions: number
  avgScore: number
}

export interface ModuleStats {
  id: string
  title: string
  students: number
  avgCompletion: number
  avgScore: number
  color: string
  colorLt: string
}

export const WEEKLY_ACTIVITY: WeeklyActivity[] = [
  { day: 'MON', sessions: 38, avgScore: 74 },
  { day: 'TUE', sessions: 52, avgScore: 79 },
  { day: 'WED', sessions: 61, avgScore: 81 },
  { day: 'THU', sessions: 47, avgScore: 76 },
  { day: 'FRI', sessions: 44, avgScore: 78 },
  { day: 'SAT', sessions: 21, avgScore: 82 },
  { day: 'SUN', sessions: 15, avgScore: 85 },
]

export const MODULE_STATS: ModuleStats[] = [
  { id: '1', title: 'Machine Learning Fundamentals', students: 89,  avgCompletion: 68, avgScore: 78, color: C.yellow, colorLt: C.yellowLt },
  { id: '2', title: 'Neural Networks Deep Dive',     students: 72,  avgCompletion: 41, avgScore: 71, color: C.purple, colorLt: C.purpleLt },
  { id: '3', title: 'Computer Vision Basics',        students: 54,  avgCompletion: 22, avgScore: 65, color: C.orange, colorLt: C.orangeLt },
  { id: '4', title: 'Statistics for Data Science',   students: 91,  avgCompletion: 73, avgScore: 82, color: C.green,  colorLt: C.greenLt  },
  { id: '5', title: 'Linear Algebra Refresher',      students: 110, avgCompletion: 91, avgScore: 88, color: C.cyan,   colorLt: C.cyanLt   },
]

export interface ModuleQuizDetail {
  quiz: string
  avgScore: number
  submissions: number
  passRate: number
}

export interface ModuleDetail {
  moduleId: string
  quizzes: ModuleQuizDetail[]
}

export const MODULE_DETAILS: ModuleDetail[] = [
  { moduleId: '1', quizzes: [
    { quiz: 'Quiz #1 — Intro to ML',       avgScore: 84, submissions: 87, passRate: 91 },
    { quiz: 'Quiz #2 — Decision Trees',    avgScore: 78, submissions: 85, passRate: 82 },
    { quiz: 'Quiz #3 — Regression',        avgScore: 71, submissions: 80, passRate: 74 },
    { quiz: 'Quiz #4 — Clustering',        avgScore: 76, submissions: 78, passRate: 79 },
  ]},
  { moduleId: '2', quizzes: [
    { quiz: 'Quiz #1 — Perceptrons',       avgScore: 73, submissions: 70, passRate: 76 },
    { quiz: 'Quiz #2 — Backprop',          avgScore: 65, submissions: 68, passRate: 61 },
    { quiz: 'Quiz #3 — CNNs',              avgScore: 70, submissions: 65, passRate: 68 },
  ]},
  { moduleId: '3', quizzes: [
    { quiz: 'Quiz #1 — Image Basics',      avgScore: 68, submissions: 52, passRate: 71 },
    { quiz: 'Quiz #2 — Edge Detection',    avgScore: 61, submissions: 50, passRate: 60 },
    { quiz: 'Quiz #3 — Object Detection',  avgScore: 58, submissions: 44, passRate: 54 },
  ]},
  { moduleId: '4', quizzes: [
    { quiz: 'Quiz #1 — Probability',       avgScore: 86, submissions: 90, passRate: 93 },
    { quiz: 'Quiz #2 — Distributions',     avgScore: 81, submissions: 88, passRate: 89 },
    { quiz: 'Quiz #3 — Hypothesis Tests',  avgScore: 79, submissions: 85, passRate: 84 },
  ]},
  { moduleId: '5', quizzes: [
    { quiz: 'Quiz #1 — Vectors',           avgScore: 92, submissions: 108, passRate: 96 },
    { quiz: 'Quiz #2 — Matrices',          avgScore: 88, submissions: 105, passRate: 93 },
    { quiz: 'Quiz #3 — Eigenvalues',       avgScore: 84, submissions: 100, passRate: 89 },
  ]},
]

export interface ConceptMastery {
  concept: string
  mastery: number  // percent
  students: number
  color: string
  colorLt: string
}

export const CONCEPT_MASTERY: ConceptMastery[] = [
  { concept: 'Decision Trees',        mastery: 91, students: 87,  color: C.green,  colorLt: C.greenLt  },
  { concept: 'Neural Activation',     mastery: 74, students: 72,  color: C.cyan,   colorLt: C.cyanLt   },
  { concept: 'Gradient Descent',      mastery: 68, students: 89,  color: C.yellow, colorLt: C.yellowLt },
  { concept: 'Convolutional Layers',  mastery: 52, students: 54,  color: C.orange, colorLt: C.orangeLt },
  { concept: 'Backpropagation',       mastery: 47, students: 72,  color: C.purple, colorLt: C.purpleLt },
  { concept: 'Regularisation',        mastery: 38, students: 61,  color: C.red,    colorLt: C.redLt    },
]

