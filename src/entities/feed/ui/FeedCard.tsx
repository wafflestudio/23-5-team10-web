import { useState } from 'react'
import { Heart, Bookmark, MessageCircle, MoreHorizontal } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import type { FeedItem } from '@/entities/feed/model/types'
import { useToggleLikeMutation } from '@/entities/post/model/hooks/useToggleLikeMutation'
import { useToggleBookmarkMutation } from '@/entities/post/model/hooks/useToggleBookmarkMutation'
import { Button } from '@/shared/ui/button'
import { Card, CardFooter, CardHeader } from '@/shared/ui/card'
import { cn } from '@/shared/lib/utils'
import { DefaultProfileImage } from '@/shared/ui/default-profile-image'
import LazyImage from '@/shared/ui/lazyImage'
import PostMenuModal from '@/components/post/PostMenuModal'

type FeedCardProps = {
  item: FeedItem
  className?: string
  onOpenPost?: (postId: number) => void
}

export function FeedCard({ item, className, onOpenPost }: FeedCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <>
      <Card
        className={cn(
          'mx-auto w-full max-w-sm gap-2 overflow-hidden rounded-lg border-none bg-transparent p-0',
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <Link
              to="/$userId"
              params={{ userId: String(item.author.userId) }}
              className="shrink-0 transition-opacity hover:opacity-80"
            >
              {item.author.profileImageUrl ? (
                <img
                  src={item.author.profileImageUrl}
                  alt={`${item.author.nickname} 프로필`}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <DefaultProfileImage className="size-8" />
              )}
            </Link>
            <div className="flex flex-col">
              <Link
                to="/$userId"
                params={{ userId: String(item.author.userId) }}
                className="text-sm leading-tight font-semibold text-black transition-opacity hover:opacity-60"
              >
                {item.author.nickname}
              </Link>
              <span className="text-muted-foreground text-[11px]">
                {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="p-1 transition-colors hover:text-gray-600"
          >
            <MoreHorizontal className="size-5" />
          </button>
        </CardHeader>

        <button
          type="button"
          onClick={handleOpenPost}
          className="block w-full focus-visible:outline-none"
        >
          {item.thumbnailImageUrl ? (
            <LazyImage
              src={item.thumbnailImageUrl}
              alt={`Post by ${item.author.nickname}`}
              wrapperClassName="w-full bg-black/5 aspect-square"
            />
          ) : (
            <div className="aspect-square w-full bg-black/5" />
          )}
        </button>

        <CardFooter className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-1">
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleOpenPost}
            >
              <MessageCircle className="text-foreground size-6 scale-x-[-1]" />
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

      {isMenuOpen && (
        <PostMenuModal
          onClose={() => setIsMenuOpen(false)}
          postId={item.postId}
          nickname={item.author.nickname}
          authorId={item.author.userId}
          profileImageUrl={item.author.profileImageUrl}
        />
      )}
    </>
  )
}
