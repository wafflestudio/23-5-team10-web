import { http, HttpResponse } from 'msw'
import {
  recentSearchDb,
  getNextSearchId,
  type MockRecentSearch,
} from '../db/recentSearch.db'
import { users } from '../db/user.db'
import { follows } from '../db/follow.db'

const CURRENT_USER_ID = 1

interface PostRecentSearchRequest {
  toUserId: number
}

interface DeleteRecentSearchRequest {
  toUserId: number
}

function findUserByUserId(userId: number) {
  return users.find((u) => u.userId === userId)
}

export const searchHandlers = [
  http.post('*/api/v1/search/recent', async ({ request }) => {
    const { toUserId } = (await request.json()) as PostRecentSearchRequest

    const existingIndex = recentSearchDb.findIndex((r) => r.userId === toUserId)
    let searchId: number

    if (existingIndex !== -1) {
      const [existing] = recentSearchDb.splice(existingIndex, 1)
      searchId = existing.searchId
      recentSearchDb.unshift(existing)
    } else {
      searchId = getNextSearchId()
      const newEntry: MockRecentSearch = { searchId, userId: toUserId }
      recentSearchDb.unshift(newEntry)
    }

    return HttpResponse.json({
      code: 'RECENT_SEARCH_SAVED',
      message: '최근 검색 기록 저장 완료',
      data: { searchId },
      isSuccess: true,
    })
  }),

  http.get('*/api/v1/search/recent', () => {
    const items = recentSearchDb.map((r) => {
      const user = findUserByUserId(r.userId)
      const followed = follows.some(
        (f) => f.fromUserId === CURRENT_USER_ID && f.toUserId === r.userId
      )
      return {
        searchId: r.searchId,
        userId: r.userId,
        nickname: user?.nickname ?? 'unknown',
        profileImageUrl: user?.profileImageUrl ?? null,
        name: user?.name ?? null,
        followed,
      }
    })

    return HttpResponse.json({
      code: 'RECENT_SEARCH_LIST_SUCCESS',
      message: '최근 검색 목록 조회 성공',
      data: { items },
      isSuccess: true,
    })
  }),

  http.delete('*/api/v1/search/recent', async ({ request }) => {
    const { toUserId } = (await request.json()) as DeleteRecentSearchRequest

    const index = recentSearchDb.findIndex((r) => r.userId === toUserId)
    if (index !== -1) {
      recentSearchDb.splice(index, 1)
    }

    return HttpResponse.json({
      code: 'RECENT_SEARCH_DELETED',
      message: '최근 검색 기록 삭제 완료',
      isSuccess: true,
    })
  }),

  http.delete('*/api/v1/search/recent/all', () => {
    recentSearchDb.length = 0

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '요청에 성공하였습니다.',
      isSuccess: true,
    })
  }),
]
