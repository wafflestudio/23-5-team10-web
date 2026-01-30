import { useQuery } from '@tanstack/react-query'
import { getSearchUser } from '../../api/getSearchUser'

export function useSearchUser(query: string) {
  return useQuery({
    queryKey: ['searchUser', query],
    queryFn: () => getSearchUser(query),
    enabled: !!query,
  })
}
