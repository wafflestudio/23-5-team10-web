import { useCallback, useMemo, useState } from 'react'

import { useImageCarousel } from '@/features/create-post/model/hooks/useImageCarousel'
import { useLimitedFilesDrop } from '@/features/create-post/model/hooks/useLimitedFilesDrop'
import { useObjectUrl } from '@/features/create-post/model/hooks/useObjectUrl'

export type CreatePostStep = 'select' | 'details'

type UseCreatePostDraftParams = {
  maxFiles: number
  onIgnoredCount?: (ignoredCount: number) => void
}

export function useCreatePostDraft({
  maxFiles,
  onIgnoredCount,
}: UseCreatePostDraftParams) {
  const [files, setFiles] = useState<File[]>([])
  const [step, setStep] = useState<CreatePostStep>('select')

  const carousel = useImageCarousel(files.length)
  const isUploaded = useMemo(() => files.length > 0, [files.length])
  const isDetails = isUploaded && step === 'details'

  const resetDraft = useCallback(() => {
    setFiles([])
    setStep('select')
    carousel.reset()
  }, [carousel])

  const handleDropFiles = useLimitedFilesDrop({
    maxFiles,
    onAcceptedFiles: (limited) => {
      setFiles(limited)
      setStep('select')
      carousel.reset()
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
    activePreviewUrl,
    carousel,
    handleDropFiles,
    resetDraft,
  }
}
