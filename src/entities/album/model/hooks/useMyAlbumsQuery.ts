import { useQuery } from '@tanstack/react-query'
import { getMyAlbums } from '@/entities/album/api/getMyAlbums'
import type { AlbumSummary } from '@/entities/album/model/types'

export function useMyAlbumsQuery() {
  return useQuery<AlbumSummary[]>({
    queryKey: ['albums', 'my'],
    queryFn: () => getMyAlbums(),
    retry: false,
  })
}
