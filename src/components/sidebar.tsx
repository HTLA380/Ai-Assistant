"use client"

import { useCallback } from "react"
import { createContext } from "@/utils/create-context"
import { Button, buttonStyles, cn } from "@mijn-ui/react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useControlledState } from "@/hooks/use-controlled-state"
import { Tooltip } from "@/components/tooltip-wrapper"

const SIDEBAR_WIDTH = "4.5rem"

/* -------------------------------------------------------------------------- */

type SidebarContextType = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const [SidebarContextProvider, useSidebarContext] = createContext<SidebarContextType>({
  name: "SidebarContext",
  strict: true,
  errorMessage: "useSidebarContext: `context` is undefined. Ensure the component is wrapped within <Sidebar />",
})

/* -------------------------------------------------------------------------- */
/*                             SidebarProvider                             */
/* -------------------------------------------------------------------------- */

type SidebarProviderProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
} & React.ComponentPropsWithRef<"div">

const SidebarProvider = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = true,
  ...props
}: SidebarProviderProps) => {
  const [open, _setOpen] = useControlledState(controlledOpen, defaultOpen, onOpenChange)

  const setOpen = useCallback(
    (open: boolean) => {
      _setOpen(open)
    },
    [_setOpen],
  )

  return (
    <SidebarContextProvider value={{ open, onOpenChange: setOpen }}>
      <div
        data-state={open ? "open" : "closed"}
        className="size-full"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
          } as React.CSSProperties
        }
        {...props}
      />
    </SidebarContextProvider>
  )
}

const Sidebar = ({ className, ...props }: React.ComponentProps<"aside">) => {
  const { open } = useSidebarContext()

  return (
    <aside
      data-state={open ? "open" : "closed"}
      className={cn(
        "h-full overflow-hidden py-4 transition-all duration-300 data-[state=closed]:w-0 data-[state=open]:w-[var(--sidebar-width)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

const SidebarContent = ({ className, ...props }: React.ComponentPropsWithRef<"div">) => {
  return <div className={cn("flex size-full flex-col items-center gap-4", className)} {...props} />
}

type SidebarItemProps = React.ComponentPropsWithRef<"button"> & {
  tooltip?: string
  asChild?: boolean
}

const SidebarItem = ({ tooltip, asChild, className, ...props }: SidebarItemProps) => {
  const Comp = asChild ? Slot : "button"

  const content = (
    <Comp
      className={cn("flex flex-col items-center text-secondary-foreground hover:text-foreground", className)}
      {...props}
    />
  )

  return tooltip ? <Tooltip content={tooltip}>{content}</Tooltip> : content
}

const SidebarIcon = ({
  className,
  asChild,
  ...props
}: React.ComponentPropsWithRef<"span"> & {
  asChild?: boolean
}) => {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      className={cn(
        buttonStyles().base({
          variant: "ghost",
          iconOnly: true,
        }),
        "text-lg text-current group-hover:bg-secondary",
        className,
      )}
      {...props}
    />
  )
}

const SidebarToggler = ({ className, onClick, ...props }: React.ComponentPropsWithRef<typeof Button>) => {
  const { open, onOpenChange } = useSidebarContext()

  return (
    <Tooltip content={open ? "Close Sidebar" : "Open Sidebar"}>
      <Button
        data-state={open ? "open" : "closed"}
        variant="ghost"
        className={cn("", className)}
        iconOnly
        onClick={(e) => {
          onClick?.(e)
          onOpenChange(!open)
        }}
        {...props}>
        {open ? <PanelLeftClose /> : <PanelLeftOpen />}
      </Button>
    </Tooltip>
  )
}

export { SidebarProvider, Sidebar, SidebarContent, SidebarItem, SidebarIcon, SidebarToggler, useSidebarContext }
