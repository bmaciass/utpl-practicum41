import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type BreadcrumbNameRegistry = Map<string, string>

type BreadcrumbNameContextValue = {
  getLabel: (key: string) => string | undefined
  registerLabel: (key: string, label: string) => void
}

const BreadcrumbNameContext = createContext<
  BreadcrumbNameContextValue | undefined
>(undefined)

export const BreadcrumbNameProvider = ({ children }: PropsWithChildren) => {
  const [registry, setRegistry] = useState<BreadcrumbNameRegistry>(
    () => new Map(),
  )

  const getLabel = useCallback((key: string) => registry.get(key), [registry])

  const registerLabel = useCallback((key: string, label: string) => {
    setRegistry((currentRegistry) => {
      if (currentRegistry.get(key) === label) {
        return currentRegistry
      }

      const nextRegistry = new Map(currentRegistry)
      nextRegistry.set(key, label)

      return nextRegistry
    })
  }, [])

  const contextValue = useMemo(
    () => ({
      getLabel,
      registerLabel,
    }),
    [getLabel, registerLabel],
  )

  return (
    <BreadcrumbNameContext.Provider value={contextValue}>
      {children}
    </BreadcrumbNameContext.Provider>
  )
}

export const useBreadcrumbNames = () => {
  const context = useContext(BreadcrumbNameContext)

  if (!context) {
    throw new Error('BreadcrumbNameProvider is not initialized')
  }

  return context
}

export const useRegisterBreadcrumbName = (
  key?: string | null,
  label?: string | null,
) => {
  const { registerLabel } = useBreadcrumbNames()

  useEffect(() => {
    if (!key || !label) {
      return
    }

    const normalizedLabel = label.trim()
    if (!normalizedLabel) {
      return
    }

    registerLabel(key, normalizedLabel)
  }, [key, label, registerLabel])
}
