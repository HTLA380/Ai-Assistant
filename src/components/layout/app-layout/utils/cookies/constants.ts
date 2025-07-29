import { PanelViewType } from "../../constants"

export const APP_LAYOUT_COOKIE_NAME = "app_layout"
export const APP_LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export type AppLayoutCookieData = {
  panels: Record<string, boolean>
  sizes: number[]
  activeView: PanelViewType | null
}

export const defaultCookieData: AppLayoutCookieData = {
  panels: {},
  sizes: [],
  activeView: null,
}
