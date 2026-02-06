import { cn } from '@/shared/lib/utils'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'

import { AVATAR_SIZE_CLASSNAME } from './constants'

type ProfileAvatarProps = {
  avatarUrl?: string | null
  nickname: string
}

export function ProfileAvatar({ avatarUrl, nickname }: ProfileAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${nickname} 프로필 이미지`}
        className={cn(AVATAR_SIZE_CLASSNAME, 'rounded-full object-cover')}
      />
    )
  }

  return <DefaultProfileImage className={AVATAR_SIZE_CLASSNAME} />
}
