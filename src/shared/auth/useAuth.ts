import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from './authStore'
import { authInstance } from '../api/authApi'

interface LoginCredentials {
  email?: string
  password?: string
  [key: string]: unknown
}

interface LoginResponse {
  success: boolean
  data: {
    user: {
      id: number
      nickname: string
      profileImageUrl: string
    }
  }
}

export function useAuth() {
  const navigate = useNavigate()
  const { setAuthenticated, reset } = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    const response = await authInstance
      .post('api/v1/auth/login', {
        json: credentials,
      })
      .json<LoginResponse>()

    if (response.success) {
      setAuthenticated(true, response.data.user)
      navigate({ to: '/' })
    }
    return response
  }

  const logout = async () => {
    try {
      await authInstance.post('api/v1/auth/logout')
    } finally {
      reset()
      navigate({ to: '/login' })
    }
  }

  return { login, logout }
}
