const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to_email, name, conversion_score, summary, pdf_url } = await req.json();

    if (!to_email || !name) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailHtml = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 40px; border-radius: 12px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">📊 Your Growth Audit Report</h1>
        <p style="color: #888; font-size: 14px; margin-bottom: 24px;">Keystone Growth Systems</p>
        
        <p>Hi ${name},</p>
        <p>Your AI-powered business audit is ready. Here are the highlights:</p>
        
        <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 18px; font-weight: bold;">Conversion Score: <span style="color: #7c3aed;">${conversion_score || "N/A"}/100</span></p>
          <p style="color: #aaa; font-size: 14px;">${summary || "Your detailed report is attached."}</p>
        </div>
        
        ${pdf_url ? `<a href="${pdf_url}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin: 16px 0;">📥 Download PDF Report</a>` : ""}
        
        <p style="margin-top: 24px;">Ready for execution? Let's discuss your growth strategy:</p>
        <a href="https://wa.me/923132147653" style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">💬 Chat on WhatsApp</a>
        
        <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />
        <p style="color: #666; font-size: 12px;">Keystone Growth Systems — Diagnosis → Strategy → Execution</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Keystone Growth Systems <onboarding@resend.dev>",
        to: [to_email],
        subject: `📊 Your Growth Audit Report | Keystone Growth Systems`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error("Resend API error:", errText);
      return new Response(JSON.stringify({ error: "Email delivery failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendData = await resendRes.json();
    return new Response(JSON.stringify({ success: true, email_id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Send report error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
