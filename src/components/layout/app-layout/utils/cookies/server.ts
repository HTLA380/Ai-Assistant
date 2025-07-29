import { cookies } from "next/headers"
import { APP_LAYOUT_COOKIE_NAME, AppLayoutCookieData, defaultCookieData } from "./constants"
import { validateActiveView, validatePanels, validateSizes } from "./validate"

/**
 * Reads and validates the resizable layout cookie from server-side headers.
 * If invalid or missing, returns the provided defaultData (if any),
 * or falls back to internal defaults.
 *
 * @param defaultData - Partial layout data to use as fallback.
 * @returns A complete, validated layout config.
 */
export async function getServerSideAppLayoutCookieData(
  defaultData: Partial<AppLayoutCookieData> = {},
): Promise<AppLayoutCookieData> {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(APP_LAYOUT_COOKIE_NAME)?.value

  if (!cookieValue) {
    return {
      ...defaultCookieData,
      ...defaultData,
    }
  }

  try {
    const parsedData: AppLayoutCookieData = JSON.parse(decodeURIComponent(cookieValue))

    return {
      panels: validatePanels(parsedData.panels) ?? defaultData.panels ?? defaultCookieData.panels,
      sizes: validateSizes(parsedData.sizes) ?? defaultData.sizes ?? defaultCookieData.sizes,
      activeView: validateActiveView(parsedData.activeView) ?? defaultData.activeView ?? defaultCookieData.activeView,
    }
  } catch (error) {
    console.error("Failed to parse server-side resizable layout cookie:", error)
    return {
      panels: defaultData.panels ?? defaultCookieData.panels,
      sizes: defaultData.sizes ?? defaultCookieData.sizes,
      activeView: defaultData.activeView ?? defaultCookieData.activeView,
    }
  }
}
