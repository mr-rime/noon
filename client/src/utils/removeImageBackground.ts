const processedImageCache = new Map<string, string>()

export async function removeImageBackground(imageSrc: string): Promise<string> {
  if (processedImageCache.has(imageSrc)) {
    return processedImageCache.get(imageSrc)!
  }

  const img = await loadImage(imageSrc)
  const scale = 0.5
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth * scale
  canvas.height = img.naturalHeight * scale
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixelCount = data.length / 4

  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4
    const r = data[idx],
      g = data[idx + 1],
      b = data[idx + 2]
    if (Math.abs(r - 255) < 10 && Math.abs(g - 255) < 10 && Math.abs(b - 255) < 10) {
      data[idx + 3] = 0
    }
    if (i % 5000 === 0) await new Promise((r) => setTimeout(r, 0))
  }

  ctx.putImageData(new ImageData(data, width, height), 0, 0)

  const blob: Blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'))
  const url = URL.createObjectURL(blob)
  processedImageCache.set(imageSrc, url)
  return url
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
