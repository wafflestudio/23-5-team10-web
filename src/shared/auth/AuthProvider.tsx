import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from './authStore'
import { useCurrentUser, useClearCurrentUser } from './useCurrentUser'

const PUBLIC_PATHS = ['/login', '/accounts/emailsignup', '/accounts/password']

function hasAccessToken() {
  return !!localStorage.getItem('accessToken')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSessionExpired, reset } = useAuthStore()
  const isPublicPage = PUBLIC_PATHS.some((path) =>
    location.pathname.startsWith(path)
  )
  const hasToken = hasAccessToken()
  const shouldFetchUser = !isPublicPage && hasToken
  const { isError, isFetched, isLoading } = useCurrentUser({
    enabled: shouldFetchUser,
  })
  const clearCurrentUser = useClearCurrentUser()

  useLayoutEffect(() => {
    if (!isPublicPage && !hasToken) {
      navigate({ to: '/login', replace: true })
    }
  }, [isPublicPage, hasToken, navigate])

  useEffect(() => {
    if (!isFetched || isPublicPage) return

    if (isError && location.pathname !== '/') {
      navigate({ to: '/login' })
    }
  }, [isError, isFetched, isPublicPage, location.pathname, navigate])

  useEffect(() => {
    if (isSessionExpired) {
      toast.error('세션이 만료되었습니다. 다시 로그인해주세요.', {
        id: 'session-expired',
      })
      clearCurrentUser()
      reset()
      navigate({ to: '/login' })
    }
  }, [isSessionExpired, reset, navigate, clearCurrentUser])

  if (!isPublicPage && !hasToken) {
    return null
  }

  if (!isPublicPage && isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return <>{children}</>
}
