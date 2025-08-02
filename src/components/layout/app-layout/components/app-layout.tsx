"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button, ScrollArea, tabsStyles } from "@mijn-ui/react"
import { Menu, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-screen-sizes"
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

/* -------------------------------------------------------------------------- */
/*                                 Constants                                  */
/* -------------------------------------------------------------------------- */

const RESIZABLE_LAYOUT_PANEL_ID = "left_panel"

const MAIN_AREA_PADDING = "0.5rem"
const HEADER_HEIGHT = "3.5rem"

const DEFAULT_LAYOUT_VALUES: AppLayoutCookieData = {
  activeView: "history",
  panels: { [RESIZABLE_LAYOUT_PANEL_ID]: false },
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

  const handlePanelChange = (panels: Record<string, boolean>) => {
    updateResizableLayoutCookie({ panels })
  }

  const handleLayoutChange = (sizes: number[]) => {
    updateResizableLayoutCookie({ sizes })
  }

  return (
    <AppLayoutPanelViewProvider defaultActiveView={defaultValues.activeView}>
      <ResizableLayoutProvider defaultPanels={defaultValues.panels} onPanelChange={handlePanelChange}>
        <SidebarProvider>
          <div
            className="flex h-svh w-full bg-background"
            style={
              {
                "--main-area-padding": MAIN_AREA_PADDING,
                "--header-height": HEADER_HEIGHT,
              } as React.CSSProperties
            }>
            {!isMobile && <AppLayoutSidebar />}

            <div className="h-full grow md:p-[var(--main-area-padding)]">
              <main className="size-full bg-secondary md:rounded-md">
                <ResizableLayoutGroup
                  defaultLayout={defaultValues.sizes}
                  onLayoutChange={handleLayoutChange}
                  direction="horizontal">
                  <ResizableLayoutPanel className="hidden md:block" id={RESIZABLE_LAYOUT_PANEL_ID} side="left">
                    <header className="flex items-center justify-end p-2">
                      <ResizableLayoutClose asChild id={RESIZABLE_LAYOUT_PANEL_ID}>
                        <Button variant="ghost" iconOnly>
                          <X />
                          <span className="sr-only">Close Panel</span>
                        </Button>
                      </ResizableLayoutClose>
                    </header>

                    {!isMobile && <div className="hidden size-full md:block">{panelSlot}</div>}
                  </ResizableLayoutPanel>

                  <ResizableLayoutContent disableTransition className="relative w-screen md:w-full">
                    <div className="sticky inset-x-0 z-50 flex h-[var(--header-height)] w-full items-center justify-between bg-secondary px-4 md:absolute md:top-4 md:justify-end md:bg-transparent md:px-6">
                      {/* Mobile Header Menu */}
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button iconOnly size="sm" variant="ghost" className="text-xl md:hidden">
                            <Menu />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DrawerTrigger>

                        {isMobile && (
                          <DrawerContent className="z-[99] flex w-full flex-col md:hidden">
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

                            <ScrollArea className="h-[70svh] overflow-y-auto">{panelSlot}</ScrollArea>
                          </DrawerContent>
                        )}
                      </Drawer>

                      {headerSlot}
                    </div>

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

const AppLayoutSidebar = () => {
  const renderSidebarItem = (item: (typeof SIDEBAR_NAV_ITEMS)[0]) => {
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
      <ResizableLayoutOpen id={RESIZABLE_LAYOUT_PANEL_ID} key={key} asChild>
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
  }

  return (
    <>
      <Sidebar className="hidden shrink-0 md:block">
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
