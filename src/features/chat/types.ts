export type ToolCall = {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string
  }
}

// A plain text message from the user or assistant
export type TextMessage = {
  type: "user" | "assistant"
  content: string
}

// A message representing a tool call
export type ToolCallMessage = {
  type: "tool_call"
  toolCall: ToolCall
}

// The new unified type for our conversation array
export type ConversationTurn = TextMessage | ToolCallMessage

// The API response will now be simpler
export type MockApiResponse = {
  type: "text_delta" | "tool_call" | "done"
  data: string | ToolCall | "[DONE]"
}