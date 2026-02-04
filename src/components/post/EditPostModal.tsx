import { useCallback, useState, useMemo } from 'react'
import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { instance } from '@/shared/api/ky'
import { useQueryClient } from '@tanstack/react-query'

import { CreateModalHeader } from '@/features/create-post/ui/CreateModalHeader'
import { PreviewPane } from '@/features/create-post/ui/PreviewPane'
import { PostDetailsPane } from '@/features/create-post/ui/PostDetailsPane'
import { useImageCarousel } from '@/features/create-post/model/hooks/useImageCarousel'
import { useUpdatePostMutation } from '@/entities/post/model/hooks/useUpdatePostMutation'
import type { PostData } from './PostDetail'

type EditPostModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: PostData
  onSuccess?: (updatedData: PostData) => void
}

export function EditPostModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: EditPostModalProps) {
  const [caption, setCaption] = useState(initialData.content)
  const [selectedAlbumId, setSelectedAlbumId] = useState<number>(
    initialData.albumId ?? -1
  )
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSuccessState, setIsSuccessState] = useState(false)

  const queryClient = useQueryClient()
  const updatePost = useUpdatePostMutation(initialData.id)
  const carousel = useImageCarousel(initialData.images.length)

  const isDirty = useMemo(() => {
    return (
      caption !== initialData.content ||
      selectedAlbumId !== (initialData.albumId ?? -1)
    )
  }, [caption, selectedAlbumId, initialData])

  const handleUpdate = useCallback(async () => {
    if (!isDirty) return
    setIsSyncing(true)

    try {
      let updatedData: PostData = { ...initialData }

      if (caption !== initialData.content) {
        const result = await updatePost.mutateAsync({
          content: caption,
          albumId: initialData.albumId ?? null,
          imageUrls: initialData.images.map((img) => img.url),
        })
        updatedData = { ...updatedData, content: result.content }
      }

      if (selectedAlbumId !== (initialData.albumId ?? -1)) {
        if (selectedAlbumId === -1) {
          await instance.delete(
            `api/v1/albums/${initialData.albumId}/posts/${initialData.id}`
          )
          updatedData = { ...updatedData, albumId: null as unknown as number }
        } else {
          await instance.post(
            `api/v1/albums/${selectedAlbumId}/posts/${initialData.id}`
          )
          updatedData = { ...updatedData, albumId: selectedAlbumId }
        }
      }

      setIsSuccessState(true)

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
        queryClient.invalidateQueries({ queryKey: ['albums'] })

        onSuccess?.(updatedData)
        onOpenChange(false)
      }, 500)
    } catch {
      toast.error('정보 수정에 실패했습니다.')
    } finally {
      setIsSyncing(false)
    }
  }, [
    caption,
    selectedAlbumId,
    isDirty,
    updatePost,
    onOpenChange,
    initialData,
    onSuccess,
    queryClient,
  ])

  const activePreviewUrl = initialData.images[carousel.activeIndex]?.url

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[110]"
        className="z-[120] flex flex-col gap-0 overflow-hidden rounded-4xl bg-white p-0 sm:w-[calc(80vh-51px+340px)] sm:max-w-[849px]"
      >
        <CreateModalHeader
          isUploaded={true}
          step="details"
          title="정보 수정"
          onBack={() => onOpenChange(false)}
          onShare={handleUpdate}
          isShareDisabled={!isDirty || isSyncing}
          isSharing={isSyncing}
          isShareSuccess={isSuccessState}
        />
        <div className="h-px w-full bg-zinc-200" />

        {isSyncing ? (
          <div className="flex aspect-square w-full items-center justify-center sm:h-[calc(80vh-51px)] sm:max-h-[509px]">
            <Loader2 className="size-16 animate-spin text-zinc-400" />
          </div>
        ) : isSuccessState ? (
          <div className="flex aspect-square w-full flex-col items-center justify-center gap-4 sm:h-[calc(80vh-51px)] sm:max-h-[509px]">
            <CheckCircle2 className="size-24 text-green-500" />
            <p className="text-lg font-medium text-zinc-700">
              정보가 수정되었습니다.
            </p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
            <div className="flex aspect-square w-full sm:h-[calc(80vh-51px)] sm:max-h-[509px] sm:w-[calc(80vh-51px)] sm:max-w-[509px] sm:flex-none">
              <PreviewPane
                activePreviewUrl={activePreviewUrl}
                filesCount={initialData.images.length}
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
                profileName={initialData.nickname}
                profileImageUrl={initialData.profileImageUrl}
                caption={caption}
                onCaptionChange={setCaption}
                selectedAlbumId={selectedAlbumId}
                onAlbumSelect={setSelectedAlbumId}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
