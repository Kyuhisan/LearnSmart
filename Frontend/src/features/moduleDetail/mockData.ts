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
