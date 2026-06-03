import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ComicBtn } from './ComicBtn'

describe('ComicBtn', () => {
  it('renders its children', () => {
    render(<ComicBtn>Click me</ComicBtn>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<ComicBtn onClick={onClick}>Go</ComicBtn>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<ComicBtn onClick={onClick} disabled>Go</ComicBtn>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders a disabled button when disabled prop is true', () => {
    render(<ComicBtn disabled>Save</ComicBtn>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies smaller padding when sm prop is set', () => {
    render(
      <>
        <ComicBtn>Normal</ComicBtn>
        <ComicBtn sm>Small</ComicBtn>
      </>
    )
    const normal = screen.getByRole('button', { name: 'Normal' })
    const small  = screen.getByRole('button', { name: 'Small' })
    // sm uses S[1.5] padding-block vs S[2.5] — the font-size also shrinks
    // jsdom doesn't resolve token values to px, but inline style is set directly
    expect(small.style.fontSize).not.toBe(normal.style.fontSize)
  })

  it('renders a white label when dark prop is set', () => {
    render(<ComicBtn dark>Dark</ComicBtn>)
    const btn = screen.getByRole('button', { name: 'Dark' })
    // jsdom normalizes hex to rgb
    expect(btn.style.color).toBe('rgb(255, 255, 255)')
  })

  it('uses the provided color as background', () => {
    render(<ComicBtn color="rgb(200, 100, 50)">Colored</ComicBtn>)
    expect(screen.getByRole('button').style.background).toBe('rgb(200, 100, 50)')
  })

  it('renders type="submit" when type prop is submit', () => {
    render(<ComicBtn type="submit">Submit</ComicBtn>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
