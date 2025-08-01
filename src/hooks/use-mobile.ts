"use client"

import { useEffect, useState } from "react"
import { UAParser } from "ua-parser-js"
import { useUserAgent } from "@/components/providers/user-agent-provider"

export const useIsMobile = () => {
  const userAgent = useUserAgent()

  if (!userAgent) {
    throw new Error("useIsMobile must be used within a UserAgentContext.Provider")
  }

  const device = new UAParser(userAgent.ua || "").getDevice()

  const [isMobile, setIsMobile] = useState(device.type === "mobile")

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
