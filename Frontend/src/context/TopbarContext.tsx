import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

export interface TopbarConfig {
  title: string
  subtitle?: string
  back?: () => void
  actions?: ReactNode
}

interface TopbarContextValue {
  config: TopbarConfig
  setConfig: (config: TopbarConfig) => void
}

const TopbarContext = createContext<TopbarContextValue>({
  config: { title: '' },
  setConfig: () => {},
})

interface TopbarProviderProps {
  readonly children: ReactNode
}

export function TopbarProvider({ children }: TopbarProviderProps) {
  const [config, setConfig] = useState<TopbarConfig>({ title: '' })
  const setConfigStable = useCallback((c: TopbarConfig) => setConfig(c), [])
  const value = useMemo(() => ({ config, setConfig: setConfigStable }), [config, setConfigStable])
  return (
    <TopbarContext.Provider value={value}>
      {children}
    </TopbarContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTopbarContext() {
  return useContext(TopbarContext)
}
