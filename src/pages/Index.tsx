import { GatekeeperProvider } from "@/contexts/GatekeeperContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemGrid from "@/components/ProblemGrid";
import Services from "@/components/Services";
import AIToolbox from "@/components/AIToolbox";
import Portfolio from "@/components/Portfolio";
import Founder from "@/components/Founder";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";

const Index = () => {
  return (
    <GatekeeperProvider>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <ProblemGrid />
        <Services />
        <AIToolbox />
        <Portfolio />
        <Founder />
        <AuditForm />
        <Footer />
        <LeadModal />
      </div>
    </GatekeeperProvider>
  );
};

export default Index;
