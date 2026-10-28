"use client";

import React from "react";
import { VisionBoard } from "./VisionBoard";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { InnerPageBackground } from "../common/InnerPageBackground";
import { Button } from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";

export default function FaaliyetlerContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <InnerPageBackground className="min-h-screen pt-24 sm:pt-28 pb-16">
      {/* ---------------------------------------------------- */}
      {/* HERO TITLE SECTION                                   */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 text-center relative">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#E0F2EC]/60 blur-3xl rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-1/4 w-72 h-56 bg-[#FFE8DB]/60 blur-3xl rounded-full pointer-events-none -z-10" />

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F1115] tracking-tight font-headings max-w-4xl mx-auto leading-tight">
          {isEn ? "Our Activities & " : "Faaliyetlerimiz & "}
          <span className="text-[#07452C] relative inline-block">
            {isEn ? "Inspiration Board" : "İlham Panomuz"}
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-[#81B29A]"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path
                d="M0,7 Q50,13 100,5"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "A live board view of all activities created, produced, and brought to life by youth across technology, art, environment, and social impact."
            : "Ne Yapsak? ekolojiden teknolojiye, sanattan toplumsal faydaya gençlerin birlikte ürettiği, hayal ettiği ve hayata geçirdiği tüm faaliyetlerin canlı pano görünümü."}
        </p>
      </section>


      {/* ---------------------------------------------------- */}
      {/* MAIN VISION BOARD SECTION                            */}
      {/* ---------------------------------------------------- */}
      <section className="w-full my-4 sm:my-6">
        <VisionBoard />
      </section>

      {/* ---------------------------------------------------- */}
      {/* OFFICIAL NE YAPSAK SITE-WIDE CTA BANNER                */}
      {/* ---------------------------------------------------- */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="rounded-[24px] bg-[#0A5C3A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none shadow-[0_20px_50px_rgba(10,92,58,0.20)] relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10">
            <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 inline-block">
              {isEn ? "Take Action" : "Harekete Geç"}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight mb-2">
              {isEn ? "Take your place in Ne Yapsak?!" : "Sen de Ne Yapsak?'ta yerini al!"}
            </h3>
            <p className="text-sm sm:text-base text-white/85 font-sans font-medium max-w-xl">
              {isEn
                ? "You can submit your membership application to discover your potential, produce your projects, and meet like-minded youth."
                : "Potansiyelini keşfetmek, projelerini üretmek ve senin gibi düşünen gençlerle buluşmak için mülakatlı üyelik başvurusu yapabilirsin."}
            </p>
          </div>
          <Button
            href={ROUTES.BASVURU}
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
            className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold shrink-0 shadow-lg text-base px-6 h-12 relative z-10"
          >
            {isEn ? "Join Association" : "Derneğe Katıl"}
          </Button>
        </div>
      </section>
    </InnerPageBackground>
  );
}
