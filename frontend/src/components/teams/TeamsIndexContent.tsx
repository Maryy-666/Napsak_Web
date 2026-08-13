"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Layers, Target } from "lucide-react";
import { TEAMS_DATA, TEAM_ICONS, TeamData } from "../../data/teams";
import { Badge, Button, Card, PageContainer, Section } from "../ui";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: "easeOut",
    },
  }),
};

export function TeamsIndexContent() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(TEAMS_DATA[0].id);

  const activeTeam = TEAMS_DATA.find((t) => t.id === selectedTeamId) || TEAMS_DATA[0];
  const ActiveIcon = TEAM_ICONS[activeTeam.iconName];

  return (
    <PageBackground id="ekipler-index-root" className="select-none px-0 py-0">
      {/* 1. HERO SECTION */}
      <Section padding="none" background="transparent" className="pt-16 sm:pt-24 pb-12 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <Badge variant="brand" size="md" className="mx-auto">
              N'apsak? Çalışma Ekipleri
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight">
              Fikirlerin projeye, tutkunun <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#0A5C3A] to-[#128C59] bg-clip-text text-transparent font-black">
                üretime dönüştüğü
              </span>{" "}
              gençlik alanları.
            </h1>

            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium max-w-3xl mx-auto">
              Topluluğumuz bünyesindeki 5 bağımsız çalışma ekibi; sanat, teknoloji, çevre, eğitim ve iletişim alanlarında gençlerin yeteneklerini ortaya çıkarmasına olanak tanır.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                href={ROUTES.BASVURU}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
                className="font-bold px-7 h-12 text-sm sm:text-base rounded-xl"
              >
                Bir Ekibe Katıl
              </Button>
              <Button
                href={ROUTES.HAKKIMIZDA}
                variant="outline"
                size="lg"
                className="font-semibold px-6 h-12 text-sm sm:text-base rounded-xl border-[#EEF0F2]"
              >
                Topluluğu Tanı
              </Button>
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      {/* 2. INTERACTIVE TEAM EXPLORER HUB */}
      <Section padding="none" background="transparent" className="py-12 sm:py-20 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl space-y-10">
          
          {/* TEAM TABS BAR */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x select-none">
            {TEAMS_DATA.map((team) => {
              const IconComp = TEAM_ICONS[team.iconName];
              const isSelected = team.id === selectedTeamId;

              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer snap-start border ${
                    isSelected
                      ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-md shadow-[#0A5C3A]/20"
                      : "bg-white text-[#5F6773] border-[#EEF0F2] hover:border-[#0A5C3A]/40 hover:text-[#0F1115]"
                  }`}
                >
                  <IconComp className={`w-4 h-4 stroke-[2] ${isSelected ? "text-white" : "text-[#0A5C3A]"}`} />
                  <span>{team.title}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TEAM SPOTLIGHT SHOWCASE CARD */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTeam.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white rounded-[28px] border border-[#EEF0F2] shadow-[0_16px_40px_rgba(15,17,21,0.06)] overflow-hidden p-6 sm:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* LEFT CONTENT SPOTLIGHT */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] border border-[#0A5C3A]/20 flex items-center justify-center font-bold">
                      <ActiveIcon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#0A5C3A] block">
                        SEÇİLİ ÇALIŞMA EKİBİ
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-headings text-[#0F1115]">
                        {activeTeam.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg text-[#5F6773] font-sans font-medium leading-relaxed">
                    {activeTeam.about}
                  </p>

                  {/* ODAK ALANLARI */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F1115] flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#0A5C3A]" /> Odak Alanları & Çalışmalar
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeTeam.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F4F6F8] text-[#0F1115] border border-[#EEF0F2]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ACTION CTA BUTTON (DIRECT 1-CLICK ACCESS TO DETAIL PAGE) */}
                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/ekipler/${activeTeam.slug}`}
                      className="px-7 py-3.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white font-bold font-sans text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 group"
                    >
                      <span>{activeTeam.title} Detayına Git</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/basvuru"
                      className="px-6 py-3.5 rounded-xl bg-[#F8F9FA] hover:bg-[#EEF0F2] text-[#0F1115] border border-[#EEF0F2] font-semibold text-sm sm:text-base transition-colors"
                    >
                      Ekibe Başvur
                    </Link>
                  </div>
                </div>

                {/* RIGHT IMAGE FRAME */}
                <div className="lg:col-span-5 relative">
                  <Link
                    href={`/ekipler/${activeTeam.slug}`}
                    className="group block relative rounded-[24px] overflow-hidden border border-[#EEF0F2] shadow-md aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]"
                  >
                    <Image
                      src={activeTeam.bgImage}
                      alt={activeTeam.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white text-left z-10">
                      <span className="bg-[#0A5C3A] text-white text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider mb-2 w-fit">
                        Keşfet
                      </span>
                      <h3 className="text-xl font-bold font-headings flex items-center justify-between">
                        <span>{activeTeam.title}</span>
                        <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-xs text-white/80 font-sans mt-1">
                        Detaylı sayfa ve üretimleri incelemek için tıklayın
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 4. CTA BANNER */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.2}
            variants={fadeInUp}
            className="rounded-[24px] bg-[#0A5C3A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(10,92,58,0.20)] relative overflow-hidden mt-12"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10 text-left">
              <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 inline-block">
                Üretmeye Başla
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight mb-2">
                Hangi ekip sana daha yakın?
              </h3>
              <p className="text-sm sm:text-base text-white/85 font-sans font-medium max-w-xl">
                Yeteneğini geliştirmek ve projelerde aktif rol almak için mülakatlı üyelik başvurunu yapabilirsin.
              </p>
            </div>
            <Button
              href={ROUTES.BASVURU}
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
              className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold shrink-0 shadow-lg text-base px-6 h-12 relative z-10"
            >
              Hemen Başvur
            </Button>
          </motion.div>
        </PageContainer>
      </Section>
    </PageBackground>
  );
}
