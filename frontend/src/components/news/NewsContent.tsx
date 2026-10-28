"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper, Search, Sparkles } from "lucide-react";
import { NewsRepository } from "../../lib/newsStore";
import { Badge, PageContainer, Section } from "../ui";
import { useLanguage } from "../../context/LanguageContext";

type NewsCard = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  coverImage: string;
  content: string;
};

const mapNewsItem = (item: any): NewsCard => ({
  id: String(item.id),
  slug: item.slug,
  title: item.title,
  date: item.publishDate || "2026",
  category: item.category || "Duyuru",
  excerpt: item.summary || item.content?.substring(0, 150) || "",
  coverImage: item.coverImage || "/images/forest-hero.jpg",
  content: item.content || "",
});

export function NewsContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [newsItems, setNewsItems] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    NewsRepository.fetchNewsFromDB()
      .then((data) => setNewsItems(data.map(mapNewsItem)))
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(new Set(newsItems.map((item) => item.category || "Duyuru")));

  const filteredNews = newsItems.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Section padding="lg" background="subtle" className="py-12 sm:py-16">
      <PageContainer className="max-w-6xl">
        <div className="space-y-4 mb-10 text-center sm:text-left">
          <Badge
            variant="brand"
            size="md"
            className="!bg-[#0A5C3A]/10 !text-[#0A5C3A] !border-[#0A5C3A]/20"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> {isEn ? "Ne Yapsak? Latest Updates!" : "Ne Yapsak? Naptık!"}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-headings text-[#0F1115] tracking-tight">
            {isEn ? "News & Announcements" : "Haberler & Duyurular"}
          </h1>
          <p className="text-base sm:text-lg font-sans text-[#5F6773] max-w-2xl">
            {isEn
              ? "The latest workshops, events, collaborations, and impactful stories from our association."
              : "Derneğimizin en güncel atölyeleri, etkinlikleri, iş birlikleri ve sahada iz bırakan hikayeleri."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search news or announcements..." : "Haber veya duyuru ara..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EEF0F2] bg-white text-xs font-medium outline-none focus:border-[#0A5C3A]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#0A5C3A] text-white shadow-sm"
                  : "bg-white border border-[#EEF0F2] text-[#5F6773] hover:bg-slate-50"
              }`}
            >
              {isEn ? "All" : "Tümü"}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#0A5C3A] text-white shadow-sm"
                    : "bg-white border border-[#EEF0F2] text-[#5F6773] hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            {isEn ? "Loading news..." : "Haberler yükleniyor..."}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm font-medium">
            {isEn ? "No news published yet." : "Yayında haber bulunmuyor."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id || item.slug}
                href={`/haberler/${item.slug}`}
                className="flex flex-col h-full bg-white rounded-[24px] border border-[#EEF0F2] overflow-hidden shadow-[0_8px_30px_rgba(15,17,21,0.04)] hover:shadow-[0_16px_40px_rgba(10,92,58,0.14)] hover:border-[#0A5C3A]/50 transition-all duration-300 group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAFBFB] p-2">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#0A5C3A] text-white text-xs font-bold shadow-md">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#5F6773]">
                      <Calendar className="w-3.5 h-3.5 text-[#0A5C3A]" />
                      <span>{item.date}</span>
                    </div>

                    <h2 className="text-lg font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm font-sans text-[#5F6773] leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EEF0F2] flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A5C3A] group-hover:text-[#084A2F]">
                      <span>{isEn ? "Read Article" : "Oku"}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                    <span className="w-7 h-7 rounded-full bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center">
                      <Newspaper className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </PageContainer>
    </Section>
  );
}
