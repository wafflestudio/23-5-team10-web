import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { FollowButton } from './FollowButton'
import { type FollowListType } from './FollowListModal'
import { useToggleFollow } from '../model/useToggleFollow'

type User = {
  userId: number
  nickname: string
  name: string | null
  profileImageUrl: string | null
  isFollowing?: boolean
}

type FollowListItemProps = {
  user: User
  type: FollowListType | null
  onNavigate?: () => void
  profileUserId: number
}

export function FollowListItem({
  user,
  type,
  onNavigate,
  profileUserId,
}: FollowListItemProps) {
  const { mutateAsync: toggleFollow } = useToggleFollow({
    userId: user.userId,
    profileUserId,
    invalidateFollowList: false,
  })

  const handleRemove = () => {
    console.log('Remove:', user)
  }

  const handleFollowToggle = async () => {
    await toggleFollow()
  }

  const initial = user.nickname.trim().slice(0, 1).toUpperCase()

  return (
    <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
      <Link
        to="/$userId"
        params={{ userId: String(user.userId) }}
        onClick={onNavigate}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={`${user.nickname} 프로필 이미지`}
            className="size-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-label={`${user.nickname} 프로필 이미지`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-base font-semibold text-gray-500"
          >
            {initial || '?'}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {user.nickname}
          </p>
          {user.name && (
            <p className="truncate text-sm text-gray-500">{user.name}</p>
          )}
        </div>
      </Link>

      <div className="shrink-0">
        {type === 'following' ? (
          <FollowButton
            defaultIsFollowing={user.isFollowing ?? false}
            onToggle={handleFollowToggle}
            className="h-8"
          />
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemove}
            className="h-8 text-sm text-gray-900 hover:bg-gray-100"
          >
            삭제
          </Button>
        )}
      </div>
    </li>
  )
}
