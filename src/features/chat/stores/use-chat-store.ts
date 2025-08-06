import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { Message, ToolCall } from "../type"

export type ChatStatus = "ready" | "submitted" | "streaming" | "error"

interface ChatStore {
  messages: Message[]
  conversationId: string | null
  status: ChatStatus
  error: Error | null
  streamingMessage: string
  currentToolCalls: ToolCall[]
  input: string

  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateLastMessage: (updates: Partial<Message>) => void
  setConversationId: (id: string | null) => void
  setStatus: (status: ChatStatus) => void
  setError: (error: Error | null) => void
  setStreamingMessage: (message: string) => void
  appendStreamingContent: (content: string) => void
  setCurrentToolCalls: (toolCalls: ToolCall[]) => void
  setInput: (input: string) => void
  reset: (initialMessages?: Message[], conversationId?: string) => void
}

const createChatStore = (initialMessages: Message[] = [], conversationId?: string) =>
  create<ChatStore>()(
    subscribeWithSelector((set, get) => ({
      messages: initialMessages,
      conversationId: conversationId || null,
      status: "ready",
      error: null,
      streamingMessage: "",
      currentToolCalls: [],
      input: "",

      setMessages: (messages) => set({ messages }),

      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

      updateLastMessage: (updates) =>
        set((state) => {
          const messages = [...state.messages]
          const lastIndex = messages.length - 1
          if (lastIndex >= 0) {
            messages[lastIndex] = { ...messages[lastIndex], ...updates }
          }
          return { messages }
        }),

      setConversationId: (conversationId) => set({ conversationId }),

      setStatus: (status) => set({ status }),

      setError: (error) => set({ error }),

      setStreamingMessage: (streamingMessage) => set({ streamingMessage }),

      appendStreamingContent: (content) => set((state) => ({ streamingMessage: state.streamingMessage + content })),

      setCurrentToolCalls: (currentToolCalls) => set({ currentToolCalls }),

      setInput: (input) => set({ input }),

      reset: (initialMessages = [], conversationId) =>
        set({
          messages: initialMessages,
          conversationId: conversationId || null,
          status: "idle",
          error: null,
          streamingMessage: "",
          currentToolCalls: [],
          input: "",
        }),
    })),
  )
export { createChatStore }
