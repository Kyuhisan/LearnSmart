import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '../../test/renderWithProviders'
import { StudentModules } from './StudentModules'
import { useAuth } from '../../context/AuthContext'
import { server } from '../../test/server'
import { API, mockModule } from '../../test/handlers'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))
// Render actions so JOIN MODULE WITH CODE button is accessible
vi.mock('../../components/ui/Topbar', () => ({
  Topbar: ({ actions }: { actions?: React.ReactNode }) => <>{actions}</>,
}))
vi.mock('./JoinModuleModal', () => ({
  JoinModuleModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="join-modal">
      <button onClick={onClose}>Close Join</button>
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

const mathModule = mockModule({ id: 'mod-1', naziv: 'Math Basics' })
const physicsModule = mockModule({ id: 'mod-2', naziv: 'Physics 101' })
// Enrollment record for mod-1 only
const enrollment = { id: 'v1', predmetId: 'mod-1', casNaModulu: 0 }

describe('StudentModules', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuth).mockReturnValue(baseAuth as any)
    // Two public modules; student is enrolled in mod-1 only
    server.use(
      http.get(`${API}/moduli`, () => HttpResponse.json([mathModule, physicsModule])),
      http.get(`${API}/vpisi/moji`, () => HttpResponse.json([enrollment]))
    )
  })

  it('renders the MY MODULES section', async () => {
    renderWithProviders(<StudentModules />)
    await waitFor(() => expect(screen.getByText('MY MODULES')).toBeInTheDocument())
  })

  it('renders the ALL MODULES section', async () => {
    renderWithProviders(<StudentModules />)
    await waitFor(() => expect(screen.getByText('ALL MODULES')).toBeInTheDocument())
  })

  it('places enrolled module under MY MODULES section', async () => {
    renderWithProviders(<StudentModules />)
    // Both sections have a heading; confirm Math Basics appears after MY MODULES
    await waitFor(() => {
      const myModulesTag = screen.getByText('MY MODULES')
      const allModulesTag = screen.getByText('ALL MODULES')
      const mathEl = screen.getAllByText('Math Basics')[0]

      // Math Basics should appear before ALL MODULES in the DOM
      expect(myModulesTag.compareDocumentPosition(mathEl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(allModulesTag.compareDocumentPosition(mathEl) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    })
  })

  it('places non-enrolled module under ALL MODULES section', async () => {
    renderWithProviders(<StudentModules />)
    await waitFor(() => {
      const allModulesTag = screen.getByText('ALL MODULES')
      const physicsEl = screen.getAllByText('Physics 101')[0]
      // Physics 101 comes after ALL MODULES
      expect(allModulesTag.compareDocumentPosition(physicsEl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
  })

  it('search filters both sections simultaneously', async () => {
    renderWithProviders(<StudentModules />)
    await waitFor(() => expect(screen.getAllByText('Math Basics').length).toBeGreaterThan(0))

    await userEvent.type(screen.getByPlaceholderText(/search/i), 'Physics')
    // Math Basics should no longer be visible
    await waitFor(() =>
      expect(screen.queryByText('Math Basics')).not.toBeInTheDocument()
    )
    expect(screen.getAllByText('Physics 101').length).toBeGreaterThan(0)
  })

  it('shows "No other modules available" when all public modules are enrolled', async () => {
    server.use(
      http.get(`${API}/moduli`, () => HttpResponse.json([mathModule])),
      http.get(`${API}/vpisi/moji`, () => HttpResponse.json([enrollment]))
    )
    renderWithProviders(<StudentModules />)
    await waitFor(() =>
      expect(screen.getByText(/no other modules available/i)).toBeInTheDocument()
    )
  })

  it('shows empty enrolled state when student has no enrollments', async () => {
    server.use(http.get(`${API}/vpisi/moji`, () => HttpResponse.json([])))
    renderWithProviders(<StudentModules />)
    await waitFor(() =>
      expect(screen.getByText(/haven't enrolled in any modules/i)).toBeInTheDocument()
    )
  })

  it('clicking JOIN MODULE WITH CODE button opens the join modal', async () => {
    renderWithProviders(<StudentModules />)
    // Wait for any button labelled "JOIN MODULE WITH CODE"
    await waitFor(() =>
      expect(screen.getByText('JOIN MODULE WITH CODE')).toBeInTheDocument()
    )
    // Fire directly on the ComicBtn's inner button element
    const joinBtn = screen.getByText('JOIN MODULE WITH CODE').closest('button')!
    await userEvent.click(joinBtn)
    expect(await screen.findByTestId('join-modal')).toBeInTheDocument()
  })
})
