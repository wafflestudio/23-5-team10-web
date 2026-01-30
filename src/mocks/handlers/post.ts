import { http, HttpResponse } from 'msw'
import { posts } from '../db/post.db'
import {
  bookmarkedPostIds,
  likedPostIds,
  postAlbumMap,
} from '../db/postRelations.db'
import { users } from '../db/user.db'

export const postHandlers = [
  http.post('*/api/v1/posts', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const body = (await request.json()) as {
      content: string
      albumId?: number | null
      imageUrls?: string[]
    }

    const nextId = posts.length > 0 ? Number(posts[posts.length - 1].id) + 1 : 1
    const postId = nextId

    const newPost = {
      id: String(postId),
      images: body.imageUrls ?? [],
      caption: body.content,
      username: 'mock_user',
      userImage: 'https://picsum.photos/id/100/50/50',
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0,
    }

    posts.push(newPost)

    if (body.albumId != null) {
      postAlbumMap[postId] = body.albumId
    }

    const responsePost = {
      id: postId,
      userId: 1,
      nickname: newPost.username,
      profileImageUrl: newPost.userImage,
      content: newPost.caption,
      albumId: (body.albumId ?? null) as number | null,
      images: (newPost.images ?? []).map((url, imgIndex) => ({
        id: postId * 100 + imgIndex,
        url,
        orderIndex: imgIndex,
      })),
      likeCount: newPost.likeCount,
      commentCount: newPost.commentCount,
      createdAt: newPost.createdAt,
      updatedAt: newPost.createdAt,
      liked: false,
      bookmarked: false,
    }

    return HttpResponse.json(
      {
        code: '201',
        message: '게시글을 생성했습니다.',
        data: responsePost,
        isSuccess: true,
      },
      { status: 201 }
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
      isSuccess: true,
    })
  }),
  http.get('/api/v1/posts/:postId', ({ params }) => {
    const { postId } = params
    const post = posts.find((p) => p.id === postId)

    if (!post) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json({
      isSuccess: true,
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
          isSuccess: false,
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
          isSuccess: false,
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
        isSuccess: true,
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
          isSuccess: false,
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
          isSuccess: false,
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
        isSuccess: true,
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
          isSuccess: false,
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
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    bookmarkedPostIds.add(postId)

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글을 북마크했습니다.',
        isSuccess: true,
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
          isSuccess: false,
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
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    bookmarkedPostIds.delete(postId)

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글 북마크를 취소했습니다.',
        isSuccess: true,
      },
      { status: 200 }
    )
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
      isSuccess: true,
    })
  }),
  http.get('*/api/v1/users/:userId/posts', ({ params }) => {
    const userId = Number(params.userId)

    if (!Number.isInteger(userId) || userId < 1) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          isSuccess: false,
        },
        { status: 400 }
      )
    }

    const user = users.find((u) => u.userId === userId)

    const sortedPosts = [...posts].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const grouped: Record<string, unknown[]> = {}

    sortedPosts.forEach((p) => {
      const postId = Number(p.id)
      const albumId = (postAlbumMap[postId] ?? null) as number | null
      const key = String(albumId ?? 0)

      const item = {
        id: postId,
        userId,
        nickname: user?.nickname ?? p.username,
        profileImageUrl: user?.profileImageUrl ?? p.userImage,
        content: p.caption,
        albumId,
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

      if (!grouped[key]) {
        grouped[key] = []
      }

      grouped[key] = [...grouped[key], item]
    })

    return HttpResponse.json({
      code: '200',
      message: '요청에 성공하였습니다.',
      data: grouped,
      isSuccess: true,
    })
  }),
]
