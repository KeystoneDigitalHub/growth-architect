import { ArrowRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import founderHero from "@/assets/founder-hero.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-28 sm:pt-32 overflow-hidden">
      {/* Ambient glow */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground mb-8">
              <BarChart3 size={14} className="text-primary" />
              Leads &gt; Likes. Pretty ≠ Profit.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Stop Guessing.{" "}
              <span className="gradient-text">Start Scaling</span> with AI-Powered Ads, Design & Automation.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
              We fix unattractive websites, optimize wasted ad spend, and build autonomous AI workflows that scale small businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#audit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}
              >
                Audit My Brand
                <ArrowRight size={16} />
              </a>
              <a
                href="https://linktr.ee/Keystone_Digital_Hub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-muted transition-colors"
              >
                Explore Portfolio
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
              alt="Shahan-E-Ali with Keystone Growth Hub AI Dashboard"
              className="w-full rounded-2xl"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
