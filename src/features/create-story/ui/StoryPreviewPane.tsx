import { cn } from '@/shared/lib/utils'

type StoryPreviewPaneProps = {
  previewUrl: string | null | undefined
  className?: string
}

export function StoryPreviewPane({
  previewUrl,
  className,
}: StoryPreviewPaneProps) {
  return (
    <div className={cn('flex h-full w-full flex-col', className)}>
      <div
        className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-neutral-900"
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="업로드된 스토리 이미지 미리보기"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : null}
      </div>
    </div>
  )
}
