import { useCallback } from 'react'

import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { Dropzone } from '@/shared/ui/dropzone'
import { toast } from 'sonner'

import {
  CREATE_POST_IMAGE_ACCEPT,
  MAX_IMAGE_FILES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from '@/features/create-post/constants'
import { useCreatePostDraft } from '@/features/create-post/model/hooks/useCreatePostDraft'
import { useDiscardConfirm } from '@/features/create-post/model/hooks/useDiscardConfirm'
import { CreateModalHeader } from '@/features/create-post/ui/CreateModalHeader'
import { DiscardCreatePostDialog } from '@/features/create-post/ui/DiscardCreatePostDialog'
import { EmptyDropzoneState } from '@/features/create-post/ui/EmptyDropzoneState'
import { PreviewPane } from '@/features/create-post/ui/PreviewPane'
import { PostDetailsPane } from '@/features/create-post/ui/PostDetailsPane'

type CreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateModal({ open, onOpenChange }: CreateModalProps) {
  if (!open) return null
  return <CreateModalInner onOpenChange={onOpenChange} />
}

function CreateModalInner({
  onOpenChange,
}: Pick<CreateModalProps, 'onOpenChange'>) {
  const {
    files,
    step,
    setStep,
    isUploaded,
    isDetails,
    activePreviewUrl,
    carousel,
    handleDropFiles,
    resetDraft,
  } = useCreatePostDraft({
    maxFiles: MAX_IMAGE_FILES,
    onIgnoredCount: (ignoredCount) => {
      if (ignoredCount <= 0) return
      toast(
        `사진 ${ignoredCount}장이 업로드 되지 않았습니다.\n최대 ${MAX_IMAGE_FILES}개의 파일만 선택할 수 있습니다.`
      )
    },
  })

  const closeWithoutConfirm = useCallback(() => {
    resetDraft()
    onOpenChange(false)
  }, [onOpenChange, resetDraft])

  const {
    isConfirmOpen,
    setConfirmOpen,
    requestClose,
    handleDialogOpenChange,
  } = useDiscardConfirm({
    isDirty: isUploaded,
    onClose: closeWithoutConfirm,
  })

  return (
    <>
      <Dialog open onOpenChange={handleDialogOpenChange}>
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
            onBack={isDetails ? () => setStep('select') : requestClose}
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
                    activeIndex={carousel.activeIndex}
                    canGoPrev={carousel.canGoPrev}
                    canGoNext={carousel.canGoNext}
                    dots={carousel.dots}
                    goPrev={carousel.goPrev}
                    goNext={carousel.goNext}
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
                activeIndex={carousel.activeIndex}
                canGoPrev={carousel.canGoPrev}
                canGoNext={carousel.canGoNext}
                dots={carousel.dots}
                goPrev={carousel.goPrev}
                goNext={carousel.goNext}
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

      <DiscardCreatePostDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onDiscard={closeWithoutConfirm}
      />
    </>
  )
}
