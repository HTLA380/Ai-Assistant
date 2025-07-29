/**
 * Safely gets a cookie value by name
 * Returns null if running on server or cookie not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }
  return null
}

/**
 * Safely gets and parses a JSON cookie value
 * Returns null if cookie doesn't exist, can't be parsed, or running on server
 */
export function getJsonCookie<T = any>(name: string): T | null {
  const cookieValue = getCookie(name)
  if (!cookieValue) return null

  try {
    return JSON.parse(decodeURIComponent(cookieValue))
  } catch (error) {
    console.error(`Failed to parse JSON cookie "${name}":`, error)
    return null
  }
}
