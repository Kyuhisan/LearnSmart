import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '../../test/renderWithProviders'
import { StudentQuiz } from './StudentQuiz'
import { useAuth } from '../../context/AuthContext'
import { server } from '../../test/server'
import { API, mockQuizResult } from '../../test/handlers'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

// Prevent QuizSession from rendering — we test the hub only
vi.mock('./QuizSession', () => ({
  QuizSession: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="quiz-session-mock">
      <button onClick={onClose}>Exit Quiz</button>
    </div>
  ),
}))

const baseAuth = {
  session: { access_token: 'fake-token' },
  loading: false,
  profil: { username: 'student1', vloga: 'ucenec', ucniTip: 'visual', varkScores: null, xp: 0, nivo: 1 },
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

const publishedQuiz = {
  id: 'quiz-1',
  naziv: 'Algebra Quiz',
  status: 'PUBLISHED',
  casIzvajanja: 15,
  predmetId: 'mod-1',
}

describe('StudentQuiz', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuth).mockReturnValue(baseAuth as any)
  })

  it('renders the stat cards panel', async () => {
    renderWithProviders(<StudentQuiz />)
    await waitFor(() => {
      expect(screen.getByText('AVG SCORE')).toBeInTheDocument()
      expect(screen.getByText('BEST SCORE')).toBeInTheDocument()
      expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    })
  })

  it('renders the AVAILABLE QUIZZES panel', async () => {
    renderWithProviders(<StudentQuiz />)
    await waitFor(() => expect(screen.getByText('AVAILABLE QUIZZES')).toBeInTheDocument())
  })

  it('renders the QUIZ HISTORY panel', async () => {
    renderWithProviders(<StudentQuiz />)
    await waitFor(() => expect(screen.getByText('QUIZ HISTORY')).toBeInTheDocument())
  })

  it('shows "No quizzes available yet" when the quizzes list is empty', async () => {
    // default handler already returns [] for /kvizi/moji
    renderWithProviders(<StudentQuiz />)
    await waitFor(() =>
      expect(screen.getByText(/no quizzes available yet/i)).toBeInTheDocument()
    )
  })

  it('displays a published quiz card with START button on first attempt', async () => {
    server.use(http.get(`${API}/kvizi/moji`, () => HttpResponse.json([publishedQuiz])))
    renderWithProviders(<StudentQuiz />)
    await waitFor(() => {
      expect(screen.getByText('Algebra Quiz')).toBeInTheDocument()
      expect(screen.getByText('START')).toBeInTheDocument()
    })
  })

  it('shows RETRY button and best score after one completed attempt', async () => {
    server.use(
      http.get(`${API}/kvizi/moji`, () => HttpResponse.json([publishedQuiz])),
      http.get(`${API}/kvizi/rezultati/moji`, () =>
        HttpResponse.json([mockQuizResult({ kvizId: 'quiz-1', odstotek: 80 })])
      )
    )
    renderWithProviders(<StudentQuiz />)
    await waitFor(() => {
      expect(screen.getByText('RETRY')).toBeInTheDocument()
      expect(screen.getByText('BEST: 80%')).toBeInTheDocument()
    })
  })

  it('shows "0 XP ON RETRY" tag after 3 or more attempts', async () => {
    const attempts = [
      mockQuizResult({ id: 'r1', kvizId: 'quiz-1', odstotek: 50 }),
      mockQuizResult({ id: 'r2', kvizId: 'quiz-1', odstotek: 60 }),
      mockQuizResult({ id: 'r3', kvizId: 'quiz-1', odstotek: 70 }),
    ]
    server.use(
      http.get(`${API}/kvizi/moji`, () => HttpResponse.json([publishedQuiz])),
      http.get(`${API}/kvizi/rezultati/moji`, () => HttpResponse.json(attempts))
    )
    renderWithProviders(<StudentQuiz />)
    await waitFor(() =>
      expect(screen.getByText('0 XP ON RETRY')).toBeInTheDocument()
    )
  })

  it('shows completed quiz results in QUIZ HISTORY', async () => {
    server.use(
      http.get(`${API}/kvizi/rezultati/moji`, () =>
        HttpResponse.json([mockQuizResult({ kvizNaziv: 'Algebra Quiz', odstotek: 80 })])
      )
    )
    renderWithProviders(<StudentQuiz />)
    await waitFor(() => {
      // Quiz name appears in history
      expect(screen.getAllByText('Algebra Quiz').length).toBeGreaterThan(0)
      // '80%' appears in both stat cards (avg/best) and history tag — getAllByText is safer
      expect(screen.getAllByText('80%').length).toBeGreaterThan(0)
    }, { timeout: 3000 })
  })
})
