export { getRecentSearch } from './api/getRecentSearch'
export { postRecentSearch } from './api/postRecentSearch'
export { deleteRecentSearch } from './api/deleteRecentSearch'

export {
  useRecentSearchQuery,
  useAddRecentSearchMutation,
  useDeleteRecentSearchMutation,
} from './model/hooks/useRecentSearch'

export type { RecentSearchItem } from './model/types'
