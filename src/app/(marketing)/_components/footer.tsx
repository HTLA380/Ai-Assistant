import { Bot, Globe, MessageCircle, Shield } from "lucide-react"

export const Footer = () => {
  return (
    <footer id="contact" className="bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <Bot className="text-2xl text-primary" />
              <span className="text-xl font-bold">Pica Bot</span>
            </div>
            <p className="mb-4 text-secondary-foreground">
              The intelligent AI assistant for ERP and sales teams in the medical and supplement industry.
            </p>
            <div className="flex space-x-4">
              <Globe className="size-5 text-secondary-foreground" />
              <MessageCircle className="size-5 text-secondary-foreground" />
              <Shield className="size-5 text-secondary-foreground" />
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-2 text-secondary-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-secondary-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-secondary-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-secondary-foreground">
          <p>&copy; 2024 Pica Bot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
