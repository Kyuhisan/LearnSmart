import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { render } from '@testing-library/react'
import { WakeBackend } from './WakeBackend'
import { server } from '../../test/server'
import { API } from '../../test/handlers'

// WakeBackend wraps children — no router/topbar context needed
function renderWake(children = <div>APP CONTENT</div>) {
  return render(<WakeBackend>{children}</WakeBackend>)
}

describe('WakeBackend', () => {
  it('shows CONNECTING… while the first health check is in flight', () => {
    server.use(http.get(`${API}/health`, () => new Promise(() => {})))
    renderWake()
    expect(screen.getByText('CONNECTING…')).toBeInTheDocument()
  })

  it('renders children immediately when health returns 200', async () => {
    // default handler returns 200
    renderWake()
    await waitFor(() =>
      expect(screen.getByText('APP CONTENT')).toBeInTheDocument()
    )
  })

  it('transitions to WAKING UP… when the first health check fails', async () => {
    server.use(
      http.get(`${API}/health`, () => new HttpResponse(null, { status: 503 }))
    )
    renderWake()
    await waitFor(() =>
      expect(screen.getByText('WAKING UP…')).toBeInTheDocument()
    )
  })

  it('shows the speech bubble message while waking', async () => {
    server.use(
      http.get(`${API}/health`, () => new HttpResponse(null, { status: 503 }))
    )
    renderWake()
    await waitFor(() =>
      expect(screen.getByText(/waking it up/i)).toBeInTheDocument()
    )
  })

  it('shows elapsed seconds counter while in waking state', async () => {
    server.use(
      http.get(`${API}/health`, () => new HttpResponse(null, { status: 503 }))
    )
    renderWake()
    await waitFor(() =>
      // "0s elapsed" or any elapsed counter
      expect(screen.getByText(/s elapsed/i)).toBeInTheDocument()
    )
  })

  it('eventually renders children after polling succeeds', async () => {
    let callCount = 0
    server.use(
      http.get(`${API}/health`, () => {
        callCount++
        // First call fails, subsequent calls succeed
        return callCount === 1
          ? new HttpResponse(null, { status: 503 })
          : new HttpResponse(null, { status: 200 })
      })
    )
    renderWake(<div>LOADED</div>)
    // Component transitions: checking → waking → awake
    await waitFor(() =>
      expect(screen.getByText('LOADED')).toBeInTheDocument(),
      { timeout: 10000 }
    )
  })
})
