export interface GeneratedQuestion {
  id: number
  text: string
  options: string[]
  correct: number
  type: 'mcq' | 'truefalse'
  approved: boolean | null  // null = pending, true = approved, false = rejected
}

export interface AIQuizDraft {
  id: string
  title: string
  module: string
  generatedAt: string
  questions: GeneratedQuestion[]
}

export const AI_QUIZ_DRAFT: AIQuizDraft = {
  id: 'draft-01',
  title: 'AI Draft — Decision Trees',
  module: 'Machine Learning Fundamentals',
  generatedAt: '2026-05-16T09:00:00',
  questions: [
    {
      id: 1,
      text: 'What criterion does a decision tree use to select the best split?',
      options: ['Mean squared loss', 'Gini impurity or entropy', 'Cosine similarity', 'L2 regularization'],
      correct: 1,
      type: 'mcq',
      approved: null,
    },
    {
      id: 2,
      text: 'Decision trees are always guaranteed to find the globally optimal split at each node.',
      options: ['True', 'False'],
      correct: 1,
      type: 'truefalse',
      approved: null,
    },
    {
      id: 3,
      text: 'Which technique helps prevent decision tree overfitting?',
      options: ['Boosting', 'Pruning', 'Standardization', 'One-hot encoding'],
      correct: 1,
      type: 'mcq',
      approved: null,
    },
  ],
}

export const AI_QUIZ_MODULE_OPTIONS = [
  'Machine Learning Fundamentals',
  'Neural Networks Deep Dive',
  'Computer Vision Basics',
  'Statistics for Data Science',
  'Linear Algebra Refresher',
]

export const AI_DIFFICULTY_OPTIONS = ['EASY', 'MEDIUM', 'HARD'] as const
export type AIDifficulty = (typeof AI_DIFFICULTY_OPTIONS)[number]

import { C } from '../../styles/tokens'
export const DIFFICULTY_COLOR: Record<AIDifficulty, string> = {
  EASY: C.greenLt,
  MEDIUM: C.yellowLt,
  HARD: C.redLt,
}
