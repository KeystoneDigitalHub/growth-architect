import { Search, Lightbulb, Rocket } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import readmeImg from "@/assets/README_ME.png";

const steps = [
  { icon: Search, title: "Diagnose", desc: "AI detects revenue leaks — low inquiries, weak websites, wasted ad spend." },
  { icon: Lightbulb, title: "Discover", desc: "AI identifies missed traffic opportunities, content gaps, and GEO scaling potential." },
  { icon: Rocket, title: "Deploy", desc: "Use insights to improve ads, funnels, and automation workflows." },
];

const HowItWorks = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <AnimatedSection>
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Framework</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">How It Works</h2>
        <p className="text-muted-foreground mb-12 max-w-lg">Diagnose → Discover → Deploy. Our decision-driven growth framework.</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {steps.map((s, i) => (
          <AnimatedSection key={s.title} delay={i * 0.1}>
            <div className="glow-card p-8 text-center h-full">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "var(--gradient-primary)" }}>
                <s.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection className="max-w-4xl mx-auto">
        <img src={readmeImg} alt="Keystone Decision-Driven Framework" className="w-full rounded-xl border border-border" loading="lazy" />
      </AnimatedSection>
    </div>
  </section>
);

export default HowItWorks;
