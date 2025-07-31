"use client"

import { ErrorDisplay } from "@/components/error-display"
import { Bot } from "lucide-react"
import { useEffect } from "react"

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    // console.error(error);
  }, [error])

  return (
    <html>
      <body className="flex min-h-svh w-full items-center justify-center">
        <div className="absolute left-10 top-5 flex items-center space-x-2">
          <Bot className="text-2xl text-primary" />
          <span className="text-xl font-bold">Pica Bot</span>
        </div>

        <ErrorDisplay
          title="Something went wrong"
          message="An unrecoverable error occurred. Please reload the page."
          onRetry={() => window.location.reload()}
        />
      </body>
    </html>
  )
}
