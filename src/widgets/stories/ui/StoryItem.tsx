import { Link } from '@tanstack/react-router'
import { CarouselItem } from '@/shared/ui/carousel'
import { cn } from '@/shared/lib/utils'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'

type StoryItemProps = {
  userId: number
  nickname: string
  profileImageUrl: string | null
  hasUnseenStory: boolean
}

export function StoryItem({
  userId,
  nickname,
  profileImageUrl,
  hasUnseenStory,
}: StoryItemProps) {
  return (
    <CarouselItem className="flex basis-1/4 flex-col items-center gap-1 sm:basis-1/5 md:basis-1/6 lg:basis-1/8">
      <Link
        to="/stories/$user_id"
        params={{ user_id: String(userId) }}
        className="group focus:outline-none"
      >
        <div
          className={cn(
            'flex size-20 items-center justify-center rounded-full p-1 transition group-hover:brightness-110',
            hasUnseenStory
              ? 'bg-linear-to-tr from-pink-500 via-red-500 to-yellow-400'
              : 'bg-gray-300'
          )}
        >
          <div className="flex size-full items-center justify-center rounded-full bg-white p-1">
            {profileImageUrl ? (
              <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-gray-200">
                <img
                  src={profileImageUrl}
                  alt={`${nickname} 프로필`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <DefaultProfileImage className="size-full" />
            )}
          </div>
        </div>
      </Link>

      <span className="max-w-16 truncate text-xs">{nickname}</span>
    </CarouselItem>
  )
}
