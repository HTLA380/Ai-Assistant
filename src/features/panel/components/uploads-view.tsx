"use client"

import { useUploads } from "../hooks/use-panel-queries"

export const UploadsView = () => {
  const { data, isLoading, isError } = useUploads()

  if (isLoading) return <div className="p-4">Loading Uploads...</div>
  if (isError) return <div className="p-4">Error loading uploads.</div>

  return (
    <div className="p-4">
      <h3 className="mb-2 font-semibold">Uploaded Files</h3>
      <ul className="space-y-2">
        {data?.map((item) => (
          <li key={item.id} className="text-sm">
            <p className="font-medium">{item.fileName}</p>
            <p className="text-xs text-secondary-foreground">Size: {item.size}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
