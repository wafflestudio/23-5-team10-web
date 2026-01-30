import { useEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from './authStore'
import { refreshAccessToken } from '../api/authApi'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isSessionExpired, setAuthenticated, reset } =
    useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      if (location.pathname === '/login') return

      try {
        const data = await refreshAccessToken()
        setAuthenticated(true, data.user)
      } catch {
        reset()
        navigate({ to: '/login' })
      }
    }

    if (!isAuthenticated) {
      initAuth()
    }
  }, [isAuthenticated, location.pathname, navigate, reset, setAuthenticated])

  useEffect(() => {
    if (isSessionExpired) {
      toast.error('세션이 만료되었습니다. 다시 로그인해주세요.')
      reset()
      navigate({ to: '/login' })
    }
  }, [isSessionExpired, reset, navigate])

  return <>{children}</>
}
