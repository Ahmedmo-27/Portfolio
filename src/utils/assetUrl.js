const R2_BASE = import.meta.env.VITE_R2_PUBLIC_URL || ''

/**
 * Build an absolute asset URL using Cloudflare R2 via Worker.
 */
export function assetUrl(inputPath) {
  if (!inputPath) return inputPath

  // Already absolute / special schemes
  if (
    inputPath.startsWith('http://') ||
    inputPath.startsWith('https://') ||
    inputPath.startsWith('data:') ||
    inputPath.startsWith('blob:') ||
    inputPath.startsWith('#')
  ) {
    return inputPath
  }

  const normalized = inputPath.startsWith('/') ? inputPath.slice(1) : inputPath

  // Local fallback
  if (!R2_BASE) {
    return encodeURI(`/${normalized}`)
  }

  const base = R2_BASE.endsWith('/') ? R2_BASE.slice(0, -1) : R2_BASE
  return encodeURI(`${base}/${normalized}`)
}

/**
 * Convert an image URL to WebP format if possible.
 */
export function getWebPUrl(imageUrl) {
  if (!imageUrl) return imageUrl

  // Already optimized
  if (/\.(webp|avif)$/i.test(imageUrl)) return imageUrl

  // Skip data/blob
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    return imageUrl
  }

  const webpUrl = imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  // Local path → OK
  if (!imageUrl.startsWith('http')) {
    return webpUrl
  }

  // Worker-served R2 assets → OK
  if (R2_BASE && imageUrl.startsWith(R2_BASE)) {
    return webpUrl
  }

  // External URL → leave unchanged
  return imageUrl
}
