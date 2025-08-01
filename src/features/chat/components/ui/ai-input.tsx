"use client"

import type { ComponentProps, HTMLAttributes, KeyboardEventHandler } from "react"
import { useCallback, useEffect, useRef } from "react"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, cn } from "@mijn-ui/react"
import { Loader2Icon, SendIcon, Square, XIcon } from "lucide-react"

type UseAutoResizeTextareaProps = {
  minHeight: string
  maxHeight?: string
}

const useAutoResizeTextarea = ({ minHeight, maxHeight }: UseAutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = minHeight
        return
      }

      textarea.style.height = minHeight
      const newHeight = Math.max(
        convertToPx(minHeight),
        Math.min(textarea.scrollHeight, convertToPx(maxHeight) ?? Infinity),
      )

      textarea.style.height = `${newHeight}px`
      document.documentElement.style.setProperty("--prompt-area-height", `${newHeight}px`)
    },
    [minHeight, maxHeight],
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = minHeight
    }
  }, [minHeight])

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) return

    const handleInput = () => adjustHeight()

    const handleFocus = () => {
      setTimeout(() => {
        textarea.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 200)
    }

    textarea.addEventListener("input", handleInput)
    textarea.addEventListener("focus", handleFocus)

    return () => {
      textarea.removeEventListener("input", handleInput)
      textarea.removeEventListener("focus", handleFocus)
    }
  }, [adjustHeight])

  useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}

export type AIInputProps = HTMLAttributes<HTMLFormElement>

export const AIInput = ({ className, ...props }: AIInputProps) => (
  <form className={cn("w-full overflow-hidden rounded-xl border bg-background shadow-sm", className)} {...props} />
)

export type AIInputTextareaProps = ComponentProps<typeof Textarea> & {
  minHeight?: string
  maxHeight?: string
}

export const AIInputTextarea = ({
  onChange,
  className,
  placeholder = "What would you like to know?",
  minHeight = "80px",
  maxHeight = "164px",
  ...props
}: AIInputTextareaProps) => {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  })

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <textarea
      style={{
        minHeight,
      }}
      className={cn(
        "w-full resize-none rounded-none border-none p-4 text-sm shadow-none outline-none",
        "bg-transparent dark:bg-transparent",
        className,
      )}
      name="message"
      onChange={(e) => {
        adjustHeight()
        onChange?.(e)
      }}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      ref={textareaRef}
      {...props}
    />
  )
}

export type AIInputToolbarProps = HTMLAttributes<HTMLDivElement>

export const AIInputToolbar = ({ className, ...props }: AIInputToolbarProps) => (
  <div className={cn("flex items-center justify-between p-1", className)} {...props} />
)

export type AIInputToolsProps = HTMLAttributes<HTMLDivElement>

export const AIInputTools = ({ className, ...props }: AIInputToolsProps) => (
  <div className={cn("flex items-center", "[&_button:first-child]:rounded-bl-xl", className)} {...props} />
)

export type AIInputButtonProps = ComponentProps<typeof Button>

export const AIInputButton = ({ variant = "ghost", className, size, ...props }: AIInputButtonProps) => {
  return (
    <Button
      className={cn("shrink-0 gap-1.5", variant === "ghost" && "text-secondary-foreground", className)}
      type="button"
      size={size}
      variant={variant}
      {...props}
    />
  )
}

export type AIInputSubmitProps = ComponentProps<typeof Button> & {
  status?: "submitted" | "streaming" | "ready" | "error" | "loading-config"
}

export const AIInputSubmit = ({ className, variant = "default", status, children, ...props }: AIInputSubmitProps) => {
  let Icon = <SendIcon />

  if (status === "submitted") {
    Icon = <Loader2Icon className="animate-spin" />
  } else if (status === "streaming") {
    Icon = <Square className="bg-foreground" />
  } else if (status === "error") {
    Icon = <XIcon />
  }

  return (
    <Button
      className={cn("gap-1.5 rounded-lg rounded-br-xl", className)}
      type="submit"
      iconOnly
      variant={variant}
      {...props}>
      {children ?? Icon}
    </Button>
  )
}

export type AIInputModelSelectProps = ComponentProps<typeof Select>

export const AIInputModelSelect = (props: AIInputModelSelectProps) => <Select {...props} />

export type AIInputModelSelectTriggerProps = ComponentProps<typeof SelectTrigger>

export const AIInputModelSelectTrigger = ({ className, ...props }: AIInputModelSelectTriggerProps) => (
  <SelectTrigger
    className={cn(
      "border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors",
      'hover:bg-accent [&[aria-expanded="true"]]:bg-accent hover:text-foreground [&[aria-expanded="true"]]:text-foreground',
      className,
    )}
    {...props}
  />
)

export type AIInputModelSelectContentProps = ComponentProps<typeof SelectContent>

export const AIInputModelSelectContent = ({ className, ...props }: AIInputModelSelectContentProps) => (
  <SelectContent className={cn(className)} {...props} />
)

export type AIInputModelSelectItemProps = ComponentProps<typeof SelectItem>

export const AIInputModelSelectItem = ({ className, ...props }: AIInputModelSelectItemProps) => (
  <SelectItem className={cn(className)} {...props} />
)

export type AIInputModelSelectValueProps = ComponentProps<typeof SelectValue>

export const AIInputModelSelectValue = ({ className, ...props }: AIInputModelSelectValueProps) => (
  <SelectValue className={cn(className)} {...props} />
)

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
function convertToPx(value?: string) {
  if (!value || typeof value !== "string") {
    return 0
  }

  const cleanValue = value.trim().toLowerCase()

  const match = cleanValue.match(/^(-?\d*\.?\d+)(px|rem)$/)

  if (!match) {
    console.warn(`Invalid value format: ${value}`)
    return 0
  }

  const [, number, unit] = match
  const numValue = parseFloat(number)

  if (unit === "px") {
    return numValue
  } else if (unit === "rem") {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16

    return numValue * rootFontSize
  }

  return 0
}
