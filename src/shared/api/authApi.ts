import ky from 'ky'

const API_URL = import.meta.env.VITE_API_URL

type RefreshResponse = {
  code: string
  message: string
  data: {
    accessToken: string
  }
  success: boolean
}

export const authInstance = ky.create({
  prefixUrl: API_URL,
  credentials: 'include',
})

export async function refreshAccessToken() {
  const response = await authInstance.post('auth/refresh')
  const result = await response.json<RefreshResponse>()
  return result.data
}
