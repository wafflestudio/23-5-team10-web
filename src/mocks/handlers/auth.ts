import { http, HttpResponse } from 'msw'
import { authUsers } from '../db/auth.db'

export const authHandlers = [
  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    const { loginId, password } = body

    const authInfo = authUsers.find((u) => u.loginId === loginId)

    if (!authInfo) {
      return HttpResponse.json(
        {
          code: 'USER404',
          message: '사용자를 찾을 수 없습니다.',
          data: null,
          success: false,
        },
        { status: 404 }
      )
    }

    if (authInfo.password !== password) {
      return HttpResponse.json(
        {
          code: 'AUTH401',
          message: '비밀번호가 일치하지 않습니다.',
          data: null,
          success: false,
        },
        { status: 401 }
      )
    }

    return HttpResponse.json(
      {
        code: 'COMMON200',
        message: '성공입니다.',
        data: {
          accessToken: `mock-access-token-${authInfo.userId}`,
          refreshToken: 'mock-refresh-token',
        },
        success: true,
      },
      { status: 200 }
    )
  }),
]
