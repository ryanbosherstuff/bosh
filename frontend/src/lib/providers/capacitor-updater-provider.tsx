import { type Context, createContext, type FC, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'

interface CapacitorUpdaterContextType {

}

const CapacitorUpdaterContext: Context<CapacitorUpdaterContextType> = createContext({} as CapacitorUpdaterContextType)
export const useCapacitorUpdaterContext = () => useContext(CapacitorUpdaterContext)

export const CapacitorUpdateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [env, setEnv] = useState<string>(process.env['NX_UIRA_ENVIRONMENT']!)

  useEffect(() => {
    console.log('BOSH: capacitor-updater-provider: env:', env)
  }, [])

  const CapacitorUpdaterProviderValue: CapacitorUpdaterContextType = useMemo(
    (): CapacitorUpdaterContextType => ({}),
    []
  )

  return (
    <CapacitorUpdaterContext.Provider value={CapacitorUpdaterProviderValue}>
      {children}
    </CapacitorUpdaterContext.Provider>
  )
}
