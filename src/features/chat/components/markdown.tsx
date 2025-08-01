"use client"

import type { HTMLAttributes } from "react"
import React, { memo } from "react"
import { cn } from "@mijn-ui/react"
import "katex/dist/katex.min.css"
import ReactMarkdown, { type Options } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { toast } from "sonner"
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
  type CodeBlockProps,
} from "./ui/code-block"

const components: Options["components"] = {
  h1: ({ node: _, ...props }) => <h1 className="text-2xl font-semibold sm:text-3xl" {...props} />,
  h2: ({ node: _, ...props }) => <h2 className="text-xl font-semibold sm:text-2xl" {...props} />,
  h3: ({ node: _, ...props }) => <h3 className="text-lg font-semibold sm:text-xl" {...props} />,
  h4: ({ node: _, ...props }) => <h4 className="text-md font-semibold sm:text-lg" {...props} />,
  h5: ({ node: _, ...props }) => <h5 className="text-base font-semibold" {...props} />,
  h6: ({ node: _, ...props }) => <h6 className="text-sm font-semibold" {...props} />,
  pre: ({ node: _, className, ...props }) => <pre className={cn("not-prose", className)} {...props} />,
  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "")
    const codeContent = String(children).replace(/\n$/, "")

    if (match) {
      let filename: string | null = null
      if (node?.data?.meta) {
        const metaString = node.data.meta as string
        const filenameMatch = metaString.match(/filename=["']([^"]+)["']/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      return <FencedCodeBlock language={match[1]} filename={filename} code={codeContent} />
    }

    return (
      <code className={cn("not-prose rounded-md bg-muted px-1.5 py-1 font-mono text-sm", className)} {...props}>
        {children}
      </code>
    )
  },
}

/* -------------------------------------------------------------------------- */

export type MarkdownProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options
  children: Options["children"]
}

export const Markdown = memo(
  ({ className, options, children, ...props }: MarkdownProps) => (
    <div className={cn("size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", className)} {...props}>
      <ReactMarkdown
        components={{ ...components, ...options?.components }}
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

/* -------------------------------------------------------------------------- */

type FencedCodeBlockProps = {
  language: string
  filename: string | null
  code: string
}

const FencedCodeBlock = ({ language, filename, code }: FencedCodeBlockProps) => {
  const data: CodeBlockProps["data"] = [{ language, filename: filename || "", code }]

  const handleCopy = () => {
    toast.success("Copied code to clipboard!")
  }

  const handleCopyError = () => {
    toast.error("Failed to copy code to clipboard.")
  }

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
          <CodeBlockCopyButton onCopy={handleCopy} onError={handleCopyError} />
        </CodeBlockHeader>
      ) : (
        <CodeBlockCopyButton
          className="absolute right-2 top-2 z-10 [&>svg]:text-foreground/80"
          onCopy={handleCopy}
          onError={handleCopyError}
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
}
