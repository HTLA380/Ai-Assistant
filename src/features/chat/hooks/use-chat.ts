import { useChatStore } from "../stores/use-chat-store"
import { FormEventHandler, useCallback } from "react"

export const useChat = () => {
  const {
    messages,
    previousResponseId,
    status,
    input,
    setInput,
    setPreviousResponseId,
    addMessage,
    updateLastMessage,
    setStatus,
    setError,
  } = useChatStore()

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault()

      if (!input || status === "streaming") return

      const currentInput = input

      addMessage({ role: "user", content: currentInput })
      addMessage({ role: "assistant", content: "" })
      setStatus("streaming")
      setInput("")

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: currentInput, previousResponseId }),
        })

        if (!response.ok || !response.body) {
          const errorText = await response.text()
          throw new Error(`API Error: ${response.statusText} - ${errorText}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const events = buffer.split("\n\n")

          for (let i = 0; i < events.length - 1; i++) {
            const eventBlock = events[i].trim()
            if (!eventBlock) continue

            const lines = eventBlock.split("\n")
            const dataLine = lines.find((line) => line.startsWith("data:"))
            if (!dataLine) continue

            const jsonStr = dataLine.replace(/^data:\s*/, "")

            if (jsonStr === "[DONE]") {
              setStatus("ready")
              return
            }

            try {
              const data = JSON.parse(jsonStr)

              switch (data.type) {
                case "response.output_text.delta":
                  updateLastMessage(data.delta ?? "")
                  break
                case "response.created":
                  if (data.response.id) {
                    setPreviousResponseId(data.response.id)
                  }
                  break
                case "response.failed":
                  console.error("Response failed:", data)
                  setError("The AI failed to respond.")
                  setStatus("ready")
                  return
                case "response.completed":
                  setStatus("ready")
                  return
                default:
                  break
              }
            } catch (err) {
              console.error("Invalid JSON chunk:", jsonStr, err)
            }
          }

          // Retain unfinished chunk
          buffer = events[events.length - 1]
        }

        setStatus("ready")
      } catch (error) {
        console.error("Chat error:", error)
        setError(
          `Sorry, I encountered an error: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
        setStatus("ready")
      }
    },
    [
      input,
      status,
      previousResponseId,
      addMessage,
      updateLastMessage,
      setStatus,
      setInput,
      setError,
      setPreviousResponseId,
    ]
  )

  return {
    messages,
    status,
    input,
    previousResponseId,
    setInput,
    setPreviousResponseId,
    handleSubmit,
  }
}
