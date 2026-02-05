import { http, HttpResponse, delay } from 'msw'
import { users } from '../db/user.db'
import { follows } from '../db/follow.db'
import { authDb } from '../db/auth.db'
import { posts } from '../db/post.db'
import {
  bookmarkedPostIds,
  likedPostIds,
  postAlbumMap,
} from '../db/postRelations.db'

const CURRENT_USER_ID = 1

function getPostsByUserId(userId: number) {
  const user = users.find((u) => u.userId === userId)
  if (!user) return []
  return posts.filter((p) => p.username === user.nickname)
}

function getUserIdFromToken(request: Request): number | null {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token?.startsWith('mock-access-token-')) return null
  const userId = Number(token.replace('mock-access-token-', ''))
  return Number.isInteger(userId) ? userId : null
}

const FORCE_AUTH_FAILURE = false

export const userHandlers = [
  http.get('*/api/v1/users/me', ({ request }) => {
    if (FORCE_AUTH_FAILURE) {
      return HttpResponse.json(
        {
          code: 'AUTH_401',
          message: '세션이 만료되었습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 401 }
      )
    }

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
    const postCount = getPostsByUserId(userId).length

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
        postCount,
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

  http.get('*/api/v1/users/:userId/posts', ({ params }) => {
    const userId = Number(params.userId)

    if (!Number.isInteger(userId) || userId < 1) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 userId입니다.',
          data: [],
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
          data: [],
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    const userPosts = getPostsByUserId(userId)

    const data = userPosts.map((post) => {
      const postId = Number(post.id)
      return {
        id: postId,
        userId: user.userId,
        nickname: user.nickname,
        profileImageUrl: user.profileImageUrl,
        content: post.caption,
        albumId: postAlbumMap[postId] ?? null,
        images: post.images.map((url, index) => ({
          id: postId * 100 + index,
          url,
          orderIndex: index,
        })),
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        updatedAt: post.createdAt,
        isLiked: likedPostIds.has(postId),
        isBookmarked: bookmarkedPostIds.has(postId),
      }
    })

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '사용자 게시물 목록 조회 성공',
      data,
      isSuccess: true,
    })
  }),
]
