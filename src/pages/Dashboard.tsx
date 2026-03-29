import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Search, BarChart3, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

type Hook = {
  type: string;
  primary_text: string;
  headline: string;
  cta: string;
  ctr: string;
  label: string;
};

type GapItem = {
  keyword: string;
  your_status: string;
  competitor_status: string;
  traffic_potential: string;
  geo_market: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hooks" | "gaps">("hooks");

  // Hook Generator State
  const [hookIndustry, setHookIndustry] = useState("E-commerce");
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [hookLoading, setHookLoading] = useState(false);

  // Gap Hunter State
  const [gapBusiness, setGapBusiness] = useState("");
  const [gaps, setGaps] = useState<GapItem[]>([]);
  const [gapLoading, setGapLoading] = useState(false);

  const generateHooks = async () => {
    setHookLoading(true);
    try {
      const { data } = await supabase.functions.invoke("generate-hooks", {
        body: { industry: hookIndustry },
      });
      if (data?.hooks) setHooks(data.hooks);
    } catch (e) {
      console.error(e);
    }
    setHookLoading(false);
  };

  const generateGaps = async () => {
    if (!gapBusiness) return;
    setGapLoading(true);
    try {
      const { data } = await supabase.functions.invoke("generate-gaps", {
        body: { business_type: gapBusiness },
      });
      if (data?.gaps) setGaps(data.gaps);
    } catch (e) {
      console.error(e);
    }
    setGapLoading(false);
  };

  const labelColor = (label: string) => {
    if (label.includes("Aggressive")) return "text-red-400";
    if (label.includes("High")) return "text-green-400";
    if (label.includes("Strong")) return "text-blue-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold"><span className="gradient-text">Keystone</span> Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("hooks")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "hooks" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Sparkles size={14} className="inline mr-1" /> Hook Generator
          </button>
          <button onClick={() => setActiveTab("gaps")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "gaps" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Search size={14} className="inline mr-1" /> Gap Hunter
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {activeTab === "hooks" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold mb-2">AI Ad Hook Generator</h2>
            <p className="text-muted-foreground text-sm mb-6">Generate 3 strategic ad hooks — Emotional, Performance, Contrarian.</p>

            <div className="flex gap-3 mb-8">
              <select value={hookIndustry} onChange={(e) => setHookIndustry(e.target.value)}
                className="px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                {["E-commerce", "Real Estate", "Consulting", "Agency", "Education", "Healthcare", "Local Business", "SaaS"].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <button onClick={generateHooks} disabled={hookLoading}
                className="px-6 py-3 rounded-lg text-sm font-medium text-primary-foreground disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}>
                {hookLoading ? <Loader2 size={16} className="animate-spin" /> : "Generate"}
              </button>
            </div>

            {hooks.length > 0 && (
              <div className="grid md:grid-cols-3 gap-5">
                {hooks.map((hook, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glow-card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{hook.type}</span>
                      <span className={`text-xs font-medium ${labelColor(hook.label)}`}>{hook.label}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{hook.headline}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{hook.primary_text}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-primary font-medium">CTA: {hook.cta}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-green-400" />
                        <span className="text-green-400 font-bold">{hook.ctr}</span>
                      </div>
                    </div>
                    {/* CTR bar */}
                    <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: hook.ctr }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "gaps" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold mb-2">AI Content Gap Hunter</h2>
            <p className="text-muted-foreground text-sm mb-6">Identify keyword gaps and content opportunities your competitors are ranking for.</p>

            <div className="flex gap-3 mb-8">
              <input value={gapBusiness} onChange={(e) => setGapBusiness(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter your business type or niche" />
              <button onClick={generateGaps} disabled={gapLoading || !gapBusiness}
                className="px-6 py-3 rounded-lg text-sm font-medium text-primary-foreground disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}>
                {gapLoading ? <Loader2 size={16} className="animate-spin" /> : "Analyze"}
              </button>
            </div>

            {gaps.length > 0 && (
              <div className="glow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-muted-foreground font-medium">Keyword</th>
                        <th className="text-center p-4 text-muted-foreground font-medium">Your Business</th>
                        <th className="text-center p-4 text-muted-foreground font-medium">Competitors</th>
                        <th className="text-center p-4 text-muted-foreground font-medium">Traffic Potential</th>
                        <th className="text-center p-4 text-muted-foreground font-medium">GEO Market</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gaps.map((gap, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium">{gap.keyword}</td>
                          <td className="p-4 text-center">
                            {gap.your_status === "MISSING" ? (
                              <span className="text-red-400 font-medium text-xs">MISSING</span>
                            ) : (
                              <span className="text-green-400">✓</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {gap.competitor_status === "MISSING" ? (
                              <span className="text-red-400 font-medium text-xs">MISSING</span>
                            ) : (
                              <span className="text-green-400">✓</span>
                            )}
                          </td>
                          <td className="p-4 text-center text-primary font-medium">{gap.traffic_potential}</td>
                          <td className="p-4 text-center">{gap.geo_market}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
