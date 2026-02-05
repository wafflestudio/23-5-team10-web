import { http, HttpResponse } from 'msw'
import { posts } from '../db/post.db'
import { users } from '../db/user.db'
import { bookmarkedPostIds, likedPostIds } from '../db/postRelations.db'
import {
  FeedItemSchema,
  FeedPageSchema,
  ApiResponseSchema,
} from '@/entities/feed/model/schema'

export const feedHandlers = [
  http.get('*/api/v1/feed', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const size = Number(url.searchParams.get('size') ?? '6')

    const allPosts = posts

    const start = (page - 1) * size
    const end = start + size
    const pageItems = allPosts.slice(start, end)

    const items = pageItems.map((p) => {
      const postId = Number(p.id)
      const user = users.find((u) => u.nickname === p.username)

      return FeedItemSchema.parse({
        postId,
        author: {
          userId: user?.userId ?? 1,
          nickname: p.username,
          profileImageUrl: user?.profileImageUrl ?? p.userImage,
        },
        thumbnailImageUrl: p.images?.[0] ?? null,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: p.createdAt,
        isLiked: likedPostIds.has(postId),
        isBookmarked: bookmarkedPostIds.has(postId),
      })
    })

    const totalElements = allPosts.length
    const totalPages = Math.max(1, Math.ceil(totalElements / size))

    const feedPage = FeedPageSchema.parse({
      items,
      page,
      size,
      totalPages,
      totalElements,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    })

    const responseBody = ApiResponseSchema(FeedPageSchema).parse({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: feedPage,
      isSuccess: true,
    })

    return HttpResponse.json(responseBody)
  }),
]
