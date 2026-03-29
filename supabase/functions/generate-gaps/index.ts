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
    const { business_type } = await req.json();

    if (!business_type) {
      return new Response(JSON.stringify({ error: "business_type field required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (!groqKey) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY not configured in Supabase secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `You are a senior SEO content strategist specializing in diaspora and GEO-targeted markets.

Analyze the "${business_type}" industry and generate exactly 8 high-value keyword gap opportunities that the business is likely missing but competitors are exploiting.

CRITICAL: Return ONLY a raw JSON object. No markdown. No backticks. No explanation.

Required format:
{
  "gaps": [
    {
      "keyword": "specific long-tail keyword phrase",
      "search_intent": "Commercial",
      "your_status": "MISSING",
      "competitor_status": "RANKING",
      "traffic_potential": "12.4K/mo",
      "geo_market": "UAE 🇦🇪"
    }
  ]
}

Rules:
- Exactly 8 gap items
- search_intent must be one of: Commercial | Transactional | Informational | Navigational
- your_status: at least 6 of 8 must be "MISSING"
- competitor_status: at least 6 of 8 must be "RANKING"  
- traffic_potential format: "X.XK/mo" (realistic numbers 1K-50K range)
- geo_market: rotate across UAE 🇦🇪, UK 🇬🇧, USA 🇺🇸, Canada 🇨🇦, Pakistan 🇵🇰 — at least 3 different markets
- Keywords must be highly specific to "${business_type}" — no generic terms
- Prioritize high buyer-intent keywords (purchase, hire, near me, best, prices, services)`;

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
              "You are a JSON-only response bot. Output ONLY raw valid JSON. No markdown fences. No code blocks. No text before or after the JSON object.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.65,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Groq API ${res.status}:`, errBody);
      return new Response(
        JSON.stringify({ error: `Groq returned ${res.status}. Check API key or model quota.` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse failed. Raw:", raw);
      return new Response(
        JSON.stringify({ error: "AI returned malformed JSON. Try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize: support both { gaps: [] } and plain []
    const gaps = Array.isArray(parsed) ? parsed : parsed.gaps ?? [];

    return new Response(JSON.stringify({ gaps }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-gaps error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});