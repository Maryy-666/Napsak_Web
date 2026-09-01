"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  Filter,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Button, PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";
import { ReportCoverPreview } from "./ReportCoverPreview";
import { downloadReportPdf } from "../../lib/pdfExporter";
import { ReportsRepository } from "../../lib/reportsStore";
import { useLanguage } from "../../context/LanguageContext";


const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, delay, ease: "easeOut" },
  }),
};

type ReportStatus = "Yayınlandı" | "Hazırlanıyor";

export type Report = {
  id: string;
  title: string;
  category: string;
  period: string;
  status: ReportStatus;
  summary: string;
  highlights: string[];
  pages: number;
  fileSize: string;
  publishDate: string;
  featured?: boolean;
  readCount: number;
  downloadCount: number;
  keyTakeaways: string[];
  tableOfContents: string[];
  methodology: string;
};

const REPORTS: Report[] = [
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
      "Katılımcıların %78'i teorik bilgiden ziyade pratik proje üretimi sunan atölyeleri tercih ediyor.",
      "Disiplinler arası ekiplerde (Yazılım + Tasarım + Sosyoloji) proje tamamlama oranı %40 daha yüksek.",
      "Gençlerin sivil katılımda en çok ihtiyaç duyduğu unsur sürdürülebilir mentorluk desteği.",
    ],
    tableOfContents: [
      "1. Giriş ve Araştırmanın Amacı",
      "2. Metodoloji ve Örneklem Profili",
      "3. Gençlik Katılım Trendleri ve Alan Bulguları",
      "4. Çalışma Ekiplerinin Üretim Analizleri",
      "5. Sonuç, Değerlendirme ve Gelecek Projeksiyonu",
    ],
    methodology:
      "N'apsak? Gençlik Topluluğu bünyesindeki 450+ aktif üye ile gerçekleştirilen nicel anketler ve 24 derinlemesine odak grup görüşmesinden elde edilen veriler analiz edilmiştir.",
  },
  {
    id: "calisma-ekipleri-2026-q1",
    title: "Çalışma Ekipleri Faaliyet ve Etki Notu",
    category: "Çalışma Ekipleri",
    period: "2026",
    status: "Yayınlandı",
    summary:
      "Teknoloji, sanat, çevre-sağlık, eğitim ve iletişim çalışma ekiplerinin ilk çeyrek üretim çıktıları.",
    highlights: ["5 Aktif Ekip", "14 Tamamlanan Proje", "Ekip İçi Sinerji"],
    pages: 28,
    fileSize: "3.1 MB",
    publishDate: "28 Ocak 2026",
    readCount: 950,
    downloadCount: 310,
    keyTakeaways: [
      "Teknoloji ekibi açık kaynak 3 yeni topluluk aracını yayına aldı.",
      "Çevre & Sağlık ekibi 2 yerel farkındalık kampanyası tamamladı.",
    ],
    tableOfContents: [
      "1. Dönem Özeti",
      "2. Ekip Bazlı Çıktılar",
      "3. Gelecek Çeyrek Hedefleri",
    ],
    methodology:
      "Eş zamanlı proje takip araçları ve ekip liderlerinin dönemsel raporlamalarından derlenmiştir.",
  },
  {
    id: "etkinlik-geribildirim-2026",
    title: "Etkinlik & Atölye Geri Bildirimleri Analizi",
    category: "Etkinlik & Buluşmalar",
    period: "2026",
    status: "Hazırlanıyor",
    summary:
      "Gerçekleştirilen atölyeler ve buluşmalardan toplanan nitel/nicel geri bildirimlerin memnuniyet analizi.",
    highlights: ["Memnuniyet Oranları", "İçerik Önerileri"],
    pages: 18,
    fileSize: "2.2 MB",
    publishDate: "Mart 2026",
    readCount: 420,
    downloadCount: 0,
    keyTakeaways: [
      "Atölyelerde interaktif pratik süresinin artırılması talebi ön planda.",
      "Fiziki buluşmalara katılım motivasyonu ağ kurma odaklı.",
    ],
    tableOfContents: [
      "1. Etkinlik Katılımcı Profili",
      "2. Genel Memnuniyet İndeksi",
    ],
    methodology: "Etkinlik sonrasında iletilen dijital geri bildirim formları verilerinden derlenmektedir.",
  },
  {
    id: "yerel-genclik-ihtiyaclari-2026",
    title: "Yerel Gençlik İhtiyaçları & Saha Gözlemi",
    category: "Saha Araştırmaları",
    period: "2026",
    status: "Hazırlanıyor",
    summary:
      "Gençlerin öğrenme, sosyalleşme ve imkanlara erişim alanlarında karşılaştığı temel kısıtlar ve yerel ihtiyaç tespiti.",
    highlights: ["Mekansal İhtiyaçlar", "Öğrenme Ortamları"],
    pages: 36,
    fileSize: "4.0 MB",
    publishDate: "Nisan 2026",
    readCount: 290,
    downloadCount: 0,
    keyTakeaways: [
      "Gençlerin %65'i ücretsiz ve donanımlı ortak çalışma mekanlarına erişimde zorluk yaşıyor.",
    ],
    tableOfContents: [
      "1. Bölgesel Saha Çalışmaları",
      "2. Çözüm Önerileri ve Politika Notu",
    ],
    methodology: "Saha ziyaretleri ve yüz yüze mülakat teknikleri kullanılmaktadır.",
  },
];

const CATEGORIES_TR = [
  "Tümü",
  "Gençlik & Katılım",
  "Çalışma Ekipleri",
  "Etkinlik & Buluşmalar",
  "Saha Araştırmaları",
];

const CATEGORIES_EN = [
  "All",
  "Youth & Participation",
  "Working Teams",
  "Events & Meetups",
  "Field Research",
];

export function ReportsContent() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [reportsList, setReportsList] = useState<Report[]>(REPORTS);

  const [activeCategory, setActiveCategory] = useState<string>("Tümü");
  const [query, setQuery] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    ReportsRepository.fetchReportsFromDB().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setReportsList(
          data.map((r: any) => ({
            id: String(r.id),
            title: r.title,
            category: r.category || "Gençlik & Katılım",
            period: r.publishDate || "2026",
            status: (r.publicationStatus === "PUBLISHED" ? "Yayınlandı" : "Hazırlanıyor") as ReportStatus,
            summary: r.summary || r.description || "Rapor özeti.",
            highlights: ["Araştırma Bulguları", "Saha Gözlemi"],
            pages: r.pages || 42,
            fileSize: r.fileSize || "4.8 MB",
            publishDate: r.publishDate || "2026",
            featured: r.isFeatured,
            readCount: r.readCount || 0,
            downloadCount: r.downloadCount || 0,
            keyTakeaways: r.summary ? [r.summary] : ["Rapor bulgusu."],
            tableOfContents: ["1. Giriş ve Araştırma Amacı", "2. Bulgular"],
            methodology: r.description || "N'apsak? Gençlik Topluluğu araştırma yöntemi.",
            pdfUrl: r.pdfUrl,
            coverImage: r.coverImage,
          }))
        );
      }
    });
  }, []);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedReport) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedReport]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reportsList.filter((report) => {
      const matchesCategory =
        activeCategory === "Tümü" || report.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        report.title.toLowerCase().includes(normalizedQuery) ||
        report.summary.toLowerCase().includes(normalizedQuery) ||
        report.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, reportsList]);

  const handleDownloadPDF = (report: Report) => {
    if (report.status !== "Yayınlandı") {
      triggerToast(`"${report.title}" raporu henüz hazırlanma aşamasındadır.`);
      return;
    }

    try {
      downloadReportPdf({
        id: report.id,
        title: report.title,
        category: report.category,
        date: report.publishDate,
        pages: report.pages,
        summary: report.summary,
        keyTakeaways: report.keyTakeaways,
        methodology: report.methodology,
      });

      triggerToast(`"${report.title}" PDF raporu başarıyla indirildi!`);
    } catch (error) {
      console.error("PDF indirme hatası:", error);
      triggerToast("PDF raporu oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <PageBackground id="raporlar-root" className="select-none px-0 py-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-5 z-[400] flex items-center gap-3 rounded-2xl border border-[#07452C]/30 bg-[#07452C] px-5 py-3.5 text-white shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="h-5 w-5 shrink-0 text-amber-300" />
            <p className="text-sm font-bold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Subdued Research Background Decor */}
      <Section padding="none" background="transparent" className="relative pt-14 sm:pt-20 pb-6 border-b border-[#EEF0F2] overflow-hidden">
        {/* SUBDUED RESEARCH BACKDROP DECOR */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-between px-10">
          <svg className="w-full h-full" viewBox="0 0 1200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50H1200M0 150H1200M0 250H1200" stroke="#07452C" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M200 0V300M600 0V300M1000 0V300" stroke="#07452C" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M100 220 Q 300 120, 500 180 T 900 80 T 1100 110" stroke="#07452C" strokeWidth="3" fill="none" />
            <circle cx="500" cy="180" r="6" fill="#07452C" />
            <circle cx="900" cy="80" r="6" fill="#07452C" />
          </svg>
        </div>

        <PageContainer className="max-w-6xl sm:max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#07452C]/10 border border-[#07452C]/20 text-[#07452C] font-extrabold text-xs tracking-wide uppercase shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 text-[#07452C]" />
              <span>{isEn ? "N'apsak? Digital Reports & Publication Archive" : "N'apsak? Dijital Rapor & Yayın Arşivi"}</span>
            </div>

            <h1 className="font-headings text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] leading-tight">
              {isEn ? "Youth Observations & Research Reports" : "Gençlik Gözlemleri & Araştırma Raporları"}
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm font-medium leading-relaxed text-[#5F6773]">
              {isEn
                ? "We archive our field experiences, survey data, and youth participation trends with institutional research publications."
                : "Saha deneyimlerimizi, anket verilerini ve gençlik katılım trendlerini kurumsal araştırma yayınlarımızla arşivliyoruz."}
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      {/* Main Research Archive Cards Grid Section */}
      <Section padding="none" background="transparent" className="py-6 sm:py-10">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          {/* Streamlined Filter & Search Row */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-[#EEF0F2] pb-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="h-4 w-4 shrink-0 text-[#07452C] mr-1" />
              {CATEGORIES_TR.map((category, idx) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-xl border px-3.5 py-1.5 text-xs font-semibold font-sans transition-all cursor-pointer ${
                    activeCategory === category
                      ? "border-[#07452C] bg-[#07452C] text-white shadow-2xs font-bold"
                      : "border-[#E5E7EB] bg-[#F8FAFC] text-[#4B5563] hover:border-[#07452C]/35 hover:bg-white hover:text-[#0F1115]"
                  }`}
                >
                  {isEn ? CATEGORIES_EN[idx] : category}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5F6773]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isEn ? "Search reports or topics..." : "Rapor veya konu ara..."}
                className="h-9 w-full rounded-xl border border-[#E5E7EB] bg-white pl-8 pr-8 text-xs font-medium text-[#0F1115] outline-none transition placeholder:text-[#9FA6B2] focus:border-[#07452C] focus:ring-2 focus:ring-[#07452C]/10 shadow-2xs"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FA6B2] hover:text-[#0F1115]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* SPACIOUS & ELEGANT PUBLICATION CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            {filteredReports.map((report, index) => (
              <motion.article
                key={report.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeInUp}
                custom={index * 0.04}
                className="h-full"
              >
                <div className="h-full rounded-2xl border border-stone-200/80 hover:border-[#07452C]/40 transition-all duration-300 bg-white group shadow-[0_4px_18px_rgba(7,69,44,0.03)] hover:shadow-[0_12px_32px_rgba(7,69,44,0.08)] flex flex-col justify-between p-5 sm:p-6">
                  <div className="space-y-4">
                    {/* Top Row: Report Cover (Left) + Title, Summary & Metadata (Right) */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-start">
                      {/* Left: Document Cover Preview Window */}
                      <div className="sm:col-span-4 shrink-0">
                        <ReportCoverPreview report={report} className="w-full aspect-[3/4]" />
                      </div>

                      {/* Right: Title, Summary & Single-Line Metadata */}
                      <div className="sm:col-span-8 space-y-2.5">
                        {/* Show tag ONLY if report is Hazırlanıyor */}
                        {report.status === "Hazırlanıyor" && (
                          <span className="inline-block rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold">
                            Hazırlanıyor
                          </span>
                        )}

                        {/* Editorial Title */}
                        <h3 className="text-base sm:text-lg font-bold font-headings text-[#0F1115] group-hover:text-[#07452C] transition-colors leading-snug line-clamp-2">
                          {report.title}
                        </h3>

                        {/* Short Summary (Max 2 lines) */}
                        <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed line-clamp-2">
                          {report.summary}
                        </p>

                        {/* Single-Line Metadata Text */}
                        <p className="text-xs text-stone-500 font-sans font-medium pt-1">
                          {report.publishDate} · {report.pages} Sayfa · PDF
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spacious Action Footer Bar */}
                  <div className="pt-4 border-t border-stone-100 mt-5 flex items-center justify-between gap-4">
                    {/* Primary Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="h-10 sm:h-10.5 rounded-xl bg-[#07452C] hover:bg-[#0A5C3A] text-white font-bold text-xs sm:text-sm px-5 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>Raporu İncele</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Subtle Secondary PDF Link */}
                    {report.status === "Yayınlandı" ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(report)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#07452C] px-3 py-2 rounded-xl hover:bg-[#07452C]/5 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#07452C]" />
                        <span>PDF İndir</span>
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-stone-400">
                        (Yakında Yayınlanacak)
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#DDE7E1] bg-white p-12 text-center">
              <Search className="mx-auto h-10 w-10 text-[#5F6773] opacity-40 mb-3" />
              <p className="text-sm font-semibold text-[#5F6773]">Filtrenize uygun araştırma raporu bulunamadı.</p>
            </div>
          )}
        </PageContainer>
      </Section>

      {/* Report Preview Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-[#0F1115]/80 backdrop-blur-md z-0"
            />

            {/* Modal Dialog Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl max-h-[calc(100vh-50px)] sm:max-h-[calc(100vh-70px)] flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-2xl border border-[#EEF0F2]"
            >
              {/* Fixed Header */}
              <div className="flex-none flex items-start justify-between border-b border-[#EEF0F2] bg-[#F8FAFC] p-4 sm:p-5 px-6 z-20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-[#EEF7F3] px-3 py-0.5 text-xs font-bold text-[#07452C]">
                      {selectedReport.category}
                    </span>
                    <span className="rounded-full bg-white border border-[#E5E7EB] px-2.5 py-0.5 text-xs font-bold text-[#5F6773]">
                      {selectedReport.period}
                    </span>
                  </div>
                  <h3 className="font-headings text-lg sm:text-xl font-extrabold text-[#0F1115] leading-snug line-clamp-1">
                    {selectedReport.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-full p-2 text-[#5F6773] hover:bg-[#EEF0F2] hover:text-[#0F1115] transition-colors cursor-pointer"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 z-10 max-h-[360px] sm:max-h-[420px]">
                {/* Left: Cover Preview */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <ReportCoverPreview report={selectedReport} className="w-full max-w-[180px] aspect-[3/4]" />
                </div>

                {/* Right: Details */}
                <div className="md:col-span-8 space-y-3.5">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#07452C]">Yönetici Özeti</h4>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#5F6773] bg-[#F8FBF9] p-3.5 rounded-2xl border border-[#DDE7E1]">
                      {selectedReport.summary}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#07452C]">Öne Çıkan Bulgular</h4>
                    <div className="space-y-1.5">
                      {selectedReport.keyTakeaways.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-[#EEF0F2] p-2.5 text-xs font-semibold text-[#0F1115]">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#07452C] mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#07452C]">İçindekiler Bölümleri</h4>
                    <ul className="space-y-1 pl-1">
                      {selectedReport.tableOfContents.map((section, idx) => (
                        <li key={idx} className="text-xs font-semibold text-[#5F6773] flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#07452C]" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#07452C]">Metodoloji & Veri Kaynağı</h4>
                    <p className="text-xs sm:text-sm font-medium text-[#5F6773]">
                      {selectedReport.methodology}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permanently Anchored Action Footer */}
              <div className="flex-none flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EEF0F2] bg-[#F8FAFC] p-3.5 px-6 z-20">
                <span className="text-xs font-bold text-[#5F6773]">
                  {selectedReport.period} · {selectedReport.pages} Sayfa · {selectedReport.fileSize} · PDF
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport(null)}
                    className="rounded-xl"
                  >
                    Kapat
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => {
                      handleDownloadPDF(selectedReport);
                      setSelectedReport(null);
                    }}
                    disabled={selectedReport.status !== "Yayınlandı"}
                    className="rounded-xl !bg-[#07452C] hover:!bg-[#0A5C3A] text-white font-bold"
                  >
                    PDF Aç / İndir
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageBackground>
  );
}

export default ReportsContent;
