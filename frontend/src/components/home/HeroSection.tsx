"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge, PageContainer } from "../ui";
import { useLanguage } from "../../context/LanguageContext";

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const badgeText = t("hero.badge", "2025'ten Beri Harekete Geçenler");
  const title = t("hero.title", "N'apsak? Gençlik Topluluğu");
  const highlight = t(
    "hero.highlight",
    "“Keşke..” diyenlerin değil, “N'apsak?” deyip harekete geçenlerin topluluğuyuz."
  );
  const description = t(
    "hero.description",
    "Üreten, öğrenen ve birlikte gelişen gençlerin buluşma noktasıyız. Farklı alanlarda kendini geliştirmek, yeni insanlarla tanışmak ve birlikte üretmenin gücünü keşfetmek için buradayız."
  );
  const bgImage = "/images/forest-hero.jpg";


  return (
    <section className="relative w-full h-[100vh] min-h-[100vh] h-[100svh] min-h-[100svh] pt-24 sm:pt-28 pb-10 sm:pb-14 flex items-center justify-start overflow-hidden bg-[#07452C]">
      {/* Forest Hero Background Image - Full Viewport Cover */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        {/* Dark/Green Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07452C]/90 via-[#0A5C3A]/75 to-[#07452C]/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <PageContainer className="relative z-10 text-left flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl rounded-[24px] bg-[#07452C]/65 backdrop-blur-[16px] border border-white/20 p-7 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-left flex flex-col items-start"
        >
          {/* Badge */}
          <Badge variant="brand" size="md" className="!bg-white/15 !text-white !border-white/25 mb-4 sm:mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> {badgeText}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-headings select-none leading-[1.15] mb-4">
            {title}
          </h1>

          {/* Main Message Slogan */}
          <p className="text-base sm:text-lg lg:text-xl text-[#EEF7F3] font-semibold font-sans italic leading-relaxed mb-3 select-none">
            {highlight}
          </p>

          {/* Supporting Description Text */}
          <p className="text-xs sm:text-sm lg:text-base text-white/85 font-normal font-sans leading-relaxed select-none mb-0">
            {description}
          </p>
        </motion.div>
      </PageContainer>
    </section>
  );
};

HeroSection.displayName = "HeroSection";
export default HeroSection;
