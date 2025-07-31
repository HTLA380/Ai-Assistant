"use client"

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/features/chat/components/ai-input"
import { Button, cn } from "@mijn-ui/react"
import { motion } from "framer-motion"
import { GlobeIcon, Paperclip, Telescope } from "lucide-react"
import { SUGGESTION_ITEMS } from "./constants"
import { ChangeEventHandler, FormEventHandler } from "react"
import { ChatStatus } from "../stores/use-chat-store"
import { useLlmConfig } from "../hooks/use-llm-config"
import { useIsMobile } from "@/hooks/use-mobile"

type PromptAreaProps = {
  input: string
  status: ChatStatus
  hasConversation: boolean
  onInputChange: ChangeEventHandler<HTMLTextAreaElement>
  onSubmit: FormEventHandler<HTMLFormElement>
}

const PromptArea = ({ input, status, hasConversation, onInputChange, onSubmit }: PromptAreaProps) => {
  // get default LLM Default config
  useLlmConfig()

  const isMobile = useIsMobile()

  return (
    <div className="pointer-events-none absolute inset-0 z-50 w-full">
      <div className="mx-auto flex size-full flex-col items-center justify-center">
        {!hasConversation && <WelcomeMessage className="pointer-events-auto mb-4 grow md:grow-0" />}

        {hasConversation && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100%", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="size-full origin-bottom"
          />
        )}

        <motion.div
          layout
          className="pointer-events-auto flex w-full shrink-0 items-center justify-center bg-transparent p-4 pt-0 md:max-w-[90%]">
          <AIInput className="w-full max-w-3xl" onSubmit={onSubmit}>
            <AIInputTextarea minHeight={isMobile ? 60 : 80} maxHeight={300} onChange={onInputChange} value={input} />
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
              <AIInputSubmit
                disabled={!input || status === "streaming" || status === "loading-config"}
                status={status}
              />
            </AIInputToolbar>
          </AIInput>
        </motion.div>

        {!hasConversation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-auto mt-6 hidden max-w-[90%] flex-wrap items-center gap-2 px-6 md:flex xl:max-w-3xl xl:px-0">
            {SUGGESTION_ITEMS.map((item) => (
              <Button key={item.id} size="sm" className="gap-2">
                {item.icon}
                {item.text}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

const WelcomeMessage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-[90%] flex-col items-start justify-center px-6 xl:max-w-3xl xl:px-0",
        className,
      )}>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold md:text-xl md:font-medium">
        Hello there!
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl font-medium text-muted-foreground md:text-xl md:font-normal">
        How can I help you today?
      </motion.h1>
    </div>
  )
}

export default PromptArea
