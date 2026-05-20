import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

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

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<TopbarConfig>({ title: '' })
  const setConfig = useCallback((c: TopbarConfig) => setConfigState(c), [])
  return (
    <TopbarContext.Provider value={{ config, setConfig }}>
      {children}
    </TopbarContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTopbarContext() {
  return useContext(TopbarContext)
}
