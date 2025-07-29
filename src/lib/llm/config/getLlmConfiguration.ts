import axiosServer from "@/lib/axios"
import { LlmConfigResponse } from "../types/llm"

export async function getLlmConfiguration(): Promise<LlmConfigResponse> {
  const data = await axiosServer.get("https://mcp.picosbs.com/api/v1/mcp/client/info/openai", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  return data.data
}
