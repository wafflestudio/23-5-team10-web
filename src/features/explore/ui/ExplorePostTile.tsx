import { Heart, MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'

import { cn } from '@/shared/lib/utils'
import { ImageFallback } from '@/shared/ui/image-fallback'
import type { PostListItem } from '@/entities/post/model/types'

type ExplorePostTileProps = {
  className?: string
  item: PostListItem
  rowSpan: 1 | 2
}

export function ExplorePostTile({
  className,
  item,
  rowSpan,
}: ExplorePostTileProps) {
  const [isImageError, setIsImageError] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const thumbnailUrl = item.images[0]?.url
  const ariaLabel = useMemo(
    () =>
      `게시글: ${item.content || '내용 없음'}, 좋아요 ${item.likeCount}개, 댓글 ${item.commentCount}개`,
    [item.commentCount, item.content, item.likeCount]
  )

  const handleClick = () => {
    navigate({
      to: '/p/$post_id',
      params: { post_id: String(item.id) },
      search: {
        returnToPath: location.pathname,
        returnToSearch: location.search,
      },
    })
  }

  return (
    <button
      type="button"
      className={cn(
        'group relative w-full overflow-hidden bg-neutral-200',
        rowSpan === 1 ? 'aspect-square' : 'row-span-2 h-full min-h-0',
        className
      )}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {thumbnailUrl && !isImageError ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={() => setIsImageError(true)}
        />
      ) : (
        <ImageFallback
          className="absolute inset-0 h-full w-full"
          ariaLabel="게시물 이미지 없음"
        />
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-6 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center gap-2 text-white">
          <Heart className="size-5" aria-hidden />
          <span className="text-sm font-semibold">{item.likeCount}</span>
          <span className="sr-only">좋아요</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="size-5" aria-hidden />
          <span className="text-sm font-semibold">{item.commentCount}</span>
          <span className="sr-only">댓글</span>
        </div>
      </div>
    </button>
  )
}
