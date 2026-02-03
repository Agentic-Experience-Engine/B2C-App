export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return ''
  }

  return process.env.NEXT_AUTH_URL || 'http://localhost:3000'
}
