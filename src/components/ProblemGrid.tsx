import { MessageSquareOff, Globe, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: MessageSquareOff,
    title: "Low inquiries despite posting frequently",
    desc: "Content without strategy is noise. Engagement without conversion is vanity.",
  },
  {
    icon: Globe,
    title: "Weak website structure reducing trust",
    desc: "Your website is your storefront. If it doesn't convert, it's costing you.",
  },
  {
    icon: TrendingDown,
    title: "Ad spend without ROI clarity",
    desc: "Every dollar spent without tracking is a dollar donated to the algorithm.",
  },
];

const ProblemGrid = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Diagnosis</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          Sound familiar?
        </h2>
        <p className="text-muted-foreground mb-12 max-w-lg">
          Growth problems are rarely isolated. They exist across the funnel.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div key={p.title} className="glow-card p-6 sm:p-8">
              <p.icon size={28} className="text-primary mb-5" />
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemGrid;
