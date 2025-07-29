import { useChatStore } from "@/features/chat/stores/use-chat-store"
import axiosClient from "@/lib/axios-client"
import { LlmConfigResponse } from "@/lib/llm/types/llm"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const llmConfigKeys = {
  all: ["llm-config"] as const,
}

const fetchLlmConfig = async (): Promise<LlmConfigResponse> => {
  const { data } = await axiosClient.get("/chat/config")
  return data
}

export const useLlmConfig = () => {
  const { setLlmConfig, setStatus, setError } = useChatStore()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: llmConfigKeys.all,
    queryFn: fetchLlmConfig,
    // TODO: update stale time to get the lastest config
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isLoading) {
      setStatus("loading-config")
    } else if (isError) {
      setError(`Failed to load AI configuration: ${error instanceof Error ? error.message : String(error)}`)
      setStatus("error")
    } else if (data) {
      setLlmConfig(data)
      setStatus("ready")
    }
  }, [isLoading, isError, data, setLlmConfig, setStatus, setError, error])

  return {
    config: data,
    isLoading,
    isError,
  }
}
