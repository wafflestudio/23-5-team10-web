import { useMutation } from '@tanstack/react-query'

import { uploadStoryImage } from '@/features/create-story/api/uploadStoryImage'

export function useStoryImageUpload() {
  return useMutation({
    mutationFn: (file: File) => uploadStoryImage(file),
  })
}
