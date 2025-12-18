const R2_BASE = import.meta.env.VITE_R2_PUBLIC_URL || ''

/**
 * Build an absolute asset URL using Cloudflare R2 public base URL (VITE_R2_PUBLIC_URL).
 *
 * - If VITE_R2_PUBLIC_URL is not set, falls back to local `/public` paths.
 * - Leaves absolute URLs (http/https), data/blob URLs, and hash links unchanged.
 * - URL-encodes spaces and other safe characters.
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

  // Normalize path (strip leading slash so we can join safely)
  const normalized = inputPath.startsWith('/') ? inputPath.slice(1) : inputPath

  // If no R2 base provided, serve from /public
  if (!R2_BASE) {
    return encodeURI(`/${normalized}`)
  }

  const base = R2_BASE.endsWith('/') ? R2_BASE.slice(0, -1) : R2_BASE
  return encodeURI(`${base}/${normalized}`)
}


