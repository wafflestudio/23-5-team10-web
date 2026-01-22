import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAlbum } from '@/entities/album/api/createAlbum'
import type { CreateAlbumRequest } from '@/entities/album/model/types'

export function useCreateAlbumMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAlbumRequest) => createAlbum(payload),
    onSuccess: () => {
      // 앨범 목록 쿼리 무효화하여 자동으로 다시 가져오기
      queryClient.invalidateQueries({ queryKey: ['albums', 'my'] })
    },
  })
}
