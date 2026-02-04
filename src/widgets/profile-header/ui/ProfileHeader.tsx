import { FollowButton } from '@/features/follow-user/ui/FollowButton'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { PROFILE_CONTAINER_CLASSNAME } from './constants'
import { ProfileAvatar } from './ProfileAvatar'
import { ProfileStat } from './ProfileStat'
import { FollowListModal } from '@/features/follow-user/ui/FollowListModal'
import { useState } from 'react'
import { type FollowListType } from '@/features/follow-user/ui/FollowListModal'

interface ProfileHeaderProps {
  className?: string
  avatarUrl?: string | null
  nickname: string
  bio?: string | null
  postsCount: number
  followersCount: number
  followingCount: number
  defaultIsFollowing?: boolean
  onFollowToggle?: (nextIsFollowing: boolean) => Promise<void> | void
  userId: number
  isMe?: boolean
}

export function ProfileHeader({
  className,
  avatarUrl,
  nickname,
  bio,
  postsCount,
  followersCount,
  followingCount,
  defaultIsFollowing = false,
  onFollowToggle,
  userId,
  isMe = false,
}: ProfileHeaderProps) {
  const [modalState, setModalState] = useState<{
    open: boolean
    type: FollowListType | null
  }>({
    open: false,
    type: null,
  })

  const handleFollowListClick = () => {
    setModalState({
      open: true,
      type: 'followers',
    })
  }

  const handleFollowingListClick = () => {
    setModalState({
      open: true,
      type: 'following',
    })
  }

  const handleModalOpenChange = () => {
    setModalState({
      open: false,
      type: modalState.type,
    })
  }

  return (
    <>
      <FollowListModal
        open={modalState.open}
        onOpenChange={handleModalOpenChange}
        type={modalState.type}
        userId={userId}
      />
      <section className={cn(PROFILE_CONTAINER_CLASSNAME, className)}>
        <div className="flex gap-8 md:gap-16">
          <div className="flex w-[180px] justify-center">
            <ProfileAvatar avatarUrl={avatarUrl} nickname={nickname} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-xl font-normal text-gray-900">{nickname}</h1>
              {isMe ? (
                <Button
                  variant="secondary"
                  className="h-8 rounded-lg bg-gray-200 px-4 text-sm font-semibold text-gray-900 hover:bg-gray-300"
                >
                  프로필 수정
                </Button>
              ) : (
                <FollowButton
                  defaultIsFollowing={defaultIsFollowing}
                  onToggle={onFollowToggle}
                />
              )}
            </div>

            <div className="mt-6 flex gap-10 text-base">
              <ProfileStat label="게시물" value={postsCount} />
              <ProfileStat
                label="팔로워"
                value={followersCount}
                onClick={handleFollowListClick}
              />
              <ProfileStat
                label="팔로잉"
                value={followingCount}
                onClick={handleFollowingListClick}
              />
            </div>

            {bio ? (
              <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-gray-900">
                {bio}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
