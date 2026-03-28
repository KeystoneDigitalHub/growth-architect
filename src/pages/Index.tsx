import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemGrid from "@/components/ProblemGrid";
import Services from "@/components/Services";
import AIToolbox from "@/components/AIToolbox";
import Portfolio from "@/components/Portfolio";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemGrid />
      <Services />
      <AIToolbox />
      <Portfolio />
      <AuditForm />
      <Footer />
    </div>
  );
};

export default Index;
