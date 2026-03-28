import { Target, Palette, Layout, Bot, Share2, BarChart } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const services = [
  { icon: Target, title: "Meta Ads Mastery", desc: "ROI-driven testing structure with precision targeting and iterative creative optimization." },
  { icon: Palette, title: "AI Creative Studio", desc: "Conversion-focused visuals engineered to stop the scroll and drive action." },
  { icon: Layout, title: "Website Revamp", desc: "Improve clarity and trust through structure. Every element earns its place." },
  { icon: Bot, title: "AI Automation", desc: "Chatbots, workflow automation, and intelligent lead routing that works 24/7." },
  { icon: Share2, title: "Strategic Social Media", desc: "Consistent brand positioning across platforms with measurable engagement." },
  { icon: BarChart, title: "Performance Tracking", desc: "Decision clarity through data. Custom dashboards that reveal what matters." },
];

const Services = () => {
  return (
    <section id="services" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Execution</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Core Services</h2>
          <p className="text-muted-foreground mb-12 max-w-lg">Each service follows: Diagnosis → Strategy → Execution.</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.08}>
              <div className="glow-card p-6 sm:p-8 group h-full">
                <s.icon size={28} className="text-secondary mb-5 group-hover:text-primary transition-colors duration-300" />
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
