import { MessageSquareOff, Globe, TrendingDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const problems = [
  {
    icon: MessageSquareOff,
    title: "Drowning in Noise",
    desc: "High posting, low inquiries. Content without strategy is noise. Engagement without conversion is vanity.",
  },
  {
    icon: Globe,
    title: "Broken Funnel",
    desc: "Unattractive or non-converting website. Your storefront doesn't convert — it's costing you.",
  },
  {
    icon: TrendingDown,
    title: "Burning Ad Budget",
    desc: "Running ads without ROI clarity. Every dollar spent without tracking is a dollar donated to the algorithm.",
  },
];

const ProblemGrid = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Diagnosis</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Sound familiar?</h2>
          <p className="text-muted-foreground mb-12 max-w-lg">
            Growth problems are rarely isolated. They exist across the funnel.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.1}>
              <div className="glow-card p-6 sm:p-8 h-full">
                <p.icon size={28} className="text-primary mb-5" />
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemGrid;
