import { http, HttpResponse } from 'msw'
import { posts } from '../db/post.db'

export const postHandlers = [
  http.get('/api/v1/posts/:postId', ({ params }) => {
    const { postId } = params
    const post = posts.find((p) => p.id === postId)

    if (!post) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({
      success: true,
      data: post,
    })
  }),
  http.get('*/api/v1/posts/bookmarks', () => {
    const bookmarkedPostIds = ['1', '3', '5', '7', '9']
    const bookmarkedPosts = posts
      .filter((p) => bookmarkedPostIds.includes(p.id))
      .map((p, index) => ({
        id: Number(p.id),
        userId: 1,
        nickname: p.username,
        profileImageUrl: p.userImage,
        content: p.caption,
        albumId: null,
        images: p.images.map((url, imgIndex) => ({
          id: Number(p.id) * 100 + imgIndex,
          url,
          orderIndex: imgIndex,
        })),
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        liked: index % 2 === 0,
        bookmarked: true,
      }))

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: bookmarkedPosts,
      success: true,
    })
  }),
  http.get('*/api/v1/posts/search', () => {
    const searchResults = posts.map((p, index) => {
      const postId = Number(p.id)
      const userId = 1
      return {
        id: postId,
        userId,
        nickname: p.username,
        profileImageUrl: p.userImage,
        content: p.caption,
        albumId: null as number | null,
        images: (p.images ?? []).map((url, imgIndex) => ({
          id: postId * 100 + imgIndex,
          url,
          orderIndex: imgIndex,
        })),
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        liked: index % 2 === 0,
        bookmarked: index % 3 === 0,
      }
    })

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: searchResults,
      success: true,
    })
  }),
]
