"use client"

import { useEffect } from "react"
import { ErrorDisplay } from "@/components/error-display"

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // console.error(error);
  }, [error])

  return (
    <div className="flex items-center justify-center pt-16 sm:pt-28 md:pt-40">
      <ErrorDisplay
        title="Oops! Something went wrong."
        message={error.message || "An unexpected error occurred in the application."}
        onRetry={reset}
      />
    </div>
  )
}
