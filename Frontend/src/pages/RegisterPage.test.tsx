import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '../test/renderWithProviders'
import { RegisterPage } from './RegisterPage'
import { useAuth } from '../context/AuthContext'
import { server } from '../test/server'
import { API } from '../test/handlers'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

// useNavigate must be mocked at module level (vi.mock is hoisted, can't reference inner vars)
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const orig = await importOriginal<typeof import('react-router-dom')>()
  return { ...orig, useNavigate: () => mockNavigate }
})

// RegisterPage calls supabase.auth.getSession() directly — mock the client
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'fake-token' } },
      }),
    },
  },
}))

const baseAuth = {
  session: { access_token: 'fake-token' },
  loading: false,
  profil: null,
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

// Helper: override /api/me/status so the page shows the form (isNewUser: true)
function setupNewUser() {
  server.use(
    http.get(`${API}/api/me/status`, () =>
      HttpResponse.json({ isNewUser: true })
    )
  )
}

async function waitForForm() {
  await waitFor(() => expect(screen.getByText('Complete your profile!')).toBeInTheDocument())
}

describe('RegisterPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuth).mockReturnValue(baseAuth as any)
    setupNewUser()
  })

  it('shows loading state while checking user status', () => {
    // status endpoint is pending → page shows loader
    server.use(http.get(`${API}/api/me/status`, () => new Promise(() => {})))
    renderWithProviders(<RegisterPage />)
    expect(document.querySelector('.page-loader')).toBeTruthy()
  })

  it('renders the registration form once status check passes', async () => {
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    expect(screen.getByPlaceholderText(/johndoe/i)).toBeInTheDocument()
    expect(screen.getByText('STUDENT')).toBeInTheDocument()
    expect(screen.getByText('TEACHER')).toBeInTheDocument()
  })

  it('shows an error when username is empty', async () => {
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    fireEvent.click(screen.getByRole('button', { name: /start learning/i }))
    expect(await screen.findByText('Please enter a username!')).toBeInTheDocument()
  })

  it('shows an error when username is shorter than 3 chars', async () => {
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    await userEvent.type(screen.getByPlaceholderText(/johndoe/i), 'ab')
    fireEvent.click(screen.getByRole('button', { name: /start learning/i }))
    expect(await screen.findByText('Username must be at least 3 characters!')).toBeInTheDocument()
  })

  it('shows an error when username contains invalid characters', async () => {
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    await userEvent.type(screen.getByPlaceholderText(/johndoe/i), 'bad name!')
    fireEvent.click(screen.getByRole('button', { name: /start learning/i }))
    expect(await screen.findByText(/only contain letters/i)).toBeInTheDocument()
  })

  it('clicking TEACHER changes the submit button label', async () => {
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    fireEvent.click(screen.getByText('TEACHER'))
    expect(screen.getByRole('button', { name: /start teaching/i })).toBeInTheDocument()
  })

  it('navigates to /questionnaire after successful student registration', async () => {
    server.use(
      http.post(`${API}/api/me/complete-registration`, () =>
        HttpResponse.json({ vloga: 'ucenec', username: 'newuser' })
      )
    )
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    await userEvent.type(screen.getByPlaceholderText(/johndoe/i), 'validuser')
    fireEvent.click(screen.getByRole('button', { name: /start learning/i }))
    await waitFor(() => {
      // The component navigates to /questionnaire for ucenec
      expect(mockNavigate).toHaveBeenCalledWith('/questionnaire')
    })
  })

  it('shows error message when API returns an error', async () => {
    server.use(
      http.post(`${API}/api/me/complete-registration`, () =>
        HttpResponse.json({ message: 'Username already taken.' }, { status: 409 })
      )
    )
    renderWithProviders(<RegisterPage />)
    await waitForForm()
    await userEvent.type(screen.getByPlaceholderText(/johndoe/i), 'takenname')
    fireEvent.click(screen.getByRole('button', { name: /start learning/i }))
    expect(await screen.findByText('Username already taken.')).toBeInTheDocument()
  })
})
