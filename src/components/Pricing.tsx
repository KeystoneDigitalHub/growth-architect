import { Check, Zap } from "lucide-react";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

const tiers = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    desc: "Try the AI audit engine",
    features: ["1 AI Growth Audit", "Basic PDF Report", "Lead Score", "WhatsApp Support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    monthly: 15,
    yearly: 144,
    desc: "For scaling businesses",
    features: ["Unlimited Audits", "AI Hook Generator", "Content Gap Hunter", "GEO Expansion Reports", "Priority Support"],
    cta: "Start Growing",
    highlight: true,
  },
  {
    name: "Pro",
    monthly: 29,
    yearly: 278,
    desc: "Full AI growth stack",
    features: ["Everything in Growth", "Admin CRM Dashboard", "Custom AI Prompts", "API Access", "White-Label Reports", "Dedicated Strategist"],
    cta: "Go Pro",
    highlight: false,
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Simple, Transparent Pricing</h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button onClick={() => setYearly(!yearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${yearly ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
            <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>Yearly <span className="text-primary text-xs">(Save 20%)</span></span>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.1}>
              <div className={`glow-card p-8 h-full flex flex-col ${tier.highlight ? "border-primary/50 ring-1 ring-primary/20" : ""}`}>
                {tier.highlight && (
                  <div className="text-xs font-medium text-primary-foreground px-3 py-1 rounded-full w-fit mb-4" style={{ background: "var(--gradient-primary)" }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{tier.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${yearly ? Math.round(tier.yearly / 12) : tier.monthly}</span>
                  {tier.monthly > 0 && <span className="text-muted-foreground text-sm">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#audit"
                  className={`block text-center px-6 py-3 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 ${tier.highlight ? "text-primary-foreground" : "border border-border text-foreground hover:bg-muted"}`}
                  style={tier.highlight ? { background: "var(--gradient-primary)" } : undefined}>
                  {tier.cta}
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Founder LTD */}
        <AnimatedSection>
          <div className="glow-card p-8 text-center border-primary/40">
            <Zap size={28} className="text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Founder Lifetime Deal</h3>
            <p className="text-muted-foreground mb-4">One-time payment. Lifetime access to all Pro features. Limited to 50 users.</p>
            <div className="text-5xl font-bold mb-6">$99 <span className="text-lg text-muted-foreground font-normal">one-time</span></div>
            <a href="#audit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90"
              style={{ background: "var(--gradient-primary)" }}>
              Claim Lifetime Access
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Pricing;
