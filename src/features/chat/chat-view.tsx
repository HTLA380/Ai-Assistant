"use client"

import React from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnimatePresence, motion } from "framer-motion"
import { GlobeIcon, Paperclip, Telescope } from "lucide-react"
import { Messages } from "./components/messages"
import { SuggestionItems } from "./components/suggestion-items"
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "./components/ui/ai-input"
import { AIConversation, AIConversationContent, AIConversationScrollButton } from "./components/ui/conversation"
import { WelcomeMessage } from "./components/welcome-message"
import { useChat } from "./hooks/use-chat"
import { useLlmConfig } from "./hooks/use-llm-config"

const CHAT_VIEW_MAX_WIDTH = "48rem"
const PROMPT_AREA_HEIGHT = "5rem"

/* -------------------------------------------------------------------------- */

const ChatView = () => {
  useLlmConfig()

  const { messages, status, input, setInput, handleSubmit } = useChat()
  const isMobile = useIsMobile()

  const hasConversation = messages.length > 0
  const responsivePromptHeight = isMobile ? `calc(${PROMPT_AREA_HEIGHT} * 0.75)` : PROMPT_AREA_HEIGHT

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const isSubmitDisabled = !input || status === "streaming" || status === "loading-config"

  return (
    <div
      className="relative h-[calc(100svh_-_var(--header-height))] md:h-[calc(100svh_-_var(--main-area-padding)_-_0.5rem)]"
      style={
        {
          "--chat-view-max-width": CHAT_VIEW_MAX_WIDTH,
          "--prompt-area-height": responsivePromptHeight,
        } as React.CSSProperties
      }>
      <AIConversation className="relative flex size-full overflow-hidden">
        <AIConversationContent>
          <AnimatePresence>
            <div className="mx-auto flex size-full flex-col gap-8 pb-[calc(var(--prompt-area-height)_+_10rem)] md:pb-[calc(var(--prompt-area-height)_+_12rem)] md:pt-[var(--header-height)]">
              {hasConversation && (
                <div className="mx-auto flex w-full max-w-[var(--chat-view-max-width)] flex-col gap-8">
                  {messages.map((message, index) => (
                    <Messages
                      key={`message-${index}`}
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

      <div className="pointer-events-none absolute inset-0 z-50 w-full">
        <div className="mx-auto flex size-full flex-col items-center justify-center">
          {!hasConversation && <WelcomeMessage className="pointer-events-auto mb-4 grow md:grow-0" />}

          {hasConversation && (
            <motion.div
              key="conversation-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "100%", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="size-full origin-bottom"
            />
          )}

          <motion.div
            layout
            className="pointer-events-auto flex w-full shrink-0 items-center justify-center bg-transparent p-4 pt-0 xl:max-w-[90%]">
            <AIInput className="w-full max-w-[var(--chat-view-max-width)]" onSubmit={handleSubmit}>
              <AIInputTextarea
                minHeight={responsivePromptHeight}
                maxHeight="300px"
                onChange={handleInputChange}
                value={input}
              />
              <AIInputToolbar>
                <AIInputTools>
                  <AIInputButton iconOnly>
                    <Paperclip size={16} />
                  </AIInputButton>
                  <AIInputButton iconOnly>
                    <Telescope size={16} />
                  </AIInputButton>
                  <AIInputButton>
                    <GlobeIcon size={16} />
                    <span>Search</span>
                  </AIInputButton>
                </AIInputTools>
                <AIInputSubmit disabled={isSubmitDisabled} status={status} />
              </AIInputToolbar>
            </AIInput>
          </motion.div>

          {!hasConversation && <SuggestionItems />}
        </div>
      </div>
    </div>
  )
}

export { ChatView }
