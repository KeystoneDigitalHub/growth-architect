export function calculateLeadScore(data: {
  ad_budget?: number;
  website_url?: string;
  whatsapp?: string;
  email: string;
  business_type?: string;
}): number {
  let score = 0;

  if (data.ad_budget && data.ad_budget > 1000) score += 30;
  else if (data.ad_budget && data.ad_budget > 500) score += 15;

  if (data.website_url) score += 25;
  if (data.whatsapp) score += 10;

  // Professional email (not gmail, yahoo, etc.)
  const freeProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"];
  const emailDomain = data.email.split("@")[1]?.toLowerCase();
  if (emailDomain && !freeProviders.includes(emailDomain)) score += 15;

  // E-commerce bonus
  const ecomKeywords = ["ecommerce", "e-commerce", "shopify", "store", "retail", "shop"];
  if (data.business_type && ecomKeywords.some((k) => data.business_type!.toLowerCase().includes(k))) {
    score += 20;
  }

  return Math.min(score, 100);
}

export function getLeadLabel(score: number): string {
  if (score >= 71) return "High Intent";
  if (score >= 41) return "Medium Intent";
  return "Low Intent";
}
