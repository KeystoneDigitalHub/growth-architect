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
    const { website_url, business_type, name, lead_id } = await req.json();

    if (!business_type || !lead_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a Growth Intelligence AI for Keystone Growth Systems. Analyze this business and return ONLY valid JSON.

Business: ${business_type}
Website: ${website_url || "Not provided"}
Owner: ${name || "Unknown"}

Return this exact JSON structure:
{
  "conversion_score": <number 0-100>,
  "revenue_leaks": ["<leak1>", "<leak2>", "<leak3>"],
  "visual_trust_issues": ["<issue1>", "<issue2>"],
  "ad_strategy_gap": "<one paragraph>",
  "seo_structure": "<brief assessment>",
  "recommended_geo_targets": ["<market1>", "<market2>", "<market3>"],
  "geo_strategy": "<paragraph about international targeting>",
  "funnel_fix": "<recommended funnel improvement>",
  "automation_opportunity": "<AI automation suggestion>",
  "expected_lead_gain": "<percentage estimate>",
  "priority_level": "<Critical|High|Medium|Low>",
  "summary": "<2-3 sentence executive summary>"
}

If the business is based in Pakistan, recommend targeting diaspora markets: UK Pakistani audience, UAE Pakistani audience, Canada Pakistani audience, USA Pakistani audience, Saudi Pakistani audience — due to higher purchasing power and online buying frequency.

Be specific, actionable, and data-informed.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a growth strategist AI. Return ONLY valid JSON, no markdown, no code blocks." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content || "{}";

    // Parse the JSON from the response (handle potential markdown wrapping)
    let auditResult;
    try {
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      auditResult = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Groq response:", rawContent);
      auditResult = { conversion_score: 50, summary: rawContent, revenue_leaks: [], priority_level: "Medium" };
    }

    // Update the lead record with audit results
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase
      .from("leads")
      .update({
        audit_report: JSON.stringify(auditResult),
        geo_strategy: auditResult.geo_strategy || null,
      })
      .eq("id", lead_id);

    return new Response(JSON.stringify({ success: true, audit: auditResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
