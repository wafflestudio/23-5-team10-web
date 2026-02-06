import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'
import { FollowButton } from './FollowButton'
import { RemoveFollowerModal } from './RemoveFollowerModal'
import { type FollowListType } from './FollowListModal'
import { useToggleFollow } from '../model/useToggleFollow'
import { useRemoveFollower } from '../model/useRemoveFollower'
import { useCurrentUserId } from '@/shared/auth/useCurrentUser'

type User = {
  userId: number
  nickname: string
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
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const currentUserId = useCurrentUserId()
  const isMe = user.userId === currentUserId
  const isMyProfile = profileUserId === currentUserId

  const { mutateAsync: toggleFollow } = useToggleFollow({
    userId: user.userId,
    profileUserId,
    invalidateFollowList: false,
  })

  const { mutate: removeFollower, isPending: isRemoving } = useRemoveFollower({
    onSuccess: () => {
      setIsRemoveModalOpen(false)
    },
  })

  const handleRemoveClick = () => {
    setIsRemoveModalOpen(true)
  }

  const handleRemoveConfirm = () => {
    removeFollower({ followerId: user.userId })
  }

  const handleFollowToggle = async () => {
    await toggleFollow()
  }

  const renderActionButton = () => {
    if (isMe) {
      return null
    }

    if (type === 'followers' && isMyProfile) {
      return (
        <Button
          type="button"
          variant="ghost"
          onClick={handleRemoveClick}
          className="h-8 text-sm text-gray-900 hover:bg-gray-100"
        >
          삭제
        </Button>
      )
    }

    return (
      <FollowButton
        defaultIsFollowing={user.isFollowing ?? false}
        onToggle={handleFollowToggle}
        className="h-8"
      />
    )
  }

  return (
    <>
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
            <DefaultProfileImage className="size-10" />
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.nickname}
            </p>
          </div>
        </Link>

        <div className="shrink-0">{renderActionButton()}</div>
      </li>

      <RemoveFollowerModal
        open={isRemoveModalOpen}
        onOpenChange={setIsRemoveModalOpen}
        nickname={user.nickname}
        profileImageUrl={user.profileImageUrl}
        onConfirm={handleRemoveConfirm}
        isPending={isRemoving}
      />
    </>
  )
}
