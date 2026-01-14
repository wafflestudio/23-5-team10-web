import { ImageFallback } from '@/shared/ui/image-fallback'
import { CarouselItem } from '@/shared/ui/carousel'

export function StoryItem() {
  return (
    <CarouselItem className="flex basis-1/8 flex-col items-center gap-1">
      <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-tr from-pink-500 via-red-500 to-yellow-400 p-1">
        <div className="flex size-full items-center justify-center rounded-full bg-white p-1">
          <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <ImageFallback />
          </div>
        </div>
      </div>

      <span className="text-xs">닉네임</span>
    </CarouselItem>
  )
}
