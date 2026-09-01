"use client";

import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Filter,
  MapPin,
  Search,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { Badge, Button, Card, PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";
import { useLanguage } from "../../context/LanguageContext";
import { ROUTES } from "../../constants/routes";
import { PositionsRepository, OpenPosition } from "../../lib/positionsStore";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: "easeOut" },
  }),
};


export default function AcikPozisyonlarContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedMode, setSelectedMode] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    PositionsRepository.fetchPositionsFromDB()
      .then((data) => {
        setPositions(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter options
  const teams = [
    { id: "all", label: isEn ? "All Teams" : "Tüm Ekipler" },
    { id: "iletisim", label: isEn ? "Communication & Media" : "İletişim ve Medya" },
    { id: "teknoloji", label: isEn ? "Technology" : "Teknoloji" },
    { id: "etkinlik", label: isEn ? "Events" : "Etkinlik" },
    { id: "yonetim", label: isEn ? "Management" : "Yönetim" },
  ];

  const modes = [
    { id: "all", label: isEn ? "All Work Modes" : "Tüm Çalışma Şekilleri" },
    { id: "Gönüllü", label: isEn ? "Volunteer" : "Gönüllü" },
    { id: "Hibrit", label: isEn ? "Hybrid" : "Hibrit" },
    { id: "Uzaktan", label: isEn ? "Remote" : "Uzaktan" },
  ];

  const filteredPositions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return positions.filter((pos) => {
      const matchesTeam =
        selectedTeam === "all" || pos.teamCategory === selectedTeam;
      const matchesMode =
        selectedMode === "all" || pos.workType === selectedMode;

      const titleStr = isEn ? (pos.titleEn || pos.title) : pos.title;
      const descStr = isEn ? (pos.shortDescriptionEn || pos.shortDescription) : pos.shortDescription;
      const teamStr = isEn ? (pos.teamEn || pos.team) : pos.team;

      const matchesQuery =
        !q ||
        titleStr.toLowerCase().includes(q) ||
        descStr.toLowerCase().includes(q) ||
        teamStr.toLowerCase().includes(q);

      return matchesTeam && matchesMode && matchesQuery;
    });
  }, [positions, selectedTeam, selectedMode, searchQuery, isEn]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };


  return (
    <PageBackground id="acik-pozisyonlar-root" className="select-none px-0 py-0">
      {/* -------------------------------------------------------------
          1. HERO HEADER SECTION
      ------------------------------------------------------------- */}
      <Section
        padding="none"
        background="transparent"
        className="relative pt-16 sm:pt-24 pb-8 border-b border-[#EEF0F2] overflow-hidden"
      >
        {/* Background Ambient Blur Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#0A5C3A]/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <Badge
              variant="brand"
              size="md"
              className="!bg-[#0A5C3A]/10 !text-[#0A5C3A] !border-[#0A5C3A]/20 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#0A5C3A]" />
              {isEn ? "Join Our Team & Produce Together" : "Ekibimize Katıl & Birlikte Üret"}
            </Badge>

            <h1 className="font-headings text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F1115] leading-tight">
              {isEn ? "Open Positions" : "Açık Pozisyonlar"}
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-base sm:text-lg font-medium leading-relaxed text-[#5F6773] font-sans">
              {isEn
                ? "As N'apsak? Youth Community, we are expanding our team and looking for volunteers who want to produce, learn, and grow together."
                : "N'apsak? Gençlik Topluluğu olarak ekibimizi büyütüyor, birlikte üretmek, öğrenmek ve gelişmek isteyen gönüllüler arıyoruz."}
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          2. STREAMLINED SEARCH & FILTER BAR
      ------------------------------------------------------------- */}
      <Section padding="none" background="transparent" className="py-6 sm:py-8 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-[#EEF0F2] shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6773]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? "Search by position title or keyword..."
                    : "Pozisyon adı veya kelime ara..."
                }
                className="h-10 w-full rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] pl-10 pr-4 text-xs sm:text-sm font-medium text-[#0F1115] outline-none transition placeholder:text-[#9FA6B2] focus:border-[#0A5C3A] focus:bg-white focus:ring-4 focus:ring-[#0A5C3A]/10"
              />
            </div>

            {/* Team Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <Filter className="h-4 w-4 shrink-0 text-[#0A5C3A] hidden sm:block mr-1" />
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeam(team.id)}
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-semibold font-sans transition-all cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20 ${
                    selectedTeam === team.id
                      ? "border-[#0A5C3A] bg-[#0A5C3A] text-white shadow-xs font-bold"
                      : "border-[#EEF0F2] bg-[#F8FAFC] text-[#5F6773] hover:border-[#0A5C3A]/30 hover:bg-white hover:text-[#0F1115]"
                  }`}
                  aria-pressed={selectedTeam === team.id}
                >
                  {team.label}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          3. POSITIONS LISTING & CARDS
      ------------------------------------------------------------- */}
      <Section padding="none" background="subtle" className="py-10 sm:py-16">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          {filteredPositions.length === 0 ? (
            /* EMPTY STATE */
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeInUp}
              className="text-center bg-white rounded-[24px] border border-[#EEF0F2] p-10 sm:p-16 max-w-2xl mx-auto shadow-xs space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto mb-2">
                <Briefcase className="w-8 h-8 stroke-[1.75]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-headings text-[#0F1115]">
                {isEn
                  ? "There are currently no open positions matching your filter."
                  : "Şu anda açık bir pozisyon bulunmuyor."}
              </h3>
              <p className="text-sm sm:text-base text-[#5F6773] font-medium max-w-md mx-auto leading-relaxed">
                {isEn
                  ? "Follow us on social media or reach out to stay updated on new volunteer opportunities."
                  : "Yeni fırsatlardan haberdar olmak için bizi takip edebilir veya genel başvuru yapabilirsiniz."}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button
                  href={ROUTES.BASVURU}
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-bold"
                >
                  {isEn ? "General Application" : "Genel Başvuru Yap"}
                </Button>
                <Button
                  href={ROUTES.ILETISIM}
                  variant="secondary"
                  size="md"
                  className="!bg-[#F8FAFC] !border-[#EEF0F2] !text-[#0F1115] hover:!bg-white font-bold"
                >
                  {isEn ? "Contact Us" : "Bizimle İletişime Geç"}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* POSITIONS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPositions.map((pos, idx) => {
                const isExpanded = expandedId === pos.id;

                const titleText = isEn ? (pos.titleEn || pos.title) : pos.title;
                const teamText = isEn ? (pos.teamEn || pos.team) : pos.team;
                const descText = isEn ? (pos.shortDescriptionEn || pos.shortDescription) : pos.shortDescription;
                const modeText = isEn ? (pos.workTypeEn || pos.workType) : pos.workType;
                const locText = isEn ? (pos.locationEn || pos.location) : pos.location;
                const respList = isEn ? (pos.responsibilitiesEn?.length ? pos.responsibilitiesEn : pos.responsibilities) : pos.responsibilities;
                const reqList = isEn ? (pos.requirementsEn?.length ? pos.requirementsEn : pos.requirements) : pos.requirements;
                const prefList = isEn ? (pos.preferredQualificationsEn?.length ? pos.preferredQualificationsEn : pos.preferredQualifications) : pos.preferredQualifications;


                return (
                  <motion.div
                    key={pos.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={idx * 0.05}
                    variants={fadeInUp}
                    className="flex flex-col"
                  >
                    <Card
                      variant="default"
                      animate={false}
                      className="h-full rounded-[24px] p-6 sm:p-7 border-[#EEF0F2] bg-white shadow-xs hover:border-[#0A5C3A]/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-3 py-1 rounded-md bg-[#0A5C3A]/10 text-[#0A5C3A]">
                              {teamText}
                            </span>
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#5F6773] border border-[#EEF0F2] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#0A5C3A]" />
                              {locText}
                            </span>
                          </div>

                          {pos.isUrgent && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-rose-500 text-rose-500" />
                              {isEn ? "Urgent" : "Acil Pozisyon"}
                            </span>
                          )}
                        </div>

                        {/* Position Title */}
                        <h2 className="text-xl sm:text-2xl font-bold font-headings text-[#0F1115] mb-2 leading-snug">
                          {titleText}
                        </h2>

                        {/* Short Description */}
                        <p className="text-xs sm:text-sm text-[#5F6773] font-sans font-medium leading-relaxed mb-5">
                          {descText}
                        </p>

                        {/* Expandable Details Section */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.28, ease: "easeInOut" }}
                              className="overflow-hidden space-y-4 pt-3 border-t border-[#EEF0F2] mb-5 text-xs sm:text-sm"
                            >
                              {/* Responsibilities */}
                              {respList && respList.length > 0 && (
                                <div className="space-y-1.5">
                                  <h3 className="font-extrabold text-[#0F1115] font-headings uppercase text-[11px] tracking-wider text-[#0A5C3A]">
                                    {isEn ? "Responsibilities" : "Sorumluluklar"}
                                  </h3>
                                  <ul className="space-y-1.5 pl-1">
                                    {respList.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2 text-[#5F6773] font-medium leading-relaxed">
                                        <CheckCircle2 className="w-4 h-4 text-[#0A5C3A] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Requirements */}
                              {reqList && reqList.length > 0 && (
                                <div className="space-y-1.5">
                                  <h3 className="font-extrabold text-[#0F1115] font-headings uppercase text-[11px] tracking-wider text-[#0A5C3A]">
                                    {isEn ? "Requirements" : "Aranan Özellikler"}
                                  </h3>
                                  <ul className="space-y-1.5 pl-1">
                                    {reqList.map((item, i) => (
                                      <li key={i} className="flex items-start gap-2 text-[#5F6773] font-medium leading-relaxed">
                                        <UserCheck className="w-4 h-4 text-[#0A5C3A] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Preferred Skills */}
                              {prefList && prefList.length > 0 && (
                                <div className="space-y-1.5">
                                  <h3 className="font-extrabold text-[#0F1115] font-headings uppercase text-[11px] tracking-wider text-[#0A5C3A]">
                                    {isEn ? "Preferred Skills" : "Tercih Edilen Yetkinlikler"}
                                  </h3>
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {prefList.map((skill, i) => (
                                      <span
                                        key={i}
                                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#0A5C3A]/8 text-[#0A5C3A] border border-[#0A5C3A]/15"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Card Footer: Detail Toggle & Apply Action */}
                      <div className="pt-4 border-t border-[#EEF0F2] flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleExpand(pos.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5F6773] hover:text-[#0A5C3A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-md px-1 py-0.5 cursor-pointer"
                          aria-expanded={isExpanded}
                          aria-label={
                            isExpanded
                              ? isEn ? "Hide Details" : "Detayları Gizle"
                              : isEn ? "View Details" : "Detayları İncele"
                          }
                        >
                          <span>
                            {isExpanded
                              ? isEn ? "Detayları Gizle" : "Detayları Gizle"
                              : isEn ? "View Details & Requirements" : "Detayları & Şartları İncele"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-[#0A5C3A]" : ""
                            }`}
                          />
                        </button>

                        <Button
                          href={ROUTES.BASVURU}
                          variant="primary"
                          size="sm"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-bold text-xs px-4 h-9 shadow-sm shrink-0"
                          aria-label={`${titleText} pozisyonuna başvur`}
                        >
                          {isEn ? "Apply" : "Başvur"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* -------------------------------------------------------------
              4. GENERAL APPLICATION CTA BANNER
          ------------------------------------------------------------- */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.2}
            variants={fadeInUp}
            className="rounded-[24px] bg-[#0A5C3A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none shadow-[0_20px_50px_rgba(10,92,58,0.20)] relative overflow-hidden mt-12 md:mt-16"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 inline-block">
                {isEn ? "Take Action" : "Harekete Geç"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight mb-2">
                {isEn
                  ? "Didn't find the exact position you're looking for?"
                  : "Aradığın pozisyonu listede bulamadın mı?"}
              </h3>
              <p className="text-sm sm:text-base text-white/85 font-sans font-medium max-w-xl leading-relaxed">
                {isEn
                  ? "You can make a general application to join our community membership process and take your place in all our project teams."
                  : "Genel üyelik başvurusu yaparak mülakatlı katılım sürecimize dahil olabilir, potansiyeline uygun tüm çalışma ekiplerinde yerini alabilirsin."}
              </p>
            </div>
            <Button
              href={ROUTES.BASVURU}
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
              className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold shrink-0 shadow-lg text-base px-6 h-12 relative z-10"
            >
              {isEn ? "Make General Application" : "Genel Başvuru Yap"}
            </Button>
          </motion.div>
        </PageContainer>
      </Section>
    </PageBackground>
  );
}
