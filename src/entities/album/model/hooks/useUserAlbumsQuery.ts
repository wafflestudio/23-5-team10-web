import { useQuery } from '@tanstack/react-query'
import { getUserAlbums } from '@/entities/album/api/getUserAlbums'
import type { AlbumSummary } from '@/entities/album/model/types'

type UseUserAlbumsQueryParams = {
  userId: number
  enabled?: boolean
}

export function useUserAlbumsQuery({
  userId,
  enabled = true,
}: UseUserAlbumsQueryParams) {
  return useQuery<AlbumSummary[]>({
    queryKey: ['albums', 'user', userId],
    queryFn: () => getUserAlbums({ userId }),
    enabled: enabled && userId > 0,
    retry: false,
  })
}
