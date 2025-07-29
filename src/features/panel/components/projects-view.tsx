"use client"

import { useProjects } from "../hooks/use-panel-queries"

export const ProjectsView = () => {
  const { data, isLoading, isError } = useProjects()

  if (isLoading) return <div className="p-4">Loading Projects...</div>
  if (isError) return <div className="p-4">Error loading projects.</div>

  return (
    <div className="p-4">
      <h3 className="mb-2 font-semibold">Projects</h3>
      <ul className="space-y-2">
        {data?.map((item) => (
          <li key={item.id} className="text-sm">
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-secondary-foreground">Status: {item.status}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
