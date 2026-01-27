import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

type ContentContainerProps = ComponentProps<'div'>

const CONTENT_CONTAINER_CLASSNAME = 'mx-auto w-full max-w-[935px] px-4'

export function ContentContainer({
  className,
  ...props
}: ContentContainerProps) {
  return (
    <div className={cn(CONTENT_CONTAINER_CLASSNAME, className)} {...props} />
  )
}
