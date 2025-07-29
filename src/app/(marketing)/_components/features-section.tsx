import { Button } from "@mijn-ui/react"
import { features } from "./constants"

export const FeaturesSection = () => {
  return (
    <section id="features" className="px-4 py-12 sm:px-6 sm:py-16 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-center gap-2 text-start md:mb-16 md:items-center md:text-center">
          <h2 className="text-pretty bg-gradient-to-tr from-foreground to-secondary-foreground/80 bg-clip-text text-[1.75rem]/7 font-medium text-transparent sm:text-3xl md:text-4xl">
            Powerful Features for Modern Businesses
          </h2>
          <p className="max-w-screen-md text-pretty text-lg font-light text-foreground/70 md:text-xl">
            Everything you need to provide exceptional customer support and streamline your sales process.
          </p>
        </div>

        <div className="grid justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex aspect-video max-w-md flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center [box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset] dark:[box-shadow:_70px_-20px_130px_0px_rgba(255,255,255,0.05)_inset]">
              <Button iconOnly className="size-9 rounded-full text-lg" variant="primary">
                <feature.icon className="size-6" />
              </Button>
              <h3 className="text-lg font-medium">{feature.title}</h3>
              <p className="text-pretty text-secondary-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
