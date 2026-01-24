import { useQuery } from '@tanstack/react-query'
import { getBookmarkedPosts } from '@/entities/post/api/getBookmarkedPosts'
import type { BookmarkedPost } from '@/entities/post/model/types'

export function useBookmarkedPostsQuery() {
  return useQuery<BookmarkedPost[]>({
    queryKey: ['posts', 'bookmarks'],
    queryFn: () => getBookmarkedPosts(),
    retry: false,
  })
}
