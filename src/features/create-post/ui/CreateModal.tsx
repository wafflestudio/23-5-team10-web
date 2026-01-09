import { useCallback, useState } from 'react'

import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Dropzone } from '@/shared/ui/dropzone'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, ImagePlus, XIcon } from 'lucide-react'

import {
  CREATE_POST_IMAGE_ACCEPT,
  MAX_IMAGE_FILES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from '@/features/create-post/constants'
import { useImageCarousel } from '@/features/create-post/model/hooks/useImageCarousel'
import { useLimitedFilesDrop } from '@/features/create-post/model/hooks/useLimitedFilesDrop'
import { useObjectUrl } from '@/features/create-post/model/hooks/useObjectUrl'

type CreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const {
    activeIndex,
    canGoPrev,
    canGoNext,
    dots,
    goNext,
    goPrev,
    reset: resetActiveIndex,
  } = useImageCarousel(files.length)

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setFiles([])
        resetActiveIndex()
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange, resetActiveIndex]
  )

  const handleDropFiles = useLimitedFilesDrop({
    maxFiles: MAX_IMAGE_FILES,
    onAcceptedFiles: (limited) => {
      setFiles(limited)
      resetActiveIndex()
    },
    onIgnoredCount: (ignoredCount) => {
      if (ignoredCount <= 0) return
      toast(
        `사진 ${ignoredCount}장이 업로드 되지 않았습니다.\n최대 ${MAX_IMAGE_FILES}개의 파일만 선택할 수 있습니다.`
      )
    },
  })

  const activeFile = files[activeIndex]
  const activePreviewUrl = useObjectUrl(activeFile)

  const isUploaded = files.length > 0

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex aspect-square flex-col gap-0 overflow-hidden rounded-4xl bg-white p-0 sm:max-w-xl"
      >
        <header className="relative flex h-auto items-center justify-center px-12 py-6">
          <DialogTitle className="text-base font-semibold">
            새 게시물 만들기
          </DialogTitle>
          {isUploaded ? (
            <Button
              type="button"
              variant="ghost"
              className="absolute top-1/2 right-4 -translate-y-1/2"
              onClick={() => {}}
            >
              다음으로
            </Button>
          ) : (
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="absolute top-1/2 right-4 -translate-y-1/2"
              >
                <XIcon className="size-5" />
              </Button>
            </DialogClose>
          )}
        </header>
        <div className="h-px w-full bg-zinc-200" />

        {isUploaded ? (
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

              {files.length > 1 ? (
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
        ) : (
          <Dropzone
            accept={CREATE_POST_IMAGE_ACCEPT}
            multiple
            maxSizeBytes={MAX_IMAGE_FILE_SIZE_BYTES}
            onDropFiles={handleDropFiles}
          >
            {({ getRootProps, getInputProps, openFileDialog, isDragging }) => (
              <div
                {...getRootProps({
                  className: [
                    'flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center',
                    isDragging ? 'bg-zinc-50' : '',
                  ].join(' '),
                })}
              >
                <ImagePlus className="size-10" />

                <p className="text-lg font-medium">
                  사진과 동영상을 여기에 끌어다 놓으세요
                </p>

                <input {...getInputProps({ className: 'hidden' })} />

                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openFileDialog()
                  }}
                >
                  컴퓨터에서 선택
                </Button>
              </div>
            )}
          </Dropzone>
        )}
      </DialogContent>
    </Dialog>
  )
}
