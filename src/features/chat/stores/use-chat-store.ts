import { create } from "zustand"
import { LlmConfigResponse } from "@/lib/llm/types/llm"

export type Message = {
  role: "user" | "assistant"
  content: string
}

export type ChatStatus = "ready" | "streaming" | "error" | "loading-config"

type ChatState = {
  messages: Message[]
  status: ChatStatus
  input: string
  previousResponseId: null | number | string
  llmConfig: LlmConfigResponse | null
}

type ChatActions = {
  setInput: (input: string) => void
  setPreviousResponseId: (input: null | number | string) => void
  setLlmConfig: (config: LlmConfigResponse) => void
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  setStatus: (status: ChatStatus) => void
  setError: (errorMessage: string) => void
  reset: () => void
}

export type ChatStore = ChatState & ChatActions

const initialState: ChatState = {
  messages: [
    {
      role: "assistant",

      content:
        '```jsx\nimport React from \\"react\\";\nimport { Prism as SyntaxHighlighter } from \\"react-syntax-highlighter\\";\nimport { okaidia } from \\"react-syntax-highlighter/dist/esm/styles/prism\\";\n\n/**\n * Props:\n *   code      : String - The code to display\n *   language  : String - Programming language (e.g., \'javascript\', \'python\')\n */\n\nconst CodeBlock = ({ code, language = \\"javascript\\" }) => (\n  <SyntaxHighlighter language={language} style={okaidia}>\n    {code}\n  </SyntaxHighlighter>\n);\n\nexport default CodeBlock;\n```\n\n```jsx\nimport React from \\"react\\";\nimport { Prism as SyntaxHighlighter } from \\"react-syntax-highlighter\\";\nimport { okaidia } from \\"react-syntax-highlighter/dist/esm/styles/prism\\";\n\n/**\n * Props:\n *   code      : String - The code to display\n *   language  : String - Programming language (e.g., \'javascript\', \'python\')\n */\n\nconst CodeBlock = ({ code, language = \\"javascript\\" }) => (\n  <SyntaxHighlighter language={language} style={okaidia}>\n    {code}\n  </SyntaxHighlighter>\n);\n\nexport default CodeBlock;\n```',
    },
  ],
  status: "ready",
  input: "",
  previousResponseId: null,
  llmConfig: null,
}

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  setInput: (input) => set({ input }),
  setPreviousResponseId: (previousResponseId: any) => set({ previousResponseId }),
  setLlmConfig: (config) => set({ llmConfig: config }),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (contentChunk) => {
    set((state) => {
      const messages = [...state.messages]
      const lastMessage = messages[messages.length - 1]
      if (lastMessage) {
        messages[messages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + contentChunk,
        }
      }
      return { messages }
    })
  },

  setStatus: (status) => set({ status }),

  setError: (errorMessage) => {
    set((state) => {
      const messages = [...state.messages]
      const lastMessage = messages[messages.length - 1]
      // If the last message was an empty assistant message, replace it with the error.
      if (lastMessage && lastMessage.role === "assistant" && lastMessage.content === "") {
        messages[messages.length - 1] = {
          ...lastMessage,
          content: errorMessage,
        }
        return { messages, status: "error" }
      }
      // Otherwise, add a new error message.
      return {
        messages: [...messages, { role: "assistant", content: errorMessage }],
        status: "error",
      }
    })
  },
  reset: () => set(initialState),
}))
