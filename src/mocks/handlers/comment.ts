import { http, HttpResponse } from 'msw'
import { comments } from '../db/comment.db'

export const commentHandlers = [
  http.get('*/api/v1/posts/:postId/comments', ({ params }) => {
    const { postId } = params

    const postComments = comments.filter(
      (comment) => String(comment.postId) === String(postId)
    )

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '댓글 목록 조회 성공',
      data: postComments,
      success: true,
    })
  }),

  http.post('*/api/v1/posts/:postId/comments', async ({ request, params }) => {
    const { postId } = params
    const { content, parentId } = (await request.json()) as {
      content: string
      parentId?: number | null
    }

    const newComment = {
      id: Math.floor(Math.random() * 1000000),
      postId: Number(postId),
      userId: 1,
      nickname: 'me',
      profileImageUrl: 'https://i.pravatar.cc/150?u=1',
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: parentId || null,
      likeCount: 0,
      liked: false,
      likedUserIds: [],
    }

    comments.push(newComment)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '댓글 등록 성공',
      data: newComment,
      success: true,
    })
  }),

  http.post('*/api/v1/posts/:postId/comments/:commentId/like', ({ params }) => {
    const { commentId } = params
    const comment = comments.find((c) => String(c.id) === String(commentId))

    if (comment && !comment.liked) {
      comment.liked = true
      comment.likeCount += 1
      comment.likedUserIds.push(1)
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: `댓글 ${commentId} 좋아요 성공`,
      data: null,
      success: true,
    })
  }),

  http.delete(
    '*/api/v1/posts/:postId/comments/:commentId/like',
    ({ params }) => {
      const { commentId } = params
      const comment = comments.find((c) => String(c.id) === String(commentId))

      if (comment && comment.liked) {
        comment.liked = false
        comment.likeCount = Math.max(0, comment.likeCount - 1)
        comment.likedUserIds = comment.likedUserIds.filter((id) => id !== 1)
      }

      return HttpResponse.json({
        code: 'COMMON_200',
        message: `댓글 ${commentId} 좋아요 취소 성공`,
        data: null,
        success: true,
      })
    }
  ),
]
