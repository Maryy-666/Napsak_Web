"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  Users,
  Briefcase,
  Target,
  Palette,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { TeamData, TEAMS_DATA, TEAM_ICONS } from "../../data/teams";
import { TeamsRepository } from "../../lib/teamsStore";
import { PageContainer, Section } from "../ui";
import { InnerPageBackground } from "../common/InnerPageBackground";
import { ROUTES } from "../../constants/routes";

interface TeamDetailContentProps {
  team: TeamData;
}

export function TeamDetailContent({ team: initialTeam }: TeamDetailContentProps) {
  const [currentTeam, setCurrentTeam] = useState<TeamData>(initialTeam);
  const [allTeams, setAllTeams] = useState<TeamData[]>(TEAMS_DATA);

  useEffect(() => {
    TeamsRepository.fetchTeamsFromDB().then((teams) => {
      if (Array.isArray(teams) && teams.length > 0) {
        setAllTeams(teams);
        const matched = teams.find(
          (t) => t.slug === initialTeam.slug || t.id === initialTeam.id || t.slug === initialTeam.id
        );
        if (matched) {
          setCurrentTeam(matched);
        }
      }
    });
  }, [initialTeam]);

  const team = currentTeam;
  const IconComp = TEAM_ICONS[team.iconName] || TEAM_ICONS["cpu"];
  const featuredArt = team.gallery?.find((item) => item.isFeatured);
  const gridArtItems = team.gallery?.filter((item) => !item.isFeatured) || [];

  return (
    <InnerPageBackground className="min-h-screen flex flex-col">
      {/* Hero Banner Section */}
      <Section padding="lg" background="transparent" className="pt-10 pb-16 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-6xl">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-[#5F6773] mb-8 font-medium">
            <Link
              href="/"
              className="hover:text-[#0A5C3A] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Ana Sayfa
            </Link>
            <span className="text-[#CDD1D5]">/</span>
            <Link href={ROUTES.EKIPLER} className="hover:text-[#0A5C3A] transition-colors">
              Ekipler
            </Link>
            <span className="text-[#CDD1D5]">/</span>
            <span className="text-[#0F1115] font-semibold">{team.title}</span>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-7 flex flex-col text-left"
            >
              {/* Badge Header */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0A5C3A]/8 text-[#0A5C3A] font-bold text-xs sm:text-sm tracking-wide uppercase mb-6 w-fit border border-[#0A5C3A]/15 shadow-sm">
                <IconComp className="w-4 h-4 stroke-[2.5]" />
                <span>N'APSAK? ÇALIŞMA EKİBİ</span>
              </div>

              {/* 1. Ekip Adı */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-headings text-[#0F1115] tracking-tight leading-[1.15] mb-6">
                {team.title}
              </h1>

              {/* 2. Kısa Tanıtım */}
              <p className="text-lg sm:text-xl font-sans text-[#5F6773] leading-relaxed mb-8">
                {team.shortDescription}
              </p>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/basvuru"
                  className="px-7 py-3.5 rounded-full bg-[#0A5C3A] text-white font-bold font-sans text-sm sm:text-base hover:bg-[#084A2F] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group"
                >
                  <span>Ekibe Katıl</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#diger-ekipler"
                  className="px-6 py-3.5 rounded-full bg-white border border-[#EEF0F2] text-[#0F1115] font-semibold font-sans text-sm sm:text-base hover:bg-[#F8F9FA] hover:border-[#0A5C3A]/30 transition-all duration-200 shadow-sm"
                >
                  Tüm Ekipler
                </a>
              </div>
            </motion.div>

            {/* Right Image Banner Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-[28px] overflow-hidden border-2 border-[#EEF0F2] shadow-xl group aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                <Image
                  src={team.bgImage || "/images/istockphoto-1173149385-612x612.jpg"}
                  alt={team.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-left z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 border border-white/20">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-bold font-headings">{team.title}</h3>
                  <p className="text-xs text-white/80 font-sans mt-1">N'apsak? Gençlik Topluluğu</p>
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </Section>

      {/* Main Body Sections */}
      <Section padding="lg" background="transparent" className="py-16">
        <PageContainer className="max-w-6xl space-y-16">
          {/* 3. Ekip Hakkında (Özel Görsel Entegrasyonlu) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`bg-white/80 backdrop-blur-sm rounded-[24px] border border-[#EEF0F2] p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow ${
                team.featuredSectionImage ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                  <Users className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-headings text-[#0F1115]">
                  Ekip Hakkında
                </h2>
              </div>
              <p className="text-base sm:text-lg font-sans text-[#5F6773] leading-relaxed">
                {team.about}
              </p>
            </motion.div>

            {/* Çevre ve Sağlık (Doğa) Ekibi Özel Görseli */}
            {team.featuredSectionImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-5 relative"
              >
                <div className="relative rounded-[24px] overflow-hidden border border-[#EEF0F2] shadow-md group bg-white aspect-[4/3]">
                  <Image
                    src={team.featuredSectionImage}
                    alt={`${team.title} Sürdürülebilirlik & Doğa İllüstrasyonu`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold font-sans flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Leaf className="w-4 h-4 text-[#0A5C3A] bg-white rounded-full p-0.5" />
                    <span>Sürdürülebilir & Doğa Dostu Gelecek</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Grid: 4. Çalışma Alanları & 5. Neler Yapıyoruz? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {/* 4. Çalışma Alanları */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[24px] border border-[#EEF0F2] p-7 sm:p-9 shadow-[0_10px_30px_rgba(15,17,21,0.04)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                    <Target className="w-5.5 h-5.5 stroke-[2]" />
                  </div>
                  <h2 className="text-2xl font-bold font-headings text-[#0F1115]">
                    Çalışma Alanları
                  </h2>
                </div>

                <ul className="space-y-3.5">
                  {team.focusAreas.map((area, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-[#EEF0F2] text-sm sm:text-base font-semibold font-sans text-[#0F1115] hover:border-[#0A5C3A]/30 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#0A5C3A] shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* 5. Neler Yapıyoruz? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[24px] border border-[#EEF0F2] p-7 sm:p-9 shadow-[0_10px_30px_rgba(15,17,21,0.04)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                    <Briefcase className="w-5.5 h-5.5 stroke-[2]" />
                  </div>
                  <h2 className="text-2xl font-bold font-headings text-[#0F1115]">
                    Neler Yapıyoruz?
                  </h2>
                </div>

                <div className="space-y-4">
                  {team.whatWeDo.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-left">
                      <CheckCircle2 className="w-5 h-5 text-[#0A5C3A] shrink-0 mt-0.5" />
                      <p className="text-sm sm:text-base font-sans text-[#5F6773] leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sanat Ekibi Özel Görsel Galerisi */}
          {team.gallery && team.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-[28px] border border-[#EEF0F2] p-7 sm:p-10 shadow-sm text-left space-y-8"
            >
              {/* Gallery Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EEF0F2] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0A5C3A] mb-1">
                    <Palette className="w-4 h-4" />
                    <span>Yaratıcı Atölye & Üretim</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-headings text-[#0F1115]">
                    {team.galleryTitle || "Sanatla Üretiyoruz"}
                  </h2>
                </div>
                <p className="text-sm text-[#5F6773] max-w-md">
                  Gençlerin hayal gücü ve estetik bakış açısıyla ürettiği özgün soyut formlar, illüstrasyonlar ve yaratıcı görsel çalışmalar.
                </p>
              </div>

              {/* 1. Featured Banner Collage */}
              {featuredArt && (
                <div className="relative rounded-[24px] overflow-hidden border border-[#EEF0F2] shadow-md group aspect-[16/9] sm:aspect-[21/9] bg-[#FAFBFB]">
                  <Image
                    src={featuredArt.src}
                    alt={featuredArt.alt}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              )}

              {/* 2. 2-Column Responsive Art Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gridArtItems.map((art, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-[20px] overflow-hidden border border-[#EEF0F2] shadow-sm bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 aspect-[4/3] sm:aspect-square flex items-center justify-center p-2"
                  >
                    <div className="relative w-full h-full rounded-[16px] overflow-hidden">
                      <Image
                        src={art.src}
                        alt={art.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 6. Ekip / Çalışma Yapısı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-[24px] border border-[#EEF0F2] p-8 sm:p-10 text-left shadow-sm"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                <Layers className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-headings text-[#0F1115]">
                Ekip & Çalışma Yapısı
              </h2>
            </div>
            <p className="text-base sm:text-lg font-sans text-[#5F6773] leading-relaxed">
              {team.structure}
            </p>
          </motion.div>

          {/* 6.5. Ekip Kadrosu & Sorumlular */}
          {team.membersList && team.membersList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/90 backdrop-blur-sm rounded-[28px] border border-[#EEF0F2] p-7 sm:p-10 text-left space-y-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF0F2] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5.5 h-5.5 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[#0A5C3A] text-xs font-bold uppercase tracking-wider">
                      EKİP KADROSU & ÜYELER
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-headings text-[#0F1115]">
                      Ekip Sorumluları ve Üyeleri
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0A5C3A] bg-[#0A5C3A]/10 px-3 py-1.5 rounded-full w-fit">
                  Toplam {team.membersList.length} Üye
                </span>
              </div>

              {/* Ekip Sorumluları / Başkanları */}
              {team.membersList.filter((m) => m.isLeader || m.role.toLowerCase().includes("sorumlus") || m.role.toLowerCase().includes("başkan")).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0A5C3A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Ekip Sorumlusu / Başkan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.membersList
                      .filter((m) => m.isLeader || m.role.toLowerCase().includes("sorumlus") || m.role.toLowerCase().includes("başkan"))
                      .map((leader, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-gradient-to-br from-emerald-50/80 to-white border-2 border-[#0A5C3A]/40 rounded-2xl p-4 shadow-sm relative overflow-hidden"
                        >
                          <div className="w-14 h-14 rounded-full bg-[#0A5C3A] text-white flex items-center justify-center font-headings font-bold text-lg border-2 border-white shadow-sm shrink-0">
                            {leader.name.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0A5C3A] text-white text-[10px] font-black uppercase tracking-wider mb-1">
                              ★ EKİP SORUMLUSU
                            </div>
                            <h4 className="text-base font-extrabold font-headings text-[#0F1115] truncate">
                              {leader.name}
                            </h4>
                            <p className="text-xs font-semibold text-[#0A5C3A] truncate">
                              {leader.role}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Ekip Üyeleri */}
              {team.membersList.filter((m) => !m.isLeader && !m.role.toLowerCase().includes("sorumlus") && !m.role.toLowerCase().includes("başkan")).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#5F6773] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#0A5C3A]" /> Ekip Üyeleri
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.membersList
                      .filter((m) => !m.isLeader && !m.role.toLowerCase().includes("sorumlus") && !m.role.toLowerCase().includes("başkan"))
                      .map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3.5 bg-white border border-[#EEF0F2] rounded-2xl p-3.5 shadow-xs hover:border-[#0A5C3A]/30 transition-all"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#07452C] text-white flex items-center justify-center font-headings font-bold text-xs border-2 border-white shadow-xs shrink-0">
                            {member.name.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="text-sm font-bold font-headings text-[#0F1115] truncate">
                              {member.name}
                            </h4>
                            <p className="text-xs font-medium text-[#5F6773] truncate">
                              {member.role || "Ekip Üyesi"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 7. "Ekibe Katıl" CTA Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[28px] bg-gradient-to-r from-[#0A5C3A] to-[#0D784C] text-white p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="space-y-3 max-w-2xl relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight">
                Sen de {team.title}'na Katıl!
              </h3>
              <p className="text-white/90 text-sm sm:text-base font-sans leading-relaxed">
                Fikirlerini projeye dönüştürmek, yetkinliklerini geliştirmek ve üretken gençlerle bir araya gelmek için hemen başvurunu yap.
              </p>
            </div>

            <Link
              href="/basvuru"
              className="px-8 py-4 rounded-full bg-white text-[#0A5C3A] font-bold font-sans text-base hover:bg-[#F8F9FA] transition-all shadow-lg hover:shadow-xl shrink-0 flex items-center gap-2 group relative z-10"
            >
              <span>Ekibe Katıl</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* 8. "Diğer Ekipler" Navigation Section */}
          <motion.div
            id="diger-ekipler"
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
                  Diğer Ekiplerimiz
                </h2>
              </div>
              <p className="text-sm text-[#5F6773] max-w-sm">
                Topluluğumuz bünyesindeki tüm çalışma ekiplerini inceleyin ve ilgi alanınıza en uygun olanına hemen katılın.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
              {allTeams.map((item) => {
                const ItemIconComp = TEAM_ICONS[item.iconName] || TEAM_ICONS["cpu"];
                const isCurrent = item.slug === team.slug || item.id === team.id;

                if (isCurrent) {
                  return (
                    <div
                      key={item.id}
                      className="relative bg-white rounded-[20px] border-2 border-[#0A5C3A] p-5 shadow-[0_10px_30px_rgba(10,92,58,0.12)] flex flex-col justify-between cursor-default text-left ring-2 ring-[#0A5C3A]/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0A5C3A] text-white flex items-center justify-center shrink-0">
                          <ItemIconComp className="w-5 h-5 stroke-[2]" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#0A5C3A] text-white uppercase tracking-wider shadow-sm">
                          Buradasın
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-headings text-[#0A5C3A] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs font-sans text-[#5F6773] line-clamp-2">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={`/ekipler/${item.slug}`}
                    className="group relative bg-white rounded-[20px] border border-[#EEF0F2] p-5 shadow-[0_8px_24px_rgba(15,17,21,0.04)] hover:border-[#0A5C3A] hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(10,92,58,0.12)] transition-all duration-300 flex flex-col justify-between text-left"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/8 text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0">
                        <ItemIconComp className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#F8F9FA] text-[#0A5C3A] group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors flex items-center justify-center text-xs font-bold">
                        →
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-sans text-[#5F6773] line-clamp-2">
                        {item.shortDescription}
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
