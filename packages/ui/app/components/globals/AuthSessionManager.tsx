import { useEffect } from 'react'
import { useLocation } from '@remix-run/react'
import {
  clearRefreshSchedule,
  scheduleAccessTokenRefresh,
} from '~/lib/auth.client'

export function AuthSessionManager() {
  const location = useLocation()

  useEffect(() => {
    scheduleAccessTokenRefresh()
  }, [location.key])

  useEffect(() => {
    const handleFocus = () => {
      scheduleAccessTokenRefresh()
    }
    const handleRefreshed = () => {
      scheduleAccessTokenRefresh()
    }
    const handleCleared = () => {
      clearRefreshSchedule()
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scheduleAccessTokenRefresh()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('auth:refreshed', handleRefreshed)
    window.addEventListener('auth:cleared', handleCleared)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('auth:refreshed', handleRefreshed)
      window.removeEventListener('auth:cleared', handleCleared)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearRefreshSchedule()
    }
  }, [])

  return null
}
