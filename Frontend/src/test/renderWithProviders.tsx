import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TopbarProvider } from '../context/TopbarContext'
import type { RenderOptions } from '@testing-library/react'
import type { ReactNode } from 'react'

interface Options extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <TopbarProvider>{children}</TopbarProvider>
    </MemoryRouter>
  )
}

export function renderWithProviders(ui: ReactNode, options?: Options) {
  return render(ui, { wrapper: Wrapper, ...options })
}
