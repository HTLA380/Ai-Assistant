"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarIcon,
  SidebarItem,
  SidebarProvider,
  SidebarToggler,
} from "@/components/sidebar"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button, ScrollArea, tabsStyles } from "@mijn-ui/react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useCallback } from "react"
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
/*                               Constants / IDs                              */
/* -------------------------------------------------------------------------- */

const MAIN_AREA_PADDING = "0.5rem"
const HEADER_HEIGHT = "3.5rem"
const RESIZABLE_LAYOUT_PANEL_ID = "left_panel"

/* -------------------------------------------------------------------------- */

export type AppLayoutProps = {
  defaultValues?: AppLayoutCookieData
  panelSlot?: React.ReactNode
  headerSlot?: React.ReactNode
  children: React.ReactNode
}

const appLayoutDefaultValues: AppLayoutCookieData = {
  activeView: null,
  panels: { [RESIZABLE_LAYOUT_PANEL_ID]: false },
  sizes: [0, 100],
}

const AppLayout = ({ children, defaultValues = appLayoutDefaultValues, panelSlot, headerSlot }: AppLayoutProps) => {
  const isMobile = useIsMobile()

  const onPanelChange = useCallback((panels: Record<string, boolean>) => {
    updateResizableLayoutCookie({ panels })
  }, [])

  return (
    <AppLayoutPanelViewProvider defaultActiveView={defaultValues.activeView}>
      <ResizableLayoutProvider defaultPanels={defaultValues.panels} onPanelChange={onPanelChange}>
        <SidebarProvider>
          <div
            className="flex h-screen w-full bg-background"
            style={
              {
                "--main-area-padding": MAIN_AREA_PADDING,
                "--header-height": HEADER_HEIGHT,
              } as React.CSSProperties
            }>
            {!isMobile && <AppLayoutSidebar />}

            <div className="h-full grow md:p-[var(--main-area-padding)]">
              {isMobile ? (
                <AppLayoutMobileContent panelSlot={panelSlot} headerSlot={headerSlot}>
                  {children}
                </AppLayoutMobileContent>
              ) : (
                <AppLayoutDesktopContent sizes={defaultValues.sizes} headerSlot={headerSlot} panelSlot={panelSlot}>
                  {children}
                </AppLayoutDesktopContent>
              )}
            </div>
          </div>
        </SidebarProvider>
      </ResizableLayoutProvider>
    </AppLayoutPanelViewProvider>
  )
}

export { AppLayout }

/* -------------------------------------------------------------------------- */
type AppLayoutDesktopContentProps = {
  sizes: AppLayoutCookieData["sizes"]
} & Pick<AppLayoutProps, "headerSlot" | "panelSlot" | "children">

const AppLayoutDesktopContent = ({ sizes, headerSlot, panelSlot, children }: AppLayoutDesktopContentProps) => {
  const onLayoutChange = useCallback((sizes: number[]) => {
    updateResizableLayoutCookie({ sizes })
  }, [])

  return (
    <main className="size-full rounded-md bg-secondary">
      <ResizableLayoutGroup defaultLayout={sizes} onLayoutChange={onLayoutChange} direction="horizontal">
        <ResizableLayoutPanel id={RESIZABLE_LAYOUT_PANEL_ID} side="left">
          <div className="flex items-center justify-end p-2">
            <ResizableLayoutClose asChild id={RESIZABLE_LAYOUT_PANEL_ID}>
              <Button variant="ghost" iconOnly>
                <X />
                <div className="sr-only">Close Panel</div>
              </Button>
            </ResizableLayoutClose>
          </div>

          {panelSlot}
        </ResizableLayoutPanel>

        <ResizableLayoutContent disableTransition className="relative">
          {/* Desktop Header */}
          <div className="absolute inset-x-0 top-4 z-50 flex h-[var(--header-height)] w-full items-center justify-end bg-transparent px-6">
            {headerSlot}
          </div>

          <div className="pt-[var(--header-height)]">{children}</div>
        </ResizableLayoutContent>
      </ResizableLayoutGroup>
    </main>
  )
}

/* -------------------------------------------------------------------------- */

type AppLayoutMobileContentProps = Pick<AppLayoutProps, "headerSlot" | "panelSlot" | "children">

const AppLayoutMobileContent = ({ headerSlot, panelSlot, children }: AppLayoutMobileContentProps) => {
  return (
    <main className="size-full bg-secondary md:rounded-md">
      <div className="relative">
        <div className="sticky z-50 flex h-[var(--header-height)] items-center justify-between bg-secondary px-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button iconOnly size="sm" variant="ghost" className="text-xl">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="z-[99] flex w-full flex-col">
              <DrawerTitle className="sr-only">Menu</DrawerTitle>
              <div className={tabsStyles().list({ className: "flex-row" })}>
                {SIDEBAR_NAV_ITEMS.map((item) => {
                  if (!item.panelViewId) return null

                  return (
                    <AppLayoutPanelViewTrigger key={item.panelViewId} value={item.panelViewId} asChild>
                      <button className={tabsStyles().trigger({ className: "w-full" })}>
                        <item.icon />
                        <p className="text-xs">{item.title}</p>
                      </button>
                    </AppLayoutPanelViewTrigger>
                  )
                })}
              </div>
              <ScrollArea className="h-[70vh] overflow-y-auto">{panelSlot}</ScrollArea>
            </DrawerContent>
          </Drawer>

          <div className="flex items-center gap-2">{headerSlot}</div>
        </div>

        <div>{children}</div>
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------- */

const AppLayoutSidebar = () => {
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarIcon asChild>
            <Link href="/chat" className="flex size-11 items-center justify-center rounded-md !p-1.5">
              <Image src="/images/picosbs.png" width={44} height={44} alt="Picosbs" />
            </Link>
          </SidebarIcon>
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            if (!item.panelViewId) {
              return (
                <SidebarItem asChild key={item.title} tooltip={item.tooltip}>
                  <Link href={item.href ?? "#"}>
                    <SidebarIcon>
                      <Icon />
                    </SidebarIcon>
                    <p className="text-xs">{item.title}</p>
                  </Link>
                </SidebarItem>
              )
            }

            return (
              <ResizableLayoutOpen id={RESIZABLE_LAYOUT_PANEL_ID} key={item.title} asChild>
                <AppLayoutPanelViewTrigger value={item.panelViewId} asChild>
                  <SidebarItem tooltip={item.tooltip}>
                    <SidebarIcon>
                      <Icon />
                    </SidebarIcon>
                    <p className="text-xs">{item.title}</p>
                  </SidebarItem>
                </AppLayoutPanelViewTrigger>
              </ResizableLayoutOpen>
            )
          })}
        </SidebarContent>
      </Sidebar>
      <SidebarToggler className="fixed bottom-6 left-6 z-50 bg-background text-lg text-secondary-foreground transition-all duration-300 hover:text-foreground data-[state=open]:bottom-4 data-[state=open]:left-5" />
    </>
  )
}
