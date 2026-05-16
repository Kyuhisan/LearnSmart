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
}

export interface StyleBreakdown {
  label: string
  percent: number
  color: string
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
  { id: '1', title: 'Machine Learning Fundamentals', students: 89,  avgCompletion: 68, avgScore: 78, color: C.yellow  },
  { id: '2', title: 'Neural Networks Deep Dive',     students: 72,  avgCompletion: 41, avgScore: 71, color: C.purple  },
  { id: '3', title: 'Computer Vision Basics',        students: 54,  avgCompletion: 22, avgScore: 65, color: C.orange  },
  { id: '4', title: 'Statistics for Data Science',   students: 91,  avgCompletion: 73, avgScore: 82, color: C.green   },
  { id: '5', title: 'Linear Algebra Refresher',      students: 110, avgCompletion: 91, avgScore: 88, color: C.cyan    },
]

export const STYLE_BREAKDOWN: StyleBreakdown[] = [
  { label: 'VISUAL',      percent: 38, color: C.purple },
  { label: 'READING',     percent: 27, color: C.cyan   },
  { label: 'AUDITORY',    percent: 21, color: C.green  },
  { label: 'KINESTHETIC', percent: 14, color: C.red    },
]

export const ANALYTICS_STATS = {
  activeStudents: 134,
  totalStudents: 248,
  avgScore: 78,
  avgScoreDelta: '+4%',
  avgCompletion: 61,
  quizzesGraded: 86,
}
