"use client"

import { cn } from "@mijn-ui/react"
import "katex/dist/katex.min.css"
import type { HTMLAttributes } from "react"
import React, { memo } from "react"
import ReactMarkdown, { type Options } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import {
  BundledLanguage,
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockProps,
} from "./code-block"

export type MarkdownProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options
  children: Options["children"]
}

const components: Options["components"] = {
  h1: ({ node: _, children, ...props }) => {
    return (
      <h1 className="text-2xl font-semibold sm:text-3xl" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ node: _, children, ...props }) => {
    return (
      <h2 className="text-xl font-semibold sm:text-2xl" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ node: _, children, ...props }) => {
    return (
      <h3 className="text-lg font-semibold sm:text-xl" {...props}>
        {children}
      </h3>
    )
  },
  h4: ({ node: _, children, ...props }) => {
    return (
      <h4 className="text-md font-semibold sm:text-lg" {...props}>
        {children}
      </h4>
    )
  },
  h5: ({ node: _, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold" {...props}>
        {children}
      </h5>
    )
  },
  h6: ({ node: _, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold" {...props}>
        {children}
      </h6>
    )
  },
  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "") ?? "plaintext"
    const language = match[0].replace("language-", "")

    if (!match) {
      return (
        <code {...props} className={className}>
          {children}
        </code>
      )
    }

    let filename = ""

    // Check for metadata in the node or extract from code content
    if (node?.data?.meta) {
      // Handle metadata like ```typescript filename="example.ts"
      const metaString = node.data.meta
      const filenameMatch = metaString.match(/filename=["']([^"']+)["']/)
      if (filenameMatch) {
        filename = filenameMatch[1]
      }
    }

    const code = String(children).replace(/\n$/, "") ?? ""

    const data: CodeBlockProps["data"] = [
      {
        language,
        filename,
        code,
      },
    ]

    return (
      <CodeBlock className="relative" data={data} defaultValue={data[0].language}>
        {filename ? (
          <CodeBlockHeader>
            <CodeBlockFiles>
              {(item) => (
                <CodeBlockFilename
                  className="bg-transparent text-secondary-foreground"
                  key={item.language}
                  value={item.language}>
                  {item.filename}
                </CodeBlockFilename>
              )}
            </CodeBlockFiles>
            <CodeBlockCopyButton
              onCopy={() => console.log("Copied code to clipboard")}
              onError={() => console.error("Failed to copy code to clipboard")}
            />
          </CodeBlockHeader>
        ) : (
          <CodeBlockCopyButton
            className="absolute right-2 top-2 z-10 [&>svg]:text-foreground/80"
            onCopy={() => console.log("Copied code to clipboard")}
            onError={() => console.error("Failed to copy code to clipboard")}
          />
        )}

        <CodeBlockBody>
          {(item) => (
            <CodeBlockItem key={item.language} value={item.language}>
              <CodeBlockContent language={item.language as BundledLanguage}>{item.code}</CodeBlockContent>
            </CodeBlockItem>
          )}
        </CodeBlockBody>
      </CodeBlock>
    )
  },
  pre: ({ node: _, className, ...props }) => {
    return <pre className={cn("not-prose", className)} {...props} />
  },
}

export const Markdown = memo(
  ({ className, options, children, ...props }: MarkdownProps) => (
    <div className={cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)} {...props}>
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkMath]}
        {...options}>
        {children}
      </ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
)

Markdown.displayName = "Markdown"
