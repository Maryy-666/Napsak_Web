"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Newspaper,
  Sparkles,
  Quote,
} from "lucide-react";
import { NewsItem, NEWS_DATA } from "../../data/news";
import { PageContainer, Section } from "../ui";
import { InnerPageBackground } from "../common/InnerPageBackground";

interface NewsDetailContentProps {
  news: NewsItem;
}

export function NewsDetailContent({ news }: NewsDetailContentProps) {
  const otherNews = NEWS_DATA;

  return (
    <InnerPageBackground className="min-h-screen flex flex-col">
      {/* Header & Hero Image Section */}
      <Section padding="lg" background="transparent" className="pt-10 pb-12 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-5xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-[#5F6773] mb-8 font-medium">
            <Link
              href="/"
              className="hover:text-[#0A5C3A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Ana Sayfa
            </Link>
            <span className="text-[#CDD1D5]">/</span>
            <span className="text-[#5F6773]">Haberler</span>
            <span className="text-[#CDD1D5]">/</span>
            <span className="text-[#0F1115] font-semibold line-clamp-1">{news.title}</span>
          </div>

          {/* Title Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col text-left space-y-4 mb-8"
          >
            {/* Category & Slogan Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A5C3A] text-white font-bold text-xs uppercase tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>N'apsak? Naptık!</span>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] font-extrabold text-xs uppercase tracking-wide border border-[#0A5C3A]/20">
                {news.category}
              </span>
            </div>

            {/* Main News Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headings text-[#0F1115] tracking-tight leading-[1.18]">
              {news.title}
            </h1>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5F6773] pt-1">
              <Calendar className="w-4 h-4 text-[#0A5C3A]" />
              <span>{news.date}</span>
            </div>
          </motion.div>

          {/* Full Cover Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-[28px] overflow-hidden border border-[#EEF0F2] shadow-xl bg-[#FAFBFB] p-2 sm:p-4 flex items-center justify-center"
          >
            <div className="relative w-full h-[320px] sm:h-[480px] md:h-[540px] rounded-[20px] overflow-hidden">
              <Image
                src={news.coverImage}
                alt={news.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain object-center rounded-[20px]"
              />
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      {/* Main News Content Body */}
      <Section padding="lg" background="transparent" className="py-12">
        <PageContainer className="max-w-4xl space-y-12">
          {/* Detailed Content Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-sm rounded-[28px] border border-[#EEF0F2] p-8 sm:p-12 text-left shadow-sm space-y-8"
          >
            <div className="flex items-center gap-3 border-b border-[#EEF0F2] pb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                <Newspaper className="w-5 h-5 stroke-[2]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-headings text-[#0F1115]">
                Haber Detayı
              </h2>
            </div>

            {/* Excerpt Lead Paragraph */}
            <p className="text-lg sm:text-xl font-sans text-[#0F1115] font-semibold leading-relaxed border-l-4 border-[#0A5C3A] pl-4 py-1">
              {news.excerpt}
            </p>

            {/* Inspiring Quote Card (Atatürk Quote for 23 Nisan) */}
            {news.quote && (
              <div className="relative rounded-[24px] bg-gradient-to-r from-[#07452C] via-[#0A5C3A] to-[#07452C] text-white p-7 sm:p-10 shadow-xl border border-white/20 my-6 text-center space-y-5 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-inner mx-auto mb-1">
                    <Quote className="w-6 h-6" />
                  </div>

                  <blockquote className="text-xl sm:text-2xl font-extrabold font-headings tracking-tight leading-relaxed italic max-w-2xl mx-auto text-[#EEF7F3]">
                    “{news.quote.text}”
                  </blockquote>

                  <div className="flex flex-col items-center pt-2 space-y-1">
                    <span className="text-base sm:text-lg font-bold font-sans tracking-wide text-white">
                      {news.quote.author}
                    </span>
                    {news.quote.title && (
                      <span className="text-xs uppercase tracking-widest text-white/80 font-semibold font-sans">
                        {news.quote.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Body */}
            <div className="text-base sm:text-lg font-sans text-[#5F6773] leading-relaxed space-y-4">
              <p>{news.content}</p>
            </div>
          </motion.div>

          {/* Extra Photo Gallery Section */}
          {news.images && news.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-[28px] border border-[#EEF0F2] p-8 sm:p-12 text-left shadow-sm space-y-8"
            >
              <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-5">
                <div>
                  <span className="text-xs font-bold text-[#0A5C3A] uppercase tracking-wider">
                    ETKİNLİK KARELERİ
                  </span>
                  <h3 className="text-2xl font-bold font-headings text-[#0F1115] mt-0.5">
                    Haber Görselleri
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center text-sm font-bold">
                  {news.images.length}
                </div>
              </div>

              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {news.images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-[24px] overflow-hidden border border-[#EEF0F2] shadow-sm bg-[#FAFBFB] hover:shadow-xl hover:scale-[1.01] transition-all duration-300 p-3 sm:p-4 flex items-center justify-center h-[340px] sm:h-[420px]"
                  >
                    <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={`${news.title} Görsel ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain object-center p-1 rounded-[16px] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* "Diğer Haberler" Navigation Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-10 border-t border-[#EEF0F2]"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
              <div>
                <span className="text-[#0A5C3A] text-xs font-bold uppercase tracking-wider">
                  KEŞFETMEYE DEVAM ET
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-headings text-[#0F1115] mt-1">
                  Diğer Haberler
                </h2>
              </div>
              <p className="text-sm text-[#5F6773] max-w-sm">
                Topluluğumuzun öne çıkan tüm haberlerini, etkinliklerini ve duyurularını inceleyin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {otherNews.map((item) => {
                const isCurrent = item.slug === news.slug;

                if (isCurrent) {
                  return (
                    <div
                      key={item.id}
                      className="relative bg-white rounded-[20px] border-2 border-[#0A5C3A] p-5 shadow-[0_10px_30px_rgba(10,92,58,0.12)] flex flex-col justify-between cursor-default ring-2 ring-[#0A5C3A]/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#0A5C3A] text-white uppercase tracking-wider shadow-sm">
                          Buradasın
                        </span>
                        <span className="text-xs font-medium text-[#5F6773]">{item.date}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-headings text-[#0A5C3A] mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs font-sans text-[#5F6773] line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={`/haberler/${item.slug}`}
                    className="group relative bg-white rounded-[20px] border border-[#EEF0F2] p-5 shadow-[0_8px_24px_rgba(15,17,21,0.04)] hover:border-[#0A5C3A] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(10,92,58,0.12)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-[#5F6773]">{item.date}</span>
                      <div className="w-6 h-6 rounded-full bg-[#F8F9FA] text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors flex items-center justify-center text-xs font-bold">
                        →
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs font-sans text-[#5F6773] line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </PageContainer>
      </Section>
    </InnerPageBackground>
  );
}
