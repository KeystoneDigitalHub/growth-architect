import { Sparkles, PenTool, Zap, Search, Unlock, Brain } from "lucide-react";
import { useGatekeeper } from "@/contexts/GatekeeperContext";
import AnimatedSection from "./AnimatedSection";

const tools = [
  { icon: Sparkles, name: "LeadAudit AI", desc: "Diagnose lead funnel gaps instantly" },
  { icon: PenTool, name: "TrendPost AI", desc: "Generate trend-aligned content ideas" },
  { icon: Zap, name: "Hook Generator", desc: "Create scroll-stopping ad hooks" },
  { icon: Search, name: "RankIQ AI", desc: "SEO intelligence for content ranking" },
  { icon: Unlock, name: "Insight Unlocked", desc: "Competitive analysis automation" },
  { icon: Brain, name: "Keystone AI Hub", desc: "Unified growth intelligence dashboard" },
];

const AIToolbox = () => {
  const { isUnlocked, openModal } = useGatekeeper();

  const handleTryTool = () => {
    if (!isUnlocked) {
      openModal();
    }
  };

  return (
    <section id="toolbox" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Capability Proof</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">AI Toolbox</h2>
          <p className="text-muted-foreground mb-12 max-w-lg">
            Proprietary diagnostic tools that power our strategic decisions.
            {!isUnlocked && <span className="text-primary ml-1">🔒 Submit your details to unlock.</span>}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tools.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.08}>
              <div className="glow-card p-5 sm:p-6 text-center h-full flex flex-col items-center">
                <t.icon size={24} className="text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-1">{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{t.desc}</p>
                <button
                  onClick={handleTryTool}
                  className="mt-auto text-xs font-medium px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
                >
                  {isUnlocked ? "Try Tool →" : "🔒 Unlock"}
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIToolbox;
