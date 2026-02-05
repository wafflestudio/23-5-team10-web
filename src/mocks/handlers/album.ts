import { http, HttpResponse } from 'msw'
import { albums, nextAlbumId } from '../db/album.db'
import { postAlbumMap } from '../db/postRelations.db'
import { posts } from '../db/post.db'
import { users } from '../db/user.db'
import { MOCK_USER_ID } from '../db/session.db'
import {
  type CreateAlbumRequest,
  type CreateAlbumResponse,
  type AlbumDetailResponse,
  type UserAlbumsResponse,
} from '../../entities/album/model/types'
import { CreateAlbumRequestSchema } from '../../entities/album/model/schema'

function getUserIdByNickname(nickname: string): number | null {
  const user = users.find((u) => u.nickname === nickname)
  return user?.userId ?? null
}

type AlbumActionResponse = {
  code: string
  message: string
  isSuccess: boolean
}

export const albumHandlers = [
  http.post('**/api/v1/albums', async ({ request }) => {
    const json = await request.json().catch(() => null)

    const result = (
      CreateAlbumRequestSchema as unknown as {
        safeParse: (data: unknown) => {
          success: boolean
          data: CreateAlbumRequest
        }
      }
    ).safeParse(json)

    if (!result.success) {
      const body: CreateAlbumResponse = {
        code: '400',
        message: '잘못된 요청입니다.',
        data: 0,
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    const { title } = result.data

    const id = nextAlbumId.value++
    albums.push({ id, userId: MOCK_USER_ID, title })

    const body: CreateAlbumResponse = {
      code: '200',
      message: '앨범 생성 성공',
      data: id,
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),

  http.get('**/api/v1/albums/users/:userId', ({ params }) => {
    const userId = Number(params.userId)
    const userAlbums = albums.filter((album) => album.userId === userId)

    const mappedPostIds = new Set(
      Object.keys(postAlbumMap).map((key) => Number(key))
    )
    const postsWithoutAlbum = posts.filter(
      (p) => !mappedPostIds.has(Number(p.id))
    )

    const noAlbumThumbnail =
      postsWithoutAlbum.length > 0
        ? (() => {
            const firstPost = postsWithoutAlbum[0]
            return firstPost.images?.[0] ?? ''
          })()
        : ''

    const noAlbumItem = {
      albumId: -1,
      title: '앨범 없음',
      thumbnailImageUrl: noAlbumThumbnail,
      postCount: postsWithoutAlbum.length,
    }

    const albumSummaries = userAlbums.map((album) => {
      const postsInAlbum = Object.entries(postAlbumMap)
        .filter(([, mappedAlbumId]) => mappedAlbumId === album.id)
        .map(([postIdKey]) => Number(postIdKey))

      const postCount = postsInAlbum.length
      let thumbnailImageUrl = ''

      if (postCount > 0) {
        const firstPostId = postsInAlbum[0]
        const post = posts.find((p) => p.id === String(firstPostId))

        if (post && post.images && post.images.length > 0) {
          thumbnailImageUrl = post.images[0]
        }
      }

      return {
        albumId: album.id,
        title: album.title,
        thumbnailImageUrl,
        postCount,
      }
    })

    const body: UserAlbumsResponse = {
      code: '200',
      message: '앨범 목록 조회 성공',
      data: [noAlbumItem, ...albumSummaries],
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),

  http.post('**/api/v1/albums/:albumId/posts/:postId', ({ params }) => {
    const albumId = Number(params.albumId)
    const postId = Number(params.postId)

    if (!Number.isInteger(albumId) || !Number.isInteger(postId)) {
      const body: AlbumActionResponse = {
        code: '400',
        message: '유효하지 않은 경로 파라미터입니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    const albumExists = albums.some((album) => album.id === albumId)

    if (!albumExists) {
      const body: AlbumActionResponse = {
        code: '404',
        message: '앨범을 찾을 수 없습니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 404 })
    }

    postAlbumMap[postId] = albumId

    const body: AlbumActionResponse = {
      code: '200',
      message: '게시글을 앨범에 담았습니다.',
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),

  http.get('**/api/v1/albums/:albumId', ({ params, request }) => {
    const albumId = Number(params.albumId)

    if (!Number.isInteger(albumId)) {
      const body: Omit<AlbumDetailResponse, 'data'> = {
        code: '400',
        message: '유효하지 않은 경로 파라미터입니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    if (albumId === -1) {
      const url = new URL(request.url)
      const ownerIdParam = url.searchParams.get('ownerId')
      const ownerId = ownerIdParam ? Number(ownerIdParam) : null

      const mappedPostIds = new Set(
        Object.keys(postAlbumMap).map((key) => Number(key))
      )
      let postsWithoutAlbum = posts.filter(
        (p) => !mappedPostIds.has(Number(p.id))
      )

      if (ownerId !== null) {
        postsWithoutAlbum = postsWithoutAlbum.filter(
          (p) => getUserIdByNickname(p.username) === ownerId
        )
      }

      const postSummaries = postsWithoutAlbum
        .map((post) => {
          if (!post.images || post.images.length === 0) return null

          return {
            postId: Number(post.id),
            imageUrl: post.images[0],
            likeCount: post.likeCount,
            commentCount: post.commentCount,
          }
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)

      const body: AlbumDetailResponse = {
        code: '200',
        message: '앨범 상세 조회 성공',
        data: {
          albumId: -1,
          title: '앨범 없음',
          posts: postSummaries,
        },
        isSuccess: true,
      }

      return HttpResponse.json(body, { status: 200 })
    }

    const album = albums.find((a) => a.id === albumId)

    if (!album) {
      const body: Omit<AlbumDetailResponse, 'data'> = {
        code: '404',
        message: '앨범을 찾을 수 없습니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 404 })
    }

    const postsInAlbum = Object.entries(postAlbumMap)
      .filter(([, mappedAlbumId]) => mappedAlbumId === albumId)
      .map(([postIdKey]) => Number(postIdKey))

    const postSummaries = postsInAlbum
      .map((postId) => {
        const post = posts.find((p) => p.id === String(postId))
        if (!post || !post.images || post.images.length === 0) return null

        return {
          postId,
          imageUrl: post.images[0],
          likeCount: post.likeCount,
          commentCount: post.commentCount,
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    const body: AlbumDetailResponse = {
      code: '200',
      message: '앨범 상세 조회 성공',
      data: {
        albumId: album.id,
        title: album.title,
        posts: postSummaries,
      },
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),

  http.delete('**/api/v1/albums/:albumId/posts/:postId', ({ params }) => {
    const albumId = Number(params.albumId)
    const postId = Number(params.postId)

    if (!Number.isInteger(albumId) || !Number.isInteger(postId)) {
      const body: AlbumActionResponse = {
        code: '400',
        message: '유효하지 않은 경로 파라미터입니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    const currentAlbumId = postAlbumMap[postId]

    if (currentAlbumId !== albumId) {
      const body: AlbumActionResponse = {
        code: '404',
        message: '해당 앨범에 속한 게시글이 아닙니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 404 })
    }

    delete postAlbumMap[postId]

    const body: AlbumActionResponse = {
      code: '200',
      message: '게시글을 앨범에서 제거했습니다.',
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),

  http.delete('**/api/v1/albums/:albumId', ({ params }) => {
    const albumId = Number(params.albumId)

    if (!Number.isInteger(albumId)) {
      const body: AlbumActionResponse = {
        code: '400',
        message: '유효하지 않은 경로 파라미터입니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    const albumIndex = albums.findIndex((album) => album.id === albumId)

    if (albumIndex === -1) {
      const body: AlbumActionResponse = {
        code: '404',
        message: '앨범을 찾을 수 없습니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 404 })
    }

    albums.splice(albumIndex, 1)

    Object.entries(postAlbumMap).forEach(([postIdKey, mappedAlbumId]) => {
      if (mappedAlbumId === albumId) {
        delete postAlbumMap[Number(postIdKey)]
      }
    })

    const body: AlbumActionResponse = {
      code: '200',
      message: '앨범을 삭제했습니다.',
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),

  http.patch('**/api/v1/albums/:albumId', async ({ params, request }) => {
    const albumId = Number(params.albumId)

    if (!Number.isInteger(albumId)) {
      const body: AlbumActionResponse = {
        code: '400',
        message: '유효하지 않은 경로 파라미터입니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    const json = await request.json().catch(() => null)

    const result = (
      CreateAlbumRequestSchema as unknown as {
        safeParse: (data: unknown) => {
          success: boolean
          data: CreateAlbumRequest
        }
      }
    ).safeParse(json)

    if (!result.success) {
      const body: AlbumActionResponse = {
        code: '400',
        message: '잘못된 요청입니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 400 })
    }

    const album = albums.find((a) => a.id === albumId)

    if (!album) {
      const body: AlbumActionResponse = {
        code: '404',
        message: '앨범을 찾을 수 없습니다.',
        isSuccess: false,
      }

      return HttpResponse.json(body, { status: 404 })
    }

    const { title } = result.data
    album.title = title

    const body: AlbumActionResponse = {
      code: '200',
      message: '앨범 제목을 수정했습니다.',
      isSuccess: true,
    }

    return HttpResponse.json(body, { status: 200 })
  }),
]
