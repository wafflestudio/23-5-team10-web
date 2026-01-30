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

  http.post('*/api/v1/posts/:postId/comments', async ({ request }) => {
    const { content } = (await request.json()) as { content: string }

    const newComment = {
      id: Math.floor(Math.random() * 1000000),
      postId: 1,
      userId: 999,
      nickname: '사용자',
      profileImageUrl: 'https://via.placeholder.com/150',
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: null,
      likeCount: 0,
      liked: false,
      likedUserIds: [],
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '댓글 등록 성공',
      data: newComment,
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
