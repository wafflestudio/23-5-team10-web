import { Link } from '@tanstack/react-router'
import { cn } from '@/shared/lib/utils'

type StoryItemProps = {
  userId: string
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
    <div className="flex flex-col items-center gap-2">
      <Link
        to="/stories/$user_id"
        params={{ user_id: userId }}
        className="group focus:outline-none"
      >
        <div
          className={cn(
            'flex size-20 items-center justify-center rounded-full p-[2.5px] transition group-hover:brightness-110',
            hasUnseenStory
              ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
              : 'bg-gray-300'
          )}
        >
          <div className="flex size-full items-center justify-center rounded-full bg-white p-[2px] dark:bg-black">
            <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={nickname}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {nickname.trim().slice(0, 1).toUpperCase() || '?'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      <span className="w-20 truncate text-center text-[11px] font-medium tracking-tight">
        {nickname}
      </span>
    </div>
  )
}
