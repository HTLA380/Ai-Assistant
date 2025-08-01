"use client"

import React, { useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button, ScrollArea, tabsStyles } from "@mijn-ui/react"
import { Menu, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarIcon,
  SidebarItem,
  SidebarProvider,
  SidebarToggler,
} from "@/components/sidebar"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { SIDEBAR_NAV_ITEMS } from "../constants"
import { updateResizableLayoutCookie } from "../utils/cookies/client"
import { AppLayoutCookieData } from "../utils/cookies/constants"
import { AppLayoutPanelViewProvider, AppLayoutPanelViewTrigger } from "./panel-view-provider"
import {
  ResizableLayoutClose,
  ResizableLayoutContent,
  ResizableLayoutGroup,
  ResizableLayoutOpen,
  ResizableLayoutPanel,
  ResizableLayoutProvider,
} from "./resizable-layout"
import { useIsMobile } from "@/hooks/use-screen-sizes"

/* -------------------------------------------------------------------------- */
/*                                 Constants                                  */
/* -------------------------------------------------------------------------- */

const LAYOUT_CONFIG = {
  panelId: "left_panel",
  mainAreaPadding: "0.5rem",
  headerHeight: "3.5rem",
  drawerMaxHeight: "70vh",
} as const

const DEFAULT_LAYOUT_VALUES: AppLayoutCookieData = {
  activeView: "history",
  panels: { [LAYOUT_CONFIG.panelId]: false },
  sizes: [0, 100],
}

/* -------------------------------------------------------------------------- */

export type AppLayoutProps = {
  defaultValues?: AppLayoutCookieData
  panelSlot?: React.ReactNode
  headerSlot?: React.ReactNode
  children: React.ReactNode
}

const AppLayout = ({ children, defaultValues = DEFAULT_LAYOUT_VALUES, panelSlot, headerSlot }: AppLayoutProps) => {
  const isMobile = useIsMobile()

  // Memoized event handlers to prevent unnecessary re-renders
  const handlePanelChange = useCallback((panels: Record<string, boolean>) => {
    updateResizableLayoutCookie({ panels })
  }, [])

  const handleLayoutChange = useCallback((sizes: number[]) => {
    updateResizableLayoutCookie({ sizes })
  }, [])

  const cssVariables = {
    "--main-area-padding": LAYOUT_CONFIG.mainAreaPadding,
    "--header-height": LAYOUT_CONFIG.headerHeight,
  } as React.CSSProperties

  return (
    <AppLayoutPanelViewProvider defaultActiveView={defaultValues.activeView}>
      <ResizableLayoutProvider defaultPanels={defaultValues.panels} onPanelChange={handlePanelChange}>
        <SidebarProvider>
          <div className="flex h-svh w-full bg-background" style={cssVariables}>
            {!isMobile && <AppLayoutSidebar />}

            <div className="h-full grow md:p-[var(--main-area-padding)]">
              <main className="size-full bg-secondary md:rounded-md">
                <ResizableLayoutGroup
                  defaultLayout={defaultValues.sizes}
                  onLayoutChange={handleLayoutChange}
                  direction="horizontal">
                  {/* Panel persists in DOM to maintain state */}
                  <PanelContent panelSlot={panelSlot} />

                  <ResizableLayoutContent disableTransition className="relative w-screen md:w-full">
                    {isMobile ? (
                      <MobileHeader headerSlot={headerSlot} panelSlot={panelSlot} />
                    ) : (
                      <DesktopHeader headerSlot={headerSlot} />
                    )}

                    {children}
                  </ResizableLayoutContent>
                </ResizableLayoutGroup>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ResizableLayoutProvider>
    </AppLayoutPanelViewProvider>
  )
}

export { AppLayout }

/* -------------------------------------------------------------------------- */

type MobileHeaderProps = {
  headerSlot?: React.ReactNode
  panelSlot?: React.ReactNode
}

const MobileHeader = ({ headerSlot, panelSlot }: MobileHeaderProps) => (
  <div className="sticky z-50 flex h-[var(--header-height)] items-center justify-between bg-secondary px-4">
    <Drawer>
      <DrawerTrigger asChild>
        <Button iconOnly size="sm" variant="ghost" className="text-xl">
          <Menu />
          <span className="sr-only">Open menu</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="z-[99] flex w-full flex-col">
        <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>

        <div className={tabsStyles().list({ className: "flex-row" })}>
          {SIDEBAR_NAV_ITEMS.filter((item) => item.panelViewId).map((item) => (
            <AppLayoutPanelViewTrigger key={item.panelViewId} value={item.panelViewId!} asChild>
              <button className={tabsStyles().trigger({ className: "w-full" })}>
                <item.icon />
                <span className="text-xs">{item.title}</span>
              </button>
            </AppLayoutPanelViewTrigger>
          ))}
        </div>

        <ScrollArea className={`h-[${LAYOUT_CONFIG.drawerMaxHeight}] overflow-y-auto`}>{panelSlot}</ScrollArea>
      </DrawerContent>
    </Drawer>

    <div className="flex items-center gap-2">{headerSlot}</div>
  </div>
)

/* -------------------------------------------------------------------------- */

type DesktopHeaderProps = {
  headerSlot?: React.ReactNode
}

const DesktopHeader = ({ headerSlot }: DesktopHeaderProps) => (
  <div className="absolute inset-x-0 top-4 z-50 flex h-[var(--header-height)] w-full items-center justify-end bg-transparent px-6">
    {headerSlot}
  </div>
)

/* -------------------------------------------------------------------------- */

type PanelContentProps = {
  panelSlot?: React.ReactNode
}

const PanelContent = ({ panelSlot }: PanelContentProps) => (
  <ResizableLayoutPanel className="hidden md:block" id={LAYOUT_CONFIG.panelId} side="left">
    <header className="flex items-center justify-end p-2">
      <ResizableLayoutClose asChild id={LAYOUT_CONFIG.panelId}>
        <Button variant="ghost" iconOnly>
          <X />
          <span className="sr-only">Close Panel</span>
        </Button>
      </ResizableLayoutClose>
    </header>

    <div className="hidden size-full md:block">{panelSlot}</div>
  </ResizableLayoutPanel>
)

/* -------------------------------------------------------------------------- */

const AppLayoutSidebar = () => {
  const renderSidebarItem = useCallback((item: (typeof SIDEBAR_NAV_ITEMS)[0]) => {
    const Icon = item.icon
    const key = item.panelViewId || item.title

    // Regular navigation items
    if (!item.panelViewId) {
      return (
        <SidebarItem asChild key={key} tooltip={item.tooltip}>
          <Link href={item.href ?? "#"}>
            <SidebarIcon>
              <Icon />
            </SidebarIcon>
            <span className="text-xs">{item.title}</span>
          </Link>
        </SidebarItem>
      )
    }

    // Panel view items
    return (
      <ResizableLayoutOpen id={LAYOUT_CONFIG.panelId} key={key} asChild>
        <AppLayoutPanelViewTrigger value={item.panelViewId} asChild>
          <SidebarItem tooltip={item.tooltip}>
            <SidebarIcon>
              <Icon />
            </SidebarIcon>
            <span className="text-xs">{item.title}</span>
          </SidebarItem>
        </AppLayoutPanelViewTrigger>
      </ResizableLayoutOpen>
    )
  }, [])

  return (
    <>
      <Sidebar className="shrink-0">
        <SidebarContent>
          <SidebarIcon asChild>
            <Link
              href="/chat"
              className="flex size-11 items-center justify-center rounded-md !p-1.5"
              aria-label="Picosbs Home">
              <Image src="/images/picosbs.png" width={44} height={44} alt="Picosbs" priority />
            </Link>
          </SidebarIcon>

          {SIDEBAR_NAV_ITEMS.map(renderSidebarItem)}
        </SidebarContent>
      </Sidebar>

      <SidebarToggler className="fixed bottom-6 left-6 z-50 bg-background text-lg text-secondary-foreground transition-all duration-300 hover:text-foreground data-[state=open]:bottom-4 data-[state=open]:left-5" />
    </>
  )
}
