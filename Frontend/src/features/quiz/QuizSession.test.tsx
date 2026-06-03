import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { http } from 'msw'
import { renderWithProviders } from '../../test/renderWithProviders'
import { QuizSession } from './QuizSession'
import { useAuth } from '../../context/AuthContext'
import { server } from '../../test/server'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

// Topbar renders null (sets context only) — stub it to make title queryable
vi.mock('../../components/ui/Topbar', () => ({
  Topbar: ({ title }: { title: string }) => <div data-testid="topbar-title">{title}</div>,
}))

const mockQuiz = {
  id: 'quiz-1',
  naziv: 'Test Quiz',
  status: 'PUBLISHED',
  casIzvajanja: 10,
  predmetId: 'pred-1',
}

const baseAuth = {
  session: { access_token: 'fake-token' },
  loading: false,
  profil: { username: 'student1', vloga: 'ucenec', ucniTip: 'visual', varkScores: null, xp: 100, nivo: 1 },
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

describe('QuizSession', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuth).mockReturnValue(baseAuth as any)
    onClose.mockReset()
  })

  it('shows the quiz intro screen after questions load', async () => {
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    await waitFor(() => {
      expect(screen.getByText('START QUIZ')).toBeInTheDocument()
    })
  })

  it('passes the quiz name (uppercased) to the topbar', async () => {
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    await waitFor(() => {
      expect(screen.getByTestId('topbar-title')).toHaveTextContent('TEST QUIZ')
    })
  })

  it('shows question count and time limit on the intro screen', async () => {
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    await waitFor(() => {
      expect(screen.getByText('1 QUESTIONS')).toBeInTheDocument()
      expect(screen.getByText('10 MIN LIMIT')).toBeInTheDocument()
    })
  })

  it('navigates to the first question after clicking START QUIZ', async () => {
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    await waitFor(() => expect(screen.getByText('START QUIZ')).toBeInTheDocument())

    fireEvent.click(screen.getByText('START QUIZ'))
    await waitFor(() => {
      expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
    })
  })

  it('calls onClose when BACK is clicked on the intro screen', async () => {
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    await waitFor(() => expect(screen.getByText('BACK')).toBeInTheDocument())
    fireEvent.click(screen.getByText('BACK'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows a loading state while questions are fetching', () => {
    // Override handler with an indefinitely pending response
    server.use(
      http.get('http://localhost:8081/kvizi/:id/vprasanja', () =>
        new Promise(() => {}) // never resolves
      )
    )
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    expect(screen.getByText('LOADING QUESTIONS...')).toBeInTheDocument()
  })

  it('shows answer options when on the question step', async () => {
    renderWithProviders(<QuizSession quiz={mockQuiz} onClose={onClose} />)
    await waitFor(() => expect(screen.getByText('START QUIZ')).toBeInTheDocument())
    fireEvent.click(screen.getByText('START QUIZ'))

    await waitFor(() => {
      // Options from the MSW handler: 3, 4, 5, 6
      expect(screen.getByText('4')).toBeInTheDocument()
    })
  })
})
