import { NextRequest } from "next/server"
import { LlmConfigResponse } from "@/lib/llm/types/llm"

export const runtime = "edge"

export async function POST(req: NextRequest): Promise<Response> {
  const {
    message,
    previousResponseId,
    llmConfig,
  }: { message: string; previousResponseId: string; llmConfig: LlmConfigResponse } = await req.json()

  if (!process.env.OPENAI_API_KEY) {
    return new Response("Missing OpenAI API Key", { status: 500 })
  }

  if (!message) {
    return new Response("Missing message", { status: 400 })
  }

  if (!llmConfig) {
    return new Response("Missing LLM configuration", { status: 400 })
  }

  try {
    const openAIResponse = await fetch(llmConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: llmConfig.model,
        input: message,
        instructions: llmConfig.smart_prompt,
        tools: Array.isArray(llmConfig.tools) ? llmConfig.tools : [llmConfig.tools],
        stream: true,
        previous_response_id: previousResponseId,
      }),
    })

    if (!openAIResponse.ok || !openAIResponse.body) {
      const errorText = await openAIResponse.text()
      return new Response(errorText, { status: openAIResponse.status })
    }

    // Just return the stream directly — no transformation
    return new Response(openAIResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (err) {
    console.error("Chat proxy error:", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
