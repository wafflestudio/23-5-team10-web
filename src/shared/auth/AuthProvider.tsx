import { useEffect, type ReactNode, useRef } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from './authStore'
import { refreshAccessToken } from '../api/authApi'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isInitialMount = useRef(true)
  const { isAuthenticated, isSessionExpired, setAuthenticated, reset } =
    useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      if (location.pathname === '/login' || isAuthenticated) return

      try {
        const data = await refreshAccessToken()
        setAuthenticated(true, data.user)
      } catch {
        reset()
        // 로그인이 필요한 페이지에서만 튕기도록 설정 (필요 시 조건 추가)
        if (location.pathname !== '/') {
          navigate({ to: '/login' })
        }
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false
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
