import { useCallback, useMemo, useState } from 'react'

import { useImageCarousel } from '@/features/create-post/model/hooks/useImageCarousel'
import { useImageUpload } from '@/features/create-post/model/hooks/useImageUpload'
import { useLimitedFilesDrop } from '@/features/create-post/model/hooks/useLimitedFilesDrop'
import { useObjectUrl } from '@/features/create-post/model/hooks/useObjectUrl'

export type CreatePostStep = 'select' | 'details'

type UseCreatePostDraftParams = {
  maxFiles: number
  onIgnoredCount?: (ignoredCount: number) => void
  onUploadError?: (error: Error) => void
}

export function useCreatePostDraft({
  maxFiles,
  onIgnoredCount,
  onUploadError,
}: UseCreatePostDraftParams) {
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<CreatePostStep>('select')
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [selectedAlbumId, setSelectedAlbumId] = useState<number>(-1)

  const imageUpload = useImageUpload()

  const carousel = useImageCarousel(files.length)
  const isUploaded = useMemo(() => files.length > 0, [files.length])
  const isDetails = isUploaded && step === 'details'
  const isUploading = imageUpload.isPending
  const isUploadError = imageUpload.isError
  const isUploadComplete =
    uploadedUrls.length > 0 && uploadedUrls.length === files.length

  const resetDraft = useCallback(() => {
    setFiles([])
    setStep('select')
    setUploadedUrls([])
    setCaption('')
    setSelectedAlbumId(-1)
    carousel.reset()
    imageUpload.reset()
  }, [carousel, imageUpload])

  const handleDropFiles = useLimitedFilesDrop({
    maxFiles,
    onAcceptedFiles: (limited) => {
      setFiles(limited)
      setStep('select')
      setUploadedUrls([])
      carousel.reset()

      imageUpload.mutate(limited, {
        onSuccess: (urls) => {
          setUploadedUrls(urls)
        },
        onError: (error) => {
          onUploadError?.(error as Error)
        },
      })
    },
    onIgnoredCount,
  })

  const activeFile = files[carousel.activeIndex]
  const activePreviewUrl = useObjectUrl(activeFile)

  return {
    files,
    step,
    setStep,
    isUploaded,
    isDetails,
    isUploading,
    isUploadError,
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
  }
}
