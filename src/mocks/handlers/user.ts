import { http, HttpResponse, delay } from 'msw'
import { users } from '../db/user.db'
import { follows } from '../db/follow.db'
import { authDb } from '../db/auth.db'

const CURRENT_USER_ID = 1

function getUserIdFromToken(request: Request): number | null {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token?.startsWith('mock-access-token-')) return null
  const userId = Number(token.replace('mock-access-token-', ''))
  return Number.isInteger(userId) ? userId : null
}

export const userHandlers = [
  http.get('*/api/v1/users/me', ({ request }) => {
    const userId = getUserIdFromToken(request)
    if (!userId) {
      return HttpResponse.json(
        {
          code: 'AUTH_401',
          message: '인증이 필요합니다.',
          data: null,
          isSuccess: false,
        },
        { status: 401 }
      )
    }

    const authUser = authDb.find((u) => u.userId === userId)
    const profileUser = users.find((u) => u.userId === userId)

    if (!authUser) {
      return HttpResponse.json(
        {
          code: '404',
          message: '사용자를 찾을 수 없습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '요청에 성공하였습니다.',
      data: {
        userId: authUser.userId,
        email: authUser.email,
        nickname: profileUser?.nickname ?? authUser.nickname,
        name: profileUser?.name ?? null,
        profileImageUrl: profileUser?.profileImageUrl ?? null,
        bio: profileUser?.bio ?? null,
        role: 'USER',
      },
      isSuccess: true,
    })
  }),

  http.get('*/api/v1/users/:userId/profile', ({ params }) => {
    const userId = Number(params.userId)

    if (!Number.isInteger(userId) || userId < 1) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 userId입니다.',
          data: null,
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const user = users.find((u) => u.userId === userId)
    if (!user) {
      return HttpResponse.json(
        {
          code: '404',
          message: '사용자를 찾을 수 없습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    const followerCount = follows.filter((f) => f.toUserId === userId).length
    const followingCount = follows.filter((f) => f.fromUserId === userId).length
    const postsCount = 0

    const followed = follows.some(
      (f) => f.fromUserId === CURRENT_USER_ID && f.toUserId === userId
    )

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '요청에 성공하였습니다.',
      data: {
        userId: user.userId,
        nickname: user.nickname,
        name: user.name,
        bio: user.bio,
        profileImageUrl: user.profileImageUrl,
        postsCount,
        followerCount,
        followingCount,
        isMe: userId === CURRENT_USER_ID,
        isFollowed: followed,
      },
      isSuccess: true,
    })
  }),

  http.get('*/api/v1/users/search', async ({ request }) => {
    await delay(1000)
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''

    const trimmed = q.trim().toLowerCase()
    const matched = trimmed
      ? users.filter((u) => u.nickname.toLowerCase().includes(trimmed))
      : [...users]

    const data = matched.map((u) => {
      const followed = follows.some(
        (f) => f.fromUserId === CURRENT_USER_ID && f.toUserId === u.userId
      )
      return {
        userId: u.userId,
        nickname: u.nickname,
        profileImageUrl: u.profileImageUrl,
        name: u.name,
        isFollowed: followed,
      }
    })

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: { users: data },
      isSuccess: true,
    })
  }),
]
