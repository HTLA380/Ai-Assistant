import { NextRequest } from "next/server"

export const runtime = "edge"

// Types matching the hook expectations
interface ToolCall {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string
  }
}

interface StreamResponse {
  type: "content" | "tool_calls" | "conversation_id" | "error"
  content?: string
  tool_calls?: ToolCall[]
  conversation_id?: string
  message?: string
}

// Main POST handler for both new and existing conversations
export async function POST(req: NextRequest): Promise<Response> {
  // Wait for 1 second to simulate loading
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    const url = new URL(req.url)
    const pathSegments = url.pathname.split("/")

    // Extract conversation ID from URL if present
    // /api/chat -> new conversation
    // /api/chat/conv_abc123 -> existing conversation
    const conversationId = pathSegments.length > 3 ? pathSegments[3] : null
    const isNewConversation = !conversationId

    const { message }: { message: string } = await req.json()

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const enqueue = (data: string) => controller.enqueue(encoder.encode(data))

        try {
          // For new conversations, send conversation ID first
          if (isNewConversation) {
            const newConversationId = generateConversationId()

            enqueue(
              createStreamChunk({
                type: "conversation_id",
                conversation_id: newConversationId,
              }),
            )
            await new Promise((resolve) => setTimeout(resolve, 100))
          }

          // Handle different message types
          if (message.toLowerCase().includes("stock")) {
            // First send tool call
            const mockToolCall: ToolCall = {
              id: "call_123",
              type: "function",
              function: {
                name: "get_stock_price",
                arguments: JSON.stringify({ ticker: "AAPL" }),
              },
            }

            enqueue(
              createStreamChunk({
                type: "tool_calls",
                tool_calls: [mockToolCall],
              }),
            )

            await new Promise((resolve) => setTimeout(resolve, 500))

            // Then stream the response content
            const text = "The current stock price of AAPL is $150.42. The stock is up 2.3% from yesterday's close."

            for (const char of text) {
              enqueue(
                createStreamChunk({
                  type: "content",
                  content: char,
                }),
              )

              await new Promise((resolve) => setTimeout(resolve, 25))
            }
          } else if (message.toLowerCase().includes("weather")) {
            // Another tool example
            const weatherToolCall: ToolCall = {
              id: "call_456",
              type: "function",
              function: {
                name: "get_weather",
                arguments: JSON.stringify({ location: "Tokyo" }),
              },
            }

            enqueue(
              createStreamChunk({
                type: "tool_calls",
                tool_calls: [weatherToolCall],
              }),
            )
            await new Promise((resolve) => setTimeout(resolve, 500))

            const text = "The weather in Tokyo is currently 22°C with partly cloudy skies. Perfect for a walk!"
            for (const char of text) {
              enqueue(
                createStreamChunk({
                  type: "content",
                  content: char,
                }),
              )
              await new Promise((resolve) => setTimeout(resolve, 25))
            }
          } else if (message.toLowerCase().includes("error")) {
            // Test error handling
            enqueue(
              createStreamChunk({
                type: "error",
                message: "This is a test error message",
              }),
            )
            return
          } else {
            // Regular text response
            const responses = [
              "This is a simple text response from the mock API.",
              "I understand your message and I'm here to help!",
              "That's an interesting question. Let me think about that...",
              `You said: "${message}". How can I assist you further?`,
            ]

            const text = responses[Math.floor(Math.random() * responses.length)]
            for (const char of text) {
              enqueue(
                createStreamChunk({
                  type: "content",
                  content: char,
                }),
              )
              await new Promise((resolve) => setTimeout(resolve, 25))
            }
          }

          // End the stream
          controller.close()
        } catch (error) {
          // Handle streaming errors
          enqueue(
            createStreamChunk({
              type: "error",
              message: error instanceof Error ? error.message : "Unknown error occurred",
            }),
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    // Handle request parsing errors
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to process request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Optional: GET handler to load conversation history
export async function GET(req: NextRequest): Promise<Response> {
  try {
    const url = new URL(req.url)
    const pathSegments = url.pathname.split("/")
    const conversationId = pathSegments[pathSegments.length - 1]

    // In a real app, you'd fetch from database
    // For now, return mock conversation history
    const mockHistory = {
      id: conversationId,
      messages: [
        {
          id: "msg_1",
          role: "user",
          content: "Hello!",
          timestamp: new Date(Date.now() - 60000).toISOString(),
        },
        {
          id: "msg_2",
          role: "assistant",
          content: "Hi there! How can I help you today?",
          timestamp: new Date(Date.now() - 59000).toISOString(),
        },
      ],
    }

    return new Response(JSON.stringify(mockHistory), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to load conversation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

const createStreamChunk = (response: StreamResponse): string => {
  return `data: ${JSON.stringify(response)}\n\n`
}

const generateConversationId = (): string => {
  return `conv_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`
}
