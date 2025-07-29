"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { createTVUnstyledSlots } from "@mijn-ui/react"
import { useTVUnstyled } from "@mijn-ui/react-hooks"
import { UnstyledComponentWithSlots, UnstyledProps, VariantProps, cn, tv } from "@mijn-ui/react"
import { createContext } from "@/utils/create-context"

/* -------------------------------------------------------------------------- */
/*                              Resizable Styles                              */
/* -------------------------------------------------------------------------- */

const resizableStyles = tv({
  slots: {
    group: "flex size-full",
    panel: "",
    handle:
      "focus-visible:ring-ring relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1",
    iconWrapper: "rounded-small z-10 flex h-4 w-3 items-center justify-center border bg-border",
    icon: "size-2.5",
  },

  variants: {
    direction: {
      horizontal: {
        group: "flex-row",
        handle: "",
      },
      vertical: {
        group: "flex-col",
        handle: "h-px w-full after:left-0 after:h-1 after:w-full after:-translate-y-1/2 after:translate-x-0",
        iconWrapper: "rotate-90",
      },
    },
  },
})

export type ResizableSlots = keyof ReturnType<typeof resizableStyles>
export type ResizableVariantProps = VariantProps<typeof resizableStyles>

/* -------------------------------------------------------------------------- */
/*                             Resizeable Context                             */
/* -------------------------------------------------------------------------- */

type ResizableBaseProps = UnstyledComponentWithSlots<ResizableSlots>

type ResizableContextType = ResizableBaseProps & {
  styles: ReturnType<typeof resizableStyles>
}

const [ResizableProvider, useResizableContext] = createContext<ResizableContextType>({
  name: "ResizableContext",
  strict: true,
  errorMessage:
    "useResizableContext: `context` is undefined. Ensure the component is wrapped within <ResizablePanelGroup />",
})

/* -------------------------------------------------------------------------- */
/*                               Resizable Hook                               */
/* -------------------------------------------------------------------------- */

const useResizableStyles = (unstyledOverride?: boolean) => {
  const context = useResizableContext()
  const unstyledSlots = useTVUnstyled(context, unstyledOverride)

  return { ...unstyledSlots, classNames: context.classNames }
}

/* -------------------------------------------------------------------------- */
/*                             ResizablePanelGroup                            */
/* -------------------------------------------------------------------------- */

export type ResizablePanelGroupProps = React.ComponentPropsWithRef<typeof ResizablePrimitive.PanelGroup> &
  ResizableVariantProps &
  ResizableBaseProps

const ResizablePanelGroup = ({
  className,
  classNames,
  unstyled,
  direction = "horizontal",
  ...props
}: ResizablePanelGroupProps) => {
  const styles = resizableStyles({ direction })
  const { group } = createTVUnstyledSlots({ group: styles.group }, unstyled)

  return (
    <ResizableProvider value={{ classNames, unstyled, styles }}>
      <ResizablePrimitive.PanelGroup
        className={group({ className: cn(classNames?.group, className) })}
        direction={direction}
        {...props}
      />
    </ResizableProvider>
  )
}

/* -------------------------------------------------------------------------- */
/*                               ResizablePanel                               */
/* -------------------------------------------------------------------------- */

export type ResizablePanelProps = React.ComponentPropsWithRef<typeof ResizablePrimitive.Panel> & UnstyledProps

const ResizablePanel = ({ className, unstyled, ...props }: ResizablePanelProps) => {
  const { panel, classNames } = useResizableStyles(unstyled)

  return <ResizablePrimitive.Panel className={panel({ className: cn(classNames?.panel, className) })} {...props} />
}

/* -------------------------------------------------------------------------- */
/*                               ResizableHandle                              */
/* -------------------------------------------------------------------------- */

export type ResizableHandleProps = React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> &
  UnstyledProps & {
    withHandle?: boolean
  }

const ResizableHandle = ({ withHandle, unstyled, className, ...props }: ResizableHandleProps) => {
  const { handle, iconWrapper, icon, classNames } = useResizableStyles(unstyled)

  return (
    <ResizablePrimitive.PanelResizeHandle
      className={handle({ className: cn(classNames?.handle, className) })}
      {...props}>
      {withHandle && (
        <div className={iconWrapper({ className: classNames?.iconWrapper })}>
          <GripVertical className={icon({ className: classNames?.icon })} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
