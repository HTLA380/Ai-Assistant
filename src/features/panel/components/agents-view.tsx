"use client"

import { useAgents } from "../hooks/use-panel-queries"

export const AgentsView = () => {
  const { data, isLoading, isError } = useAgents()

  if (isLoading) return <div className="p-4">Loading Agents...</div>
  if (isError) return <div className="p-4">Error loading agents.</div>

  return (
    <div className="p-4">
      <h3 className="mb-2 font-semibold">AI Agents</h3>
      <ul className="space-y-2">
        {data?.map((item) => (
          <li key={item.id} className="text-sm">
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-secondary-foreground">{item.role}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
