import { createFileRoute } from '@tanstack/react-router'

import { ContentContainer } from '@/widgets/profile-layout'
import { AlbumSummaryCard } from '@/entities/album/ui/AlbumSummaryCard'
import { useMyAlbumsQuery } from '@/entities/album/model/hooks/useMyAlbumsQuery'

export const Route = createFileRoute('/_app/$profile_name/albums')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: albums = [], isLoading } = useMyAlbumsQuery()

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
      ) : (
        <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <AlbumSummaryCard key={album.albumId} album={album} />
          ))}
        </div>
      )}
    </ContentContainer>
  )
}
