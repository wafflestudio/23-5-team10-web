import type { AlbumSummary } from '@/entities/album/model/types'
import { cn } from '@/shared/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card'
import LazyImage from '@/shared/ui/lazyImage'

type AlbumSummaryCardProps = {
  album: AlbumSummary
  className?: string
  onClick?: (albumId: number) => void
}

export function AlbumSummaryCard({
  album,
  className,
  onClick,
}: AlbumSummaryCardProps) {
  const { title, thumbnailImageUrl, postCount } = album

  const handleClick = () => {
    onClick?.(album.albumId)
  }

  return (
    <Card
      className={cn(
        'w-[260px] cursor-pointer gap-0 overflow-hidden rounded-2xl border-none py-0 shadow-md',
        className
      )}
      role="button"
      tabIndex={0}
      onClick={handleClick}
    >
      <CardHeader className="flex items-start gap-2 px-4 py-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-b-2xl">
          <LazyImage
            src={thumbnailImageUrl}
            alt={title}
            wrapperClassName="absolute inset-0"
            className="h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 h-full w-full bg-linear-to-t from-black/35 via-black/5 to-transparent" />

          <div className="pointer-events-none absolute right-2 bottom-2">
            <div className="text-foreground/90 inline-flex min-w-[40px] items-center justify-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              {postCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
