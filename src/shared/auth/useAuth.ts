import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from './authStore'
import { instance } from '../api/ky'
import { useInvalidateCurrentUser, useClearCurrentUser } from './useCurrentUser'

type LoginCredentials = {
  email?: string
  password?: string
  [key: string]: unknown
}

type LoginResponse = {
  success: boolean
  data: {
    accessToken: string
  }
}

export function useAuth() {
  const navigate = useNavigate()
  const { reset } = useAuthStore()
  const invalidateCurrentUser = useInvalidateCurrentUser()
  const clearCurrentUser = useClearCurrentUser()

  const login = async (credentials: LoginCredentials) => {
    const response = await instance
      .post('api/v1/auth/login', {
        json: credentials,
      })
      .json<LoginResponse>()

    if (response.success) {
      localStorage.setItem('accessToken', response.data.accessToken)
      await invalidateCurrentUser()
      navigate({ to: '/', search: { page: 1 } })
    }
    return response
  }

  const logout = async () => {
    try {
      await instance.post('api/v1/auth/logout')
    } finally {
      localStorage.removeItem('accessToken')
      clearCurrentUser()
      reset()
      navigate({ to: '/login' })
    }
  }

  return { login, logout }
}
