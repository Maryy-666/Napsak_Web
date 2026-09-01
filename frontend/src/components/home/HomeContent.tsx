"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  Compass,
  UserPlus,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { Button, Card, Badge, PageContainer, Section } from "../ui";
import { HeroSection } from "./HeroSection";
import { TeamCarousel } from "./TeamCarousel";
import { StatsSection } from "./StatsSection";
import { TurkeyMapSection } from "./TurkeyMapSection";
import { CoreValuesSection } from "./CoreValuesSection";
import { NewsSection } from "./NewsSection";
import { ROUTES } from "../../constants/routes";
import { SITE_CONFIG } from "../../config/site";
import { useLanguage } from "../../context/LanguageContext";

export default function HomeContent() {
  const { language, t } = useLanguage();

  const culturalSteps = [
    {
      num: "01",
      title: t("culture.step1.title", "Keşfet"),
      description: t("culture.step1.desc", "İlgi alanlarını keşfet, topluluğumuzu ve ekiplerimizi tanı."),
      icon: Compass,
    },
    {
      num: "02",
      title: t("culture.step2.title", "Katıl"),
      description: t("culture.step2.desc", "Sana en yakın çalışma alanına dahil ol, diğer gençlerle birlikte üret."),
      icon: UserPlus,
    },
    {
      num: "03",
      title: t("culture.step3.title", "Üret"),
      description: t("culture.step3.desc", "Projelerde, etkinliklerde ve ekip çalışmalarında aktif rol al."),
      icon: Lightbulb,
    },
    {
      num: "04",
      title: t("culture.step4.title", "Geliş"),
      description: t("culture.step4.desc", "Yeni şeyler öğren, deneyim kazan ve topluluğun gelişimine katkı sağla."),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center bg-white overflow-hidden" id="home-page-root">
      
      {/* 1. HERO SECTION WITH FOREST BACKGROUND */}
      <HeroSection />

      {/* 2. "N'APSAK'LI OLMAK NE DEMEK?" CULTURAL PROCESS SECTION */}
      <Section padding="none" background="white" className="py-12 sm:py-20 border-b border-[#EEF0F2]">
        <PageContainer>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 select-none">
            <Badge variant="brand" size="md" className="mb-3">
              {t("culture.badge", "Topluluk Kültürü")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings mb-3">
              {t("culture.title", "N'apsak'lı olmak ne demek?")}
            </h2>
            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium">
              {t("culture.subtitle", "Sadece bir topluluğun parçası olmak değil; üretmek, öğrenmek ve birlikte gelişmek.")}
            </p>
          </div>

          {/* 4 Steps Process Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
            {culturalSteps.map((step, index) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="group relative bg-white rounded-[20px] border border-[#EEF0F2] p-6 flex flex-col justify-between transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_16px_36px_rgba(10,92,58,0.14)] hover:border-[#0A5C3A]/50 hover:z-10 select-none cursor-default"
                >
                  <div>
                    {/* Top Header: Step Number Pill & Icon Box */}
                    <div className="flex items-center justify-between w-full mb-5">
                      <span className="text-xs font-black tracking-widest text-[#0A5C3A] bg-[#0A5C3A]/10 px-2.5 py-1 rounded-md font-sans">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors duration-300 shadow-sm">
                        <IconComp className="w-5 h-5 stroke-[2]" />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl font-bold font-headings text-[#0F1115] mb-2.5 group-hover:text-[#0A5C3A] transition-colors">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-xs sm:text-sm text-[#5F6773] font-sans leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Soft Green Accent Bar at Bottom of Card on Hover */}
                  <div className="w-full h-1 bg-transparent group-hover:bg-[#0A5C3A] rounded-full mt-6 transition-colors duration-300" />
                </motion.div>
              );
            })}
          </div>
        </PageContainer>
      </Section>

      {/* 2.5 ISTATISTIK BANDI */}
      <StatsSection />

      {/* 2.6 BİZ HER YERDEYİZ (TÜRKİYE HARİTASI) */}
      <TurkeyMapSection />

      {/* 3. KISA TOPLULUK TANITIMI (VİZYON & MİSYON) */}
      <Section padding="md" background="subtle">
        <PageContainer>
          <div className="text-center max-w-3xl mx-auto mb-12 select-none">
            <Badge variant="brand" size="md" className="mb-3">
              {language === "en" ? "About Our Community" : "Topluluğumuz Hakkında"}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F1115] font-headings mb-4">
              {language === "en" ? "Unleashing Youth Potential Together" : "Gençlerin Potansiyelini Harekete Geçiriyoruz"}
            </h2>
            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium">
              {language === "en"
                ? "The meeting point for youth who produce, learn, and grow together."
                : SITE_CONFIG.description}
            </p>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Card
              variant="default"
              animate={false}
              className="p-6 sm:p-8 bg-white border border-[#EEF0F2] rounded-[16px] flex flex-col text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mb-5">
                <Target className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F1115] font-headings mb-3">
                {language === "en" ? "Our Vision" : "Vizyonumuz"}
              </h3>
              <p className="text-sm sm:text-base text-[#5F6773] font-sans leading-relaxed">
                {language === "en"
                  ? "To prepare youth not just for today but for tomorrow by unleashing their potential; supporting personal growth across academic, social, technological, and creative fields."
                  : "Gençlerin potansiyellerini ortaya çıkararak onları yalnızca bugünün değil, yarının dünyasına da hazırlamak; akademik gelişimin yanında sosyal, kültürel, teknolojik ve sanatsal alanlarda da gelişimi desteklemektir."}
              </p>
            </Card>

            <Card
              variant="default"
              animate={false}
              className="p-6 sm:p-8 bg-white border border-[#EEF0F2] rounded-[16px] flex flex-col text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mb-5">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F1115] font-headings mb-3">
                {language === "en" ? "Our Mission" : "Misyonumuz"}
              </h3>
              <p className="text-sm sm:text-base text-[#5F6773] font-sans leading-relaxed">
                {language === "en"
                  ? "To guide youth energy, curiosity, and creativity toward positive development; building a culture of producing together in education, art, technology, and social responsibility."
                  : "Gençlerin enerjisini, merakını ve yaratıcılığını doğru yönlendirerek gelişim yolculuklarına katkıda bulunmak; eğitim, hobi, sanat, teknoloji ve sosyal sorumluluk alanlarında birlikte üretme kültürünü desteklemektir."}
              </p>
            </Card>
          </div>
        </PageContainer>
      </Section> 

      {/* 3.5 TEMEL DEĞERLERİMİZ (RADIAL CORE VALUES SECTION) */}
      <CoreValuesSection />

      {/* 4. WORKING TEAMS (PERSPECTIVE 3D TEAM CAROUSEL) */}
      <Section padding="lg" background="white" className="overflow-hidden">
        <PageContainer>
          <div className="text-center max-w-3xl mx-auto mb-8 select-none">
            <Badge variant="brand" size="md" className="mb-3">
              {t("teams.badge", "Çalışma Ekiplerimiz")}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings mb-4">
              {t("teams.title", "Farklı Alanlarda Birlikte Üretiyoruz")}
            </h2>
            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium">
              {t("teams.subtitle", "Topluluğumuz bünyesinde farklı ilgi alanlarına yönelik çalışmalar yürüten ekiplerimizle üretmenin ve gelişmenin gücünü birlikte keşfediyoruz.")}
            </p>
          </div>

          {/* 3D Perspective Arc Carousel Component */}
          <TeamCarousel />
        </PageContainer>
      </Section> 

      {/* 4.5 BİZDEN HABERLER (N'APSAK? NAPTIK! NEWS SECTION) */}
      <NewsSection />

      {/* 5. FINAL CTA BANNER */}
      <Section padding="lg" background="white">
        <PageContainer>
          <div className="relative overflow-hidden rounded-[24px] bg-[#0A5C3A] text-white p-8 sm:p-14 text-center flex flex-col items-center justify-center select-none shadow-[0_20px_50px_rgba(10,92,58,0.22)]">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headings tracking-tight mb-4 leading-tight">
                {t("cta.title", "N'apsak?'ta birlikte üretelim.")}
              </h2>
              <p className="text-base sm:text-lg text-white/85 font-sans font-medium mb-8 leading-relaxed">
                {t("cta.subtitle", "Sen de potansiyelini harekete geçir, projelerini hayata geçir ve gelişen topluluğumuzun bir parçası ol.")}
              </p>
              <Button
                href={ROUTES.BASVURU}
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
                className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold text-base px-8 h-14"
              >
                {t("nav.join", "Topluluğa Katıl")}
              </Button>
            </div>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
}

