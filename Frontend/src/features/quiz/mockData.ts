// ── Quiz hub data ─────────────────────────────────────────────────────────────

export interface QuizStats {
  avgScore: number
  bestScore: number
  fastestTime: string   // e.g. '1m 42s'
  streak: number
  totalCompleted: number
  totalAvailable: number
}

export const QUIZ_STATS: QuizStats = {
  avgScore: 81,
  bestScore: 97,
  fastestTime: '1m 42s',
  streak: 5,
  totalCompleted: 14,
  totalAvailable: 19,
}

export interface AvailableQuiz {
  id: string
  title: string
  module: string
  moduleColor: string
  moduleColorLt: string
  questions: number
  timeLimit: string   // e.g. '10 min'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  dueDate?: string
}

export const AVAILABLE_QUIZZES: AvailableQuiz[] = [
  { id: 'q15', title: 'Quiz #15 — Neural Networks Intro',  module: 'Neural Networks Deep Dive',     moduleColor: '#a89bc9', moduleColorLt: '#ebe5f3', questions: 8,  timeLimit: '12 min', difficulty: 'MEDIUM', dueDate: 'Due May 24' },
  { id: 'q16', title: 'Quiz #16 — Backpropagation',        module: 'Neural Networks Deep Dive',     moduleColor: '#a89bc9', moduleColorLt: '#ebe5f3', questions: 6,  timeLimit: '10 min', difficulty: 'HARD'   },
  { id: 'q17', title: 'Quiz #3  — Image Basics',           module: 'Computer Vision Basics',        moduleColor: '#e8a570', moduleColorLt: '#fae5d3', questions: 5,  timeLimit: '8 min',  difficulty: 'EASY',  dueDate: 'Due May 26' },
  { id: 'q18', title: 'Quiz #4  — Hypothesis Testing',     module: 'Statistics for Data Science',   moduleColor: '#85b88f', moduleColorLt: '#e1efe3', questions: 10, timeLimit: '15 min', difficulty: 'HARD'   },
  { id: 'q19', title: 'Quiz #3  — Eigenvalues',            module: 'Linear Algebra Refresher',      moduleColor: '#7cb8c4', moduleColorLt: '#dbeef2', questions: 7,  timeLimit: '10 min', difficulty: 'MEDIUM' },
]

export interface CompletedQuiz {
  id: string
  title: string
  module: string
  moduleColorLt: string
  score: number
  timeTaken: string
  completedOn: string
  passed: boolean
}

export const COMPLETED_QUIZZES: CompletedQuiz[] = [
  { id: 'q14', title: 'Quiz #14 — Decision Trees',        module: 'Machine Learning Fundamentals', moduleColorLt: '#fbeed0', score: 84, timeTaken: '4m 12s', completedOn: 'May 21', passed: true  },
  { id: 'q13', title: 'Quiz #13 — Regression',            module: 'Machine Learning Fundamentals', moduleColorLt: '#fbeed0', score: 71, timeTaken: '6m 38s', completedOn: 'May 18', passed: true  },
  { id: 'q12', title: 'Quiz #12 — Binary Trees',          module: 'Machine Learning Fundamentals', moduleColorLt: '#fbeed0', score: 97, timeTaken: '1m 42s', completedOn: 'May 15', passed: true  },
  { id: 'q11', title: 'Quiz #2  — Matrices',              module: 'Linear Algebra Refresher',      moduleColorLt: '#dbeef2', score: 88, timeTaken: '3m 55s', completedOn: 'May 13', passed: true  },
  { id: 'q10', title: 'Quiz #1  — Vectors',               module: 'Linear Algebra Refresher',      moduleColorLt: '#dbeef2', score: 92, timeTaken: '2m 20s', completedOn: 'May 10', passed: true  },
  { id: 'q9',  title: 'Quiz #1  — Probability',           module: 'Statistics for Data Science',   moduleColorLt: '#e1efe3', score: 58, timeTaken: '8m 01s', completedOn: 'May 7',  passed: false },
  { id: 'q8',  title: 'Quiz #1  — Perceptrons',           module: 'Neural Networks Deep Dive',     moduleColorLt: '#ebe5f3', score: 73, timeTaken: '5m 14s', completedOn: 'May 3',  passed: true  },
]

// ── Active quiz session data ──────────────────────────────────────────────────

export interface QuizQuestion {
  id: number
  text: string
  options: string[]
  correct: number
  explanation: string
}

export interface ActiveQuiz {
  id: string
  title: string
  module: string
  totalQuestions: number
  timeLimit: number // seconds
}

export const ACTIVE_QUIZ: ActiveQuiz = {
  id: '14',
  title: 'Quiz #14 — Decision Trees',
  module: 'Machine Learning Fundamentals',
  totalQuestions: 5,
  timeLimit: 300,
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: 'What is the main advantage of a decision tree over a linear model?',
    options: [
      'It always achieves higher accuracy',
      'It can model non-linear decision boundaries',
      'It requires less training data',
      'It never overfits',
    ],
    correct: 1,
    explanation: 'Decision trees partition the feature space using axis-aligned splits, allowing them to capture non-linear relationships that a linear model cannot represent.',
  },
  {
    id: 2,
    text: 'Which metric is most commonly used to split nodes in a classification decision tree?',
    options: ['Mean Squared Error', 'R² score', 'Gini impurity', 'Pearson correlation'],
    correct: 2,
    explanation: 'Gini impurity measures how often a randomly chosen element would be misclassified. Lower values indicate purer nodes, guiding the tree to make better splits.',
  },
  {
    id: 3,
    text: 'What does "pruning" a decision tree mean?',
    options: [
      'Adding more leaf nodes to increase accuracy',
      'Removing branches to reduce overfitting',
      'Scaling input features',
      'Converting the tree to a random forest',
    ],
    correct: 1,
    explanation: 'Pruning removes branches that provide little predictive power, reducing the complexity of the model and improving its generalisation to unseen data.',
  },
  {
    id: 4,
    text: 'A decision tree with depth = 1 is called a:',
    options: ['Random forest', 'Bagging estimator', 'Decision stump', 'Boosted tree'],
    correct: 2,
    explanation: 'A decision stump is a tree with a single split (depth 1). It is used as a weak learner in ensemble methods like AdaBoost.',
  },
  {
    id: 5,
    text: 'Which of the following is TRUE about entropy in decision trees?',
    options: [
      'High entropy means a pure node',
      'Entropy is always between 0 and 10',
      'Low entropy means low uncertainty in a node',
      'Entropy cannot be used for multi-class problems',
    ],
    correct: 2,
    explanation: 'Entropy measures disorder in a node. An entropy of 0 means all samples belong to one class (pure node); high entropy means the classes are mixed and uncertain.',
  },
]
