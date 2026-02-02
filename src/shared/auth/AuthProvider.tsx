import { useEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from './authStore'
import { useCurrentUser, useClearCurrentUser } from './useCurrentUser'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSessionExpired, reset } = useAuthStore()
  const { isError, isFetched } = useCurrentUser()
  const clearCurrentUser = useClearCurrentUser()

  useEffect(() => {
    if (!isFetched || location.pathname === '/login') return

    if (isError && location.pathname !== '/') {
      navigate({ to: '/login' })
    }
  }, [isError, isFetched, location.pathname, navigate])

  useEffect(() => {
    if (isSessionExpired) {
      toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
      clearCurrentUser()
      reset()
      navigate({ to: '/login' })
    }
  }, [isSessionExpired, reset, navigate, clearCurrentUser])

  return <>{children}</>
}
