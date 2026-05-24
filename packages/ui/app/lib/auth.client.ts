const ACCESS_TOKEN_EXPIRY_COOKIE = 'access-token-expiry'
const REFRESH_ENDPOINT = '/refresh?mode=json'
const REFRESH_BUFFER_MS = 2 * 60 * 1000

let refreshPromise: Promise<boolean> | null = null
let refreshTimer: number | null = null

function getCookieValue(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null
}

function getAccessTokenExpiry(): number | null {
  const value = getCookieValue(ACCESS_TOKEN_EXPIRY_COOKIE)
  if (!value) return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function notifyAuthEvent(name: 'auth:refreshed' | 'auth:cleared') {
  window.dispatchEvent(new CustomEvent(name))
}

export function redirectToLogin() {
  window.location.assign('/login')
}

export function clearRefreshSchedule() {
  if (refreshTimer !== null) {
    window.clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

export function scheduleAccessTokenRefresh() {
  clearRefreshSchedule()

  const accessTokenExpiry = getAccessTokenExpiry()
  if (!accessTokenExpiry) return

  const refreshAt = accessTokenExpiry - REFRESH_BUFFER_MS
  const delay = Math.max(refreshAt - Date.now(), 0)

  refreshTimer = window.setTimeout(() => {
    void refreshSession({ redirectOnFail: false })
  }, delay)
}

export async function refreshSession(options?: { redirectOnFail?: boolean }) {
  const { redirectOnFail = true } = options ?? {}

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(REFRESH_ENDPOINT, {
          method: 'GET',
          credentials: 'include',
          headers: {
            accept: 'application/json',
            'x-refresh-request': '1',
          },
        })

        if (!response.ok) {
          notifyAuthEvent('auth:cleared')
          return false
        }

        notifyAuthEvent('auth:refreshed')
        scheduleAccessTokenRefresh()
        return true
      } catch {
        notifyAuthEvent('auth:cleared')
        return false
      } finally {
        refreshPromise = null
      }
    })()
  }

  const refreshed = await refreshPromise
  if (!refreshed && redirectOnFail) {
    redirectToLogin()
  }

  return refreshed
}
