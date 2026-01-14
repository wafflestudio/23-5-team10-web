import { Link } from '@tanstack/react-router'
import { ImageFallback } from '@/shared/ui/image-fallback'
import { CarouselItem } from '@/shared/ui/carousel'

interface StoryItemProps {
  profileName: string
  storyId: string
}

export function StoryItem({ profileName, storyId }: StoryItemProps) {
  return (
    <CarouselItem className="flex basis-1/8 flex-col items-center gap-1">
      <Link
        to="/stories/$profile_name/$story_id"
        params={{
          profile_name: profileName,
          story_id: storyId,
        }}
        className="group focus:outline-none"
      >
        <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-tr from-pink-500 via-red-500 to-yellow-400 p-1 transition group-hover:brightness-110">
          <div className="flex size-full items-center justify-center rounded-full bg-white p-1">
            <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-gray-200">
              <ImageFallback />
            </div>
          </div>
        </div>
      </Link>

      <span className="text-xs">닉네임</span>
    </CarouselItem>
  )
}
