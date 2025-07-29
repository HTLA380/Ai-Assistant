import { Avatar, AvatarFallback, AvatarGroup, Button, Input } from "@mijn-ui/react"

export const WaitlistSection = () => {
  return (
    <section
      id="waitlist"
      className="relative flex min-h-[520px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 -z-[1] hidden dark:block"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 -z-[1] block dark:hidden"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fafafa 45%, #6365f14c 100%)",
        }}
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-pretty bg-gradient-to-tr from-foreground to-secondary-foreground/80 bg-clip-text text-center text-3xl font-medium text-transparent md:text-4xl">
          Join Our Product Launch Waitlist
        </h2>
        <p className="mb-4 max-w-screen-md text-pretty text-center text-base font-light text-foreground/70 sm:mb-8 sm:text-lg md:text-xl">
          Be part of something truly extraordinary. Join thousands of others already gaining early access to our
          revolutionary new product.
        </p>

        <div className="mb-8 flex w-full max-w-lg flex-col items-center justify-center gap-2 sm:flex-row">
          <Input placeholder="Enter your email" className="h-10 w-full px-4" />
          <Button className="h-10 shrink-0" variant="primary">
            Get Notified
          </Button>
        </div>

        <div className="flex w-full max-w-xl items-center justify-between">
          <AvatarGroup>
            <Avatar size="xs">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar size="xs">
              <AvatarFallback className="border-orange-200 bg-orange-100 dark:border-orange-800 dark:bg-orange-900">
                AS
              </AvatarFallback>
            </Avatar>
            <Avatar size="xs">
              <AvatarFallback className="border-purple-200 bg-purple-100 dark:border-purple-800 dark:bg-purple-900">
                MK
              </AvatarFallback>
            </Avatar>
          </AvatarGroup>

          <p className="text-pretty font-semibold text-secondary-foreground">100+ people on the waitlist</p>
        </div>
      </div>
    </section>
  )
}
