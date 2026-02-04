import { http, HttpResponse, delay } from 'msw'
import { posts } from '../db/post.db'
import { users } from '../db/user.db'
import {
  bookmarkedPostIds,
  likedPostIds,
  postAlbumMap,
} from '../db/postRelations.db'

export const postHandlers = [
  http.post('**/api/v1/posts', async ({ request }) => {
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
      isLiked: false,
      isBookmarked: false,
    }

    return HttpResponse.json(
      {
        code: '200',
        message: '게시글을 생성했습니다.',
        data: responsePost,
        isSuccess: true,
      },
      { status: 200 }
    )
  }),

  http.get('**/api/v1/posts/:postId', async ({ params }) => {
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
    const profileImageUrl = author?.profileImageUrl || post.userImage

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '게시글 상세 조회 성공',
      isSuccess: true,
      data: {
        id: idNum,
        userId: authorId,
        nickname: post.username,
        profileImageUrl: profileImageUrl,
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

  http.put('**/api/v1/posts/:postId', async ({ params, request }) => {
    await delay(100)
    const { postId } = params
    const idNum = Number(postId)
    const body = (await request.json()) as {
      content: string
      albumId?: number | null
      imageUrls?: string[]
    }

    const postIndex = posts.findIndex((p) => String(p.id) === String(postId))

    if (postIndex === -1) {
      return HttpResponse.json(
        {
          code: '404',
          message: '수정할 게시글을 찾을 수 없습니다.',
          isSuccess: false,
        },
        { status: 404 }
      )
    }

    posts[postIndex] = {
      ...posts[postIndex],
      caption: body.content,
    }

    if (body.albumId !== undefined) {
      if (body.albumId === null || body.albumId === -1) {
        delete postAlbumMap[idNum]
      } else {
        postAlbumMap[idNum] = body.albumId
      }
    }

    const updatedPost = posts[postIndex]
    const author = users.find((u) => u.nickname === updatedPost.username)
    const authorId = author ? author.userId : 999
    const profileImageUrl = author?.profileImageUrl || updatedPost.userImage

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '게시글 수정 성공',
      isSuccess: true,
      data: {
        id: idNum,
        userId: authorId,
        nickname: updatedPost.username,
        profileImageUrl: profileImageUrl,
        content: updatedPost.caption,
        albumId: postAlbumMap[idNum] ?? null,
        images: updatedPost.images.map((url, index) => ({
          id: idNum * 100 + index,
          url: url,
          orderIndex: index,
        })),
        likeCount: updatedPost.likeCount,
        commentCount: updatedPost.commentCount,
        createdAt: updatedPost.createdAt,
        updatedAt: new Date().toISOString(),
        isLiked: likedPostIds.has(idNum),
        isBookmarked: bookmarkedPostIds.has(idNum),
      },
    })
  }),

  http.delete('**/api/v1/posts/:postId', async ({ params }) => {
    await delay(500)
    const { postId } = params
    const idNum = Number(postId)

    const index = posts.findIndex((p) => String(p.id) === String(postId))
    if (index !== -1) {
      posts.splice(index, 1)
      likedPostIds.delete(idNum)
      bookmarkedPostIds.delete(idNum)
      delete postAlbumMap[idNum]
    }

    return HttpResponse.json({
      code: 'COMMON_200',
      message: '게시글이 삭제되었습니다.',
      isSuccess: true,
      data: null,
    })
  }),

  http.post('**/api/v1/posts/:postId/like', async ({ params }) => {
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

  http.delete('**/api/v1/posts/:postId/like', async ({ params }) => {
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

  http.post('**/api/v1/posts/:postId/bookmark', async ({ params }) => {
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

  http.delete('**/api/v1/posts/:postId/bookmark', async ({ params }) => {
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
