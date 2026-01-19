import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import Pricing from "../components/Pricing"
import FAQ from "../components/FAQ"
import Footer from "../components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Hero />
      <Features />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <FAQ />
      <Footer />
    </div>
  )
}
