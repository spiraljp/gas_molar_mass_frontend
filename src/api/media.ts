export function mediaUrl(value: string | null | undefined, fallback: string) {
  const localUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
  if (!value?.trim()) return localUrl(fallback)
  if (value.startsWith('/media/')) return localUrl(value)
  const url = new URL(value, window.location.origin)
  // Keep MinIO object names, bucket paths and signed query strings intact.
  if (url.port === '9000' || url.pathname.startsWith('/gas-media/')) {
    return `/s3${url.pathname}${url.search}`
  }
  if (url.pathname.startsWith('/static/')) return `/backend${url.pathname}${url.search}`
  return value
}
