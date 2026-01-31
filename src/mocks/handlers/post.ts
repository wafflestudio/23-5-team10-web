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
      username: 'me',
      userImage: 'https://i.pravatar.cc/150?u=1',
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
        success: true,
      },
      { status: 201 }
    )
  }),

  http.get('*/api/v1/posts/:postId', ({ params }) => {
    const { postId } = params
    const post = posts.find((p) => String(p.id) === String(postId))

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

    const idNum = Number(post.id)

    const responseData = {
      id: idNum,
      userId: 1,
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
      liked: likedPostIds.has(idNum),
      bookmarked: bookmarkedPostIds.has(idNum),
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '게시글 상세 조회 성공',
      data: responseData,
      success: true,
    })
  }),

  http.post('*/api/v1/posts/:postId/like', ({ params }) => {
    const postId = Number(params.postId)
    const post = posts.find((p) => Number(p.id) === postId)

    if (!post) return new HttpResponse(null, { status: 404 })

    if (!likedPostIds.has(postId)) {
      likedPostIds.add(postId)
      post.likeCount += 1
    }

    return HttpResponse.json({
      code: '200',
      message: '좋아요 성공',
      success: true,
    })
  }),

  http.delete('*/api/v1/posts/:postId/like', ({ params }) => {
    const postId = Number(params.postId)
    const post = posts.find((p) => Number(p.id) === postId)

    if (!post) return new HttpResponse(null, { status: 404 })

    if (likedPostIds.has(postId)) {
      likedPostIds.delete(postId)
      post.likeCount = Math.max(0, post.likeCount - 1)
    }

    return HttpResponse.json({
      code: '200',
      message: '좋아요 취소 성공',
      success: true,
    })
  }),

  http.post('*/api/v1/posts/:postId/bookmark', ({ params }) => {
    const postId = Number(params.postId)
    bookmarkedPostIds.add(postId)
    return HttpResponse.json({
      code: '200',
      message: '북마크 성공',
      success: true,
    })
  }),

  http.delete('*/api/v1/posts/:postId/bookmark', ({ params }) => {
    const postId = Number(params.postId)
    bookmarkedPostIds.delete(postId)
    return HttpResponse.json({
      code: '200',
      message: '북마크 취소 성공',
      success: true,
    })
  }),

  http.get('*/api/v1/posts/search', () => {
    const searchResults = posts.map((p) => {
      const postId = Number(p.id)
      return {
        id: postId,
        userId: 1,
        nickname: p.username,
        profileImageUrl: p.userImage,
        content: p.caption,
        albumId: postAlbumMap[postId] ?? null,
        images: p.images.map((url, index) => ({
          id: postId * 100 + index,
          url,
          orderIndex: index,
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
      message: '성공',
      data: searchResults,
      success: true,
    })
  }),

  http.get('*/api/v1/users/:userId/posts', ({ params }) => {
    const userId = Number(params.userId)

    if (!Number.isInteger(userId) || userId < 1) {
      return HttpResponse.json(
        {
          code: '400',
          message: '유효하지 않은 경로 파라미터입니다.',
          success: false,
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
      success: true,
    })
  }),
]
