import { useCallback } from 'react'

import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { Dropzone } from '@/shared/ui/dropzone'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

import {
  CREATE_STORY_IMAGE_ACCEPT,
  MAX_STORY_IMAGE_FILES,
  MAX_STORY_IMAGE_FILE_SIZE_BYTES,
} from '@/features/create-story/constants'
import { useCreateStoryDraft } from '@/features/create-story/model/hooks/useCreateStoryDraft'
import { useCreateStoryMutation } from '@/features/create-story/model/hooks/useCreateStoryMutation'
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
  const {
    isUploaded,
    isUploading,
    isUploadComplete,
    uploadedUrl,
    previewUrl,
    handleDropFiles,
    resetDraft,
  } = useCreateStoryDraft({
    maxFiles: MAX_STORY_IMAGE_FILES,
    onIgnoredCount: (ignoredCount) => {
      if (ignoredCount <= 0) return
      toast('스토리에는 사진 1장만 업로드할 수 있습니다.')
    },
    onUploadError: () => {
      toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    },
  })

  const createStory = useCreateStoryMutation()

  const closeWithoutConfirm = useCallback(() => {
    resetDraft()
    onOpenChange(false)
  }, [onOpenChange, resetDraft])

  const handleShare = useCallback(() => {
    if (!isUploadComplete || !uploadedUrl) {
      toast.error('이미지 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    createStory.mutate(
      { imageUrl: uploadedUrl },
      {
        onError: () => {
          toast.error('스토리 공유에 실패했습니다. 다시 시도해주세요.')
        },
      }
    )
  }, [isUploadComplete, uploadedUrl, createStory])

  const isSharing = createStory.isPending
  const isShareSuccess = createStory.isSuccess
  const isShareDisabled = !isUploadComplete || isSharing

  const {
    isConfirmOpen,
    setConfirmOpen,
    requestClose,
    handleDialogOpenChange,
  } = useDiscardConfirm({
    isDirty: isUploaded && !isSharing && !isShareSuccess,
    onClose: closeWithoutConfirm,
  })

  return (
    <>
      <Dialog open onOpenChange={handleDialogOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-4xl bg-white p-0 transition-[width,max-width] duration-300 sm:w-[calc((80vh-51px)*9/16)] sm:max-w-[calc(100vw-2rem)]"
        >
          <StoryModalHeader
            isUploaded={isUploaded}
            onBack={requestClose}
            onShare={handleShare}
            isShareDisabled={isShareDisabled}
            isUploading={isUploading}
            isSharing={isSharing}
            isShareSuccess={isShareSuccess}
          />
          <div className="h-px w-full bg-zinc-200" />

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div className="relative aspect-9/16 max-h-full min-h-0 w-full max-w-full">
              {isSharing ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-900">
                  <Loader2 className="size-16 animate-spin text-white" />
                </div>
              ) : isShareSuccess ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-neutral-900">
                  <CheckCircle2 className="size-24 text-green-500" />
                  <p className="text-lg font-medium text-white">
                    스토리가 공유되었습니다.
                  </p>
                </div>
              ) : isUploaded ? (
                <StoryPreviewPane previewUrl={previewUrl} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
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
            </div>
          </div>
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
