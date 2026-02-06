import type { SearchUser } from '@/entities/user/model/types'
import { Button } from '@/shared/ui/button'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'
import { X } from 'lucide-react'

type UserCardProps = {
  user: SearchUser
  type: 'search' | 'recent'
  onRemove?: () => void
  onClick: () => void
}

export function UserCard({ user, type, onRemove, onClick }: UserCardProps) {
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
          <DefaultProfileImage className="size-10" />
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
