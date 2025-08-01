import Link from "next/link"
import { Button } from "@mijn-ui/react"
import { ArrowRight, Bot, Play } from "lucide-react"
import { DarkBlueRadialGradient } from "./gradient-decorators"

export const HeroSection = () => {
  return (
    <section className="overflow-hidden pb-20 md:min-h-[calc(760px-var(--header-height))] md:pb-10">
      <DarkBlueRadialGradient />

      <div className="relative z-10 flex flex-col divide-y pt-16 lg:pt-32">
        <div className="mx-auto flex min-h-72 shrink-0 flex-col items-start justify-center p-4 sm:px-16 md:max-w-[80vw] md:items-center lg:px-24">
          <div className="mb-4 inline-flex items-center rounded-full border !border-border-primary-subtle bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary-foreground-subtle dark:bg-primary-subtle/50 md:px-4 md:py-2 md:text-sm">
            <Bot className="mr-2 size-4" />
            AI-Powered ERP & Sales Assistant
          </div>

          <h1 className="mb-4 max-w-screen-lg text-pretty bg-gradient-to-tr from-foreground to-secondary-foreground/80 bg-clip-text text-left text-[clamp(32px,5vw,64px)] font-medium leading-none tracking-[-1.44px] text-transparent md:text-center md:tracking-[-2.16px]">
            Transform Your Customer
            <br /> Support with AI
          </h1>

          <h2 className="mb-6 max-w-3xl text-pretty text-left text-base dark:text-secondary-foreground md:text-center md:text-lg">
            Pica Bot is an intelligent AI assistant application that integrates with your ERP POS system, empowering
            your customer support staff with instant access to product information, recommendations, and multilingual
            chat capabilities.
          </h2>

          <div className="flex w-full flex-col items-center justify-start gap-2 sm:flex-row md:justify-center lg:w-auto lg:gap-4">
            <Button variant="primary" asChild size="lg" className="w-full sm:w-auto">
              <Link href={"/chat"}>
                Try Pica Bot Free <ArrowRight className="ml-2 text-lg" />
              </Link>
            </Button>
            <Button size="lg" className="w-full sm:w-auto">
              <Play className="mr-2 text-lg" />
              See Interface Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
