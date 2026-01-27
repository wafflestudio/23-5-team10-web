import { http, HttpResponse } from 'msw'
import { posts } from '../db/post.db'
import {
  bookmarkedPostIds,
  likedPostIds,
  postAlbumMap,
} from '../db/postRelations.db'

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
  http.post('*/api/v1/posts/:postId/like', ({ params }) => {
    const postId = Number(params.postId)

    if (!Number.isInteger(postId)) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          success: false,
        },
        { status: 400 }
      )
    }

    const post = posts.find((p) => Number(p.id) === postId)

    if (!post) {
      return HttpResponse.json(
        {
          code: '404',
          message: '게시글을 찾을 수 없습니다.',
          success: false,
        },
        { status: 404 }
      )
    }

    if (!likedPostIds.has(postId)) {
      likedPostIds.add(postId)
      post.likeCount += 1
    }

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글에 좋아요를 남겼습니다.',
        success: true,
      },
      { status: 200 }
    )
  }),
  http.delete('*/api/v1/posts/:postId/like', ({ params }) => {
    const postId = Number(params.postId)

    if (!Number.isInteger(postId)) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          success: false,
        },
        { status: 400 }
      )
    }

    const post = posts.find((p) => Number(p.id) === postId)

    if (!post) {
      return HttpResponse.json(
        {
          code: '404',
          message: '게시글을 찾을 수 없습니다.',
          success: false,
        },
        { status: 404 }
      )
    }

    if (likedPostIds.has(postId)) {
      likedPostIds.delete(postId)
      post.likeCount = Math.max(0, post.likeCount - 1)
    }

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글 좋아요를 취소했습니다.',
        success: true,
      },
      { status: 200 }
    )
  }),
  http.post('*/api/v1/posts/:postId/bookmark', ({ params }) => {
    const postId = Number(params.postId)

    if (!Number.isInteger(postId)) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          success: false,
        },
        { status: 400 }
      )
    }

    const post = posts.find((p) => Number(p.id) === postId)

    if (!post) {
      return HttpResponse.json(
        {
          code: '404',
          message: '게시글을 찾을 수 없습니다.',
          success: false,
        },
        { status: 404 }
      )
    }

    bookmarkedPostIds.add(postId)

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글을 북마크했습니다.',
        success: true,
      },
      { status: 200 }
    )
  }),
  http.delete('*/api/v1/posts/:postId/bookmark', ({ params }) => {
    const postId = Number(params.postId)

    if (!Number.isInteger(postId)) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          success: false,
        },
        { status: 400 }
      )
    }

    const post = posts.find((p) => Number(p.id) === postId)

    if (!post) {
      return HttpResponse.json(
        {
          code: '404',
          message: '게시글을 찾을 수 없습니다.',
          success: false,
        },
        { status: 404 }
      )
    }

    bookmarkedPostIds.delete(postId)

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글 북마크를 취소했습니다.',
        success: true,
      },
      { status: 200 }
    )
  }),
  http.get('*/api/v1/posts/bookmarks', () => {
    const bookmarkedPosts = posts
      .filter((p) => bookmarkedPostIds.has(Number(p.id)))
      .map((p) => ({
        id: Number(p.id),
        userId: 1,
        nickname: p.username,
        profileImageUrl: p.userImage,
        content: p.caption,
        albumId: postAlbumMap[Number(p.id)] ?? null,
        images: p.images.map((url, imgIndex) => ({
          id: Number(p.id) * 100 + imgIndex,
          url,
          orderIndex: imgIndex,
        })),
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        liked: likedPostIds.has(Number(p.id)),
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
    const searchResults = posts.map((p) => {
      const postId = Number(p.id)
      const userId = 1
      return {
        id: postId,
        userId,
        nickname: p.username,
        profileImageUrl: p.userImage,
        content: p.caption,
        albumId: (postAlbumMap[postId] ?? null) as number | null,
        images: (p.images ?? []).map((url, imgIndex) => ({
          id: postId * 100 + imgIndex,
          url,
          orderIndex: imgIndex,
        })),
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: p.createdAt,
        updatedAt: p.createdAt,
        liked: likedPostIds.has(postId),
        bookmarked: bookmarkedPostIds.has(postId),
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
