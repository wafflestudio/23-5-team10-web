import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import type { StoryFeedItem, StoryResponse } from '../types'

export const useStoryFeedQuery = () => {
  return useQuery({
    queryKey: ['stories', 'feed'],
    queryFn: async () => {
      const response = await ky
        .get('/api/v1/stories/feed')
        .json<StoryResponse<StoryFeedItem[]>>()

      if (!response.isSuccess) {
        throw new Error(response.message)
      }

      return response.data ?? []
    },
  })
}
