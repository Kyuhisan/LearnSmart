import { useLayoutEffect, type ReactNode } from 'react'
import { useTopbarContext } from '../../context/TopbarContext'

interface TopbarProps {
  title: string
  subtitle?: string
  back?: () => void
  actions?: ReactNode
}

export function Topbar({ title, subtitle, back, actions }: TopbarProps) {
  const { setConfig } = useTopbarContext()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => { setConfig({ title, subtitle, back, actions }) }, [title, subtitle])

  return null
}
