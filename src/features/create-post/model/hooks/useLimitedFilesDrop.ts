import { useCallback } from 'react'

type UseLimitedFilesDropParams = {
  maxFiles: number
  onAcceptedFiles: (files: File[]) => void
  onIgnoredCount?: (ignoredCount: number) => void
}

export function useLimitedFilesDrop({
  maxFiles,
  onAcceptedFiles,
  onIgnoredCount,
}: UseLimitedFilesDropParams) {
  return useCallback(
    (incomingFiles: File[]) => {
      const limited = incomingFiles.slice(0, maxFiles)
      const ignoredCount = Math.max(0, incomingFiles.length - limited.length)

      onAcceptedFiles(limited)
      onIgnoredCount?.(ignoredCount)
    },
    [maxFiles, onAcceptedFiles, onIgnoredCount]
  )
}
