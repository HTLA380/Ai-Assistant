"use client"

import { userAgent } from "next/server"
import { createContext } from "@/utils/create-context"

export type UserAgentContextType = ReturnType<typeof userAgent>

const [UserAgentContextProvider, useUserAgent] = createContext<UserAgentContextType>({
  name: "UserAgentContext",
  strict: true,
  errorMessage: "useUserAgent: `context` is undefined. Ensure the component is wrapped within <UserAgentProvider />",
})

const UserAgentProvider = ({
  reqUserAgent,
  children,
}: {
  reqUserAgent: UserAgentContextType
  children: React.ReactNode
}) => {
  return <UserAgentContextProvider value={reqUserAgent}>{children}</UserAgentContextProvider>
}

export { UserAgentProvider, useUserAgent }
