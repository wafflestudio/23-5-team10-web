import { http, HttpResponse } from 'msw'
import { authDb } from '../db/auth.db'

interface LoginRequest {
  loginId: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  nickname: string
  name?: string
}

export const authHandlers = [
  http.get('*/auth/check-nickname', async ({ request }) => {
    const url = new URL(request.url)
    const nickname = url.searchParams.get('nickname')
    const isDuplicate = authDb.some((user) => user.nickname === nickname)

    if (isDuplicate) {
      return HttpResponse.json({
        code: 'AUTH_409',
        message: '이미 존재하는 닉네임입니다.',
        data: { isAvailable: false },
        isSuccess: true,
      })
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '사용 가능한 닉네임입니다.',
      data: { isAvailable: true },
      isSuccess: true,
    })
  }),

  http.post('*/auth/check-account', async ({ request }) => {
    const { identity } = (await request.json()) as { identity: string }
    const user = authDb.find(
      (u) => u.email === identity || u.nickname === identity
    )

    if (!user) {
      return HttpResponse.json(
        {
          code: 'AUTH_404',
          message: '계정을 찾을 수 없습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    const [name, domain] = user.email.split('@')
    const maskedEmail = `${name.slice(0, 2)}****@${domain}`

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '계정 확인 성공',
      data: { sentEmail: maskedEmail },
      isSuccess: true,
    })
  }),

  http.post('*/auth/register', async ({ request }) => {
    const newUser = (await request.json()) as RegisterRequest
    const isDuplicate = authDb.some(
      (u) => u.email === newUser.email || u.nickname === newUser.nickname
    )

    if (isDuplicate) {
      return HttpResponse.json(
        {
          code: 'AUTH_400',
          message: '이미 존재하는 이메일/닉네임입니다.',
          data: null,
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const userId = authDb.length + 1
    const userObj = {
      userId,
      email: newUser.email,
      password: newUser.password,
      nickname: newUser.nickname,
    }
    authDb.push(userObj)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '회원가입 및 로그인 성공',
      data: {
        accessToken: `mock-access-token-${userId}`,
        user: {
          id: userId,
          nickname: userObj.nickname,
          profileImageUrl: `https://i.pravatar.cc/150?u=${userId}`,
        },
      },
      isSuccess: true,
    })
  }),

  http.post('*/api/v1/auth/login', async ({ request }) => {
    const { loginId, password } = (await request.json()) as LoginRequest

    const userExists = authDb.find(
      (u) => u.email === loginId || u.nickname === loginId
    )

    if (!userExists || userExists.password !== password) {
      return HttpResponse.json(
        {
          code: 'AUTH_401',
          message: '사용자 정보가 일치하지 않습니다.',
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
        user: {
          id: userExists.userId,
          nickname: userExists.nickname,
          profileImageUrl: `https://i.pravatar.cc/150?u=${userExists.userId}`,
        },
      },
      isSuccess: true,
    })
  }),

  http.post('*/api/v1/auth/refresh', async ({ request }) => {
    const FORCE_REFRESH_FAILURE = false
    if (FORCE_REFRESH_FAILURE) {
      return HttpResponse.json(
        {
          code: 'AUTH_401',
          message: '리프레시 토큰이 만료되었습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 401 }
      )
    }

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split('Bearer ')[1]
    const user =
      authDb.find((u) => `mock-access-token-${u.userId}` === token) || authDb[0]

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '토큰 재발급 성공',
      data: {
        accessToken: `mock-access-token-${user.userId}`,
        user: {
          id: user.userId,
          nickname: user.nickname,
          profileImageUrl: `https://i.pravatar.cc/150?u=${user.userId}`,
        },
      },
      isSuccess: true,
    })
  }),
]
