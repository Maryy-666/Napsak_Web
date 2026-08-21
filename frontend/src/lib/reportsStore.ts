"use client";

import { Report } from "../components/reports/ReportsContent";

const DEFAULT_REPORTS: Report[] = [
  {
    id: "genclik-katilimi-2026",
    title: "2026 Gençlik Katılımı ve Üretim Kültürü Raporu",
    category: "Gençlik & Katılım",
    period: "2026",
    status: "Yayınlandı",
    featured: true,
    summary:
      "Topluluk üyelerinin etkinlik, gönüllülük ve sivil katılım pratiklerini inceleyen kapsamlı alan araştırması.",
    highlights: ["Katılım Motivasyonları", "Dijital Üretim Araçları", "Topluluk Dinamikleri"],
    pages: 42,
    fileSize: "4.8 MB",
    publishDate: "12 Şubat 2026",
    readCount: 1840,
    downloadCount: 620,
    keyTakeaways: [
      "Katılımcıların %78'i pratik proje üretimi sunan atölyeleri tercih ediyor.",
      "Disiplinler arası ekiplerde proje tamamlama oranı %40 daha yüksek.",
      "Gençlerin en çok ihtiyaç duyduğu unsur sürdürülebilir mentorluk desteği.",
    ],
    tableOfContents: [
      "1. Giriş ve Araştırmanın Amacı",
      "2. Metodoloji ve Örneklem Profili",
      "3. Gençlik Katılım Trendleri ve Alan Bulguları",
      "4. Çalışma Ekiplerinin Üretim Analizleri",
      "5. Sonuç, Değerlendirme ve Gelecek Projeksiyonu",
    ],
    methodology:
      "N'apsak? Gençlik Topluluğu bünyesindeki 450+ aktif üye ile gerçekleştirilen nicel anketler ve 24 odak grup görüşmesi analiz edilmiştir.",
  },
];

let cachedReports: Report[] = [...DEFAULT_REPORTS];

export const ReportsRepository = {
  getReports(): Report[] {
    return cachedReports;
  },

  async fetchReportsFromDB(): Promise<Report[]> {
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          cachedReports = json.data;
          return cachedReports;
        }
      }
    } catch (err) {
      console.warn("DB'den raporlar alınamadı, varsayılan depo kullanılıyor:", err);
    }
    return cachedReports;
  },
};
