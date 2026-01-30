import { UserCard } from '@/entities/user/ui/UserCard'
import { Button } from '@/shared/ui/button'
import type { RecentSearchItem } from '@/entities/search'

type RecentSearchListProps = {
  items: RecentSearchItem[]
  onClickItem: (nickname: string) => void
  onRemoveItem: (userId: number) => void
  onClearAll: () => void
}

export function RecentSearchList({
  items,
  onClickItem,
  onRemoveItem,
  onClearAll,
}: RecentSearchListProps) {
  const isEmpty = items.length === 0

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">최근 검색 항목</h3>
        {!isEmpty && (
          <Button
            variant="ghost"
            className="text-sm font-semibold text-sky-500"
            onClick={onClearAll}
          >
            모두 지우기
          </Button>
        )}
      </div>
      {isEmpty ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          최근 검색어 없음.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <UserCard
              key={item.searchId}
              user={{
                userId: item.userId,
                nickname: item.nickname,
                profileImageUrl: item.profileImageUrl,
                name: item.name,
                followed: item.followed,
              }}
              type="recent"
              onRemove={() => onRemoveItem(item.userId)}
              onClick={() => onClickItem(item.nickname)}
            />
          ))}
        </div>
      )}
    </>
  )
}
