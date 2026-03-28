import { useState, FormEvent } from "react";
import { ArrowRight, CheckCircle, Loader2, Download, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { calculateLeadScore, getLeadLabel } from "@/lib/leadScoring";
import { generateAuditPdf, downloadAuditPdf, type AuditData } from "@/lib/generatePdf";
import { useGatekeeper } from "@/contexts/GatekeeperContext";
import AnimatedSection from "./AnimatedSection";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type FormData = {
  name: string;
  email: string;
  business_type: string;
  ad_budget: string;
  website_url: string;
  whatsapp: string;
};

const AuditForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditData | null>(null);
  const [thankYouMsg, setThankYouMsg] = useState("");
  const { unlock } = useGatekeeper();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    business_type: "",
    ad_budget: "",
    website_url: "",
    whatsapp: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const budget = parseFloat(form.ad_budget) || 0;
    const leadScore = calculateLeadScore({
      ad_budget: budget,
      website_url: form.website_url,
      whatsapp: form.whatsapp,
      email: form.email,
      business_type: form.business_type,
    });

    try {
      const { data, error } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        business_type: form.business_type,
        ad_budget: budget,
        website_url: form.website_url || null,
        whatsapp: form.whatsapp || null,
        lead_score: leadScore,
      } as Record<string, unknown>).select("id").single();

      if (!error && window.fbq) {
        window.fbq("track", "Lead");
      }

      setLoading(false);
      setSubmitted(true);
      unlock();

      const label = getLeadLabel(leadScore);
      setThankYouMsg(`Lead Score: ${leadScore}/100 (${label}). Generating your AI audit report...`);

      // Trigger AI audit
      if (data?.id) {
        setAuditLoading(true);
        try {
          const { data: auditData } = await supabase.functions.invoke("generate-audit", {
            body: {
              website_url: form.website_url,
              business_type: form.business_type,
              name: form.name,
              lead_id: data.id,
            },
          });

          if (auditData?.audit) {
            const audit: AuditData = {
              ...auditData.audit,
              name: form.name,
              business_type: form.business_type,
            };
            setAuditResult(audit);
            setThankYouMsg(`Lead Score: ${leadScore}/100 (${label}). Your AI audit is ready!`);

            // Send email in background
            supabase.functions.invoke("send-report", {
              body: {
                to_email: form.email,
                name: form.name,
                conversion_score: audit.conversion_score,
                summary: audit.summary,
              },
            }).catch(() => {});
          }
        } catch {
          setThankYouMsg(`Lead Score: ${leadScore}/100 (${label}). We'll email your detailed audit shortly.`);
        }
        setAuditLoading(false);
      }
    } catch {
      setLoading(false);
      setSubmitted(true);
      setThankYouMsg("Your audit request is confirmed. Our team will follow up shortly.");
    }
  };

  if (submitted) {
    return (
      <section id="audit" className="section-padding">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <CheckCircle size={48} className="text-primary mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Audit Request Received</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{thankYouMsg}</p>

          {auditLoading && (
            <div className="flex items-center justify-center gap-3 text-primary mb-6">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">AI is analyzing your business...</span>
            </div>
          )}

          {auditResult && (
            <div className="text-left space-y-4 mt-8">
              <div className="glow-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} className="text-primary" />
                  <h3 className="font-semibold text-lg">AI Audit Results</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Conversion Score</span>
                    <p className="font-bold text-2xl text-primary">{auditResult.conversion_score}/100</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority</span>
                    <p className="font-bold text-lg">{auditResult.priority_level}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{auditResult.summary}</p>

                {auditResult.revenue_leaks?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm mb-2">Revenue Leaks:</p>
                    <ul className="space-y-1">
                      {auditResult.revenue_leaks.map((leak, i) => (
                        <li key={i} className="text-xs text-muted-foreground">• {leak}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => downloadAuditPdf(auditResult)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Download size={16} /> Download PDF Report
              </button>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-6">Keystone Growth Systems — Diagnosis → Strategy → Execution</p>
        </AnimatedSection>
      </section>
    );
  }

  return (
    <section id="audit" className="section-padding">
      <AnimatedSection className="max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Conversion Engine</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Your Growth Bottlenecks Identified in 30 Seconds.</h2>
        <p className="text-muted-foreground mb-8">Tell us about your business. Our AI will diagnose friction and map a growth path.</p>

        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= s ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="you@business.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Type *</label>
                <input type="text" required value={form.business_type} onChange={(e) => update("business_type", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="e.g. E-commerce, SaaS, Agency" />
              </div>
              <button type="button" onClick={() => { if (form.name && form.email && form.business_type) setStep(2); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}>
                Next Step <ArrowRight size={16} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Ad Budget ($) *</label>
                <input type="number" required value={form.ad_budget} onChange={(e) => update("ad_budget", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="e.g. 500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website URL</label>
                <input type="url" value={form.website_url} onChange={(e) => update("website_url", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="https://yourbusiness.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                <input type="tel" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition" placeholder="+92 313 2147653" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3.5 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-muted transition-colors">Back</button>
                <button type="submit" disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gradient-primary)" }}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Generate AI Audit"}
                </button>
              </div>
            </>
          )}
        </form>
      </AnimatedSection>
    </section>
  );
};

export default AuditForm;
