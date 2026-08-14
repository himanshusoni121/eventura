import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlannerHero from "@/components/planner/PlannerHero";
import MultiStepForm from "@/components/planner/MultiStepForm";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export const metadata = {
  title: "Plan Event & Get Quote | Eventura Luxury Events Jodhpur",
  description: "Calculate your event budget and receive a customized luxury proposal from Eventura, Jodhpur's premier event management company and wedding planner.",
};

export default function PlannerPage() {
  return (
    <main className="relative min-h-screen bg-[var(--bg)]">
      <ScrollProgress />
      <Navbar />
      
      <PlannerHero />
      <MultiStepForm />
      
      <Footer />
      
      <BackToTop />
      <WhatsAppFloat />
    </main>
  );
}
