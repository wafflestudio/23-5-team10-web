export async function cropImageToSquare(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file)
  const { width, height } = imageBitmap

  const size = Math.max(width, height)

  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, size, size)

  const offsetX = (size - width) / 2
  const offsetY = (size - height) / 2
  ctx.drawImage(imageBitmap, offsetX, offsetY)

  const blob = await canvas.convertToBlob({
    type: file.type || 'image/jpeg',
    quality: 0.9,
  })

  return new File([blob], file.name, { type: blob.type })
}

export async function cropImagesToSquare(files: File[]): Promise<File[]> {
  return Promise.all(files.map(cropImageToSquare))
}
