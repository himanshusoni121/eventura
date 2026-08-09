import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlannerHero from "@/components/planner/PlannerHero";
import MultiStepForm from "@/components/planner/MultiStepForm";
import ScrollProgress from "@/components/ui/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export const metadata = {
  title: "Plan Event & Get Quote | Eventura",
  description: "Plan your dream event with our interactive budget estimator and receive a customized premium proposal.",
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
