import { http, HttpResponse, delay } from 'msw'
import { users } from '../db/user.db'
import { follows } from '../db/follow.db'

const CURRENT_USER_ID = 1

export const userHandlers = [
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
        followed,
      }
    })

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: { users: data },
      success: true,
    })
  }),
]
