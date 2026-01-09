import { cn } from '@/shared/lib/utils'

import { AVATAR_SIZE_CLASSNAME } from './constants'

type ProfileAvatarProps = {
  avatarUrl?: string | null
  nickname: string
}

export function ProfileAvatar({ avatarUrl, nickname }: ProfileAvatarProps) {
  const initial = nickname.trim().slice(0, 1).toUpperCase()

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${nickname} 프로필 이미지`}
        className={cn(AVATAR_SIZE_CLASSNAME, 'rounded-full object-cover')}
      />
    )
  }

  return (
    <div
      aria-label={`${nickname} 프로필 이미지`}
      className={cn(
        AVATAR_SIZE_CLASSNAME,
        'flex items-center justify-center rounded-full bg-gray-200 text-5xl font-semibold text-gray-500'
      )}
    >
      {initial || '?'}
    </div>
  )
}
