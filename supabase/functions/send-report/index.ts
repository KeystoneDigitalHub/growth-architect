import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

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
    const { to_email, name, conversion_score, summary, pdf_url, lead_id } =
      await req.json();

    // ── Validation ──────────────────────────────────────────────
    if (!to_email || !name) {
      return new Response(
        JSON.stringify({ error: "to_email and name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");

    // ── Resend key missing — log warning, don't crash ───────────
    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — email skipped");
      return new Response(
        JSON.stringify({
          success: false,
          warning: "RESEND_API_KEY not configured — email not sent",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Score color logic ────────────────────────────────────────
    const score = conversion_score ?? "N/A";
    const scoreNum = Number(score);
    const scoreColor =
      scoreNum >= 75
        ? "#22c55e"
        : scoreNum >= 50
        ? "#f97316"
        : "#ef4444";

    const priorityLabel =
      scoreNum >= 75
        ? "✅ Good Standing"
        : scoreNum >= 50
        ? "⚠️ High Priority"
        : "🚨 Critical — Act Now";

    // ── PDF button block (only if pdf_url passed) ────────────────
    const pdfBlock = pdf_url
      ? `
        <a href="${pdf_url}"
           style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);
                  color:#fff;padding:12px 24px;border-radius:8px;
                  text-decoration:none;font-weight:600;margin:16px 0;font-size:14px;">
          📥 Download Full PDF Report
        </a>`
      : `<p style="color:#666;font-size:13px;font-style:italic;">
           PDF report will be available shortly in your dashboard.
         </p>`;

    // ── Email HTML ────────────────────────────────────────────────
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;">
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0"
             style="max-width:600px;background:#111;border-radius:16px;
                    border:1px solid #1f1f1f;font-family:'Inter',sans-serif;
                    color:#e5e5e5;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#2563eb);
                     padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:20px;
                       font-weight:700;letter-spacing:-0.3px;">
              Keystone Growth Systems
            </h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">
              AI-Powered Business Audit Report
            </p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0;font-size:15px;color:#d4d4d4;">
              Hi <strong>${name}</strong>,
            </p>
            <p style="margin:10px 0 0;font-size:14px;color:#888;line-height:1.6;">
              Your AI Growth Audit is complete. Here's what the system found:
            </p>
          </td>
        </tr>

        <!-- Score Card -->
        <tr>
          <td style="padding:20px 32px;">
            <div style="background:#0a0a0a;border:1px solid #1f1f1f;
                        border-radius:12px;padding:24px;text-align:center;">
              <p style="margin:0 0 6px;color:#666;font-size:11px;
                         text-transform:uppercase;letter-spacing:1.5px;">
                Conversion Score
              </p>
              <div style="font-size:52px;font-weight:800;color:${scoreColor};
                           line-height:1;">
                ${score}<span style="font-size:24px;color:#555;">/100</span>
              </div>
              <span style="display:inline-block;margin-top:10px;padding:4px 14px;
                            border-radius:20px;font-size:12px;font-weight:600;
                            color:#fff;background:${scoreColor};">
                ${priorityLabel}
              </span>
            </div>
          </td>
        </tr>

        <!-- Summary -->
        <tr>
          <td style="padding:0 32px 20px;">
            <div style="background:#0a0a0a;border:1px solid #1f1f1f;
                        border-radius:12px;padding:20px;">
              <p style="margin:0 0 8px;font-size:12px;color:#7c3aed;
                         font-weight:600;text-transform:uppercase;
                         letter-spacing:1px;">
                Executive Summary
              </p>
              <p style="margin:0;font-size:14px;color:#bbb;line-height:1.7;">
                ${summary || "Your detailed growth audit report is ready. Review the full breakdown in your dashboard."}
              </p>
            </div>
          </td>
        </tr>

        <!-- PDF Download -->
        <tr>
          <td style="padding:0 32px 20px;text-align:center;">
            ${pdfBlock}
          </td>
        </tr>

        <!-- WhatsApp CTA -->
        <tr>
          <td style="padding:0 32px 28px;text-align:center;">
            <p style="margin:0 0 14px;font-size:14px;color:#888;">
              Ready to execute? Let's build your growth plan:
            </p>
            <a href="https://wa.me/923132147653?text=Hi+Shahan%2C+I+received+my+Keystone+audit+report+and+want+to+discuss+my+growth+strategy"
               style="display:inline-block;background:#25D366;color:#fff;
                      padding:13px 28px;border-radius:8px;text-decoration:none;
                      font-weight:600;font-size:14px;">
              💬 WhatsApp — Book Strategy Call
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #1f1f1f;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#444;font-size:11px;">
              Keystone Growth Systems · Karachi, Pakistan<br/>
              Diagnosis → Strategy → Execution
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

    // ── Send via Resend ───────────────────────────────────────────
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // TODO: Replace with your verified domain once DNS is set in Resend
        // e.g. "audit@keystonegrowthsystems.com"
        from: "Keystone Growth Systems <onboarding@resend.dev>",
        to: [to_email],
        subject: `📊 Your Growth Audit — Score: ${score}/100 | Keystone Growth Systems`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error(`Resend ${resendRes.status}:`, errText);
      return new Response(
        JSON.stringify({
          error: `Email delivery failed — Resend returned ${resendRes.status}`,
          detail: errText,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendData = await resendRes.json();
    console.log("Email sent successfully. Resend ID:", resendData.id);

    // ── Update DB status if lead_id provided ─────────────────────
    if (lead_id) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from("leads")
          .update({ status: "report_sent" })
          .eq("id", lead_id);
      } catch (dbErr) {
        // Non-fatal — email already sent
        console.warn("DB status update failed (non-fatal):", dbErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, email_id: resendData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-report fatal error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});