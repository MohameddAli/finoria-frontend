/**
 * Get authorization headers (Client-side only - SPA mode)
 * الحصول على ترويسات المصادقة (Client-side فقط)
 * 
 * Reads token from localStorage only
 * 
 * @returns Headers object with Authorization if token exists
 * 
 * @example
 * const headers = getAuthHeaders()
 * // { 'Accept': 'application/json', 'Authorization': 'Bearer token...' }
 */
export const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  
  // Client-side only: read from localStorage
  if (import.meta.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}
