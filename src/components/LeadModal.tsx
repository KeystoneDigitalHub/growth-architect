import { useState, FormEvent } from "react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGatekeeper } from "@/contexts/GatekeeperContext";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const LeadModal = () => {
  const { showModal, closeModal, unlock, isUnlocked } = useGatekeeper();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    business_type: "",
    ad_budget: "",
    website_url: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email,
        business_type: form.business_type,
        ad_budget: parseFloat(form.ad_budget) || 0,
        website_url: form.website_url || null,
      });
      if (!error && window.fbq) {
        window.fbq("track", "Lead");
      }
    } catch {
      // still unlock
    }
    setLoading(false);
    setSubmitted(true);
    unlock();
  };

  if (!showModal || isUnlocked) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8 animate-scale-in">
        <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Access Unlocked</h3>
            <p className="text-sm text-muted-foreground">You now have full access to our AI tools and audit features.</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-1">Unlock Access</h3>
            <p className="text-sm text-muted-foreground mb-6">Submit your details to access our AI tools and get a free brand audit.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input required type="email" placeholder="you@business.com" value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input required type="text" placeholder="Business type (e.g. SaaS, Agency)" value={form.business_type} onChange={(e) => update("business_type", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input required type="number" placeholder="Monthly ad budget ($)" value={form.ad_budget} onChange={(e) => update("ad_budget", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="url" placeholder="https://yourbusiness.com" value={form.website_url} onChange={(e) => update("website_url", e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Unlock Access"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadModal;
