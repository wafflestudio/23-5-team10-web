import { useCallback } from 'react'

import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { Dropzone } from '@/shared/ui/dropzone'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { useCreatePostMutation } from '@/entities/post/model/hooks/useCreatePostMutation'
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
    isUploading,
    isUploadComplete,
    uploadedUrls,
    caption,
    setCaption,
    selectedAlbumId,
    setSelectedAlbumId,
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
    onUploadError: () => {
      toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    },
  })

  const createPost = useCreatePostMutation()

  const closeWithoutConfirm = useCallback(() => {
    resetDraft()
    onOpenChange(false)
  }, [onOpenChange, resetDraft])

  const handleShare = useCallback(() => {
    if (!isUploadComplete) {
      toast.error('이미지 업로드가 완료될 때까지 기다려주세요.')
      return
    }

    createPost.mutate(
      {
        content: caption,
        albumId: selectedAlbumId,
        imageUrls: uploadedUrls,
      },
      {
        onError: () => {
          toast.error('게시물 공유에 실패했습니다. 다시 시도해주세요.')
        },
      }
    )
  }, [isUploadComplete, caption, selectedAlbumId, uploadedUrls, createPost])

  const isSharing = createPost.isPending
  const isShareSuccess = createPost.isSuccess
  const isShareDisabled = !isUploadComplete || isSharing
  const showDetailsPane = isDetails && !isSharing && !isShareSuccess

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
          className={[
            'flex flex-col gap-0 overflow-hidden rounded-4xl bg-white p-0 transition-[width,max-width] duration-300 sm:h-auto sm:max-w-[calc(100vw-2rem)]',
            showDetailsPane
              ? 'sm:w-[calc(80vh-51px+340px)] sm:max-w-[849px]'
              : 'sm:w-[calc(80vh-51px)] sm:max-w-[509px]',
          ].join(' ')}
        >
          <CreateModalHeader
            isUploaded={isUploaded}
            step={step}
            onBack={isDetails ? () => setStep('select') : requestClose}
            onNext={() => setStep('details')}
            onShare={handleShare}
            isShareDisabled={isShareDisabled}
            isUploading={isUploading}
            isSharing={isSharing}
            isShareSuccess={isShareSuccess}
          />
          <div className="h-px w-full bg-zinc-200" />

          {isUploaded ? (
            isSharing ? (
              <div className="flex aspect-square w-full items-center justify-center sm:h-[calc(80vh-51px)] sm:max-h-[509px] sm:w-[calc(80vh-51px)] sm:max-w-[509px]">
                <Loader2 className="size-16 animate-spin text-zinc-400" />
              </div>
            ) : isShareSuccess ? (
              <div className="flex aspect-square w-full flex-col items-center justify-center gap-4 sm:h-[calc(80vh-51px)] sm:max-h-[509px] sm:w-[calc(80vh-51px)] sm:max-w-[509px]">
                <CheckCircle2 className="size-24 text-green-500" />
                <p className="text-lg font-medium text-zinc-700">
                  게시물이 공유되었습니다.
                </p>
              </div>
            ) : showDetailsPane ? (
              <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <div className="flex aspect-square w-full sm:h-[calc(80vh-51px)] sm:max-h-[509px] sm:w-[calc(80vh-51px)] sm:max-w-[509px] sm:flex-none">
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
                  <PostDetailsPane
                    profileName="user1"
                    caption={caption}
                    onCaptionChange={setCaption}
                    selectedAlbumId={selectedAlbumId}
                    onAlbumSelect={setSelectedAlbumId}
                  />
                </div>
              </div>
            ) : (
              <div className="flex aspect-square w-full sm:h-[calc(80vh-51px)] sm:max-h-[509px] sm:w-[calc(80vh-51px)] sm:max-w-[509px]">
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
            )
          ) : (
            <div className="flex aspect-square w-full sm:h-[calc(80vh-51px)] sm:max-h-[509px] sm:w-[calc(80vh-51px)] sm:max-w-[509px]">
              <Dropzone
                accept={CREATE_POST_IMAGE_ACCEPT}
                multiple
                maxSizeBytes={MAX_IMAGE_FILE_SIZE_BYTES}
                onDropFiles={handleDropFiles}
              >
                {(api) => <EmptyDropzoneState {...api} />}
              </Dropzone>
            </div>
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
