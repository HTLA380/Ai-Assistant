"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button, cn } from "@mijn-ui/react"
import { Markdown } from "./markdown"

export const UserMessage = ({ content }: { content: string }) => (
  <div
    className={cn(
      "min-w-fit max-w-[calc(var(--chat-view-max-width)*0.7)] self-end rounded-lg bg-background px-4 py-2.5 text-sm shadow-xs",
    )}>
    <p>{content}</p>
  </div>
)

export const AssistantMessage = ({ content }: { content: string }) => (
  <div className="flex w-full flex-col items-start gap-2">
    <div className="flex items-center gap-2">
      <Button className="flex size-7 shrink-0 items-center justify-center rounded-full !p-0" iconOnly variant="ghost">
        <Image src="/images/picosbs.png" width={28} height={28} alt="Picosbs" />
      </Button>
      <span className="text-xs font-medium">Pica Bot</span>
      <span className="text-muted-foreground">|</span>
      <span className="text-xs font-medium text-secondary-foreground">GPT4.1</span>
    </div>

    <div className="markdown prose w-full max-w-none text-sm dark:prose-invert">
      <Markdown>{content}</Markdown>
    </div>
  </div>
)

export const ThinkingMessage = () => (
  <motion.div
    initial={{ y: 5, opacity: 0 }}
    animate={{ y: 0, opacity: 1, transition: { delay: 0.25 } }}
    className="self-start">
    <p className="text-sm text-secondary-foreground">Let me think...</p>
  </motion.div>
)
