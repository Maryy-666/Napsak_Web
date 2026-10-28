"use client";

import { jsPDF } from "jspdf";

interface ReportPdfData {
  id: string;
  title: string;
  category: string;
  date: string;
  pages: number;
  targetAudience?: string;
  summary: string;
  keyTakeaways: string[];
  methodology: string;
}

interface MagazinePdfData {
  id: string;
  issueNumber: string;
  title: string;
  category: string;
  publishDate: string;
  period: string;
  pages: number;
  editorialNote: string;
  articles: string[];
  contributors: string[];
}

/**
 * Türk alfabesi karakterlerini jsPDF varsayılan helvetica fontuna uygun hale getirir.
 */
function sanitizeTurkish(text: string): string {
  if (!text) return "";
  return text
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
}

export function downloadReportPdf(report: ReportPdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  // Header Banner Background (#07452C)
  doc.setFillColor(7, 69, 44);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(sanitizeTurkish("Ne Yapsak? Genclik Toplulugu"), margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(sanitizeTurkish("Resmi Arastirma & Rapor Dokumani"), margin, 19);

  cursorY = 38;

  // Report Title
  doc.setTextColor(15, 17, 21);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(sanitizeTurkish(report.title), contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 7 + 4;

  // Metadata Bar
  doc.setFillColor(240, 245, 242);
  doc.roundedRect(margin, cursorY, contentWidth, 16, 2, 2, "F");

  doc.setTextColor(10, 92, 58);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(
    sanitizeTurkish(`Kategori: ${report.category}   |   Tarih: ${report.date}   |   Sayfa: ${report.pages} Sayfa`),
    margin + 4,
    cursorY + 10
  );

  cursorY += 24;

  // Section 1: Executive Summary
  doc.setTextColor(7, 69, 44);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sanitizeTurkish("YONETICI OZETI"), margin, cursorY);
  cursorY += 2;

  doc.setDrawColor(7, 69, 44);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, margin + 35, cursorY);
  cursorY += 6;

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const summaryLines = doc.splitTextToSize(sanitizeTurkish(report.summary), contentWidth);
  doc.text(summaryLines, margin, cursorY);
  cursorY += summaryLines.length * 5 + 8;

  // Section 2: Key Takeaways
  if (cursorY > pageHeight - 50) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setTextColor(7, 69, 44);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sanitizeTurkish("ONE CIKAN BULGULAR & SONUCLAR"), margin, cursorY);
  cursorY += 2;

  doc.setDrawColor(7, 69, 44);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, margin + 55, cursorY);
  cursorY += 6;

  report.keyTakeaways.forEach((item, idx) => {
    if (cursorY > pageHeight - 30) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setTextColor(10, 92, 58);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`${idx + 1}.`, margin, cursorY);

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    const takeawayLines = doc.splitTextToSize(sanitizeTurkish(item), contentWidth - 8);
    doc.text(takeawayLines, margin + 6, cursorY);
    cursorY += takeawayLines.length * 5 + 3;
  });

  cursorY += 6;

  // Section 3: Methodology
  if (cursorY > pageHeight - 45) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setTextColor(7, 69, 44);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sanitizeTurkish("METODOLOJI"), margin, cursorY);
  cursorY += 2;

  doc.setDrawColor(7, 69, 44);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, margin + 30, cursorY);
  cursorY += 6;

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const methodLines = doc.splitTextToSize(sanitizeTurkish(report.methodology), contentWidth);
  doc.text(methodLines, margin, cursorY);

  // Footer on all pages
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 225, 222);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(sanitizeTurkish("Ne Yapsak? Genclik Toplulugu | www.napsak.org"), margin, pageHeight - 9);
    doc.text(`Sayfa ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  // Save PDF
  doc.save(`${report.id}-napsak-raporu.pdf`);
}

export function downloadMagazinePdf(mag: MagazinePdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  // Header Banner Background (#07452C)
  doc.setFillColor(7, 69, 44);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(sanitizeTurkish("Ne Yapsak? Genclik Toplulugu E-Dergi"), margin, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(sanitizeTurkish(`${mag.issueNumber} | ${mag.period}`), margin, 19);

  cursorY = 38;

  // Magazine Title
  doc.setTextColor(15, 17, 21);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(sanitizeTurkish(mag.title), contentWidth);
  doc.text(titleLines, margin, cursorY);
  cursorY += titleLines.length * 7 + 4;

  // Metadata Bar
  doc.setFillColor(240, 245, 242);
  doc.roundedRect(margin, cursorY, contentWidth, 16, 2, 2, "F");

  doc.setTextColor(10, 92, 58);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(
    sanitizeTurkish(`Kategori: ${mag.category}   |   Yayin Tarihi: ${mag.publishDate}   |   Sayfa: ${mag.pages} Sayfa`),
    margin + 4,
    cursorY + 10
  );

  cursorY += 24;

  // Section 1: Editorial Note
  doc.setTextColor(7, 69, 44);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sanitizeTurkish("EDITORDEN NOT"), margin, cursorY);
  cursorY += 2;

  doc.setDrawColor(7, 69, 44);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, margin + 35, cursorY);
  cursorY += 6;

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const editorialLines = doc.splitTextToSize(sanitizeTurkish(mag.editorialNote), contentWidth);
  doc.text(editorialLines, margin, cursorY);
  cursorY += editorialLines.length * 5 + 8;

  // Section 2: Articles / Table of Contents
  if (cursorY > pageHeight - 50) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setTextColor(7, 69, 44);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sanitizeTurkish("ONE CIKAN MAKALELER & ICINDEKILER"), margin, cursorY);
  cursorY += 2;

  doc.setDrawColor(7, 69, 44);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, margin + 65, cursorY);
  cursorY += 6;

  mag.articles.forEach((art, idx) => {
    if (cursorY > pageHeight - 30) {
      doc.addPage();
      cursorY = 20;
    }
    doc.setTextColor(10, 92, 58);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`${idx + 1}.`, margin, cursorY);

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    const articleLines = doc.splitTextToSize(sanitizeTurkish(art), contentWidth - 8);
    doc.text(articleLines, margin + 6, cursorY);
    cursorY += articleLines.length * 5 + 3;
  });

  cursorY += 6;

  // Section 3: Contributors
  if (cursorY > pageHeight - 40) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setTextColor(7, 69, 44);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(sanitizeTurkish("KATKIDA BULUNANLAR"), margin, cursorY);
  cursorY += 2;

  doc.setDrawColor(7, 69, 44);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, margin + 45, cursorY);
  cursorY += 6;

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const contributorText = mag.contributors.join(", ");
  const contribLines = doc.splitTextToSize(sanitizeTurkish(contributorText), contentWidth);
  doc.text(contribLines, margin, cursorY);

  // Footer on all pages
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 225, 222);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(sanitizeTurkish("Ne Yapsak? Genclik Toplulugu | www.napsak.org"), margin, pageHeight - 9);
    doc.text(`Sayfa ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  // Save PDF
  doc.save(`${mag.id}-napsak-dergisi.pdf`);
}
