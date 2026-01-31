import ky, { type NormalizedOptions } from 'ky'
import { refreshAccessToken } from './authApi'
import { useAuthStore } from '../auth/authStore'

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL is not set')
}

const DEV = import.meta.env.DEV
const requestStartTimes = new WeakMap<NormalizedOptions, number>()
let isRefreshing = false
let refreshPromise: Promise<{
  accessToken: string
  user: { id: number; nickname: string; profileImageUrl: string }
}> | null = null

function maskHeaders(headersInit: HeadersInit | undefined) {
  const headers = headersInit ? new Headers(headersInit) : undefined
  if (!headers) return undefined

  return Object.fromEntries(
    Array.from(headers.entries()).map(([key, value]) => {
      const shouldMask = /authorization|cookie/i.test(key)
      return [key, shouldMask ? '***' : value]
    })
  )
}

export class AuthError extends Error {
  constructor(status: 401 | 403, response: Response) {
    super(`Auth error: ${status}`)
    this.name = 'AuthError'
    this.status = status
    this.response = response
  }
  public status: 401 | 403
  public response: Response
}

function getDurationMs(options: NormalizedOptions) {
  const startMs = requestStartTimes.get(options)
  if (startMs == null) return undefined
  return Math.round(performance.now() - startMs)
}

export const instance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: {
    limit: 2,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    statusCodes: [401, 408, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request, options) => {
        requestStartTimes.set(options, performance.now())

        if (DEV) {
          console.groupCollapsed(`[API][REQ] ${request.method} ${request.url}`)
          console.debug('options', {
            retry: options.retry,
            headers: maskHeaders(options.headers),
          })
          console.groupEnd()
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (DEV) {
          const durationMs = getDurationMs(options)

          console.groupCollapsed(
            `[API][RES] ${response.status} ${request.method} ${request.url}${
              durationMs != null ? ` (${durationMs}ms)` : ''
            }`
          )
          console.debug('response', {
            ok: response.ok,
            status: response.status,
            url: response.url,
            durationMs,
          })

          if (!response.ok) {
            try {
              console.debug('errorBody', await response.clone().json())
            } catch {
              // ignore
            }
          }

          console.groupEnd()
        }
        requestStartTimes.delete(options)
        return response
      },
    ],
    beforeError: [
      async (error) => {
        if (error.options) {
          requestStartTimes.delete(error.options)
        }

        const { response } = error
        if (response?.status === 401) {
          if (isRefreshing && refreshPromise) {
            try {
              await refreshPromise
              return error
            } catch {
              useAuthStore.getState().setSessionExpired()
              return error
            }
          }

          isRefreshing = true
          refreshPromise = refreshAccessToken()

          try {
            const data = await refreshPromise
            useAuthStore.getState().setAuthenticated(true, data.user)
            isRefreshing = false
            refreshPromise = null
            return error
          } catch {
            isRefreshing = false
            refreshPromise = null
            useAuthStore.getState().setSessionExpired()
            return error
          }
        }

        if (response && (response.status === 401 || response.status === 403)) {
          throw new AuthError(response.status as 401, response)
        }

        if (DEV) {
          console.groupCollapsed('[API][ERROR]')
          console.error(error)
          console.groupEnd()
        }
        return error
      },
    ],
  },
})
