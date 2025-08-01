import Link from "next/link"
import { Bot } from "lucide-react"
import { NavigationMenu } from "./navigation-menu"

const Navbar = () => {
  return (
    <header className="sticky left-0 top-0 z-50 flex w-full flex-col backdrop-blur">
      <div className="flex h-[var(--header-height)] w-full">
        <div className="container mx-auto grid w-full grid-cols-[1fr_max-content_1fr] place-items-center content-center px-6 *:first:justify-self-start">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="text-2xl text-primary" />
            <span className="text-xl font-bold">Pica Bot</span>
          </Link>

          <NavigationMenu />
        </div>
      </div>
    </header>
  )
}

export { Navbar }
