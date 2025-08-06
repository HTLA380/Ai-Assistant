"use client"

import React from "react"
import Image from "next/image"
import { Button, cn } from "@mijn-ui/react"
import { AnimatePresence, motion } from "framer-motion"
import { GlobeIcon, Paperclip, Telescope } from "lucide-react"
import { useIsMobile } from "@/hooks/use-screen-sizes"
import { Markdown } from "./components/markdown"
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

/* -------------------------------------------------------------------------- */

const ChatView = () => {
  const { messages, status, input, setInput, handleSubmit } = useChat()
  const isMobile = useIsMobile()

  const hasConversation = messages.length > 0

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const isSubmitDisabled = !input || status === "submitted" || status === "streaming"

  const promptAreaHeight = isMobile ? 60 : 80

  return (
    <div
      className="relative h-[calc(100svh_-_var(--header-height))] md:h-[calc(100svh_-_var(--main-area-padding)_-_0.5rem)]"
      style={
        {
          "--chat-view-max-width": "48rem",
          "--prompt-area-height": `${promptAreaHeight}px`,
        } as React.CSSProperties
      }>
      <AIConversation className="relative flex size-full overflow-hidden">
        <AIConversationContent>
          <AnimatePresence>
            <div className="mx-auto flex size-full flex-col gap-8 pb-[calc(var(--prompt-area-height)_+_10rem)] md:pb-[calc(var(--prompt-area-height)_+_12rem)] md:pt-[var(--header-height)]">
              {hasConversation && (
                <div className="mx-auto flex w-full max-w-[var(--chat-view-max-width)] flex-col gap-8">
                  {messages.map((message) => {
                    const shouldShowThinking =
                      status === "submitted" && message.role === "assistant" && !message.content

                    return (
                      <div
                        data-role={message.role}
                        key={message.id}
                        className="group flex items-start gap-3 data-[role=assistant]:flex-col data-[role=user]:justify-end">
                        <style>{`
                      .markdown img {
                        width: 200px !important;
                        height: 200px !important;
                      }
                    `}</style>

                        <div className="flex w-full flex-col items-start gap-2 group-data-[role=user]:w-fit group-data-[role=user]:items-end">
                          {message.role === "assistant" && (
                            <div className="flex items-center gap-2">
                              <Button
                                className="flex size-7 shrink-0 items-center justify-center rounded-full !p-0"
                                iconOnly
                                variant="ghost">
                                <Image src="/images/picosbs.png" width={28} height={28} alt="Picosbs" />
                              </Button>
                              <span className="text-xs font-medium">Pica Bot</span>
                              <span className="text-muted-foreground">|</span>
                              <span className="text-xs font-medium text-secondary-foreground">GPT4.1</span>
                            </div>
                          )}
                          {shouldShowThinking && <ThinkingMessage key={message.id} />}
                          {message.role === "assistant" && !shouldShowThinking && (
                            <AssistantMessage content={message.content} />
                          )}
                          {message.role === "user" && <UserMessage content={message.content} />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </AnimatePresence>
        </AIConversationContent>

        <AIConversationScrollButton className="absolute bottom-[calc(var(--prompt-area-height)+6rem)] left-1/2 z-50 -translate-x-1/2" />
      </AIConversation>

      <div className="pointer-events-none absolute inset-0 z-50 w-full">
        <div className="mx-auto flex size-full flex-col items-center justify-center">
          {!hasConversation && (
            <WelcomeMessage className="pointer-events-auto mb-4 max-w-[var(--chat-view-max-width)] grow md:grow-0" />
          )}

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
                minHeight={promptAreaHeight}
                maxHeight={300}
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
                <AIInputSubmit disabled={isSubmitDisabled} />
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

const UserMessage = ({ content }: { content: string }) => (
  <div
    className={cn(
      "min-w-fit max-w-[calc(var(--chat-view-max-width)*0.7)] rounded-lg bg-background px-4 py-2.5 text-sm shadow-xs",
    )}>
    <p>{content}</p>
  </div>
)

const AssistantMessage = ({ content }: { content: string }) => (
  <>
    <div className="markdown prose w-full max-w-none text-sm dark:prose-invert">
      <Markdown>{content}</Markdown>
    </div>
  </>
)

const ThinkingMessage = () => (
  <motion.div
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1, transition: { delay: 0.25 } }}
    data-role="assistant">
    <p className="text-sm text-secondary-foreground">Let me think...</p>
  </motion.div>
)
