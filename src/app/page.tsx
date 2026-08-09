import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PortfolioMarquee from "@/components/PortfolioMarquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Statistics from "@/components/Statistics";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// UI Components
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import CookieConsent from "@/components/ui/CookieConsent";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ScrollProgress />
      <Navbar />
      
      <Hero />
      <PortfolioMarquee />
      <About />
      <Services />
      <Portfolio />
      <Statistics />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <FAQ />
      <Contact />
      
      <Footer />
      
      <BackToTop />
      <WhatsAppFloat />
      <CookieConsent />
    </main>
  );
}
