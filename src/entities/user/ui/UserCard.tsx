import type { SearchUser } from '@/entities/user/model/types'
import { Button } from '@/shared/ui/button'
import { X } from 'lucide-react'

type UserCardProps = {
  user: SearchUser
  type: 'search' | 'recent'
  onRemove?: () => void
  onClick: () => void
}

export function UserCard({ user, type, onRemove, onClick }: UserCardProps) {
  const initial = user.nickname.trim().slice(0, 1).toUpperCase()

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={user.nickname}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div
            aria-label={`${user.nickname} 프로필 이미지`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-base font-semibold text-gray-500"
          >
            {initial || '?'}
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold">{user.nickname}</h3>
          {(user.name || (type === 'recent' && user.isFollowed)) && (
            <p className="text-xs text-gray-500">
              {user.name}
              {type === 'recent' &&
                user.isFollowed &&
                (user.name ? ' · 팔로잉' : '팔로잉')}
            </p>
          )}
        </div>
      </div>
      {type === 'recent' && onRemove && (
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <X />
        </Button>
      )}
    </div>
  )
}
