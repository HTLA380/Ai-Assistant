import { Bot, CheckCircle } from "lucide-react"

export const ProductOverviewSection = () => {
  return (
    <section className="border-t bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-center gap-2 text-start md:mb-16 md:items-center md:text-center">
          <h2 className="text-pretty bg-gradient-to-tr from-foreground to-secondary-foreground/80 bg-clip-text text-[1.75rem]/7 font-medium text-transparent sm:text-3xl md:text-4xl">
            Your AI-Powered Assistant App
          </h2>
          <p className="max-w-screen-md text-pretty text-base font-light text-foreground/70 sm:text-lg md:text-xl">
            Pica Bot is a dedicated AI assistant application that your team logs into to get instant help with customer
            inquiries, product recommendations, and ERP data - all in one intelligent interface.
          </p>
        </div>

        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-12">
          <div>
            <h3 className="text-xl font-medium sm:text-2xl md:text-3xl">Perfect for Your Team</h3>
            <div className="space-y-4 p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 size-6 shrink-0 text-success-emphasis" />
                <div>
                  <h4 className="font-semibold text-foreground">Small Business Owners</h4>
                  <p className="font-normal text-secondary-foreground">
                    Streamline operations and improve customer satisfaction
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 size-6 shrink-0 text-success-emphasis" />
                <div>
                  <h4 className="font-semibold text-foreground">Sales Managers</h4>
                  <p className="font-normal text-secondary-foreground">
                    Streamline operations and improve customer satisfaction
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 size-6 shrink-0 text-success-emphasis" />
                <div>
                  <h4 className="font-semibold text-foreground">Store Staff & POS Users</h4>
                  <p className="font-normal text-secondary-foreground">
                    Get instant product information and recommendations
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="mt-1 size-6 shrink-0 text-success-emphasis" />
                <div>
                  <h4 className="font-semibold text-foreground">Support Teams</h4>
                  <p className="font-normal text-secondary-foreground">
                    Provide consistent, accurate customer assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-background p-8 shadow-xl">
            <div className="mb-4 flex items-center space-x-3">
              <Bot className="text-xl text-primary" />
              <div>
                <h4 className="font-semibold text-foreground">Pica Bot Assistant</h4>
                <p className="text-sm text-success-emphasis">Online</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-border-secondary bg-background-alt p-3">
                <p className="text-sm text-secondary-foreground">
                  &quot;Do you have any vitamin D supplements in stock?&quot;
                </p>
              </div>
              <div className="ml-8 rounded-lg bg-primary p-3 text-primary-foreground">
                <p className="text-sm">
                  Yes! I found 3 vitamin D supplements in stock:
                  <br />• Vitamin D3 1000 IU (24 units)
                  <br />• Vitamin D3 2000 IU (18 units)
                  <br />• Vitamin D3 5000 IU (12 units)
                  <br />
                  <br />
                  Would you like me to check pricing or create a quote?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
