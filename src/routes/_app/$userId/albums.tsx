import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { z } from 'zod'

import { ContentContainer } from '@/widgets/profile-layout'
import { AlbumSummaryCard } from '@/entities/album/ui/AlbumSummaryCard'
import { useUserAlbumsQuery } from '@/entities/album/model/hooks/useUserAlbumsQuery'
import { useAlbumDetailQuery } from '@/entities/album/model/hooks/useAlbumDetailQuery'
import { useProfile } from '@/entities/user/model/hooks/useProfile'
import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import { EmptyAlbumsState } from '@/features/profile-posts/ui/EmptyAlbumsState'
import type { ProfilePostGridItem } from '@/features/profile-posts/ui/ProfilePostsGrid'

export const Route = createFileRoute('/_app/$userId/albums')({
  validateSearch: z.object({
    albumId: z.coerce
      .number()
      .int()
      .refine((n) => n === -1 || n > 0)
      .optional()
      .catch(undefined),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { userId } = useParams({ from: '/_app/$userId/albums' })
  const { albumId } = useSearch({ from: '/_app/$userId/albums' })
  const numericUserId = Number(userId)

  const { data: albums = [], isLoading } = useUserAlbumsQuery({
    userId: numericUserId,
  })
  const { data: profile } = useProfile(numericUserId)
  const selectedAlbumId = albumId ?? null

  const { data: albumDetail, isLoading: isAlbumLoading } = useAlbumDetailQuery(
    selectedAlbumId,
    numericUserId
  )

  const selectedAlbum = albums.find(
    (album) => album.albumId === selectedAlbumId
  )

  const handleSelectAlbum = (nextAlbumId: number) => {
    navigate({
      to: '/$userId/albums',
      params: { userId },
      search: { albumId: nextAlbumId },
    })
  }

  const handleBackToList = () => {
    navigate({
      to: '/$userId/albums',
      params: { userId },
    })
  }

  return (
    <ContentContainer className="py-6">
      {isLoading ? (
        <div className="flex justify-center text-sm text-gray-500">
          앨범을 불러오는 중입니다...
        </div>
      ) : albums.length === 0 ? (
        <EmptyAlbumsState isMe={profile?.isMe ?? false} />
      ) : selectedAlbumId == null ? (
        <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumSummaryCard
              key={album.albumId}
              album={album}
              onClick={handleSelectAlbum}
            />
          ))}
        </div>
      ) : !selectedAlbum ? (
        <div className="space-y-4">
          <div className="flex w-full items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleBackToList}
              className="shrink-0 text-sm font-medium whitespace-nowrap text-blue-500 hover:underline"
            >
              ← 앨범 목록으로
            </button>
          </div>
          <div className="flex h-96 flex-col items-center justify-center gap-2 text-sm text-gray-500">
            <span>앨범 데이터를 찾을 수 없습니다.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {isAlbumLoading || !albumDetail ? (
            <div className="flex justify-center text-sm text-gray-500">
              앨범을 불러오는 중입니다...
            </div>
          ) : (
            <>
              <div className="flex w-full items-center justify-between gap-2">
                <h2 className="px-1 text-xl font-semibold">
                  {`${selectedAlbum.title} (${albumDetail.posts.length})`}
                </h2>
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="shrink-0 text-sm font-medium whitespace-nowrap text-blue-500 hover:underline"
                >
                  ← 앨범 목록으로
                </button>
              </div>
              {albumDetail.posts.length === 0 ? (
                <div className="flex h-96 flex-col items-center justify-center gap-2 text-sm text-gray-500">
                  <span>이 앨범에는 아직 게시글이 없습니다.</span>
                </div>
              ) : (
                <ProfilePostsGrid
                  className="mt-1"
                  items={albumDetail.posts.map<ProfilePostGridItem>((post) => ({
                    id: String(post.postId),
                    imageSrc: post.imageUrl,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                  }))}
                />
              )}
            </>
          )}
        </div>
      )}
    </ContentContainer>
  )
}
