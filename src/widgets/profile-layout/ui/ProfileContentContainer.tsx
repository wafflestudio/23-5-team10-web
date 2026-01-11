import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/utils'

type ProfileContentContainerProps = ComponentProps<'div'>

const PROFILE_CONTENT_CONTAINER_CLASSNAME = 'mx-auto w-full max-w-[935px] px-4'

export function ProfileContentContainer({
  className,
  ...props
}: ProfileContentContainerProps) {
  return (
    <div
      className={cn(PROFILE_CONTENT_CONTAINER_CLASSNAME, className)}
      {...props}
    />
  )
}
