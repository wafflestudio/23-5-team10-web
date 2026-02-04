import { useQuery } from '@tanstack/react-query'
import { getUserPosts } from '@/entities/post/api/getUserPosts'
import type { PostListItem } from '@/entities/post/model/types'

type UseUserPostsQueryParams = {
  userId: number
}

export function useUserPostsQuery({ userId }: UseUserPostsQueryParams) {
  return useQuery<PostListItem[]>({
    queryKey: ['posts', 'user', userId],
    queryFn: () => getUserPosts({ userId }),
    retry: false,
  })
}
