"use client"

import { cn } from "@mijn-ui/react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { ImperativePanelHandle } from "react-resizable-panels"
import { Button } from "@mijn-ui/react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useControlledState } from "@/hooks/use-controlled-state"

/* -------------------------------------------------------------------------- */
/*                           ResizableLayoutContext                           */
/* -------------------------------------------------------------------------- */

type ResizableLayoutPanelState = {
  [id: string]: boolean
}

type ResizableLayoutContextType = {
  panels: ResizableLayoutPanelState
  togglePanel: (id: string) => void
  openPanel: (id: string) => void
  closePanel: (id: string) => void
}

const ResizableLayoutContext = createContext<ResizableLayoutContextType | null>(null)

function useResizableLayoutContext() {
  const context = useContext(ResizableLayoutContext)
  if (!context) {
    throw new Error("useResizableLayoutContext must be used within a ResizableLayoutProvider.")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/*                           ResizableLayoutProvider                          */
/* -------------------------------------------------------------------------- */

export type ResizableLayoutProviderProps = {
  panels?: ResizableLayoutPanelState
  defaultPanels?: ResizableLayoutPanelState
  onPanelChange?: (panels: ResizableLayoutPanelState) => void
  children: React.ReactNode
}

const ResizableLayoutProvider = ({
  panels: controlledPanels,
  defaultPanels = {},
  onPanelChange,
  children,
}: ResizableLayoutProviderProps) => {
  const [panels, setPanels] = useControlledState(controlledPanels, defaultPanels, onPanelChange)

  const setPanelState = useCallback(
    (id: string, isOpen: boolean) => {
      const newState = { ...panels, [id]: isOpen }
      setPanels(newState)
    },
    [panels, setPanels],
  )

  const togglePanel = useCallback(
    (id: string) => {
      setPanelState(id, !panels[id])
    },
    [panels, setPanelState],
  )

  const openPanel = useCallback(
    (id: string) => {
      setPanelState(id, true)
    },
    [setPanelState],
  )

  const closePanel = useCallback(
    (id: string) => {
      setPanelState(id, false)
    },
    [setPanelState],
  )

  return (
    <ResizableLayoutContext.Provider value={{ panels, togglePanel, openPanel, closePanel }}>
      {children}
    </ResizableLayoutContext.Provider>
  )
}
/* -------------------------------------------------------------------------- */
/*                            ResizableLayoutGroup                            */
/* -------------------------------------------------------------------------- */

// Renamed `onLayout` to `onLayoutChange` for consistency and clarity across the codebase.
export type ResizableLayoutGroupProps = Omit<React.ComponentProps<typeof ResizablePanelGroup>, "onLayout"> & {
  defaultLayout?: number[]
  onLayoutChange?: (sizes: number[]) => void
}

const ResizableLayoutGroup = ({
  children,
  onLayoutChange,
  defaultLayout: layout,
  ...props
}: ResizableLayoutGroupProps) => {
  const handleOnLayout = (sizes: number[]) => {
    onLayoutChange?.(sizes)
  }

  let panelIndex = 0

  const kids = React.Children.map(children, (child) => {
    const isValid = React.isValidElement(child)

    if (!isValid) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[ResizableLayoutGroup]: One or more children are not valid React elements. " +
            "Only <ResizableLayoutPanel> and <ResizableLayoutContent> are supported as children. " +
            "Unexpected children may cause layout flickering or hydration issues.",
        )
      }
      return child
    }

    const newProps: { defaultSize?: number } = {}
    if (layout?.[panelIndex] !== undefined) {
      newProps.defaultSize = layout[panelIndex]
    }
    panelIndex++

    return React.cloneElement(child, newProps)
  })

  return (
    <ResizablePanelGroup onLayout={handleOnLayout} {...props}>
      {kids}
    </ResizablePanelGroup>
  )
}

/* -------------------------------------------------------------------------- */
/*                            ResizableLayoutPanel                            */
/* -------------------------------------------------------------------------- */

export type ResizableLayoutPanelProps = {
  id: string
  minSize?: number
  side: "left" | "right"
  collapseOnResize?: boolean
  disableTransition?: boolean
} & React.ComponentProps<typeof ResizablePanel>

const ResizableLayoutPanel = ({
  id,
  className,
  children,
  minSize = 20,
  defaultSize = 25,
  maxSize = 30,
  side,
  collapseOnResize = false,
  disableTransition = false,
  ...props
}: ResizableLayoutPanelProps) => {
  const panelRef = useRef<ImperativePanelHandle>(null)
  const [isResizing, setIsResizing] = useState(false)
  const { panels, openPanel, closePanel } = useResizableLayoutContext()

  const isOpen = panels[id] ?? false

  useEffect(() => {
    const panel = panelRef.current

    if (!panel) return

    if (isOpen && panel.isCollapsed()) {
      console.log("isOpen = true and panel is collapsed, now expending the panel")
      panel.expand()
    } else if (!isOpen && !panel.isCollapsed()) {
      console.log("isOpen = false and panel is expended, now collapsing the panel")
      panel.collapse()
    }
  }, [isOpen])

  const resizableHandle = (
    <ResizableHandle
      className={cn(
        "pointer-events-none relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10",
        isOpen && "hidden aria-[valuenow=0]:hidden md:block",
        side === "left" ? "after:-translate-x-px" : "after:-translate-x-1",
      )}
      onDragging={setIsResizing}
    />
  )

  const handleResize = (size: number) => {
    // Prevent collapsing below minSize unless intended
    if (size < minSize && panelRef.current && isResizing && !collapseOnResize) {
      panelRef.current.resize(minSize)
    }
  }

  return (
    <>
      {side === "right" && resizableHandle}
      <ResizablePanel
        ref={panelRef}
        className={cn(
          isOpen && side === "right" && "border-l",
          isOpen && side === "left" && "border-r",
          !disableTransition && !isResizing && "transition-[flex] duration-300 ease-in-out",
          className,
        )}
        minSize={minSize}
        defaultSize={defaultSize}
        maxSize={maxSize}
        collapsible
        onResize={handleResize}
        onCollapse={() => {
          if (collapseOnResize && isOpen) closePanel(id)
        }}
        onExpand={() => {
          if (collapseOnResize && !isOpen) openPanel(id)
        }}
        data-state={isOpen ? "open" : "closed"}
        {...props}>
        {children}
      </ResizablePanel>
      {side === "left" && resizableHandle}
    </>
  )
}

ResizableLayoutPanel.displayName = "ResizableLayoutPanel"

/* -------------------------------------------------------------------------- */
/*                           ResizableLayoutContent                           */
/* -------------------------------------------------------------------------- */

export type ResizableLayoutContentProps = React.ComponentProps<typeof ResizablePanel> & {
  disableTransition?: boolean
}

const ResizableLayoutContent = ({
  defaultSize = 75,
  minSize = 70,
  maxSize = 100,
  className,
  disableTransition = false,
  ...props
}: ResizableLayoutContentProps) => {
  return (
    <ResizablePanel
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      className={cn(!disableTransition && "transition-[flex] duration-300 ease-in-out", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                           ResizableLayoutTrigger                           */
/* -------------------------------------------------------------------------- */

export type ResizableLayoutTriggerProps = {
  id: string
} & React.ComponentProps<typeof Button>

const ResizableLayoutTrigger = ({ id, onClick, children, ...props }: ResizableLayoutTriggerProps) => {
  const { panels, togglePanel } = useResizableLayoutContext()
  const isOpen = panels[id] ?? false
  const buttonContent = isOpen ? <PanelLeftClose /> : <PanelLeftOpen />

  return (
    <Button
      onClick={(e) => {
        onClick?.(e)
        togglePanel(id)
      }}
      iconOnly
      data-state={isOpen ? "open" : "closed"}
      {...props}>
      {children ? children : buttonContent}
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*                      ResizableLayoutOpen / Close                           */
/* -------------------------------------------------------------------------- */

export type ResizableLayoutActionProps = {
  id: string
  asChild?: boolean
} & React.ComponentProps<"button">

const ResizableLayoutOpen = ({ id, onClick, asChild = false, ...props }: ResizableLayoutActionProps) => {
  const Comp = asChild ? Slot : "button"
  const { openPanel } = useResizableLayoutContext()

  return (
    <Comp
      onClick={(e) => {
        onClick?.(e)
        openPanel(id)
      }}
      {...props}
    />
  )
}

const ResizableLayoutClose = ({ id, onClick, asChild, ...props }: ResizableLayoutActionProps) => {
  const Comp = asChild ? Slot : "button"
  const { closePanel } = useResizableLayoutContext()

  return (
    <Comp
      onClick={(e) => {
        onClick?.(e)
        closePanel(id)
      }}
      {...props}
    />
  )
}

export {
  ResizableLayoutClose,
  ResizableLayoutContent,
  ResizableLayoutGroup,
  ResizableLayoutOpen,
  ResizableLayoutPanel,
  ResizableLayoutProvider,
  ResizableLayoutTrigger,
}
