import { getLlmConfiguration } from "@/lib/llm/config/getLlmConfiguration"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const config = await getLlmConfiguration()
    return NextResponse.json(config)
  } catch (error: any) {
    console.error("Failed to fetch LLM config:", error?.message || error)
    return NextResponse.json({ error: "Failed to fetch LLM configuration" }, { status: error?.response?.status || 500 })
  }
}
