export { getRecentSearch } from './api/getRecentSearch'
export { postRecentSearch } from './api/postRecentSearch'
export { deleteRecentSearch } from './api/deleteRecentSearch'
export { deleteAllRecentSearch } from './api/deleteAllRecentSearch'

export {
  useRecentSearchQuery,
  useAddRecentSearchMutation,
  useDeleteRecentSearchMutation,
  useClearAllRecentSearchMutation,
} from './model/hooks/useRecentSearch'

export type { RecentSearchItem } from './model/types'
