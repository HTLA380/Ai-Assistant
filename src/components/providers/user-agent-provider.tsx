"use client"

import { createContext } from "@/utils/create-context"
import { userAgent } from "next/server"

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
