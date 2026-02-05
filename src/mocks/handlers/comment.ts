import { http, HttpResponse } from 'msw'
import { comments } from '../db/comment.db'
import { authDb } from '../db/auth.db'

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
      isSuccess: true,
    })
  }),

  http.post('*/api/v1/posts/:postId/comments', async ({ request, params }) => {
    const { postId } = params
    const { content } = (await request.json()) as {
      content: string
    }

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.split('Bearer ')[1]
    const user =
      authDb.find((u) => `mock-access-token-${u.userId}` === token) || authDb[0]

    const newComment = {
      id: Math.floor(Math.random() * 1000000),
      postId: Number(postId),
      userId: user.userId,
      nickname: user.nickname,
      profileImageUrl: `https://i.pravatar.cc/150?u=${user.userId}`,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: null as null,
      likeCount: 0,
      isLiked: false,
      likedUserIds: [] as number[],
    }

    comments.push(newComment)

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '댓글 등록 성공',
      data: newComment,
      isSuccess: true,
    })
  }),

  http.put(
    '*/api/v1/posts/:postId/comments/:commentId',
    async ({ request, params }) => {
      const { commentId } = params
      const { content } = (await request.json()) as { content: string }

      const commentIndex = comments.findIndex(
        (c) => String(c.id) === String(commentId)
      )

      if (commentIndex === -1) {
        return HttpResponse.json(
          {
            code: 'COMMENT_404',
            message: '댓글을 찾을 수 없습니다.',
            isSuccess: false,
          },
          { status: 404 }
        )
      }

      comments[commentIndex] = {
        ...comments[commentIndex],
        content,
        updatedAt: new Date().toISOString(),
      }

      return HttpResponse.json({
        code: 'COMMON_200',
        message: '댓글 수정 성공',
        data: comments[commentIndex],
        isSuccess: true,
      })
    }
  ),

  http.post(
    '*/api/v1/posts/:postId/comments/:commentId/like',
    ({ request, params }) => {
      const { commentId } = params
      const comment = comments.find((c) => String(c.id) === String(commentId))

      const authHeader = request.headers.get('Authorization')
      const token = authHeader?.split('Bearer ')[1]
      const user =
        authDb.find((u) => `mock-access-token-${u.userId}` === token) ||
        authDb[0]

      if (comment && !comment.likedUserIds.includes(user.userId)) {
        comment.isLiked = true
        comment.likeCount += 1
        comment.likedUserIds.push(user.userId)
      }

      return HttpResponse.json({
        code: 'COMMON_200',
        message: `댓글 ${commentId} 좋아요 성공`,
        data: null,
        isSuccess: true,
      })
    }
  ),

  http.delete(
    '*/api/v1/posts/:postId/comments/:commentId/like',
    ({ request, params }) => {
      const { commentId } = params
      const comment = comments.find((c) => String(c.id) === String(commentId))

      const authHeader = request.headers.get('Authorization')
      const token = authHeader?.split('Bearer ')[1]
      const user =
        authDb.find((u) => `mock-access-token-${u.userId}` === token) ||
        authDb[0]

      if (comment && comment.likedUserIds.includes(user.userId)) {
        comment.isLiked = false
        comment.likeCount = Math.max(0, comment.likeCount - 1)
        comment.likedUserIds = comment.likedUserIds.filter(
          (id) => id !== user.userId
        )
      }

      return HttpResponse.json({
        code: 'COMMON_200',
        message: `댓글 ${commentId} 좋아요 취소 성공`,
        data: null,
        isSuccess: true,
      })
    }
  ),

  http.delete('*/api/v1/posts/:postId/comments/:commentId', ({ params }) => {
    const { commentId } = params
    const index = comments.findIndex((c) => String(c.id) === String(commentId))

    if (index !== -1) {
      comments.splice(index, 1)
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '댓글 삭제 성공',
      data: null,
      isSuccess: true,
    })
  }),
]
