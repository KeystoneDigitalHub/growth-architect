import { useState, FormEvent } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FormData = {
  name: string;
  email: string;
  business_type: string;
  ad_budget: string;
  website_url: string;
};

const AuditForm = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thankYouMsg, setThankYouMsg] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    business_type: "",
    ad_budget: "",
    website_url: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Determine adaptive message
    const budget = parseFloat(form.ad_budget) || 0;
    if (budget < 500) {
      setThankYouMsg(
        "Based on your budget range, we'll prioritize AI Automation for maximum efficiency — doing more with less through intelligent workflows."
      );
    } else if (form.website_url) {
      setThankYouMsg(
        "We've noted your website. Expect a Visual Conversion Audit highlighting structural improvements to increase trust and conversions."
      );
    } else {
      setThankYouMsg(
        "Your audit request is confirmed. Our team will analyze your brand positioning and deliver a strategic growth roadmap."
      );
    }

    // TODO: Submit to Supabase when connected
    // For now just simulate
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="audit" className="section-padding">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle size={48} className="text-primary mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Audit Request Received</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{thankYouMsg}</p>
          <p className="text-xs text-muted-foreground">
            Keystone Growth Hub — Diagnosis → Strategy → Execution
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="audit" className="section-padding">
      <div className="max-w-xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Conversion Engine</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          Free Brand Audit
        </h2>
        <p className="text-muted-foreground mb-8">
          Tell us about your business. We'll diagnose the friction and map a growth path.
        </p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step >= s ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="you@business.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Business Type *</label>
                <input
                  type="text"
                  required
                  value={form.business_type}
                  onChange={(e) => update("business_type", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="e.g. E-commerce, SaaS, Agency"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (form.name && form.email && form.business_type) setStep(2);
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}
              >
                Next Step <ArrowRight size={16} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Ad Budget ($) *</label>
                <input
                  type="number"
                  required
                  value={form.ad_budget}
                  onChange={(e) => update("ad_budget", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website URL</label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={(e) => update("website_url", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="https://yourbusiness.com"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3.5 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Submit Audit"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default AuditForm;
