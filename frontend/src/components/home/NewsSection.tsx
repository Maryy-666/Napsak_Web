"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { NewsRepository } from "../../lib/newsStore";
import { PageContainer, Section } from "../ui";
import { useLanguage } from "../../context/LanguageContext";

type NewsCard = {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  date: string;
  category: string;
  categoryEn?: string;
  excerpt: string;
  excerptEn?: string;
  coverImage: string;
};

const mapNewsItem = (item: any): NewsCard => ({
  id: String(item.id),
  slug: item.slug,
  title: item.title,
  titleEn: item.titleEn,
  date: item.publishDate || "2026",
  category: item.category || "Duyuru",
  categoryEn: item.categoryEn,
  excerpt: item.summary || item.content?.substring(0, 150) || "",
  excerptEn: item.summaryEn || item.excerptEn || item.contentEn?.substring(0, 150),
  coverImage: item.coverImage || "/images/forest-hero.jpg",
});

export const NewsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [newsList, setNewsList] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    NewsRepository.fetchNewsFromDB()
      .then((data) => setNewsList(data.map(mapNewsItem)))
      .finally(() => setLoading(false));
  }, []);

  const totalNews = newsList.length;

  useEffect(() => {
    if (shouldReduceMotion || isPaused || totalNews === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalNews);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalNews, isPaused, shouldReduceMotion]);

  useEffect(() => {
    if (currentIndex >= totalNews && totalNews > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalNews]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalNews) % totalNews);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalNews);
  };

  if (!loading && totalNews === 0) {
    return null;
  }

  return (
    <Section padding="lg" background="subtle" className="relative py-20 overflow-hidden border-t border-[#EEF0F2]">
      <PageContainer className="max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 text-left">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A5C3A]/10 border border-[#0A5C3A]/20 text-[#0A5C3A] font-extrabold text-sm tracking-wide uppercase shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t("news.badge", "Ne Yapsak? Naptık!")}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headings text-[#0F1115] tracking-tight"
            >
              {t("news.title", "Bizden Haberler")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg font-sans text-[#5F6773] leading-relaxed"
            >
              {t(
                "news.subtitle",
                "Derneğimizin en güncel atölyeleri, etkinlikleri, iş birlikleri ve sahada iz bırakan renkli hikayeleri."
              )}
            </motion.p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={ROUTES.HABERLER}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A5C3A] text-white text-xs font-bold shadow-md hover:bg-[#084A2F] transition-all"
            >
              <span>{t("news.viewAll", "Tüm Haberler")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handlePrev}
              disabled={totalNews <= 1}
              className="w-12 h-12 rounded-full bg-white border border-[#EEF0F2] text-[#0A5C3A] shadow-md hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
              aria-label={isEn ? "Previous News" : "Önceki Haber"}
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={totalNews <= 1}
              className="w-12 h-12 rounded-full bg-white border border-[#EEF0F2] text-[#0A5C3A] shadow-md hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
              aria-label={isEn ? "Next News" : "Sonraki Haber"}
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm font-medium text-[#5F6773]">{t("common.loading", "Yükleniyor...")}</div>
        ) : (
          <>
            <div
              className="relative w-full overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <motion.div
                className="flex gap-6 text-left"
                animate={{
                  x: `-${
                    currentIndex *
                    (100 /
                      (typeof window !== "undefined" && window.innerWidth < 640
                        ? 1
                        : typeof window !== "undefined" && window.innerWidth < 1024
                          ? 2
                          : 3))
                  }%`,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {newsList.map((item) => {
                  const cardTitle = isEn ? (item.titleEn || item.title) : item.title;
                  const cardCategory = isEn ? (item.categoryEn || item.category) : item.category;
                  const cardExcerpt = isEn ? (item.excerptEn || item.excerpt) : item.excerpt;

                  return (
                    <div
                      key={item.id || item.slug}
                      className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 flex flex-col"
                    >
                      <Link
                        href={`/haberler/${item.slug}`}
                        className="flex flex-col h-full bg-white rounded-[24px] border border-[#EEF0F2] overflow-hidden shadow-[0_8px_30px_rgba(15,17,21,0.04)] hover:shadow-[0_16px_40px_rgba(10,92,58,0.14)] hover:border-[#0A5C3A]/50 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative block aspect-[16/10] overflow-hidden bg-[#FAFBFB] p-2">
                          <Image
                            src={item.coverImage}
                            alt={cardTitle}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#0A5C3A] text-white text-xs font-bold font-sans tracking-wide shadow-md">
                            {cardCategory}
                          </div>
                        </div>

                        <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-medium text-[#5F6773]">
                              <Calendar className="w-3.5 h-3.5 text-[#0A5C3A]" />
                              <span>{item.date}</span>
                            </div>

                            <h3 className="text-xl font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-snug line-clamp-2">
                              {cardTitle}
                            </h3>

                            <p className="text-sm font-sans text-[#5F6773] leading-relaxed line-clamp-3">
                              {cardExcerpt}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#EEF0F2] flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A5C3A] group-hover:text-[#084A2F] transition-colors">
                              <span>{t("common.viewDetails", "Detayları Gör")}</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                            </div>
                            <span className="w-8 h-8 rounded-full bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors">
                              <Newspaper className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-10">
              {newsList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-[#0A5C3A]"
                      : "w-2.5 bg-[#CDD1D5] hover:bg-[#0A5C3A]/40"
                  }`}
                  aria-label={isEn ? `News ${idx + 1}` : `Haber ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </PageContainer>
    </Section>
  );
};
