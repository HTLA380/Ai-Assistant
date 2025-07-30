"use client"

import { userAgent } from "next/server"
import { createContext, useContext } from "react"

export type UserAgent = ReturnType<typeof userAgent>

const UserAgentContext = createContext<UserAgent | undefined>(undefined)

const UserAgentProvider = ({ reqUserAgent, children }: { reqUserAgent: UserAgent; children: React.ReactNode }) => {
  return <UserAgentContext.Provider value={reqUserAgent}>{children}</UserAgentContext.Provider>
}

const useUserAgent = () => {
  const userAgent = useContext(UserAgentContext)
  if (!userAgent) {
    throw new Error("useUserAgent must be used within a UserAgentContext.Provider")
  }
  return userAgent
}

export { UserAgentContext, UserAgentProvider, useUserAgent }
