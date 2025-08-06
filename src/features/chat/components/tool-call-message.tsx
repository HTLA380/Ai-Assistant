import { Code2 } from "lucide-react"
import { ToolCall } from "../types"

const ToolCallMessage = ({ toolCall }: { toolCall: ToolCall }) => {
  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
      <Code2 className="h-5 w-5 text-gray-500" />
      <div>
        <p className="text-sm font-medium">{toolCall.function.name}</p>
        <pre className="mt-1 text-xs text-gray-500">{toolCall.function.arguments}</pre>
      </div>
    </div>
  )
}

export { ToolCallMessage }
