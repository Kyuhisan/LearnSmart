export interface ModuleDetail {
  id: string
  title: string
  subject: string
  progress: number
  professor: string
}

export interface QuizQuestion {
  id: number
  text: string
  options: string[]
  correct: number
}

export interface Highlight {
  time: string
  quote: string
}

export const MODULE: ModuleDetail = {
  id: '1',
  title: 'Binary Trees',
  subject: 'Algorithms',
  progress: 72,
  professor: 'Prof. Novak',
}

export const CHECKLIST_TASKS = [
  'Understand what a node is',
  'Draw a binary tree with 7 nodes by hand',
  'Trace an insertion into a BST step by step',
  'Write the in-order traversal of a sample tree',
  'Implement a BST insert function',
]

export const PRACTICE_PROBLEMS = [
  { label: 'Problem 01', text: 'Insert value 5 into BST: root=8, left=3, right=10' },
  { label: 'Problem 02', text: 'In-order traversal of: root=4, left=2, right=6?' },
]

export const AUDIO_HIGHLIGHTS: Highlight[] = [
  { time: '1:24', quote: '"Think of a binary tree like a family tree — every parent has at most two children."' },
  { time: '4:50', quote: '"The BST property is everything. Left is smaller, right is larger. Always."' },
  { time: '9:15', quote: '"In-order traversal on a BST gives you a sorted sequence. That\'s the magic."' },
]

export const GLOSSARY = [
  { term: 'NODE', def: 'Basic unit with value + child pointers' },
  { term: 'ROOT', def: 'Topmost node with no parent' },
  { term: 'LEAF', def: 'Node with no children' },
  { term: 'HEIGHT', def: 'Longest path from root to a leaf' },
]

// ── Professor ─────────────────────────────────────────────────────────────────

export type ContentType = 'video' | 'reading' | 'quiz' | 'practice'
export type VarkTag = 'VISUAL' | 'READING' | 'AUDITORY' | 'KINESTHETIC'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  vark: VarkTag
  duration: string
}

export interface ModuleStudent {
  name: string
  emoji: string
  completion: number
  lastActive: string
  style: VarkTag
}

export const PROF_MODULE = {
  id: '1',
  title: 'Binary Trees',
  subject: 'Algorithms',
  status: 'published' as 'published' | 'draft',
  students: 42,
  avgCompletion: 74,
}

export const CONTENT_ITEMS: ContentItem[] = [
  { id: '1', type: 'video',    title: 'Intro: What is a Binary Tree?',   vark: 'VISUAL',      duration: '6 min'       },
  { id: '2', type: 'reading',  title: 'Structured Notes — BST Rules',    vark: 'READING',     duration: '4 min read'  },
  { id: '3', type: 'video',    title: 'Concept Map: Tree Traversals',    vark: 'VISUAL',      duration: '8 min'       },
  { id: '4', type: 'reading',  title: 'Lecture: Full Binary Tree Talk',  vark: 'AUDITORY',    duration: '14 min'      },
  { id: '5', type: 'practice', title: 'Build a BST — Step by Step',      vark: 'KINESTHETIC', duration: '5 tasks'     },
  { id: '6', type: 'quiz',     title: 'Quiz #1 — Tree Properties',       vark: 'READING',     duration: '8 questions' },
  { id: '7', type: 'practice', title: 'Traversal Practice Problems',     vark: 'KINESTHETIC', duration: '3 problems'  },
]

export const MODULE_STUDENTS: ModuleStudent[] = [
  { name: 'Sara Horvat',  emoji: '🤖', completion: 96, lastActive: '2h ago',      style: 'VISUAL'      },
  { name: 'Matic Kuhar',  emoji: '🐸', completion: 88, lastActive: 'yesterday',   style: 'READING'     },
  { name: 'Jure Kovač',   emoji: '🦊', completion: 74, lastActive: '3 days ago',  style: 'AUDITORY'    },
  { name: 'Nina Žagar',   emoji: '🐻', completion: 61, lastActive: 'yesterday',   style: 'KINESTHETIC' },
  { name: 'Luka Pretnar', emoji: '🤖', completion: 45, lastActive: '1 week ago',  style: 'VISUAL'      },
  { name: 'Eva Mlakar',   emoji: '🐸', completion: 32, lastActive: '5 days ago',  style: 'READING'     },
]
