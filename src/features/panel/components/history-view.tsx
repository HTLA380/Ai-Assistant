"use client"

import { useChatHistory } from "../hooks/use-panel-queries"

export const HistoryView = () => {
  const { data, isLoading, isError } = useChatHistory()

  if (isLoading) return <div className="p-4">Loading History...</div>
  if (isError) return <div className="p-4">Error loading history.</div>

  return (
    <div className="p-4">
      <h3 className="mb-2 font-semibold">Chat History</h3>
      <ul className="space-y-2">
        {data?.map((item) => (
          <li key={item.id} className="text-sm">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
