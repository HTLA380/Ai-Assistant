import Link from "next/link"
import { Button } from "@mijn-ui/react"
import { steps } from "./constants"

export const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative flex max-w-screen-xl flex-col items-start gap-10 px-4 py-14 md:px-8 md:py-[72px] lg:mx-auto lg:!flex-row lg:gap-0 lg:py-20">
      <div className="relative top-0 shrink self-stretch lg:w-1/2 lg:pl-0 lg:pr-12 xl:pr-20">
        <div className="sticky top-[calc(var(--header-height)+40px)] flex flex-col gap-6">
          <div className="flex flex-col items-start gap-3 self-start">
            <h2 className="text-pretty bg-gradient-to-tr from-foreground to-secondary-foreground/80 bg-clip-text text-center text-3xl font-medium text-transparent md:text-4xl">
              How It Works
            </h2>
            <p className="max-w-screen-md text-pretty text-left text-lg font-light text-secondary-foreground md:text-xl">
              Get up and running with Pica Bot in three simple steps.
            </p>
          </div>
          <div className="flex items-center gap-3 md:order-3">
            <Button asChild variant="primary">
              <Link href={"/register"}>Get started</Link>
            </Button>
            <Button asChild>
              <Link href={"/"}>See more</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 shrink-0 lg:w-1/2 lg:flex-1">
        <div className="no-scrollbar flex gap-20 overflow-auto px-6 pb-10 lg:flex-col lg:overflow-visible lg:border-l lg:px-0">
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative flex w-[280px] shrink-0 flex-col gap-4 rounded-lg p-4 pl-8 lg:w-full lg:flex-row lg:pl-10 lg:pr-5">
              <div className="flex flex-col items-start gap-1">
                <div className="absolute -left-[18px] top-[18px] flex size-9 shrink-0 items-center justify-center rounded-full border bg-background-alt [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]">
                  {step.number}
                </div>

                <h5 className="text-lg font-medium">{step.title}</h5>
                <p className="text-pretty text-secondary-foreground">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
