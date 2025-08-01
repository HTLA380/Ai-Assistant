import React from "react"
import { Footer } from "./footer"
import { DarkBlueRadialGradient } from "./gradient-decorators"
import { Navbar } from "./navbar"

const BasicHomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-svh flex-col transition-colors duration-300">
      <DarkBlueRadialGradient />
      <Navbar />
      <div className="flex grow items-center justify-center">{children}</div>
      <Footer />
    </div>
  )
}

export { BasicHomeLayout }
