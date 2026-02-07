import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib/utils'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'

import { AVATAR_SIZE_CLASSNAME } from './constants'

type ProfileAvatarProps = {
  avatarUrl?: string | null
  nickname: string
  hasStory?: boolean
  hasUnseenStory?: boolean
  firstStoryId?: number
}

export function ProfileAvatar({
  avatarUrl,
  nickname,
  hasStory = false,
  hasUnseenStory = false,
  firstStoryId,
}: ProfileAvatarProps) {
  const avatarContent = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={`${nickname} 프로필 이미지`}
      className={cn(AVATAR_SIZE_CLASSNAME, 'rounded-full object-cover')}
    />
  ) : (
    <DefaultProfileImage className={AVATAR_SIZE_CLASSNAME} />
  )

  if (!hasStory) {
    return avatarContent
  }

  const ringClassName = hasUnseenStory
    ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
    : 'bg-gray-300'

  const content = (
    <div className="relative flex cursor-pointer items-center justify-center">
      <div
        className={cn(
          'absolute size-[164px] rounded-full p-[3px]',
          ringClassName
        )}
      >
        <div className="size-full rounded-full bg-white" />
      </div>
      <div className="relative">{avatarContent}</div>
    </div>
  )

  if (firstStoryId) {
    return (
      <Link
        to="/stories/$profile_name/$story_id"
        params={{ profile_name: nickname, story_id: String(firstStoryId) }}
      >
        {content}
      </Link>
    )
  }

  return content
}
