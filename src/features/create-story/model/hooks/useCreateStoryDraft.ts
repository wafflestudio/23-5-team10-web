import { useCallback, useMemo, useState } from 'react'

import { useObjectUrl } from '@/features/create-post/model/hooks/useObjectUrl'
import { useLimitedFilesDrop } from '@/features/create-post/model/hooks/useLimitedFilesDrop'

type UseCreateStoryDraftParams = {
  maxFiles: number
  onIgnoredCount?: (ignoredCount: number) => void
}

export function useCreateStoryDraft({
  maxFiles,
  onIgnoredCount,
}: UseCreateStoryDraftParams) {
  const [file, setFile] = useState<File | null>(null)

  const isUploaded = useMemo(() => file !== null, [file])

  const resetDraft = useCallback(() => {
    setFile(null)
  }, [])

  const handleDropFiles = useLimitedFilesDrop({
    maxFiles,
    onAcceptedFiles: (limited) => {
      setFile(limited[0] ?? null)
    },
    onIgnoredCount,
  })

  const previewUrl = useObjectUrl(file)

  return {
    file,
    isUploaded,
    previewUrl,
    handleDropFiles,
    resetDraft,
  }
}
