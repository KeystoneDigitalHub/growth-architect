import { ArrowRight, BarChart3, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import founderHero from "@/assets/Updated_Landing.png";

const rotatingHeadlines = [
  "AI Reveals Why Your Ads Are Not Converting",
  "Find Hidden Revenue Opportunities in 30 Seconds",
  "Your Competitors Are Already Using AI",
  "Fix Conversion Leaks Instantly",
];

const Hero = () => {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % rotatingHeadlines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* LTD Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] text-center py-2 text-xs sm:text-sm font-medium text-primary-foreground"
        style={{ background: "var(--gradient-primary)" }}>
        <Zap size={14} className="inline mr-1" />
        Founder Lifetime Deal — <strong>$99</strong> (Limited to 50 Users)
        <a href="#pricing" className="ml-2 underline underline-offset-2 opacity-90 hover:opacity-100">Claim Now →</a>
      </div>

      <section className="relative min-h-screen flex items-center section-padding pt-36 sm:pt-40 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: "var(--gradient-primary)" }} />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl flex-1"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground mb-6">
                <BarChart3 size={14} className="text-primary" />
                2,184+ audits generated · 32% Avg CTR lift
              </div>

              <div className="h-[4.5rem] sm:h-[5.5rem] lg:h-[6.5rem] mb-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={headlineIndex}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight"
                  >
                    <span className="gradient-text">{rotatingHeadlines[headlineIndex]}</span>
                  </motion.h1>
                </AnimatePresence>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
                AI detects revenue leaks, ad opportunities, and GEO scaling gaps instantly.
                Stop guessing — start scaling with data-driven intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#audit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Run Free AI Growth Audit
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-muted transition-colors"
                >
                  View Pricing
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex-1 max-w-md lg:max-w-lg"
            >
              <img
                src={founderHero}
                alt="Keystone Growth Systems AI Dashboard"
                className="w-full rounded-2xl"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
