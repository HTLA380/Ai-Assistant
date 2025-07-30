"use client"

import { AnimatePresence } from "framer-motion"
import { AIConversation, AIConversationContent, AIConversationScrollButton } from "./components/conversation"
import Messages from "./components/messages"
import PromptArea from "./components/prompt-area"
import { useChat } from "./hooks/use-chat"

const ChatView = () => {
  const { messages, status, input, setInput, handleSubmit } = useChat()

  const hasConversation = messages.length > 0

  return (
    <div className="relative">
      <AIConversation className="relative flex h-[calc(100dvh_-_var(--header-height))] w-full overflow-auto md:h-[calc(100dvh_-_var(--main-area-padding)_-_var(--header-height)_-_0.5rem)]">
        <AIConversationContent>
          <AnimatePresence>
            <div className="mx-auto flex size-full flex-col gap-8 pb-[calc(var(--prompt-area-height)_+_12rem)]">
              {hasConversation && (
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
                  {messages.map((message, index) => (
                    <Messages
                      key={index}
                      role={message.role}
                      content={message.content}
                      isStreaming={status === "streaming" && index === messages.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </AnimatePresence>
        </AIConversationContent>

        <AIConversationScrollButton className="absolute bottom-[calc(var(--prompt-area-height)+6rem)] left-1/2 z-50 -translate-x-1/2" />
      </AIConversation>
      <PromptArea
        input={input}
        status={status}
        hasConversation={hasConversation}
        onInputChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export { ChatView }
