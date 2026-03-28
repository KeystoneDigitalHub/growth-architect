import jsPDF from "jspdf";

export type AuditData = {
  name: string;
  business_type: string;
  conversion_score: number;
  revenue_leaks: string[];
  visual_trust_issues?: string[];
  ad_strategy_gap: string;
  seo_structure?: string;
  recommended_geo_targets?: string[];
  geo_strategy?: string;
  funnel_fix?: string;
  automation_opportunity?: string;
  expected_lead_gain?: string;
  priority_level: string;
  summary: string;
};

export function generateAuditPdf(audit: AuditData): string {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Keystone Growth Systems", 20, 18);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("AI Growth Audit Report", 20, 28);
  doc.setFontSize(10);
  doc.text(`Prepared for: ${audit.name}`, 20, 36);

  y = 55;
  doc.setTextColor(30, 30, 30);

  // Score
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Conversion Score: ${audit.conversion_score}/100`, 20, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Priority Level: ${audit.priority_level}`, 20, y);
  y += 6;
  doc.text(`Business Type: ${audit.business_type}`, 20, y);
  y += 12;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Executive Summary", 20, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const summaryLines = doc.splitTextToSize(audit.summary, pageWidth - 40);
  doc.text(summaryLines, 20, y);
  y += summaryLines.length * 5 + 8;

  // Revenue Leaks
  if (audit.revenue_leaks?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Revenue Leaks Identified", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    audit.revenue_leaks.forEach((leak) => {
      doc.text(`• ${leak}`, 25, y);
      y += 6;
    });
    y += 5;
  }

  // Ad Strategy Gap
  if (audit.ad_strategy_gap) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Ad Strategy Gap", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const adLines = doc.splitTextToSize(audit.ad_strategy_gap, pageWidth - 40);
    doc.text(adLines, 20, y);
    y += adLines.length * 5 + 8;
  }

  // GEO Strategy
  if (audit.geo_strategy) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("GEO Targeting Strategy", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const geoLines = doc.splitTextToSize(audit.geo_strategy, pageWidth - 40);
    doc.text(geoLines, 20, y);
    y += geoLines.length * 5 + 5;
    if (audit.recommended_geo_targets?.length) {
      audit.recommended_geo_targets.forEach((t) => {
        doc.text(`• ${t}`, 25, y);
        y += 6;
      });
    }
    y += 5;
  }

  // Funnel Fix & Automation
  if (audit.funnel_fix) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Recommended Funnel Fix", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const funnelLines = doc.splitTextToSize(audit.funnel_fix, pageWidth - 40);
    doc.text(funnelLines, 20, y);
    y += funnelLines.length * 5 + 8;
  }

  if (audit.automation_opportunity) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("AI Automation Opportunity", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const autoLines = doc.splitTextToSize(audit.automation_opportunity, pageWidth - 40);
    doc.text(autoLines, 20, y);
    y += autoLines.length * 5 + 8;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(124, 58, 237);
    doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("Keystone Growth Systems — Diagnosis → Strategy → Execution | wa.me/923132147653", 20, doc.internal.pageSize.getHeight() - 5);
    doc.text(`Page ${i}/${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 5);
  }

  return doc.output("datauristring");
}

export function downloadAuditPdf(audit: AuditData) {
  const doc = new jsPDF();
  // Re-generate (reuse logic by creating a helper, but for simplicity we use the URI)
  const uri = generateAuditPdf(audit);
  const link = document.createElement("a");
  link.href = uri;
  link.download = `keystone-growth-report-${audit.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  link.click();
}
