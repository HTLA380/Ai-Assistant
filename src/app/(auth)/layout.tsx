import { Bot } from "lucide-react"
import Link from "next/link"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Link href="/" className="absolute left-10 top-5 flex items-center space-x-2">
        <Bot className="text-2xl text-primary" />
        <span className="text-xl font-bold">Pica Bot</span>
      </Link>

      {children}
    </div>
  )
}
