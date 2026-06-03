import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from './StatCard'
import { C } from '../../styles/tokens'

describe('StatCard', () => {
  it('renders the label', () => {
    render(<StatCard label="AVG SCORE" value="82%" sub="across all quizzes" />)
    expect(screen.getByText('AVG SCORE')).toBeInTheDocument()
  })

  it('renders the value', () => {
    render(<StatCard label="AVG SCORE" value="82%" sub="across all quizzes" />)
    expect(screen.getByText('82%')).toBeInTheDocument()
  })

  it('renders the sub-text', () => {
    render(<StatCard label="AVG SCORE" value="82%" sub="across all quizzes" />)
    expect(screen.getByText('across all quizzes')).toBeInTheDocument()
  })

  it('renders a numeric value', () => {
    render(<StatCard label="TOTAL" value={42} sub="quizzes" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('applies the stat-card-label CSS class to the label element', () => {
    const { container } = render(<StatCard label="LABEL" value="V" sub="S" />)
    expect(container.querySelector('.stat-card-label')).toHaveTextContent('LABEL')
  })

  it('applies the stat-card-value CSS class to the value element', () => {
    const { container } = render(<StatCard label="L" value="VALUE" sub="S" />)
    expect(container.querySelector('.stat-card-value')).toHaveTextContent('VALUE')
  })

  it('applies the stat-card-sub CSS class to the sub element', () => {
    const { container } = render(<StatCard label="L" value="V" sub="SUB TEXT" />)
    expect(container.querySelector('.stat-card-sub')).toHaveTextContent('SUB TEXT')
  })

  it('uses paper as the default background', () => {
    const { container } = render(<StatCard label="L" value="V" sub="S" />)
    // ComicBox renders the root div with inline background style
    // jsdom normalizes hex colors to rgb when reading back inline styles
    const root = container.firstElementChild as HTMLElement
    expect(root.style.background).toBe('rgb(255, 253, 249)') // C.paper = #fffdf9
  })

  it('accepts a custom background color', () => {
    const { container } = render(<StatCard label="L" value="V" sub="S" bg={C.cyanLt} />)
    const root = container.firstElementChild as HTMLElement
    expect(root.style.background).toBe('rgb(219, 238, 242)') // C.cyanLt = #dbeef2
  })
})
