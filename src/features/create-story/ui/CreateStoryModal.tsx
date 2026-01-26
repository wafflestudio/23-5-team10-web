import { useCallback } from 'react'

import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { Dropzone } from '@/shared/ui/dropzone'
import { toast } from 'sonner'

import {
  CREATE_STORY_IMAGE_ACCEPT,
  MAX_STORY_IMAGE_FILES,
  MAX_STORY_IMAGE_FILE_SIZE_BYTES,
} from '@/features/create-story/constants'
import { useCreateStoryDraft } from '@/features/create-story/model/hooks/useCreateStoryDraft'
import { useDiscardConfirm } from '@/features/create-post/model/hooks/useDiscardConfirm'
import { StoryModalHeader } from '@/features/create-story/ui/StoryModalHeader'
import { DiscardStoryDialog } from '@/features/create-story/ui/DiscardStoryDialog'
import { EmptyStoryDropzoneState } from '@/features/create-story/ui/EmptyStoryDropzoneState'
import { StoryPreviewPane } from '@/features/create-story/ui/StoryPreviewPane'

type CreateStoryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStoryModal({
  open,
  onOpenChange,
}: CreateStoryModalProps) {
  if (!open) return null
  return <CreateStoryModalInner onOpenChange={onOpenChange} />
}

function CreateStoryModalInner({
  onOpenChange,
}: Pick<CreateStoryModalProps, 'onOpenChange'>) {
  const { isUploaded, previewUrl, handleDropFiles, resetDraft } =
    useCreateStoryDraft({
      maxFiles: MAX_STORY_IMAGE_FILES,
      onIgnoredCount: (ignoredCount) => {
        if (ignoredCount <= 0) return
        toast('스토리에는 사진 1장만 업로드할 수 있습니다.')
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
          className="flex flex-col gap-0 overflow-hidden rounded-4xl bg-white p-0 transition-[width,max-width] duration-300 sm:h-auto sm:w-[calc((80vh-51px)*9/16)] sm:max-w-[286px] sm:max-w-[calc(100vw-2rem)]"
        >
          <StoryModalHeader
            isUploaded={isUploaded}
            onBack={requestClose}
            onShare={() => toast('스토리 공유하기')}
          />
          <div className="h-px w-full bg-zinc-200" />

          {isUploaded ? (
            <div
              className="flex w-full sm:h-[calc(80vh-51px)] sm:max-h-[509px]"
              style={{ aspectRatio: '9/16' }}
            >
              <StoryPreviewPane previewUrl={previewUrl} />
            </div>
          ) : (
            <div
              className="flex w-full sm:h-[calc(80vh-51px)] sm:max-h-[509px]"
              style={{ aspectRatio: '9/16' }}
            >
              <Dropzone
                accept={CREATE_STORY_IMAGE_ACCEPT}
                multiple={false}
                maxSizeBytes={MAX_STORY_IMAGE_FILE_SIZE_BYTES}
                onDropFiles={handleDropFiles}
              >
                {(api) => <EmptyStoryDropzoneState {...api} />}
              </Dropzone>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DiscardStoryDialog
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onDiscard={closeWithoutConfirm}
      />
    </>
  )
}
