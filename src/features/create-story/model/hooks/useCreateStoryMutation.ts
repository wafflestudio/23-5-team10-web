import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createStory,
  type CreateStoryParams,
} from '@/features/create-story/api/createStory'

export function useCreateStoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: CreateStoryParams) => createStory(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
    },
  })
}
