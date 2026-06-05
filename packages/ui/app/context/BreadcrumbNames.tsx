import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type BreadcrumbNameRegistry = Map<string, Map<number, string>>

type BreadcrumbNameContextValue = {
  getLabel: (key: string) => string | undefined
  registerLabel: (key: string, label: string) => () => void
}

const BreadcrumbNameContext = createContext<
  BreadcrumbNameContextValue | undefined
>(undefined)

export const BreadcrumbNameProvider = ({ children }: PropsWithChildren) => {
  const [registry, setRegistry] = useState<BreadcrumbNameRegistry>(
    () => new Map(),
  )
  const nextRegistrationId = useRef(0)

  const getLabel = useCallback(
    (key: string) => {
      const entries = registry.get(key)
      if (!entries || entries.size === 0) {
        return undefined
      }

      return Array.from(entries.values()).at(-1)
    },
    [registry],
  )

  const registerLabel = useCallback((key: string, label: string) => {
    const registrationId = nextRegistrationId.current++

    setRegistry((currentRegistry) => {
      const nextRegistry = new Map(currentRegistry)
      const nextEntries = new Map(nextRegistry.get(key))

      nextEntries.set(registrationId, label)
      nextRegistry.set(key, nextEntries)

      return nextRegistry
    })

    return () => {
      setRegistry((currentRegistry) => {
        const currentEntries = currentRegistry.get(key)
        if (!currentEntries?.has(registrationId)) {
          return currentRegistry
        }

        const nextRegistry = new Map(currentRegistry)
        const nextEntries = new Map(currentEntries)

        nextEntries.delete(registrationId)

        if (nextEntries.size === 0) {
          nextRegistry.delete(key)
        } else {
          nextRegistry.set(key, nextEntries)
        }

        return nextRegistry
      })
    }
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

    return registerLabel(key, normalizedLabel)
  }, [key, label, registerLabel])
}
