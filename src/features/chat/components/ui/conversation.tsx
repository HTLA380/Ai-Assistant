"use client"

import type { ComponentProps } from "react"
import { useCallback } from "react"
import { Button, cn } from "@mijn-ui/react"
import { ArrowDownIcon } from "lucide-react"
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom"

export type AIConversationProps = ComponentProps<typeof StickToBottom>

export const AIConversation = ({ className, ...props }: AIConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
)

export type AIConversationContentProps = ComponentProps<typeof StickToBottom.Content>

export const AIConversationContent = ({ className, ...props }: AIConversationContentProps) => (
  <StickToBottom.Content className={cn("p-4", className)} {...props} />
)

export const AIConversationScrollButton = ({ className, onClick, ...props }: React.ComponentProps<typeof Button>) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom()
  }, [scrollToBottom])

  return (
    <Button
      className={cn(
        "absolute bottom-4 left-1/2 translate-x-1/2 rounded-full transition-all duration-300 ease-in-out",
        isAtBottom ? "pointer-events-none translate-y-4 opacity-0" : "pointer-events-auto opacity-100",
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
        handleScrollToBottom()
      }}
      iconOnly
      type="button"
      {...props}>
      <ArrowDownIcon className="size-4" />
    </Button>
  )
}
