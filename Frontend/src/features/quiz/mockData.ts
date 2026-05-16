export interface QuizQuestion {
  id: number
  text: string
  options: string[]
  correct: number
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
  },
  {
    id: 2,
    text: 'Which metric is most commonly used to split nodes in a classification decision tree?',
    options: ['Mean Squared Error', 'R² score', 'Gini impurity', 'Pearson correlation'],
    correct: 2,
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
  },
  {
    id: 4,
    text: 'A decision tree with depth = 1 is called a:',
    options: ['Random forest', 'Bagging estimator', 'Decision stump', 'Boosted tree'],
    correct: 2,
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
  },
]
