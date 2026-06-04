import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'
import { QuestionnaireWizard } from './QuestionnaireWizard'
import { useAuth } from '../../context/AuthContext'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

const baseAuth = {
  session: { access_token: 'fake-token' },
  loading: false,
  profil: null,
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

describe('QuestionnaireWizard', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuth).mockReturnValue(baseAuth as any)
  })

  it('renders the intro screen with START ASSESSMENT button', () => {
    renderWithProviders(<QuestionnaireWizard />)
    expect(screen.getByText('START ASSESSMENT')).toBeInTheDocument()
  })

  it('shows the HOW DO YOU LEARN? heading on the intro screen', () => {
    renderWithProviders(<QuestionnaireWizard />)
    // The h1 spans multiple child nodes (YOU is in a <span>); match via role + regex
    expect(screen.getByRole('heading', { name: /HOW DO YOU LEARN\?/i })).toBeInTheDocument()
  })

  it('shows the VARK ASSESSMENT tag', () => {
    renderWithProviders(<QuestionnaireWizard />)
    expect(screen.getByText('VARK ASSESSMENT')).toBeInTheDocument()
  })

  it('transitions to the first question after clicking START ASSESSMENT', async () => {
    renderWithProviders(<QuestionnaireWizard />)
    fireEvent.click(screen.getByText('START ASSESSMENT'))
    await waitFor(() => {
      expect(screen.getByText(/Q01\s*\/\s*\d+/)).toBeInTheDocument()
    })
  })

  it('NEXT button is disabled when no option is selected', async () => {
    renderWithProviders(<QuestionnaireWizard />)
    fireEvent.click(screen.getByText('START ASSESSMENT'))
    await waitFor(() => expect(screen.getByText(/Q01/)).toBeInTheDocument())
    expect(screen.getByText('NEXT')).toBeDisabled()
  })

  it('NEXT button becomes enabled after selecting an option', async () => {
    renderWithProviders(<QuestionnaireWizard />)
    fireEvent.click(screen.getByText('START ASSESSMENT'))
    await waitFor(() => expect(screen.getByText(/Q01/)).toBeInTheDocument())

    // Pick the first option (labelled "A")
    const optionA = screen.getByText('A')
    fireEvent.click(optionA.closest('button')!)
    expect(screen.getByText('NEXT')).not.toBeDisabled()
  })
})
