"use client";

import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Download,
  Filter,
  Sparkles,
  X,
} from "lucide-react";
import { Button, PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";
import { MagazineShowcaseSlider } from "./MagazineShowcaseSlider";
import { MagazineReaderModal } from "./MagazineReaderModal";
import { downloadMagazinePdf } from "../../lib/pdfExporter";

import { MagazinesRepository } from "../../lib/magazinesStore";
import { useLanguage } from "../../context/LanguageContext";

export type MagazineIssue = {

  id: string;
  issueNumber: string;
  title: string;
  category: string;
  period: string;
  publishDate: string;
  summary: string;
  articles: string[];
  pages: number;
  fileSize: string;
  pdfUrl?: string | null;
  coverImage?: string | null;
  featured?: boolean;
  editorialNote: string;
  contributors: string[];
  readCount: number;
  downloadCount: number;
  coverStyle: {
    bgGradient: string;
    textColor: string;
    subtitleColor: string;
    badgeBg: string;
    badgeText: string;
    borderFrame: string;
    isLightCover?: boolean;
  };
};

const MAGAZINES: MagazineIssue[] = [
  {
    id: "sayi-4-genclik-ve-gelecek",
    issueNumber: "Sayı #4",
    title: "Gençlik, Dijital Üretim ve Geleceğin Meslekleri",
    category: "Teknoloji & Gelecek",
    period: "2026 Kış",
    publishDate: "05 Ocak 2026",
    featured: true,
    coverStyle: {
      bgGradient: "from-[#0A5C3A] via-[#0E7A4D] to-[#08472D]",
      textColor: "text-white",
      subtitleColor: "text-amber-300",
      badgeBg: "bg-amber-400",
      badgeText: "text-slate-950",
      borderFrame: "border-emerald-400/30",
    },
    summary:
      "Geleceğin çalışma dünyasında gençlerin rolü, yapay zeka araçları ile üretim pratikleri ve açık kaynak topluluk kültürü üzerine özel röportajlar.",
    articles: [
      "Açık Kaynak Kültürü ve Genç Geliştiriciler",
      "Yapay Zeka Çağında Yaratıcı Üretim",
      "Sivil Katılımda Dijital Araçların Etkisi",
      "Saha Notları: Gençlik Atölyelerinden Yansımalar",
    ],
    pages: 56,
    fileSize: "6.2 MB",
    editorialNote:
      "Dördüncü sayımızda teknoloji ve gençlik üretimini odağımıza aldık. Üretkenliği ve kollektif çalışma bilincini destekleyen yazılarla ilham olmasını diliyoruz.",
    contributors: ["Zeynep Kaya", "Mert Demir", "Elif Yıldız", "Caner Bulut"],
    readCount: 2410,
    downloadCount: 890,
  },
  {
    id: "sayi-3-sanat-ve-toplum",
    issueNumber: "Sayı #3",
    title: "Yerel Sanat, Kamusal Alan ve Genç Ekspresyonu",
    category: "Sanat & Edebiyat",
    period: "2025 Sonbahar",
    publishDate: "15 Ekim 2025",
    coverStyle: {
      bgGradient: "from-[#FFFFFF] via-[#F8FAF8] to-[#EEF5F1]",
      textColor: "text-[#0F1115]",
      subtitleColor: "text-[#0A5C3A]",
      badgeBg: "bg-[#0A5C3A]",
      badgeText: "text-white",
      borderFrame: "border-[#0A5C3A]/20",
      isLightCover: true,
    },
    summary:
      "Sokak sanatından dijital illüstrasyona, genç sanatçıların kamusal alandaki görünürlüğü ve toplumsal ifade biçimleri.",
    articles: [
      "Kamusal Alanda Gençlik Sanatı",
      "İllüstrasyon ve Hikaye Anlatıcılığı",
      "Müzik ve Gençlik Alt Kültürleri",
    ],
    pages: 48,
    fileSize: "5.4 MB",
    editorialNote:
      "Üçüncü sayımızda sanatsal üretimin toplumsal bağları güçlendirmedeki rolünü genç sanatçıların gözünden işledik.",
    contributors: ["Selin Aksoy", "Barış Erdem", "Deniz Arslan"],
    readCount: 1750,
    downloadCount: 540,
  },
  {
    id: "sayi-2-cevre-ve-iklim",
    issueNumber: "Sayı #2",
    title: "Ekolojik Dönüşüm ve Genç İklim Aktivizmi",
    category: "Gençlik & Kültür",
    period: "2025 Yaz",
    publishDate: "20 Temmuz 2025",
    coverStyle: {
      bgGradient: "from-[#EBF3EE] via-[#DCECE2] to-[#CCE2D4]",
      textColor: "text-[#0F1115]",
      subtitleColor: "text-[#0A5C3A]",
      badgeBg: "bg-[#0A5C3A]",
      badgeText: "text-white",
      borderFrame: "border-[#0A5C3A]/25",
      isLightCover: true,
    },
    summary:
      "Sürdürülebilirlik, yerel iklim hareketleri ve gençlerin ekolojik farkındalık odaklı atölye çıktılarının analiz edildiği özel dosya.",
    articles: [
      "Kentte Ekolojik Yaşam Pratikleri",
      "İklim Adaleti ve Genç Sivil Toplum",
      "Geri Dönüşümden İleri Dönüşüme",
    ],
    pages: 40,
    fileSize: "4.8 MB",
    editorialNote:
      "İkinci sayımız iklim krizine karşı gençliğin geliştirdiği yerel çözümlere ve ekolojik farkındalık çalışmalarına odaklanıyor.",
    contributors: ["Gözde Yılmaz", "Kerem Öztürk", "Selin Aksoy"],
    readCount: 1420,
    downloadCount: 480,
  },
  {
    id: "sayi-1-napsak-baslangic",
    issueNumber: "Sayı #1",
    title: "İlk Adım: Harekete Geçen Gençlik",
    category: "Özel Sayılar",
    period: "2025 Bahar",
    publishDate: "10 Nisan 2025",
    coverStyle: {
      bgGradient: "from-[#111827] via-[#0F1115] to-[#0A5C3A]",
      textColor: "text-white",
      subtitleColor: "text-emerald-300",
      badgeBg: "bg-emerald-500",
      badgeText: "text-white",
      borderFrame: "border-emerald-500/30",
    },
    summary:
      "N'apsak? Gençlik Topluluğu'nun kuruluş felsefesi, çalışma ekiplerinin vizyonu ve ilk dönem üretimi olan lansman dergisi.",
    articles: [
      "N'apsak? Topluluk Manifestosu",
      "Ekip Çalışması ve Sivil Sinerji",
      "Gençler İçin Katılım Rehberi",
    ],
    pages: 36,
    fileSize: "4.1 MB",
    editorialNote:
      "İlk dergimizle 'Keşke' demek yerine 'N'apsak?' diyerek yola çıkan gençlerin heyecanını ve hedeflerini kayıt altına aldık.",
    contributors: ["Topluluk Yayın Kurulu"],
    readCount: 3100,
    downloadCount: 1120,
  },
  {
    id: "sayi-ozel-dijital-sanat",
    issueNumber: "Özel Sayı",
    title: "Dijital Çağda Tasarım ve Genç Üretkenlik",
    category: "Sanat & Edebiyat",
    period: "2025 Kış Özel",
    publishDate: "01 Aralık 2025",
    coverStyle: {
      bgGradient: "from-[#F6F4EE] via-[#EFECE4] to-[#E5E1D5]",
      textColor: "text-[#0F1115]",
      subtitleColor: "text-[#0A5C3A]",
      badgeBg: "bg-amber-600",
      badgeText: "text-white",
      borderFrame: "border-[#0A5C3A]/20",
      isLightCover: true,
    },
    summary:
      "Genç illüstratörler, 3D sanatçıları ve dijital içerik üreticilerinin eserlerinden oluşan karma seçki.",
    articles: [
      "Dijital İllüstrasyon Rehberi",
      "Kreatif Süreçlerde Yapay Zeka",
      "Gençlik Tasarım İnisiyatifleri",
    ],
    pages: 64,
    fileSize: "7.5 MB",
    editorialNote:
      "Sanat ve dijitalleşmenin kesişim noktasında gençlerin yarattığı özgün eserleri derledik.",
    contributors: ["Mert Demir", "Selin Aksoy", "Deniz Arslan"],
    readCount: 2890,
    downloadCount: 970,
  },
];

const CATEGORIES_TR = [
  "Tümü",
  "Teknoloji & Gelecek",
  "Sanat & Edebiyat",
  "Gençlik & Kültür",
  "Özel Sayılar",
];

const CATEGORIES_EN = [
  "All",
  "Tech & Future",
  "Art & Literature",
  "Youth & Culture",
  "Special Issues",
];

export default function DergilerContent() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [magazinesList, setMagazinesList] = useState<MagazineIssue[]>(MAGAZINES);

  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(null);
  const [readingIssue, setReadingIssue] = useState<MagazineIssue | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    MagazinesRepository.fetchMagazinesFromDB().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setMagazinesList(
          data.map((m: any) => ({
            id: String(m.id),
            issueNumber: m.issueNumber || "Sayı #",
            title: m.title,
            category: "Genel",
            period: m.publishDate || "2026",
            publishDate: m.publishDate || "2026",
            summary: m.description || m.summary || "Dergi sayısı.",
            articles: ["Dergiden öne çıkan konular", "Yayın Kurulu Notu"],
            pages: m.pages || 36,
            fileSize: "5.0 MB",
            pdfUrl: m.pdfUrl,
            coverImage: m.coverImage,
            editorialNote: m.description || "Dergi sayısı.",
            contributors: ["N'apsak? Yayın Kurulu"],
            readCount: m.readCount || 0,
            downloadCount: 0,
            coverStyle: {
              bgGradient: "from-[#0A5C3A] via-[#0E7A4D] to-[#08472D]",
              textColor: "text-white",
              subtitleColor: "text-[#0A5C3A]",
              badgeBg: "bg-[#0A5C3A]",
              badgeText: "text-white",
              borderFrame: "border-[#0A5C3A]/30",
            },
          }))
        );
      }
    });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedIssue || readingIssue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIssue, readingIssue]);

  // Filtered List
  const filteredMagazines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return magazinesList.filter((mag) => {
      const matchesCategory =
        activeCategory === "Tümü" || mag.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        mag.title.toLowerCase().includes(normalizedQuery) ||
        mag.summary.toLowerCase().includes(normalizedQuery) ||
        mag.issueNumber.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, magazinesList]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadPDF = (mag: MagazineIssue) => {
    if (mag.pdfUrl) {
      window.open(mag.pdfUrl, "_blank");
      triggerToast(`"${mag.issueNumber} - ${mag.title}" PDF dergisi açılıyor...`);
      return;
    }
    try {
      downloadMagazinePdf({
        id: mag.id,
        issueNumber: mag.issueNumber,
        title: mag.title,
        category: mag.category,
        publishDate: mag.publishDate,
        period: mag.period,
        pages: mag.pages,
        editorialNote: mag.editorialNote,
        articles: mag.articles,
        contributors: mag.contributors,
      });

      triggerToast(`"${mag.issueNumber} - ${mag.title}" PDF dergisi başarıyla indirildi!`);
    } catch (error) {
      console.error("Dergi PDF indirme hatası:", error);
      triggerToast("Dergi PDF dosyası oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <PageBackground id="dergiler-root" className="select-none px-0 py-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1 }}
            className="fixed top-20 right-5 z-[400] flex items-center gap-3 rounded-2xl border border-[#0A5C3A]/30 bg-[#0A5C3A] px-5 py-3.5 text-white shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="h-5 w-5 shrink-0 text-amber-300" />
            <p className="text-sm font-bold">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Hero Section */}
      <Section padding="none" background="transparent" className="relative pt-16 sm:pt-22 pb-6 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A5C3A]/10 border border-[#0A5C3A]/20 text-[#0A5C3A] font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-sm">
              <BookOpen className="w-4 h-4 text-[#0A5C3A]" />
              <span>{isEn ? "N'apsak? Digital Publications & Library" : "N'apsak? Dijital Yayınlar & Dergi Kütüphanesi"}</span>
            </div>

            <h1 className="font-headings text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] leading-tight">
              {isEn ? "Community Magazines & Special Issues" : "Topluluk Dergileri & Özel Yayınlar"}
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base font-medium leading-relaxed text-[#5F6773]">
              {isEn
                ? "Discover digital publications, culture & arts files, and zines written by youth in our digital library."
                : "Gençlerin kaleme aldığı dijital yayınlar, kültür-sanat dosyaları ve fanzin sayılarını dijital kütüphanemizde keşfedin."}
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      {/* Modern Horizontal Showcase Slider Section */}
      <Section padding="none" background="transparent" className="py-6 sm:py-10 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-7xl">
          {/* Controls & Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="h-4 w-4 shrink-0 text-[#0A5C3A] mr-1" />
              {CATEGORIES_TR.map((category, idx) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-xl border px-3.5 py-1.5 text-xs font-semibold font-sans transition-all cursor-pointer ${
                    activeCategory === category
                      ? "border-[#07452C] bg-[#07452C] text-white shadow-sm font-bold"
                      : "border-[#E5E7EB] bg-[#F8FAFC] text-[#4B5563] hover:border-[#07452C]/35 hover:bg-white hover:text-[#0F1115]"
                  }`}
                >
                  {isEn ? CATEGORIES_EN[idx] : category}
                </button>
              ))}
            </div>
          </div>


          {/* HORIZONTAL SHOWCASE CAROUSEL SLIDER */}
          <MagazineShowcaseSlider
            magazines={filteredMagazines}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenReader={(issue) => setReadingIssue(issue)}
          />
        </PageContainer>
      </Section>

      {/* Level 2: Magazine Detail Modal (Strict Viewport Height Bounds max-h-[calc(100vh-50px)]) */}
      {typeof document !== "undefined" &&
        createPortal(
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
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
              <div className="flex-none flex items-start justify-between border-b border-[#EEF0F2] bg-[#F8FAFC] p-3.5 sm:p-4 px-5 z-20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-[#EEF7F3] px-3 py-0.5 text-xs font-bold text-[#07452C]">
                      {selectedIssue.issueNumber}
                    </span>
                    <span className="rounded-full bg-white border border-[#E5E7EB] px-2.5 py-0.5 text-xs font-bold text-[#5F6773]">
                      {selectedIssue.period}
                    </span>
                  </div>
                  <h3 className="font-headings text-base sm:text-xl font-extrabold text-[#0F1115] leading-snug line-clamp-1">
                    {selectedIssue.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="rounded-full p-2 text-[#5F6773] hover:bg-[#EEF0F2] hover:text-[#0F1115] transition-colors cursor-pointer"
                  aria-label={isEn ? "Close" : "Kapat"}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content Body (constrained height max-h-[350px] sm:max-h-[400px]) */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-5 z-10 max-h-[350px] sm:max-h-[400px]">
                {/* Left Column: Magazine Cover Preview */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div
                    className={`w-full max-w-[175px] aspect-[3/4] rounded-2xl bg-gradient-to-br ${selectedIssue.coverStyle.bgGradient} p-3.5 ${selectedIssue.coverStyle.textColor} shadow-lg border-l-[6px] border-l-black/30 border-r-2 border-r-[#F4F1EA] flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-black/10">
                        N'APSAK?
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${selectedIssue.coverStyle.badgeBg} ${selectedIssue.coverStyle.badgeText}`}
                      >
                        {selectedIssue.issueNumber}
                      </span>
                    </div>
                    <div className="my-auto space-y-1">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                        {selectedIssue.category}
                      </p>
                      <h4 className="font-headings text-xs font-extrabold leading-snug line-clamp-3">
                        {selectedIssue.title}
                      </h4>
                    </div>
                    <div className="pt-1.5 border-t border-current/20 text-[9.5px] font-semibold">
                      {selectedIssue.publishDate}
                    </div>
                  </div>
                </div>

                {/* Right Column: Metadata */}
                <div className="md:col-span-8 space-y-3">
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#07452C]">
                      {isEn ? "Editorial Note" : "Editörden Not"}
                    </h4>
                    <p className="text-xs font-medium leading-relaxed text-[#5F6773] bg-[#F8FBF9] p-3 rounded-2xl border border-[#DDE7E1]">
                      {selectedIssue.editorialNote}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#07452C]">
                      {isEn ? "Articles in this Issue" : "Bu Sayıdaki Makaleler"}
                    </h4>
                    <div className="space-y-1.5">
                      {selectedIssue.articles.map((art, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl border border-[#EEF0F2] p-2 text-xs font-semibold text-[#0F1115]"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#07452C]" />
                          <span>{art}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#07452C]">
                      {isEn ? "Contributors & Team" : "Yazarlar ve Ekip"}
                    </h4>
                    <p className="text-xs font-semibold text-[#5F6773]">
                      {selectedIssue.contributors.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permanently Anchored Bottom Action Footer */}
              <div className="flex-none flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EEF0F2] bg-[#F8FAFC] p-3.5 px-6 z-20">
                <span className="text-xs font-bold text-[#5F6773]">
                  {selectedIssue.pages} {isEn ? "Pages" : "Sayfa"} • {selectedIssue.fileSize}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={() => handleDownloadPDF(selectedIssue)}
                    className="rounded-xl"
                  >
                    {isEn ? "Download PDF" : "PDF İndir"}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    leftIcon={<BookOpen className="h-4 w-4" />}
                    onClick={() => {
                      const target = selectedIssue;
                      setSelectedIssue(null);
                      setReadingIssue(target);
                    }}
                    className="rounded-xl !bg-[#07452C] hover:!bg-[#0A5C3A] text-white font-bold"
                  >
                    {isEn ? "Start Reading (3D Mode)" : "Okumaya Başla (3D Dergi Modu)"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
          document.body
        )}

      {/* Level 3: 3D FlipBook Reader Modal */}
      <MagazineReaderModal
        issue={readingIssue}
        onClose={() => setReadingIssue(null)}
        onDownloadPDF={handleDownloadPDF}
      />
    </PageBackground>
  );
}
