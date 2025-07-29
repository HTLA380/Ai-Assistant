"use client"

import { createContext } from "@/utils/create-context"
import React, { useCallback, useState } from "react"
import { PanelViewType } from "../constants"
import { Slot } from "@radix-ui/react-slot"
import { updateResizableLayoutCookie } from "../utils/cookies/client"

type AppLayoutPanelViewContextType = {
  activePanelView: string | null
  setActivePanelView: (panel: PanelViewType | null) => void
}

const [AppLayoutPanelViewContextProvider, useAppLayoutPanelViewContext] = createContext<AppLayoutPanelViewContextType>({
  name: "AppLayoutPanelContext",
  strict: true,
})

export type AppLayoutPanelViewProviderProps = {
  defaultActiveView: PanelViewType | null
  children: React.ReactNode
}

const AppLayoutPanelViewProvider = ({ defaultActiveView, children }: AppLayoutPanelViewProviderProps) => {
  const [activePanelView, setActivePanelView] = useState<PanelViewType | null>(defaultActiveView)

  const handleSetActivePanel = useCallback((panel: PanelViewType | null) => {
    setActivePanelView(panel)
    updateResizableLayoutCookie({ activeView: panel })
  }, [])

  return (
    <AppLayoutPanelViewContextProvider
      value={{
        activePanelView,
        setActivePanelView: handleSetActivePanel,
      }}>
      {children}
    </AppLayoutPanelViewContextProvider>
  )
}

/* -------------------------------------------------------------------------- */

const AppLayoutPanelViewTrigger = ({
  asChild,
  onClick,
  value,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean; value: PanelViewType }) => {
  const Comp = asChild ? Slot : "button"

  const { activePanelView, setActivePanelView } = useAppLayoutPanelViewContext()

  return (
    <Comp
      onClick={(e) => {
        onClick?.(e)
        setActivePanelView(value)
      }}
      data-state={activePanelView === value ? "active" : "inactive"}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */

const AppLayoutPanelViewContent = ({ value, ...props }: React.ComponentProps<"div"> & { value: PanelViewType }) => {
  const { activePanelView } = useAppLayoutPanelViewContext()

  if (activePanelView !== value) return null

  return <div {...props} />
}

export {
  AppLayoutPanelViewProvider,
  useAppLayoutPanelViewContext,
  AppLayoutPanelViewTrigger,
  AppLayoutPanelViewContent,
}
