import ky from 'ky'

type RefreshResponse = {
  code: string
  message: string
  data: {
    accessToken: string
  }
  success: boolean
}

const authInstance = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 10000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  retry: 0,
})

export async function refreshAccessToken() {
  const response = await authInstance.post('api/v1/auth/refresh')
  const result = await response.json<RefreshResponse>()
  return result.data
}
