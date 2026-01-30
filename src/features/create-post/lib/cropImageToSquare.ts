export async function cropImageToSquare(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file)
  const { width, height } = imageBitmap

  const size = Math.min(width, height)
  const offsetX = (width - size) / 2
  const offsetY = (height - size) / 2

  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  ctx.drawImage(imageBitmap, offsetX, offsetY, size, size, 0, 0, size, size)

  const blob = await canvas.convertToBlob({
    type: file.type || 'image/jpeg',
    quality: 0.9,
  })

  return new File([blob], file.name, { type: blob.type })
}

export async function cropImagesToSquare(files: File[]): Promise<File[]> {
  return Promise.all(files.map(cropImageToSquare))
}
