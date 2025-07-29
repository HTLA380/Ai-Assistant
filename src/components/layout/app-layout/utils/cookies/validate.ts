import { PANEL_VIEWS, PanelViewType } from "../../constants"

//!! We validate cookie values because they come from the client side,
// and can be tampered with. This prevents layout flicker or unexpected views
// caused by malformed or malicious cookie data. !!

/**
 * Validates and sanitizes the panels object
 */
export function validatePanels(panels: any): Record<string, boolean> {
  if (typeof panels !== "object" || panels === null) return {}

  const validatePanels: Record<string, boolean> = {}

  for (const [key, value] of Object.entries(panels)) {
    if (typeof key === "string" && typeof value === "boolean") {
      validatePanels[key] = value
    }
  }
  return validatePanels
}

/**
 * Validates and sanitizes the sizes array
 */
export function validateSizes(sizes: any): number[] {
  if (!Array.isArray(sizes)) return []
  return sizes.filter((size) => typeof size === "number" && size >= 0 && isFinite(size))
}

/**
 * Validates the activeView string
 */
export function validateActiveView(activeView: any): PanelViewType | null {
  if (
    typeof activeView === "string" &&
    activeView.trim().length > 0 &&
    Object.values(PANEL_VIEWS).includes(activeView.trim() as PanelViewType)
  ) {
    return activeView.trim() as PanelViewType
  }
  return null
}
