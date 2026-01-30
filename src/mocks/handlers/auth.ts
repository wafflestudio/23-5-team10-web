import { http, HttpResponse } from 'msw'
import { authDb } from '../db/auth.db'

interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

interface LoginRequest {
  loginId: string
  password: string
}

export const authHandlers = [
  http.get('*/api/v1/auth/check-nickname', ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')
    const isDuplicate = authDb.some((user) => user.nickname === nickname)

    if (isDuplicate) {
      return HttpResponse.json({
        isSuccess: true,
        code: 'AUTH_409',
        message: '이미 존재하는 닉네임입니다.',
        data: { isAvailable: false },
      })
    }

    return HttpResponse.json({
      isSuccess: true,
      code: 'COMMON_200',
      message: '사용 가능한 닉네임입니다.',
      data: { isAvailable: true },
    })
  }),

  http.post('*/api/v1/auth/check-account', async ({ request }) => {
    const { identity } = (await request.json()) as { identity: string }
    const user = authDb.find(
      (u) => u.email === identity || u.nickname === identity
    )

    if (!user) {
      return HttpResponse.json(
        {
          isSuccess: false,
          message: '계정을 찾을 수 없습니다.',
        },
        { status: 404 }
      )
    }

    const [name, domain] = user.email.split('@')
    const maskedEmail = `${name.slice(0, 2)}****@${domain}`

    return HttpResponse.json({
      isSuccess: true,
      data: { sentEmail: maskedEmail },
    })
  }),

  http.post('*/api/v1/auth/register', async ({ request }) => {
    const newUser = (await request.json()) as RegisterRequest
    const isDuplicate = authDb.some(
      (u) => u.email === newUser.email || u.nickname === newUser.nickname
    )

    if (isDuplicate) {
      return HttpResponse.json(
        {
          code: 'AUTH_400',
          message: '이미 존재하는 이메일/닉네임입니다.',
          data: {
            accessToken: 'string',
            refreshToken: 'string',
          },
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    authDb.push({
      userId: authDb.length + 1,
      email: newUser.email,
      password: newUser.password,
      nickname: newUser.nickname,
    })

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '회원가입 및 로그인 성공',
      data: {
        accessToken: 'mock-access-token-123',
        refreshToken: 'mock-refresh-token-456',
      },
      isSuccess: true,
    })
  }),

  http.post('*/api/v1/auth/login', async ({ request }) => {
    const { loginId, password } = (await request.json()) as LoginRequest

    const userExists = authDb.find(
      (u) => u.email === loginId || u.nickname === loginId
    )

    if (!userExists) {
      return HttpResponse.json(
        {
          code: 'AUTH_404',
          message: '사용자를 찾을 수 없습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    if (userExists.password !== password) {
      return HttpResponse.json(
        {
          code: 'AUTH_401',
          message: '비밀번호가 틀렸습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '로그인 성공',
      data: {
        accessToken: `mock-access-token-${userExists.userId}`,
        refreshToken: `mock-refresh-token-${userExists.userId}`,
      },
      isSuccess: true,
    })
  }),
]
