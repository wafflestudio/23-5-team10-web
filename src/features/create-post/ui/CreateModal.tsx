import { useCallback, useState } from 'react'

import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { Dropzone } from '@/shared/ui/dropzone'
import { toast } from 'sonner'

import {
  CREATE_POST_IMAGE_ACCEPT,
  MAX_IMAGE_FILES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from '@/features/create-post/constants'
import { useImageCarousel } from '@/features/create-post/model/hooks/useImageCarousel'
import { useLimitedFilesDrop } from '@/features/create-post/model/hooks/useLimitedFilesDrop'
import { useObjectUrl } from '@/features/create-post/model/hooks/useObjectUrl'
import { CreateModalHeader } from '@/features/create-post/ui/CreateModalHeader'
import { EmptyDropzoneState } from '@/features/create-post/ui/EmptyDropzoneState'
import { PreviewPane } from '@/features/create-post/ui/PreviewPane'
import { PostDetailsPane } from '@/features/create-post/ui/PostDetailsPane'

type CreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<'select' | 'details'>('select')
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
        setStep('select')
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
      setStep('select')
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
  const isDetails = isUploaded && step === 'details'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={[
          'flex flex-col gap-0 overflow-hidden rounded-4xl bg-white p-0 transition-[max-width] duration-300',
          isDetails
            ? 'sm:h-[min(80vh,560px)] sm:max-w-4xl'
            : 'aspect-square sm:h-[min(80vh,560px)] sm:max-w-xl',
        ].join(' ')}
      >
        <CreateModalHeader
          isUploaded={isUploaded}
          step={step}
          onBack={() => setStep('select')}
          onNext={() => setStep('details')}
          onShare={() => toast('공유하기')}
        />
        <div className="h-px w-full bg-zinc-200" />

        {isUploaded ? (
          isDetails ? (
            <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
              <div className="flex min-h-0 flex-1 sm:w-[560px] sm:shrink-0">
                <PreviewPane
                  activePreviewUrl={activePreviewUrl}
                  filesCount={files.length}
                  activeIndex={activeIndex}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                  dots={dots}
                  goPrev={goPrev}
                  goNext={goNext}
                />
              </div>

              <div className="min-h-0 flex-1 sm:w-[340px] sm:shrink-0">
                <PostDetailsPane profileName="user1" />
              </div>
            </div>
          ) : (
            <PreviewPane
              activePreviewUrl={activePreviewUrl}
              filesCount={files.length}
              activeIndex={activeIndex}
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              dots={dots}
              goPrev={goPrev}
              goNext={goNext}
            />
          )
        ) : (
          <Dropzone
            accept={CREATE_POST_IMAGE_ACCEPT}
            multiple
            maxSizeBytes={MAX_IMAGE_FILE_SIZE_BYTES}
            onDropFiles={handleDropFiles}
          >
            {(api) => <EmptyDropzoneState {...api} />}
          </Dropzone>
        )}
      </DialogContent>
    </Dialog>
  )
}
