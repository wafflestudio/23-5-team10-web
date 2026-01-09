import { useCallback, useEffect, useMemo, useState } from 'react'

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

type CreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setFiles([])
        setActiveIndex(0)
      }
      onOpenChange(nextOpen)
    },
    [onOpenChange]
  )

  const handleDropFiles = useCallback((incomingFiles: File[]) => {
    const limited = incomingFiles.slice(0, MAX_IMAGE_FILES)
    const ignoredCount = incomingFiles.length - limited.length

    setFiles(limited)
    setActiveIndex(0)

    if (ignoredCount > 0) {
      toast(
        `사진 ${ignoredCount}장이 업로드 되지 않았습니다.\n최대 ${MAX_IMAGE_FILES}개의 파일만 선택할 수 있습니다.`
      )
    }
  }, [])

  const activeFile = files[activeIndex]
  const activePreviewUrl = useMemo(
    () => (activeFile ? URL.createObjectURL(activeFile) : null),
    [activeFile]
  )

  useEffect(() => {
    return () => {
      if (activePreviewUrl) URL.revokeObjectURL(activePreviewUrl)
    }
  }, [activePreviewUrl])

  const isUploaded = files.length > 0
  const canGoPrev = activeIndex > 0
  const canGoNext = activeIndex < files.length - 1

  const dots = useMemo(
    () => Array.from({ length: files.length }, (_, i) => i),
    [files.length]
  )

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
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
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
                    onClick={() =>
                      setActiveIndex((i) => Math.min(files.length - 1, i + 1))
                    }
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
