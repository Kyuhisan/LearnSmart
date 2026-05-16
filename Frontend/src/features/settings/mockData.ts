export interface SettingsProfile {
  username: string
  email: string
  fullName: string
  bio: string
  avatarInitials: string
}

export const STUDENT_PROFILE_SETTINGS: SettingsProfile = {
  username: 'me',
  email: 'student@learnsmart.si',
  fullName: 'Miha Učenec',
  bio: 'Passionate about machine learning and data science.',
  avatarInitials: 'MU',
}

export const PROFESSOR_PROFILE_SETTINGS: SettingsProfile = {
  username: 'prof.novak',
  email: 'novak@learnsmart.si',
  fullName: 'Prof. Janez Novak',
  bio: 'Teaching ML, Neural Networks, and Computer Vision.',
  avatarInitials: 'JN',
}

export interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

export const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: 'quiz_due',    label: 'Quiz reminders',       description: 'Alert before a quiz deadline',        enabled: true  },
  { id: 'new_module',  label: 'New module published',  description: 'Notify when a new module drops',      enabled: true  },
  { id: 'badge',       label: 'Badge earned',          description: 'Celebrate when you earn a badge',     enabled: true  },
  { id: 'streak',      label: 'Streak reminders',      description: 'Warn when your streak is at risk',    enabled: false },
  { id: 'weekly',      label: 'Weekly summary',        description: 'Get a weekly progress digest',        enabled: false },
]

export const LEARNING_STYLE_OPTIONS = ['VISUAL', 'READING', 'AUDITORY', 'KINESTHETIC'] as const
export type LearningStyle = (typeof LEARNING_STYLE_OPTIONS)[number]
