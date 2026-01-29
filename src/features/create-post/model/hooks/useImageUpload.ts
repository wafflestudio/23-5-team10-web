import { useMutation } from '@tanstack/react-query'

import { uploadImages } from '@/features/create-post/api/uploadImages'

export function useImageUpload() {
  return useMutation({
    mutationFn: (files: File[]) => uploadImages(files),
  })
}
