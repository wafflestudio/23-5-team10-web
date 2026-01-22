import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAlbumTitle } from '@/entities/album/api/updateAlbumTitle'
import type { CreateAlbumRequest } from '@/entities/album/model/types'

export function useUpdateAlbumTitleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      albumId,
      payload,
    }: {
      albumId: number
      payload: CreateAlbumRequest
    }) => updateAlbumTitle(albumId, payload),
    onSuccess: () => {
      // 앨범 목록 쿼리 무효화하여 자동으로 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['albums', 'my'] })
    },
  })
}
