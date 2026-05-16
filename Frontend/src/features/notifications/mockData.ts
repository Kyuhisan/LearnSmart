export interface Notification {
  id: string
  icon: string
  title: string
  body: string
  time: string
  read: boolean
  type: 'quiz' | 'module' | 'badge' | 'system' | 'ai'
}

export const STUDENT_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: '⚡', title: 'Quiz due TODAY',            body: 'Quiz #14 — Decision Trees is due today. Don\'t miss it!',     time: '1H AGO',  read: false, type: 'quiz'   },
  { id: '2', icon: '🏆', title: 'New badge earned!',         body: 'You\'ve earned the "LEADERBOARD" badge. Keep it up!',         time: '4H AGO',  read: false, type: 'badge'  },
  { id: '3', icon: '📚', title: 'New module available',      body: 'NLP & Transformers has been published by Prof. Novak.',       time: 'YESTERDAY', read: true, type: 'module' },
  { id: '4', icon: '✅', title: 'Module complete',           body: 'You completed Linear Algebra Refresher. Well done!',          time: '2D AGO',  read: true,  type: 'module' },
  { id: '5', icon: '🔔', title: 'Reminder: streak at risk',  body: 'Log in and study for at least 5 minutes to keep your streak.','time': '3D AGO',  read: true,  type: 'system' },
]

export const PROFESSOR_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: '✨', title: 'AI quiz ready for review',  body: '8 new AI-generated questions are pending your approval.',     time: '1H AGO',  read: false, type: 'ai'     },
  { id: '2', icon: '👥', title: 'Quiz submissions coming in', body: '32 students have started Quiz #14 — Decision Trees.',        time: '3H AGO',  read: false, type: 'quiz'   },
  { id: '3', icon: '📤', title: 'Upload complete',            body: 'Lecture 7 slides.pdf (12 MB) has been processed.',           time: 'YESTERDAY', read: true, type: 'module' },
  { id: '4', icon: '📊', title: 'Weekly report ready',       body: 'Your class analytics report for week 18 is ready to view.',  time: '2D AGO',  read: true,  type: 'system' },
  { id: '5', icon: '🔔', title: 'New student enrolled',      body: '3 new students joined Machine Learning Fundamentals.',        time: '3D AGO',  read: true,  type: 'system' },
]
