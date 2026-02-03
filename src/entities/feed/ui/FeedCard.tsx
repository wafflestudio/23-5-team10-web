import { Heart, Bookmark } from 'lucide-react'

import type { FeedItem } from '@/entities/feed/model/types'
import { useToggleLikeMutation } from '@/entities/post/model/hooks/useToggleLikeMutation'
import { useToggleBookmarkMutation } from '@/entities/post/model/hooks/useToggleBookmarkMutation'
import { Button } from '@/shared/ui/button'
import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import LazyImage from '@/shared/ui/lazyImage'

type FeedCardProps = {
  item: FeedItem
  className?: string
  onOpenPost?: (postId: number) => void
}

export function FeedCard({ item, className, onOpenPost }: FeedCardProps) {
  const toggleLikeMutation = useToggleLikeMutation({
    postId: item.postId,
    initiallyLiked: item.isLiked,
  })

  const toggleBookmarkMutation = useToggleBookmarkMutation({
    postId: item.postId,
    initiallyBookmarked: item.isBookmarked,
  })

  const handleOpenPost = () => {
    onOpenPost?.(item.postId)
  }

  const handleToggleLike = () => {
    if (toggleLikeMutation.isPending) return
    toggleLikeMutation.mutate(!item.isLiked)
  }

  const handleToggleBookmark = () => {
    if (toggleBookmarkMutation.isPending) return
    toggleBookmarkMutation.mutate(!item.isBookmarked)
  }

  return (
    <Card
      className={cn(
        'mx-auto w-full max-w-sm gap-2 overflow-hidden rounded-lg border-none bg-transparent p-0',
        className
      )}
    >
      <button
        type="button"
        onClick={handleOpenPost}
        className="block w-full focus-visible:outline-none"
      >
        <LazyImage
          src={item.thumbnailImageUrl}
          alt={`Post by ${item.author.nickname}`}
          wrapperClassName="w-full bg-black/5 aspect-square"
        />
      </button>

      <CardHeader className="flex flex-row items-center gap-3 px-3 py-2">
        <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {item.author.profileImageUrl ? (
            <img
              src={item.author.profileImageUrl}
              alt={`${item.author.nickname} 프로필`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
              {item.author.nickname.trim().slice(0, 1).toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-tight font-semibold">
            {item.author.nickname}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {new Date(item.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </CardHeader>

      <CardFooter className="flex px-2 py-1">
        <div className="flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-pressed={item.isLiked}
            disabled={toggleLikeMutation.isPending}
            onClick={handleToggleLike}
          >
            <Heart
              className={cn(
                'size-6 transition-colors',
                item.isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
            />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-pressed={item.isBookmarked}
          disabled={toggleBookmarkMutation.isPending}
          onClick={handleToggleBookmark}
        >
          <Bookmark
            className={cn(
              'size-6 transition-colors',
              item.isBookmarked ? 'fill-black text-black' : 'text-foreground'
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
