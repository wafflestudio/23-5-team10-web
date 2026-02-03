import { useRef } from 'react'

import { Button } from '@/shared/ui/button'
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react'
import { CREATE_POST_IMAGE_ACCEPT } from '@/features/create-post/constants'

type PreviewPaneProps = {
  activePreviewUrl: string | null | undefined
  filesCount: number
  activeIndex: number
  canGoPrev: boolean
  canGoNext: boolean
  dots: number[]
  goPrev: () => void
  goNext: () => void
  isUploadError?: boolean
  onSelectFiles?: (files: File[]) => void
}

export function PreviewPane({
  activePreviewUrl,
  filesCount,
  activeIndex,
  canGoPrev,
  canGoNext,
  dots,
  goPrev,
  goNext,
  isUploadError,
  onSelectFiles,
}: PreviewPaneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleRetryClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onSelectFiles?.(Array.from(files))
    }
    e.target.value = ''
  }
  const hasMultipleFiles = filesCount > 1

  return (
    <div className="flex flex-1 flex-col">
      <div
        className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-zinc-50"
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {activePreviewUrl ? (
          <img
            src={activePreviewUrl}
            alt="업로드된 이미지 미리보기"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {isUploadError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/60">
            <AlertCircle className="size-12 text-red-400" />
            <p className="text-center text-sm text-white">
              이미지 업로드에 실패했습니다.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={CREATE_POST_IMAGE_ACCEPT}
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              className="gap-2 text-white"
              onClick={handleRetryClick}
            >
              <RefreshCw className="size-4" />
              다시 시도
            </Button>
          </div>
        ) : null}

        {hasMultipleFiles ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canGoPrev}
              aria-label="이전 이미지"
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/60 disabled:opacity-30"
              onClick={goPrev}
            >
              <ChevronLeft className="size-5 text-white" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={!canGoNext}
              aria-label="다음 이미지"
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/60 disabled:opacity-30"
              onClick={goNext}
            >
              <ChevronRight className="size-5 text-white" />
            </Button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-1.5">
              {dots.map((i) => {
                const isActive = i === activeIndex
                return (
                  <span
                    key={i}
                    className={[
                      'h-1.5 w-1.5 rounded-full',
                      isActive ? 'bg-white' : 'bg-white/40',
                    ].join(' ')}
                  />
                )
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
