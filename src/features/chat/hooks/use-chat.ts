import { useCallback, useEffect, useRef } from "react"
import { createChatStore } from "../stores/use-chat-store"
import { Message, ToolCall } from "../type"

export interface ChatOptions {
  api?: string
  headers?: Record<string, string>
  body?: Record<string, any>
  onError?: (error: Error) => void
  onFinish?: (message: Message) => void
  onToolCall?: (toolCall: ToolCall, message: Message) => void
  initialMessages?: Message[]
  conversationId?: string
  maxRetries?: number
  retryDelay?: number
}

export const useChat = ({
  api = "/api/chat",
  headers = {},
  body = {},
  onError,
  onFinish,
  onToolCall,
  initialMessages = [],
  conversationId: initialConversationId,
  maxRetries = 3,
  retryDelay = 1000,
}: ChatOptions = {}) => {
  const store = useRef(createChatStore(initialMessages, initialConversationId)).current

  const {
    messages,
    conversationId,
    status,
    error,
    streamingMessage,
    currentToolCalls,
    input,
    setMessages,
    addMessage,
    updateLastMessage,
    setConversationId,
    setStatus,
    setError,
    setStreamingMessage,
    appendStreamingContent,
    setCurrentToolCalls,
    setInput,
    reset: resetStore,
  } = store()

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null)
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null)
  const retryCountRef = useRef(0)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stop streaming
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (readerRef.current) {
      readerRef.current.cancel()
      readerRef.current = null
    }
    setStatus("ready")
  }, [setStatus])

  const parseStreamChunk = useCallback((chunk: string): any => {
    try {
      if (chunk.startsWith("data: ")) {
        const data = chunk.slice(6)
        if (data === "[DONE]") return null
        return JSON.parse(data)
      }
      return JSON.parse(chunk)
    } catch {
      return null
    }
  }, [])

  const processStream = useCallback(
    async (response: Response, userMessage: Message): Promise<void> => {
      const reader = response.body?.getReader()

      if (!reader) throw new Error("Response body is not readable")

      readerRef.current = reader
      const decoder = new TextDecoder()
      let buffer = ""
      let assistantMessage = createMessage("assistant", "")
      let toolCalls: ToolCall[] = []
      let isStreamingStarted = false

      // Add both user and assistant messages to store
      addMessage(userMessage)
      addMessage(assistantMessage)
      setStreamingMessage("")

      try {
        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")

          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.trim()) continue

            const parsed = parseStreamChunk(line)

            if (!parsed) continue

            if (!isStreamingStarted) {
              setStatus("streaming")
              isStreamingStarted = true
            }

            // Handle different response types
            if (parsed.type === "content") {
              const content = parsed.content || ""
              appendStreamingContent(content)
              assistantMessage.content += content

              // Update the assistant message in store
              updateLastMessage({ content: assistantMessage.content })
            } else if (parsed.type === "tool_calls") {
              const newToolCalls = parsed.tool_calls || []
              toolCalls = [...toolCalls, ...newToolCalls]
              setCurrentToolCalls(toolCalls)
              assistantMessage.toolCalls = toolCalls

              updateLastMessage({ toolCalls })

              newToolCalls.forEach((toolCall: ToolCall) => {
                onToolCall?.(toolCall, assistantMessage)
              })
            } else if (parsed.type === "conversation_id") {
              // Backend sends conversation ID for new conversations
              setConversationId(parsed.conversation_id)
            } else if (parsed.type === "error") {
              throw new Error(parsed.message || "Streaming error")
            }
          }
        }

        // Finalize the message
        assistantMessage.timestamp = new Date()
        updateLastMessage({ timestamp: assistantMessage.timestamp })
        onFinish?.(assistantMessage)
        setStatus("ready")
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          setStatus("ready")
          return // Request was cancelled
        }
        const err = error as Error
        setError(err)
        setStatus("error")
        throw error
      } finally {
        readerRef.current = null
        setStreamingMessage("")
        setCurrentToolCalls([])
      }
    },
    [
      addMessage,
      updateLastMessage,
      setConversationId,
      setStreamingMessage,
      appendStreamingContent,
      setCurrentToolCalls,
      parseStreamChunk,
      onToolCall,
      onFinish,
      setStatus,
      setError,
    ],
  )

  // Send chat request with conversation ID
  const sendChatRequest = useCallback(
    async (message: string, additionalData?: Record<string, any>): Promise<void> => {
      const attempt = async (): Promise<Response> => {
        abortControllerRef.current = new AbortController()

        // Build the API endpoint - use conversation ID if available
        const endpoint = conversationId ? `${api}/${conversationId}` : api

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            message, // Just the current message!
            ...(conversationId ? {} : {}),
            ...body,
            ...additionalData,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        if (!response.body) {
          throw new Error("Response body is empty")
        }

        return response
      }

      let lastError: Error | null = null

      for (let i = 0; i <= maxRetries; i++) {
        try {
          const response = await attempt()
          const userMessage = createMessage("user", message)
          await processStream(response, userMessage)
          retryCountRef.current = 0
          return
        } catch (error) {
          lastError = error as Error

          if (error instanceof Error && error.name === "AbortError") {
            return // Don't retry if request was cancelled
          }

          if (i < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, i)))
            retryCountRef.current = i + 1
          }
        }
      }

      throw lastError
    },
    [api, conversationId, headers, body, maxRetries, retryDelay, processStream],
  )

  // Append message
  const append = useCallback(
    async (message: Omit<Message, "id" | "timestamp">): Promise<void> => {
      if (status === "submitted" || status === "streaming") return

      setError(null)
      setStatus("submitted")

      try {
        await sendChatRequest(message.content)
      } catch (error) {
        const err = error as Error
        onError?.(err)
      }
    },
    [status, sendChatRequest, onError, setError, setStatus],
  )

  // Reload last message
  const reload = useCallback(async (): Promise<void> => {
    if (status === "submitted" || status === "streaming" || messages.length === 0) return

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUserMessage) return

    // Remove messages after the last user message
    const lastUserIndex = messages.findIndex((m) => m.id === lastUserMessage.id)
    const messagesToKeep = messages.slice(0, lastUserIndex)

    setMessages(messagesToKeep)
    setError(null)
    setStatus("submitted")

    try {
      await sendChatRequest(lastUserMessage.content)
    } catch (error) {
      const err = error as Error
      onError?.(err)
      setMessages(messages) // Restore original messages
    }
  }, [status, messages, sendChatRequest, onError, setMessages, setError, setStatus])

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    [setInput],
  )

  // Handle form submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent, chatRequestOptions?: { data?: Record<string, any> }): Promise<void> => {
      e.preventDefault()

      if (!input.trim() || status === "submitted" || status === "streaming") return

      const messageContent = input.trim()

      setInput("")
      setError(null)
      setStatus("submitted")
      updateLastMessage({ role: "user", content: input })

      try {
        await sendChatRequest(messageContent, chatRequestOptions?.data)
      } catch (error) {
        const err = error as Error
        onError?.(err)
        setInput(messageContent) // Restore input on error
      }
    },
    [input, status, sendChatRequest, onError, setInput, setError, setStatus],
  )

  // Load conversation by ID
  const loadConversation = useCallback(
    async (id: string): Promise<void> => {
      setStatus("submitted")
      setError(null)

      try {
        const response = await fetch(`${api.replace("/chat", "/conversations")}/${id}`, {
          headers: { ...headers },
        })

        if (!response.ok) {
          throw new Error(`Failed to load conversation: ${response.statusText}`)
        }

        const data = await response.json()
        setMessages(data.messages || [])
        setConversationId(id)
        setStatus("ready")
      } catch (error) {
        const err = error as Error
        setError(err)
        setStatus("error")
        onError?.(err)
      }
    },
    [api, headers, setMessages, setConversationId, setError, setStatus, onError],
  )

  // Reset chat
  const reset = useCallback(() => {
    stop()
    resetStore([], undefined)
    retryCountRef.current = 0
  }, [stop, resetStore])

  return {
    // State
    messages,
    conversationId,
    status,
    error,
    streamingMessage,
    currentToolCalls,
    input,

    // Actions
    append,
    reload,
    stop,
    setMessages,
    setInput,
    handleInputChange,
    handleSubmit,
    loadConversation,
    reset,
  }
}

const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const createMessage = (role: Message["role"], content: string, overrides?: Partial<Message>): Message => ({
  id: generateId(),
  role,
  content,
  timestamp: new Date(),
  ...overrides,
})
