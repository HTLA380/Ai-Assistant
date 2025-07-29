"use client"

import { Button } from "@mijn-ui/react"
import { AlertTriangle } from "lucide-react"
import { cn } from "@mijn-ui/react"

type ErrorDisplayProps = {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ title = "Something Went Wrong", message, onRetry, className }: ErrorDisplayProps) {
  return (
    <div
      className={cn(
        "flex aspect-video w-full max-w-lg flex-col items-center justify-center rounded-lg p-8 text-center",
        className,
      )}
      role="alert">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-danger/20 text-danger">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-danger-emphasis">{title}</h3>
      <p className="mb-6 text-sm text-danger-emphasis/80">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger">
          Try Again
        </Button>
      )}
      <p className="mt-6 text-sm text-secondary-foreground">
        If the problem persists, please contact support at{" "}
        <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="underline">
          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
        </a>
        .
      </p>
    </div>
  )
}
