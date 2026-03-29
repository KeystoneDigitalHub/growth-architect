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
      return new Response(JSON.stringify({ error: "business_type and lead_id are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not configured in Supabase secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are the Growth Intelligence AI for Keystone Growth Systems — an elite AI-powered growth audit platform.

Analyze this business and generate a comprehensive conversion audit report.

Business Type: ${business_type}
Website URL: ${website_url || "Not provided — audit based on industry benchmarks"}
Owner Name: ${name || "Business Owner"}

CRITICAL: Return ONLY raw valid JSON. No markdown. No backticks. No text outside the JSON object.

{
  "conversion_score": <integer 0-100, be realistic based on info provided>,
  "revenue_leaks": [
    "<specific revenue leak #1>",
    "<specific revenue leak #2>",
    "<specific revenue leak #3>"
  ],
  "visual_trust_issues": [
    "<trust issue #1>",
    "<trust issue #2>"
  ],
  "ad_strategy_gap": "<One paragraph — what ad strategy gaps are costing them leads and revenue>",
  "seo_structure": "<Brief but specific SEO structure assessment — 2-3 sentences>",
  "recommended_geo_targets": [
    "<market 1 with reasoning>",
    "<market 2 with reasoning>",
    "<market 3 with reasoning>"
  ],
  "geo_strategy": "<Paragraph on how to attack diaspora or international markets. Be specific to their business type.>",
  "funnel_fix": "<Specific recommended funnel improvement — what to add or fix>",
  "automation_opportunity": "<Specific AI or automation opportunity for this business type>",
  "expected_lead_gain": "<Realistic % estimate — e.g. +35-55% in 90 days>",
  "priority_level": "<Critical | High | Medium | Low>",
  "summary": "<2-3 sentence executive summary. Direct, confident, actionable tone.>"
}

Context rules:
- If business is Pakistan-based, ALWAYS recommend diaspora markets: UK Pakistani 🇬🇧, UAE Pakistani 🇦🇪, Canada Pakistani 🇨🇦, USA Pakistani 🇺🇸, Saudi Pakistani 🇸🇦 — due to 3-5x higher purchasing power
- If no website provided, conversion_score should be 20-45 (major opportunity)
- If website provided, assess based on typical industry standards
- Be specific, data-informed, and direct — no generic filler advice
- conversion_score 80+ = Low priority. 50-79 = High. Below 50 = Critical`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a JSON-only AI. Return ONLY raw valid JSON. No markdown. No code fences. No explanation text before or after.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Groq API ${res.status}:`, errBody);
      return new Response(
        JSON.stringify({ error: `AI service error: Groq returned ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const groqData = await res.json();
    const rawContent = groqData.choices?.[0]?.message?.content ?? "{}";
    const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let auditResult;
    try {
      auditResult = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw Groq output:", rawContent);
      auditResult = {
        conversion_score: 45,
        revenue_leaks: ["Unable to parse full audit — manual review recommended"],
        visual_trust_issues: [],
        ad_strategy_gap: rawContent.slice(0, 300),
        seo_structure: "Requires manual assessment",
        recommended_geo_targets: ["UAE", "UK", "Canada"],
        geo_strategy: "Diaspora targeting recommended for Pakistani businesses",
        funnel_fix: "Add lead capture and follow-up sequence",
        automation_opportunity: "WhatsApp automation for lead nurturing",
        expected_lead_gain: "+25-40% in 90 days",
        priority_level: "High",
        summary: "Audit parsing error — core data captured. Manual review advised.",
      };
    }

    // Save to Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase
      .from("leads")
      .update({
        audit_report: JSON.stringify(auditResult),
        geo_strategy: auditResult.geo_strategy ?? null,
      })
      .eq("id", lead_id);

    if (dbError) {
      console.error("Supabase update error:", dbError.message);
      // Don't fail the response — still return audit to frontend
    }

    return new Response(JSON.stringify({ success: true, audit: auditResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-audit fatal error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});