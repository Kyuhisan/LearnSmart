import { C } from '../../styles/tokens'

export interface Module {
  id: string
  title: string
  professor: string
  hours: number
  difficulty: number
  category: string
  progress: number
  status: 'in-progress' | 'complete' | 'not-started'
  isNew?: boolean
  color: string
}

export const MODULES: Module[] = [
  { id: '1', title: 'Machine Learning Fundamentals', professor: 'Prof. Novak',  hours: 6,  difficulty: 3, category: 'CORE',      progress: 68,  status: 'in-progress',                color: C.yellow   },
  { id: '2', title: 'Neural Networks Deep Dive',     professor: 'Prof. Novak',  hours: 8,  difficulty: 5, category: 'CORE',      progress: 24,  status: 'in-progress',  isNew: true,  color: C.purple   },
  { id: '3', title: 'Linear Algebra Refresher',      professor: 'Prof. Horvat', hours: 4,  difficulty: 2, category: 'MATH',      progress: 100, status: 'complete',                    color: C.cyan     },
  { id: '4', title: 'Statistics for Data Science',   professor: 'Prof. Horvat', hours: 5,  difficulty: 3, category: 'MATH',      progress: 42,  status: 'in-progress',                color: C.green    },
  { id: '5', title: 'Python for ML Pipelines',       professor: 'Prof. Kovač',  hours: 7,  difficulty: 2, category: 'PRACTICAL', progress: 12,  status: 'in-progress',  isNew: true,  color: C.pink     },
  { id: '6', title: 'Computer Vision Basics',        professor: 'Prof. Novak',  hours: 9,  difficulty: 4, category: 'CORE',      progress: 0,   status: 'not-started',  isNew: true,  color: C.orange   },
  { id: '7', title: 'NLP & Transformers',            professor: 'Prof. Novak',  hours: 10, difficulty: 5, category: 'ADVANCED',  progress: 0,   status: 'not-started',  isNew: true,  color: C.red      },
  { id: '8', title: 'Ethics in AI',                  professor: 'Prof. Kovač',  hours: 3,  difficulty: 1, category: 'THEORY',    progress: 88,  status: 'in-progress',                color: C.yellowLt },
]

export const CATEGORIES = ['ALL', 'CORE', 'MATH', 'HANDS-ON', 'ADVANCED', 'THEORY']

export const CATEGORY_COUNT: Record<string, number> = {
  ALL: 8, CORE: 3, MATH: 2, 'HANDS-ON': 1, ADVANCED: 1, THEORY: 1,
}

// ── Professor ─────────────────────────────────────────────────────────────────

export interface ProfModule {
  id: string
  title: string
  category: string
  students: number
  contentCount: number
  status: 'published' | 'draft'
  color: string
  isNew?: boolean
}

export const PROF_MODULES: ProfModule[] = [
  { id: '1', title: 'Machine Learning Fundamentals', category: 'CORE',      students: 42, contentCount: 12, status: 'published',                color: C.yellow  },
  { id: '2', title: 'Neural Networks Deep Dive',     category: 'CORE',      students: 61, contentCount: 9,  status: 'published', isNew: true,   color: C.purple  },
  { id: '3', title: 'Linear Algebra Refresher',      category: 'MATH',      students: 38, contentCount: 7,  status: 'published',                color: C.cyan    },
  { id: '4', title: 'Statistics for Data Science',   category: 'MATH',      students: 29, contentCount: 5,  status: 'published',                color: C.green   },
  { id: '5', title: 'Python for ML Pipelines',       category: 'HANDS-ON',  students: 55, contentCount: 14, status: 'published', isNew: true,   color: C.pink    },
  { id: '6', title: 'Computer Vision Basics',        category: 'CORE',      students: 0,  contentCount: 3,  status: 'draft',                    color: C.orange  },
  { id: '7', title: 'NLP & Transformers',            category: 'ADVANCED',  students: 0,  contentCount: 2,  status: 'draft',                    color: C.red     },
  { id: '8', title: 'Ethics in AI',                  category: 'THEORY',    students: 18, contentCount: 6,  status: 'published',                color: C.yellowLt},
]

export const PROF_CATEGORIES = ['ALL', 'CORE', 'MATH', 'HANDS-ON', 'ADVANCED', 'THEORY']

export const PROF_CATEGORY_COUNT: Record<string, number> = {
  ALL: 8, CORE: 3, MATH: 2, 'HANDS-ON': 1, ADVANCED: 1, THEORY: 1,
}
