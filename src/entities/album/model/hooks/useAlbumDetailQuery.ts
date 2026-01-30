import { useQuery } from '@tanstack/react-query'

import { getAlbumDetail } from '@/entities/album/api/getAlbumDetail'
import type { AlbumDetail } from '@/entities/album/model/types'

export function useAlbumDetailQuery(albumId: number | null) {
  return useQuery<AlbumDetail>({
    queryKey: ['album', albumId],
    queryKeyHashFn: (key) => JSON.stringify(key),
    enabled: albumId != null,
    queryFn: () => {
      if (albumId == null) {
        throw new Error('albumId is required')
      }

      return getAlbumDetail(albumId)
    },
  })
}
