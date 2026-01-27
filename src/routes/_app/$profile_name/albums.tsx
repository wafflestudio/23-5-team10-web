import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router'
import { z } from 'zod'

import { ContentContainer } from '@/widgets/profile-layout'
import { AlbumSummaryCard } from '@/entities/album/ui/AlbumSummaryCard'
import { useMyAlbumsQuery } from '@/entities/album/model/hooks/useMyAlbumsQuery'
import { useAlbumDetailQuery } from '@/entities/album/model/hooks/useAlbumDetailQuery'
import { ProfilePostsGrid } from '@/features/profile-posts/ui/ProfilePostsGrid'
import type { ProfilePostGridItem } from '@/features/profile-posts/ui/ProfilePostsGrid'

export const Route = createFileRoute('/_app/$profile_name/albums')({
  validateSearch: z.object({
    albumId: z.coerce.number().int().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { profile_name } = useParams({ from: '/_app/$profile_name/albums' })
  const { albumId } = useSearch({ from: '/_app/$profile_name/albums' })

  const { data: albums = [], isLoading } = useMyAlbumsQuery()
  const selectedAlbumId = albumId ?? null

  const { data: albumDetail, isLoading: isAlbumLoading } =
    useAlbumDetailQuery(selectedAlbumId)

  const selectedAlbum = albums.find(
    (album) => album.albumId === selectedAlbumId
  )

  const handleSelectAlbum = (nextAlbumId: number) => {
    navigate({
      to: '/$profile_name/albums',
      params: { profile_name },
      search: { albumId: nextAlbumId },
    })
  }

  const handleBackToList = () => {
    navigate({
      to: '/$profile_name/albums',
      params: { profile_name },
    })
  }

  return (
    <ContentContainer className="py-6">
      {isLoading ? (
        <div className="flex justify-center text-sm text-gray-500">
          앨범을 불러오는 중입니다...
        </div>
      ) : albums.length === 0 ? (
        <div className="flex justify-center text-sm text-gray-500">
          아직 만든 앨범이 없습니다.
        </div>
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
      ) : (
        <div className="space-y-4">
          {isAlbumLoading || !albumDetail || !selectedAlbum ? (
            <div className="flex justify-center text-sm text-gray-500">
              앨범을 불러오는 중입니다...
            </div>
          ) : (
            <>
              <div className="flex w-full items-center justify-between">
                <h2 className="px-1 text-xl font-semibold">
                  {`${selectedAlbum.title} (${albumDetail.posts.length})`}
                </h2>
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="text-sm font-medium text-blue-500 hover:underline"
                >
                  ← 앨범 목록으로
                </button>
              </div>
              {albumDetail.posts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
                  <span>이 앨범에는 아직 게시글이 없습니다.</span>
                </div>
              ) : (
                <ProfilePostsGrid
                  className="mt-1"
                  items={albumDetail.posts.map<ProfilePostGridItem>((post) => ({
                    id: String(post.postId),
                    imageSrc: post.imageUrl,
                    likeCount: 0,
                    commentCount: 0,
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
