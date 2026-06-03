import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '../../test/renderWithProviders'
import { ProfessorModules } from './ProfessorModules'
import { useAuth } from '../../context/AuthContext'
import { server } from '../../test/server'
import { API, mockModule } from '../../test/handlers'

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }))

// Isolate modals — tested separately
vi.mock('./EditModuleModal', () => ({
  EditModuleModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="edit-modal">
      <button onClick={onClose}>Close Edit</button>
    </div>
  ),
}))
vi.mock('./NewModulModal', () => ({
  NewModuleModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="new-modal">
      <button onClick={onClose}>Close New</button>
    </div>
  ),
}))
// Render actions so + NEW MODULE button is accessible
vi.mock('../../components/ui/Topbar', () => ({
  Topbar: ({ actions }: { actions?: React.ReactNode }) => <>{actions}</>,
}))

const baseAuth = {
  session: { access_token: 'fake-token' },
  loading: false,
  profil: { username: 'prof1', vloga: 'ucitelj', ucniTip: '', varkScores: null, xp: 0, nivo: 1 },
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  refreshProfil: vi.fn(),
}

describe('ProfessorModules', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useAuth).mockReturnValue(baseAuth as any)
  })

  it('renders YOUR MODULES section heading', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('YOUR MODULES')).toBeInTheDocument())
  })

  it('renders loaded module cards', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('Math Basics')).toBeInTheDocument())
  })

  it('shows module DRAFT/LIVE status stamp', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('DRAFT')).toBeInTheDocument())
  })

  it('shows PUBLISH button for a draft module', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('PUBLISH')).toBeInTheDocument())
  })

  it('shows UNPUBLISH button for a published module', async () => {
    server.use(
      http.get(`${API}/moduli/moji`, () =>
        HttpResponse.json([mockModule({ jeObjavljen: true })])
      )
    )
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('UNPUBLISH')).toBeInTheDocument())
  })

  it('search input filters visible modules', async () => {
    server.use(
      http.get(`${API}/moduli/moji`, () =>
        HttpResponse.json([
          mockModule({ id: 'mod-1', naziv: 'Math Basics' }),
          mockModule({ id: 'mod-2', naziv: 'Physics 101' }),
        ])
      )
    )
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('Math Basics')).toBeInTheDocument())

    await userEvent.type(screen.getByPlaceholderText(/search/i), 'Physics')
    expect(screen.queryByText('Math Basics')).not.toBeInTheDocument()
    expect(screen.getByText('Physics 101')).toBeInTheDocument()
  })

  it('clicking DELETE shows the confirm dialog', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('Math Basics')).toBeInTheDocument())

    fireEvent.click(screen.getByText('DELETE'))
    expect(await screen.findByText(/are you sure you want to delete/i)).toBeInTheDocument()
    // Both the card's DELETE button and the dialog's DELETE button are in the DOM
    expect(screen.getAllByRole('button', { name: 'DELETE' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'CANCEL' })).toBeInTheDocument()
  })

  it('CANCEL in the confirm dialog closes it without calling the API', async () => {
    let deleteCalled = false
    server.use(
      http.delete(`${API}/moduli/:id`, () => {
        deleteCalled = true
        return new HttpResponse(null, { status: 204 })
      })
    )
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('Math Basics')).toBeInTheDocument())

    fireEvent.click(screen.getByText('DELETE'))
    await screen.findByText(/are you sure/i)
    fireEvent.click(screen.getByRole('button', { name: 'CANCEL' }))

    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument()
    expect(deleteCalled).toBe(false)
  })

  it('confirming DELETE calls the delete API', async () => {
    let deleteCalledForId: string | null = null
    server.use(
      http.delete(`${API}/moduli/:id`, ({ params }) => {
        deleteCalledForId = params.id as string
        return new HttpResponse(null, { status: 204 })
      })
    )
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('Math Basics')).toBeInTheDocument())

    fireEvent.click(screen.getByText('DELETE'))
    await screen.findByText(/are you sure/i)
    // Click the DELETE button inside the dialog (not the card)
    const deleteButtons = screen.getAllByRole('button', { name: 'DELETE' })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])

    await waitFor(() => expect(deleteCalledForId).toBe('mod-1'))
  })

  it('clicking + NEW MODULE opens the new module modal', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('YOUR MODULES')).toBeInTheDocument())

    fireEvent.click(screen.getByText('+ NEW MODULE'))
    expect(await screen.findByTestId('new-modal')).toBeInTheDocument()
  })

  it('clicking EDIT opens the edit module modal', async () => {
    renderWithProviders(<ProfessorModules />)
    await waitFor(() => expect(screen.getByText('EDIT')).toBeInTheDocument())

    fireEvent.click(screen.getByText('EDIT'))
    expect(await screen.findByTestId('edit-modal')).toBeInTheDocument()
  })
})
