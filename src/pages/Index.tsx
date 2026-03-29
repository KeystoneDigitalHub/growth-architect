import { GatekeeperProvider } from "@/contexts/GatekeeperContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProblemGrid from "@/components/ProblemGrid";
import Services from "@/components/Services";
import AIToolbox from "@/components/AIToolbox";
import Portfolio from "@/components/Portfolio";
import Founder from "@/components/Founder";
import AuditForm from "@/components/AuditForm";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const Index = () => {
  return (
    <GatekeeperProvider>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <HowItWorks />
        <ProblemGrid />
        <Services />
        <AIToolbox />
        <Portfolio />
        <Founder />
        <AuditForm />
        <Pricing />
        <Footer />
        <LeadModal />
        <WhatsAppWidget />
      </div>
    </GatekeeperProvider>
  );
};

export default Index;
