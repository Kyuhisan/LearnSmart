import { C } from '../../styles/tokens'

export interface Module {
  id: string
  title: string
  professor: string
  hours: number
  stars: number
  category: string
  progress: number
  status: 'in-progress' | 'complete' | 'not-started'
  isNew?: boolean
  color: string
}

export const MODULES: Module[] = [
  { id: '1', title: 'Machine Learning Fundamentals', professor: 'Prof. Novak',  hours: 6,  stars: 3, category: 'CORE',      progress: 68,  status: 'in-progress',                color: C.yellow   },
  { id: '2', title: 'Neural Networks Deep Dive',     professor: 'Prof. Novak',  hours: 8,  stars: 3, category: 'CORE',      progress: 24,  status: 'in-progress',  isNew: true,  color: C.purple   },
  { id: '3', title: 'Linear Algebra Refresher',      professor: 'Prof. Horvat', hours: 4,  stars: 3, category: 'MATH',      progress: 100, status: 'complete',                    color: C.cyan     },
  { id: '4', title: 'Statistics for Data Science',   professor: 'Prof. Horvat', hours: 5,  stars: 3, category: 'MATH',      progress: 42,  status: 'in-progress',                color: C.green    },
  { id: '5', title: 'Python for ML Pipelines',       professor: 'Prof. Kovač',  hours: 7,  stars: 3, category: 'PRACTICAL', progress: 12,  status: 'in-progress',  isNew: true,  color: C.pink     },
  { id: '6', title: 'Computer Vision Basics',        professor: 'Prof. Novak',  hours: 9,  stars: 3, category: 'CORE',      progress: 0,   status: 'not-started',  isNew: true,  color: C.orange   },
  { id: '7', title: 'NLP & Transformers',            professor: 'Prof. Novak',  hours: 10, stars: 3, category: 'ADVANCED',  progress: 0,   status: 'not-started',  isNew: true,  color: C.red      },
  { id: '8', title: 'Ethics in AI',                  professor: 'Prof. Kovač',  hours: 3,  stars: 3, category: 'THEORY',    progress: 88,  status: 'in-progress',                color: C.yellowLt },
]

export const CATEGORIES = ['ALL', 'CORE', 'MATH', 'HANDS-ON', 'ADVANCED', 'THEORY']

export const CATEGORY_COUNT: Record<string, number> = {
  ALL: 8, CORE: 3, MATH: 2, 'HANDS-ON': 1, ADVANCED: 1, THEORY: 1,
}
