"use client"

import { ConversationTurn } from "../types"
import { AssistantMessage, ThinkingMessage, UserMessage } from "./message-bubbles"
import { ToolCallMessage } from "./tool-call-message"

interface MessagesProps {
  turn: ConversationTurn
  isStreaming?: boolean
}

const Messages = ({ turn, isStreaming }: MessagesProps) => {
  const shouldShowThinking = isStreaming && turn.type === "assistant" && !turn.content

  if (shouldShowThinking) {
    return <ThinkingMessage />
  }

  switch (turn.type) {
    case "user":
      return <UserMessage content={turn.content} />
    case "assistant":
      if (!turn.content) return null
      return <AssistantMessage content={turn.content} />
    case "tool_call":
      return <ToolCallMessage toolCall={turn.toolCall} />
    default:
      return null
  }
}

export { Messages }
