import { createFileRoute } from '@tanstack/react-router'
import { LandingNavbar } from '../components/landing/landing-navbar'
import { HeroSection } from '../components/landing/hero-section'
import { DashboardShowcase } from '../components/landing/dashboard-showcase'
import { FeaturesSection } from '../components/landing/features-section'
import { WhyChooseSection } from '../components/landing/why-choose-section'
import { CalculatorSection } from '../components/landing/calculator-section'
import { TestimonialsSection } from '../components/landing/testimonials-section'
import { CtaBannerSection } from '../components/landing/cta-banner-section'
import { LandingFooter } from '../components/landing/landing-footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1C1C1E] selection:bg-purple-100 selection:text-purple-900 font-sans">
      <LandingNavbar />
      <main>
        <HeroSection />
        <DashboardShowcase />
        <FeaturesSection />
        <WhyChooseSection />
        <CalculatorSection />
        <TestimonialsSection />
        <CtaBannerSection />
      </main>
      <LandingFooter />
    </div>
  )
}
