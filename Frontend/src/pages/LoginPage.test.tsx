import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../test/renderWithProviders'
import { LoginPage } from './LoginPage'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

const baseAuth = {
  session: null,
  loading: false,
  profil: null,
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

describe('LoginPage', () => {
  const mockSignIn = vi.fn()

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ ...baseAuth, signInWithGoogle: mockSignIn })
  })

  it('renders the "Continue with Google" button', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
  })

  it('renders the "Welcome back!" heading', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByText('Welcome back!')).toBeInTheDocument()
  })

  it('renders the "NEW HERE?" info box', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByText('NEW HERE?')).toBeInTheDocument()
  })

  it('calls signInWithGoogle when the button is clicked', () => {
    renderWithProviders(<LoginPage />)
    fireEvent.click(screen.getByText(/Continue with Google/i))
    expect(mockSignIn).toHaveBeenCalledOnce()
  })

  it('does not render the sign-in button when a session exists', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session: { access_token: 'fake-token' } as any,
      signInWithGoogle: vi.fn(),
    })
    renderWithProviders(<LoginPage />)
    expect(screen.queryByText(/Continue with Google/i)).not.toBeInTheDocument()
  })
})
