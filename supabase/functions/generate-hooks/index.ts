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
    const { industry } = await req.json();

    if (!industry) {
      return new Response(JSON.stringify({ error: "industry field required" }), {
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

    const prompt = `You are an elite direct-response Meta Ads copywriter. Generate exactly 3 high-converting ad hooks for a ${industry} business targeting diaspora markets (UK, UAE, USA, Canada) and Pakistani local market.

CRITICAL: Return ONLY a raw JSON object. No markdown. No backticks. No explanation text before or after.

Required format:
{
  "hooks": [
    {
      "type": "Emotional",
      "headline": "Pain-point hook under 8 words",
      "primary_text": "2 sentences. Hit the pain. Amplify the desire. Max 25 words.",
      "cta": "Action-oriented button text",
      "ctr": "4.8%",
      "label": "High Emotion"
    },
    {
      "type": "Performance",
      "headline": "ROI or result-focused hook under 8 words",
      "primary_text": "2 sentences. Lead with outcome. Back with proof. Max 25 words.",
      "cta": "Action-oriented button text",
      "ctr": "3.9%",
      "label": "Strong ROI"
    },
    {
      "type": "Contrarian",
      "headline": "Pattern interrupt. Challenge belief. Under 8 words.",
      "primary_text": "2 sentences. Break a myth. Create urgency. Max 25 words.",
      "cta": "Action-oriented button text",
      "ctr": "5.3%",
      "label": "Aggressive CTR"
    }
  ]
}

Rules:
- Every hook must be industry-specific, never generic
- CTR values must be between 2.5% and 6.5%
- Headline max 8 words
- primary_text max 25 words per hook`;

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
              "You are a JSON-only response bot. Output ONLY raw valid JSON. No markdown fences. No code blocks. No preamble. No explanation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.75,
        max_tokens: 1200,
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
      console.error("JSON parse failed. Raw content:", raw);
      return new Response(
        JSON.stringify({ error: "AI returned malformed JSON. Try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize: support both { hooks: [] } and plain []
    const hooks = Array.isArray(parsed) ? parsed : parsed.hooks ?? [];

    return new Response(JSON.stringify({ hooks }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-hooks error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});