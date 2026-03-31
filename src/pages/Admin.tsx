import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Lead = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  business_type: string;
  ad_budget: number | null;
  lead_score: number | null;
  status: string;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuth = () => {
    // Simple admin gate — in production use proper auth
    if (password === "keystone2025") {
      setAuthenticated(true);
      fetchLeads();
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke("admin-leads", { body: {} });
    if (data?.leads) {
      setLeads(data.leads);
    }
    setLoading(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glow-card p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Admin Access</h2>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none mb-4"
            placeholder="Enter admin password" />
          <button onClick={handleAuth}
            className="w-full px-6 py-3 rounded-lg text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-primary)" }}>
            Access CRM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border px-4 sm:px-8 py-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold"><span className="gradient-text">Keystone</span> Admin CRM</h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="glow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">WhatsApp</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Industry</th>
                    <th className="text-center p-4 text-muted-foreground font-medium">Budget</th>
                    <th className="text-center p-4 text-muted-foreground font-medium">Score</th>
                    <th className="text-center p-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium flex items-center gap-2">
                        {(lead.lead_score ?? 0) >= 70 && <Crown size={14} className="text-yellow-400" />}
                        {lead.name}
                      </td>
                      <td className="p-4 text-muted-foreground">{lead.email}</td>
                      <td className="p-4 text-muted-foreground">{lead.whatsapp || "—"}</td>
                      <td className="p-4">{lead.business_type}</td>
                      <td className="p-4 text-center">{lead.ad_budget ? `$${lead.ad_budget}` : "—"}</td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${(lead.lead_score ?? 0) >= 70 ? "text-green-400" : (lead.lead_score ?? 0) >= 40 ? "text-yellow-400" : "text-muted-foreground"}`}>
                          {lead.lead_score ?? 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${lead.status === "new" ? "bg-blue-500/20 text-blue-400" : lead.status === "contacted" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
