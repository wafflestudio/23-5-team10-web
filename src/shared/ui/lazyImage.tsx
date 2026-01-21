import { useEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
}

export default function LazyImage({
  src,
  alt,
  className,
  wrapperClassName,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return
    imgRef.current.decode().then(() => setIsLoaded(true))
  }, [])

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          'w-full object-cover transition-opacity duration-700',
          className,
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200',
            className
          )}
        />
      )}
    </div>
  )
}
