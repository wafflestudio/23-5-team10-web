import { useCallback, useMemo, useState } from 'react'

import { useObjectUrl } from '@/features/create-post/model/hooks/useObjectUrl'
import { useLimitedFilesDrop } from '@/features/create-post/model/hooks/useLimitedFilesDrop'
import { useStoryImageUpload } from '@/features/create-story/model/hooks/useStoryImageUpload'

type UseCreateStoryDraftParams = {
  maxFiles: number
  onIgnoredCount?: (ignoredCount: number) => void
  onUploadError?: (error: Error) => void
}

export function useCreateStoryDraft({
  maxFiles,
  onIgnoredCount,
  onUploadError,
}: UseCreateStoryDraftParams) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const imageUpload = useStoryImageUpload()

  const isUploaded = useMemo(() => file !== null, [file])
  const isUploading = imageUpload.isPending
  const isUploadComplete = uploadedUrl !== null

  const resetDraft = useCallback(() => {
    setFile(null)
    setUploadedUrl(null)
    imageUpload.reset()
  }, [imageUpload])

  const handleDropFiles = useLimitedFilesDrop({
    maxFiles,
    onAcceptedFiles: (limited) => {
      const selectedFile = limited[0] ?? null
      setFile(selectedFile)
      setUploadedUrl(null)

      if (selectedFile) {
        imageUpload.mutate(selectedFile, {
          onSuccess: (url) => {
            setUploadedUrl(url)
          },
          onError: (error) => {
            onUploadError?.(error as Error)
          },
        })
      }
    },
    onIgnoredCount,
  })

  const previewUrl = useObjectUrl(file)

  return {
    file,
    isUploaded,
    isUploading,
    isUploadComplete,
    uploadedUrl,
    previewUrl,
    handleDropFiles,
    resetDraft,
  }
}
