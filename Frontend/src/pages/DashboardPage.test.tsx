import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/renderWithProviders'
import { DashboardPage } from './DashboardPage'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

// Isolate heavy sub-components that make real API calls
vi.mock('../features/dashboard/StudentDashboard', () => ({
  StudentDashboard: () => <div data-testid="student-dashboard">Student Dashboard</div>,
}))
vi.mock('../features/dashboard/ProfessorDashboard', () => ({
  ProfessorDashboard: () => <div data-testid="professor-dashboard">Professor Dashboard</div>,
}))
vi.mock('../components/ui/AppHeader', () => ({
  AppHeader: () => <header data-testid="app-header" />,
}))
vi.mock('../components/ui/Sidebar', () => ({
  Sidebar: () => <nav data-testid="sidebar" />,
}))

const baseAuth = {
  session: null,
  loading: false,
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({ ...baseAuth, profil: null })
  })

  it('shows a loading indicator when profil is null', () => {
    renderWithProviders(<DashboardPage />)
    // BitMascot renders as an SVG — the page-loader wrapper should be present
    expect(document.querySelector('.page-loader')).toBeTruthy()
  })

  it('renders StudentDashboard for the ucenec role', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      profil: { username: 'student1', vloga: 'ucenec', ucniTip: 'visual', varkScores: null, xp: 0, nivo: 1 },
    })
    renderWithProviders(<DashboardPage />)
    expect(screen.getByTestId('student-dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('professor-dashboard')).not.toBeInTheDocument()
  })

  it('renders ProfessorDashboard for the ucitelj role', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...baseAuth,
      profil: { username: 'prof1', vloga: 'ucitelj', ucniTip: '', varkScores: null, xp: 0, nivo: 1 },
    })
    renderWithProviders(<DashboardPage />)
    expect(screen.getByTestId('professor-dashboard')).toBeInTheDocument()
    expect(screen.queryByTestId('student-dashboard')).not.toBeInTheDocument()
  })
})
