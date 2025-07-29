"use client"

import { ErrorDisplay } from "@/components/error-display"
import { useEffect } from "react"
import { BasicHomeLayout } from "./_components/basic-home-layout"

export default function LandingError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // console.error(error);
  }, [error])

  return (
    <BasicHomeLayout>
      <div className="container mx-auto flex size-full items-center justify-center p-4">
        <ErrorDisplay
          title="An Error Occurred"
          message={error.message || "Sorry, something went wrong while loading this page."}
          onRetry={reset}
        />
      </div>
    </BasicHomeLayout>
  )
}
