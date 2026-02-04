import ky from 'ky'

type RefreshResponse = {
  code: string
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
  success: boolean
}

const authInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  retry: 0,
})

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  const response = await authInstance.post('api/v1/auth/refresh', {
    json: { refreshToken },
  })
  const result = await response.json<RefreshResponse>()
  return result.data
}
