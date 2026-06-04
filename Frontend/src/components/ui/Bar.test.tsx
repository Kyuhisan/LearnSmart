import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Bar } from './Bar'
import { C } from '../../styles/tokens'

function getInnerDiv(container: HTMLElement) {
  // Bar renders: container > outer div > inner fill div
  return container.querySelector('div > div > div') as HTMLElement
}

describe('Bar', () => {
  it('renders an inner fill div', () => {
    const { container } = render(<Bar value={50} />)
    expect(getInnerDiv(container)).toBeTruthy()
  })

  it('sets inner width to value% of max (default 100)', () => {
    const { container } = render(<Bar value={75} />)
    expect(getInnerDiv(container).style.width).toBe('75%')
  })

  it('uses value/max ratio when max is specified', () => {
    const { container } = render(<Bar value={3} max={4} />)
    expect(getInnerDiv(container).style.width).toBe('75%')
  })

  it('clamps fill width at 100% when value exceeds max', () => {
    const { container } = render(<Bar value={150} max={100} />)
    expect(getInnerDiv(container).style.width).toBe('100%')
  })

  it('shows 0% fill when value is 0', () => {
    const { container } = render(<Bar value={0} />)
    expect(getInnerDiv(container).style.width).toBe('0%')
  })

  it('applies the provided color to the inner fill div', () => {
    const { container } = render(<Bar value={50} color={C.green} />)
    // jsdom normalizes hex to rgb
    expect(getInnerDiv(container).style.background).toBe('rgb(133, 184, 143)') // C.green = #85b88f
  })

  it('applies a numeric height in px', () => {
    const { container } = render(<Bar value={50} height={12} />)
    const outer = container.querySelector('div') as HTMLElement
    expect(outer.style.height).toBe('12px')
  })

  it('applies a string height directly', () => {
    const { container } = render(<Bar value={50} height="1.5rem" />)
    const outer = container.querySelector('div') as HTMLElement
    expect(outer.style.height).toBe('1.5rem')
  })
})
