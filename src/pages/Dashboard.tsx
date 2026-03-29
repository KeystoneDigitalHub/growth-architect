import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles, Search, TrendingUp, ArrowLeft, Loader2, Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

// ✅ FIXED: Proper asset imports from src/assets
import hookGenImg from "@/assets/Ai_Hook_Generator.png";
import gapHunterImg from "@/assets/Gap_Hunter_Upgraded.png";

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
  search_intent: string;
  traffic_potential: string;
  geo_market: string;
  your_status: string;
  competitor_status: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hooks" | "gaps">("hooks");

  // Hook Generator State
  const [hookIndustry, setHookIndustry] = useState("E-commerce");
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [hookLoading, setHookLoading] = useState(false);
  const [hookError, setHookError] = useState("");

  // Gap Hunter State
  const [gapBusiness, setGapBusiness] = useState("");
  const [gaps, setGaps] = useState<GapItem[]>([]);
  const [gapLoading, setGapLoading] = useState(false);
  const [gapError, setGapError] = useState("");

  // Lead score + referral lock
  const [leadScore, setLeadScore] = useState<number | null>(null);
  const [referralCount, setReferralCount] = useState(0);
  const gapLocked = referralCount < 2;

  useEffect(() => {
    const fetchLatestLead = async () => {
      const { data } = await supabase
        .from("leads")
        .select("lead_score, referral_count")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setLeadScore(data.lead_score ?? null);
        setReferralCount(data.referral_count ?? 0);
      }
    };
    fetchLatestLead();
  }, []);

  const generateHooks = async () => {
    setHookLoading(true);
    setHookError("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-hooks", {
        body: { industry: hookIndustry },
      });
      if (error) throw error;
      if (data?.hooks) {
        setHooks(data.hooks);
      } else {
        setHookError("No hooks returned. Check edge function.");
      }
    } catch (e: any) {
      setHookError(e.message || "AI service error. Check GROQ_API_KEY in Supabase secrets.");
    }
    setHookLoading(false);
  };

  const generateGaps = async () => {
    if (!gapBusiness || gapLocked) return;
    setGapLoading(true);
    setGapError("");
    try {
      const { data, error } = await supabase.functions.invoke("generate-gaps", {
        body: { business_type: gapBusiness },
      });
      if (error) throw error;
      if (data?.gaps) setGaps(data.gaps);
    } catch (e: any) {
      setGapError(e.message || "Gap analysis failed.");
    }
    setGapLoading(false);
  };

  const labelColor = (label: string) => {
    if (label.toLowerCase().includes("aggressive")) return "text-red-400";
    if (label.toLowerCase().includes("high")) return "text-green-400";
    if (label.toLowerCase().includes("strong")) return "text-blue-400";
    return "text-yellow-400";
  };

  const ctrWidth = (ctr: string) => {
    const num = parseFloat(ctr);
    return isNaN(num) ? "40%" : `${Math.min(num * 15, 100)}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-sm bg-background/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Keystone
            </span>{" "}
            Dashboard
          </h1>
        </div>

        {/* Lead Score Badge */}
        {leadScore !== null && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs text-purple-300 font-medium">
              Growth Score: {leadScore}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("hooks")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "hooks"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles size={14} className="inline mr-1" /> Hooks
          </button>
          <button
            onClick={() => setActiveTab("gaps")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "gaps"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search size={14} className="inline mr-1" /> Gaps
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ===== HOOK GENERATOR TAB ===== */}
        {activeTab === "hooks" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Reference Image Preview */}
            <div className="mb-6 rounded-xl overflow-hidden border border-purple-500/20 max-h-48 object-cover">
              <img
                src={hookGenImg}
                alt="Hook Generator Reference"
                className="w-full h-48 object-cover object-top"
              />
            </div>

            <h2 className="text-2xl font-bold mb-1">AI Ad Hook Generator</h2>
            <p className="text-muted-foreground text-sm mb-6">
              3 strategic hooks — Emotional, Performance, Contrarian. Built for conversion.
            </p>

            <div className="flex gap-3 mb-8 flex-wrap">
              <select
                value={hookIndustry}
                onChange={(e) => setHookIndustry(e.target.value)}
                className="px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {[
                  "E-commerce", "Real Estate", "Consulting", "Agency",
                  "Education", "Healthcare", "Local Business", "SaaS",
                  "Bridal & Fashion", "Food & Restaurant"
                ].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <button
                onClick={generateHooks}
                disabled={hookLoading}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90 bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {hookLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "⚡ Generate Hooks"
                )}
              </button>
            </div>

            {hookError && (
              <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                ⚠️ {hookError}
              </div>
            )}

            {hooks.length > 0 && (
              <div className="grid md:grid-cols-3 gap-5">
                {hooks.map((hook, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="p-6 rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                        {hook.type}
                      </span>
                      <span className={`text-xs font-semibold ${labelColor(hook.label)}`}>
                        {hook.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-2 leading-snug">{hook.headline}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {hook.primary_text}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-purple-400 font-medium">CTA: {hook.cta}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="text-green-400" />
                        <span className="text-green-400 font-bold">{hook.ctr}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: ctrWidth(hook.ctr) }}
                        transition={{ delay: i * 0.12 + 0.3, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ===== GAP HUNTER TAB ===== */}
        {activeTab === "gaps" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Reference Image */}
            <div className="mb-6 rounded-xl overflow-hidden border border-purple-500/20 max-h-48">
              <img
                src={gapHunterImg}
                alt="Gap Hunter Reference"
                className="w-full h-48 object-cover object-top"
              />
            </div>

            <h2 className="text-2xl font-bold mb-1">AI Content Gap Hunter</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Identify what your competitors rank for — UK, USA, UAE, Canada targeting.
            </p>

            {/* Referral Lock */}
            {gapLocked ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-center"
              >
                <Lock size={36} className="text-yellow-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Gap Hunter Locked</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Refer <strong className="text-yellow-400">2 businesses</strong> to unlock full
                  Gap Hunter access. You have {referralCount}/2 referrals.
                </p>
                <button className="mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500">
                  Share Referral Link
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex gap-3 mb-8 flex-wrap">
                  <input
                    value={gapBusiness}
                    onChange={(e) => setGapBusiness(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="e.g. Bridal fashion Karachi, SaaS agency Dubai"
                    onKeyDown={(e) => e.key === "Enter" && generateGaps()}
                  />
                  <button
                    onClick={generateGaps}
                    disabled={gapLoading || !gapBusiness}
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity hover:opacity-90 bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    {gapLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "🔍 Hunt Gaps"
                    )}
                  </button>
                </div>

                {gapError && (
                  <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    ⚠️ {gapError}
                  </div>
                )}

                {gaps.length > 0 && (
                  <div className="rounded-xl border border-purple-500/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-purple-500/5">
                            <th className="text-left p-4 text-muted-foreground font-medium">Keyword</th>
                            <th className="text-center p-4 text-muted-foreground font-medium">Search Intent</th>
                            <th className="text-center p-4 text-muted-foreground font-medium">Your Status</th>
                            <th className="text-center p-4 text-muted-foreground font-medium">Competitor</th>
                            <th className="text-center p-4 text-muted-foreground font-medium">Traffic</th>
                            <th className="text-center p-4 text-muted-foreground font-medium">GEO Market</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gaps.map((gap, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07 }}
                              className="border-b border-border/50 hover:bg-purple-500/5 transition-colors"
                            >
                              <td className="p-4 font-medium">{gap.keyword}</td>
                              <td className="p-4 text-center text-xs text-blue-400 font-medium">
                                {gap.search_intent}
                              </td>
                              <td className="p-4 text-center">
                                {gap.your_status === "MISSING" ? (
                                  <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-xs font-medium">
                                    MISSING
                                  </span>
                                ) : (
                                  <span className="text-green-400 text-base">✓</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                {gap.competitor_status === "RANKING" ? (
                                  <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 text-xs font-medium">
                                    RANKING
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs">–</span>
                                )}
                              </td>
                              <td className="p-4 text-center text-purple-400 font-semibold">
                                {gap.traffic_potential}
                              </td>
                              <td className="p-4 text-center text-xs">{gap.geo_market}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;