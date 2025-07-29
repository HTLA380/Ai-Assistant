import { useQuery } from "@tanstack/react-query"
import { fetchAgents, fetchHistory, fetchProjects, fetchUploads } from "../api/client"

// I will just keep the queries simple for now.
// export const chatHistoryKeys = {
// 	all: ["history"] as const,
// };

export const useChatHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
  })
}

export const useAgents = () => {
  return useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  })
}

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  })
}

export const useUploads = () => {
  return useQuery({
    queryKey: ["uploads"],
    queryFn: fetchUploads,
  })
}
