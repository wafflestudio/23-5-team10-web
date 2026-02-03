import { http, HttpResponse, delay } from 'msw'
import { posts } from '../db/post.db'
import { users } from '../db/user.db'
import {
  bookmarkedPostIds,
  likedPostIds,
  postAlbumMap,
} from '../db/postRelations.db'

export const postHandlers = [
  http.get('*/api/v1/posts/:postId', async ({ params }) => {
    await delay(100)
    const { postId } = params
    const post = posts.find((p) => String(p.id) === String(postId))

    if (!post) {
      return HttpResponse.json(
        {
          code: '404',
          message: '게시글을 찾을 수 없습니다.',
          data: null,
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    const idNum = Number(post.id)
    const author = users.find((u) => u.nickname === post.username)
    const authorId = author ? author.userId : 999

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '게시글 상세 조회 성공',
      isSuccess: true,
      data: {
        id: idNum,
        userId: authorId,
        nickname: post.username,
        profileImageUrl: post.userImage,
        content: post.caption,
        albumId: postAlbumMap[idNum] ?? null,
        images: post.images.map((url, index) => ({
          id: idNum * 100 + index,
          url: url,
          orderIndex: index,
        })),
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
        updatedAt: post.createdAt,
        isLiked: likedPostIds.has(idNum),
        isBookmarked: bookmarkedPostIds.has(idNum),
      },
    })
  }),

  http.post('*/api/v1/posts/:postId/like', async ({ params }) => {
    await delay(100)
    const { postId } = params
    const idNum = Number(postId)

    likedPostIds.add(idNum)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '좋아요 성공',
      isSuccess: true,
      data: {
        isLiked: true,
      },
    })
  }),

  http.delete('*/api/v1/posts/:postId/like', async ({ params }) => {
    await delay(100)
    const { postId } = params
    const idNum = Number(postId)

    likedPostIds.delete(idNum)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '좋아요 취소 성공',
      isSuccess: true,
      data: {
        isLiked: false,
      },
    })
  }),

  http.post('*/api/v1/posts/:postId/bookmark', async ({ params }) => {
    await delay(100)
    const { postId } = params
    const idNum = Number(postId)

    bookmarkedPostIds.add(idNum)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '북마크 성공',
      isSuccess: true,
      data: {
        isBookmarked: true,
      },
    })
  }),

  http.delete('*/api/v1/posts/:postId/bookmark', async ({ params }) => {
    await delay(100)
    const { postId } = params
    const idNum = Number(postId)

    bookmarkedPostIds.delete(idNum)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '북마크 취소 성공',
      isSuccess: true,
      data: {
        isBookmarked: false,
      },
    })
  }),
]
