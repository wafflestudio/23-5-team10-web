import { Image as ImageIcon } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

type ImageFallbackProps = ComponentProps<'div'> & {
  ariaLabel?: string
}

const DEFAULT_ARIA_LABEL = '이미지 없음'

export function ImageFallback({
  className,
  ariaLabel = DEFAULT_ARIA_LABEL,
  ...props
}: ImageFallbackProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'bg-muted flex items-center justify-center text-gray-400',
        className
      )}
      {...props}
    >
      <ImageIcon className="h-12 w-12" aria-hidden="true" />
    </div>
  )
}
