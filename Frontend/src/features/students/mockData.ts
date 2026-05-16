export interface Student {
  id: string
  username: string
  fullName: string
  email: string
  learningStyle: 'VISUAL' | 'READING' | 'AUDITORY' | 'KINESTHETIC'
  modulesEnrolled: number
  avgScore: number
  lastActive: string
  streak: number
  xp: number
}

export const STUDENTS: Student[] = [
  { id: '1',  username: 'ana.k',   fullName: 'Ana Kovač',     email: 'ana.k@learnsmart.si',   learningStyle: 'VISUAL',      modulesEnrolled: 5, avgScore: 91, lastActive: 'TODAY',      streak: 31, xp: 5820 },
  { id: '2',  username: 'miha.p',  fullName: 'Miha Peterlin', email: 'miha.p@learnsmart.si',  learningStyle: 'KINESTHETIC', modulesEnrolled: 5, avgScore: 87, lastActive: 'TODAY',      streak: 22, xp: 5410 },
  { id: '3',  username: 'teja.m',  fullName: 'Teja Mrak',     email: 'teja.m@learnsmart.si',  learningStyle: 'AUDITORY',    modulesEnrolled: 4, avgScore: 83, lastActive: 'YESTERDAY',  streak: 18, xp: 4990 },
  { id: '4',  username: 'rok.z',   fullName: 'Rok Zupan',     email: 'rok.z@learnsmart.si',   learningStyle: 'READING',     modulesEnrolled: 4, avgScore: 79, lastActive: '2D AGO',     streak: 9,  xp: 3100 },
  { id: '5',  username: 'maja.s',  fullName: 'Maja Šimič',    email: 'maja.s@learnsmart.si',  learningStyle: 'VISUAL',      modulesEnrolled: 3, avgScore: 74, lastActive: '2D AGO',     streak: 7,  xp: 2870 },
  { id: '6',  username: 'luka.h',  fullName: 'Luka Horvat',   email: 'luka.h@learnsmart.si',  learningStyle: 'READING',     modulesEnrolled: 3, avgScore: 68, lastActive: '3D AGO',     streak: 5,  xp: 2640 },
  { id: '7',  username: 'nika.b',  fullName: 'Nika Bernik',   email: 'nika.b@learnsmart.si',  learningStyle: 'VISUAL',      modulesEnrolled: 2, avgScore: 61, lastActive: '5D AGO',     streak: 3,  xp: 2310 },
  { id: '8',  username: 'peter.v', fullName: 'Peter Vidmar',  email: 'peter.v@learnsmart.si', learningStyle: 'AUDITORY',    modulesEnrolled: 2, avgScore: 55, lastActive: '1W AGO',     streak: 2,  xp: 1980 },
]

export const STUDENTS_STATS = {
  total: 248,
  activeToday: 134,
  avgScore: 78,
  avgCompletion: 61,
}
