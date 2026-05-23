import { C } from '../../styles/tokens'

export type NotifType = 'quiz' | 'module' | 'announcement' | 'badge' | 'system'

export interface Notification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  group: 'Today' | 'Yesterday' | 'Older'
  read: boolean
}

export const TYPE_META: Record<NotifType, { label: string; color: string; bg: string }> = {
  quiz:         { label: 'QUIZ',      color: C.red,    bg: C.redLt    },
  module:       { label: 'MODULE',    color: C.yellow, bg: C.yellowLt },
  announcement: { label: 'ANNOUNCE', color: C.purple, bg: C.purpleLt },
  badge:        { label: 'BADGE',     color: C.green,  bg: C.greenLt  },
  system:       { label: 'SYSTEM',    color: C.muted,  bg: C.mutedLt  },
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1',  type: 'quiz',         group: 'Today',     title: 'Quiz due today',               body: "Quiz #14 — Decision Trees is due in 3 hours. You haven't started yet.",        time: '2h ago',    read: false },
  { id: '2',  type: 'badge',        group: 'Today',     title: 'New badge earned!',            body: 'You earned the "10-Day Streak" badge. Keep the momentum going!',                time: '4h ago',    read: false },
  { id: '3',  type: 'module',       group: 'Today',     title: 'New chapter available',        body: 'Chapter 5 — Neural Activation has been published in Neural Networks Deep Dive.', time: '6h ago',   read: false },
  { id: '4',  type: 'announcement', group: 'Today',     title: 'Prof. Novak posted an update', body: 'Office hours moved to Friday 14:00–16:00 this week.',                           time: '8h ago',    read: false },
  { id: '5',  type: 'quiz',         group: 'Yesterday', title: 'Quiz result ready',            body: 'You scored 88% on Quiz #13 — Clustering Algorithms. Well done!',                time: 'Yesterday', read: true  },
  { id: '6',  type: 'system',       group: 'Yesterday', title: 'Streak reminder',              body: "Don't break your 11-day streak! Complete at least one activity today.",          time: 'Yesterday', read: true  },
  { id: '7',  type: 'module',       group: 'Yesterday', title: 'Module recommended',           body: 'Based on your progress, BIT recommends starting Data Structures this week.',    time: 'Yesterday', read: true  },
  { id: '8',  type: 'quiz',         group: 'Older',     title: 'New quiz assigned',            body: 'Quiz #14 — Decision Trees has been assigned. Due: May 22.',                     time: 'May 20',    read: true  },
  { id: '9',  type: 'announcement', group: 'Older',     title: 'Class announcement',           body: 'Midterm results posted. Check your profile for detailed feedback.',             time: 'May 19',    read: true  },
  { id: '10', type: 'badge',        group: 'Older',     title: 'Badge unlocked',               body: 'You unlocked "Quiz Master" — 5 quizzes scored above 85%.',                     time: 'May 18',    read: true  },
  { id: '11', type: 'system',       group: 'Older',     title: 'Weekly summary',               body: 'Last week: 3 quizzes completed, 240 XP earned, rank moved from #6 to #4.',      time: 'May 17',    read: true  },
  { id: '12', type: 'module',       group: 'Older',     title: 'Module completed',             body: 'You completed Introduction to Python. 120 XP awarded.',                         time: 'May 15',    read: true  },
]

export const FILTER_TABS = ['ALL', 'UNREAD', 'QUIZZES', 'MODULES', 'ANNOUNCEMENTS'] as const
export type FilterTab = typeof FILTER_TABS[number]
