import { http, HttpResponse } from 'msw'
import { comments } from '../db/comment.db'

export const commentHandlers = [
  http.get('*/api/v1/posts/:postId/comments', () => {
    return HttpResponse.json({
      code: 'COMMON_200',
      message: '댓글 목록 조회 성공',
      data: comments,
      success: true,
    })
  }),

  http.post('*/api/v1/posts/:postId/comments/:commentId/like', ({ params }) => {
    const { commentId } = params
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
      return HttpResponse.json({
        code: 'COMMON_200',
        message: `댓글 ${commentId} 좋아요 취소 성공`,
        data: null,
        success: true,
      })
    }
  ),
]
