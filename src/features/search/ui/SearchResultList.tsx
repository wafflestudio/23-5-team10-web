import { Loader2 } from 'lucide-react'
import { UserCard } from '@/entities/user/ui/UserCard'
import type { SearchUser } from '@/entities/user/model/types'

type SearchResultListProps = {
  users: SearchUser[]
  isLoading: boolean
  onClickUser: (user: SearchUser) => void
}

export function SearchResultList({
  users,
  isLoading,
  onClickUser,
}: SearchResultListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="size-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserCard
          key={user.userId}
          user={user}
          type="search"
          onClick={() => onClickUser(user)}
        />
      ))}
    </div>
  )
}
