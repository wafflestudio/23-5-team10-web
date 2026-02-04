import { instance } from './ky'

type RefreshResponse = {
  code: string
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
  success: boolean
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  const response = await instance.post('api/v1/auth/refresh', {
    json: { refreshToken },
  })
  const result = await response.json<RefreshResponse>()
  return result.data
}
