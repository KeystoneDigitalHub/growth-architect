import founderImg from "@/assets/founder.png";
import AnimatedSection from "./AnimatedSection";

const Founder = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">The Architect</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 tracking-tight">
            Meet the Founder
          </h2>
        </AnimatedSection>

        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <AnimatedSection className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0">
            <img src={founderImg} alt="Shahan-E-Ali — Founder of Keystone Growth Hub" className="w-full h-full object-cover" loading="lazy" />
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="text-center md:text-left max-w-xl">
            <h3 className="text-2xl font-bold mb-1">Shahan-E-Ali</h3>
            <p className="text-sm text-primary mb-4">Growth Architect & System Strategist</p>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              An analytical strategist who combines supply chain logic with AI automation systems. 
              Focused on building decision-driven growth infrastructure — not decorative design. 
              Every system follows: Diagnosis → Strategy → Execution.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Founder;
