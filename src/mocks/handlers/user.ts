import { http, HttpResponse } from 'msw'
import { users } from '../db/user.db'

export const userHandlers = [
  http.get('*/api/v1/users/search', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''

    const trimmed = q.trim().toLowerCase()
    const matched = trimmed
      ? users.filter((u) => u.nickname.toLowerCase().includes(trimmed))
      : [...users]

    const data = matched.map((u) => ({
      userId: u.userId,
      nickname: u.nickname,
      profileImageUrl: u.profileImageUrl,
    }))

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: { users: data },
      success: true,
    })
  }),
]
