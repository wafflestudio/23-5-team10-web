const STORY_ASPECT_RATIO = 9 / 16

export async function cropImageToStoryRatio(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file)
  const { width: srcWidth, height: srcHeight } = imageBitmap

  const targetWidth = srcWidth
  const targetHeight = Math.round(srcWidth / STORY_ASPECT_RATIO)

  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, targetWidth, targetHeight)

  const scale = targetWidth / srcWidth
  const scaledHeight = srcHeight * scale

  const offsetY = (targetHeight - scaledHeight) / 2

  ctx.drawImage(imageBitmap, 0, offsetY, targetWidth, scaledHeight)

  const blob = await canvas.convertToBlob({
    type: file.type || 'image/jpeg',
    quality: 0.9,
  })

  return new File([blob], file.name, { type: blob.type })
}
