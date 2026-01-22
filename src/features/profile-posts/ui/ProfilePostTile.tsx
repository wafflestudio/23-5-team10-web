import { Heart, MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'

import { cn } from '@/shared/lib/utils'
import { ImageFallback } from '@/shared/ui/image-fallback'

type ProfilePostTileProps = {
  className?: string
  postId: string
  imageSrc?: string
  likeCount: number
  commentCount: number
}

export function ProfilePostTile({
  className,
  postId,
  imageSrc,
  likeCount,
  commentCount,
}: ProfilePostTileProps) {
  const [isImageError, setIsImageError] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const countsLabel = useMemo(() => {
    return `좋아요 ${likeCount}개, 댓글 ${commentCount}개`
  }, [commentCount, likeCount])

  const handleClick = () => {
    navigate({
      to: '/p/$post_id',
      params: { post_id: postId },
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
        'group relative aspect-2/3 w-full overflow-hidden bg-gray-100',
        className
      )}
      aria-label={countsLabel}
      onClick={handleClick}
    >
      {imageSrc && !isImageError ? (
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setIsImageError(true)}
        />
      ) : (
        <ImageFallback
          className="h-full w-full"
          ariaLabel="게시물 이미지 없음"
        />
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-6 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex items-center gap-2 text-white">
          <Heart className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm font-semibold">{likeCount}</span>
          <span className="sr-only">좋아요</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="text-sm font-semibold">{commentCount}</span>
          <span className="sr-only">댓글</span>
        </div>
      </div>
    </button>
  )
}
