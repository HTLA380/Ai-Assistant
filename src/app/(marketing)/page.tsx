import React from "react"
import { AnnouncementBar } from "./_components/announcement-bar"
import { FeaturesSection } from "./_components/features-section"
import { Footer } from "./_components/footer"
import { HeroSection } from "./_components/hero-section"
import { HowItWorksSection } from "./_components/how-it-works-section"
import { Navbar } from "./_components/navbar"
import { ProductOverviewSection } from "./_components/product-overview-section"
import { WaitlistSection } from "./_components/waitlist-section"

const HomePage = () => {
  return (
    <div className="min-h-svh transition-colors duration-300">
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <ProductOverviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
