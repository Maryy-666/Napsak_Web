"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  Filter,
  Globe,
  Handshake,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge, Button, Card, PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";
import { useLanguage } from "../../context/LanguageContext";
import { ROUTES } from "../../constants/routes";
import { PartnersRepository, PartnerItem } from "../../lib/partnersStore";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: "easeOut" },
  }),
};

export default function PaydaslarimizContent() {
  const { language } = useLanguage();
  const isEn = language === "en";

  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    PartnersRepository.fetchPartnersFromDB()
      .then((data) => {
        setPartners(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Dynamic unique categories from DB items
  const categories = useMemo(() => {
    const defaultCats = [
      { id: "all", label: isEn ? "All Categories" : "Tüm Kategoriler" },
    ];

    const uniqueSet = new Set<string>();
    partners.forEach((p) => {
      const cat = isEn ? (p.categoryEn || p.category) : p.category;
      if (cat) uniqueSet.add(cat);
    });

    const dynamicCats = Array.from(uniqueSet).map((catName) => ({
      id: catName.toLowerCase(),
      label: catName,
      rawName: catName,
    }));

    return [...defaultCats, ...dynamicCats];
  }, [partners, isEn]);

  const filteredPartners = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return partners.filter((p) => {
      const nameStr = isEn ? (p.nameEn || p.name) : p.name;
      const descStr = isEn ? (p.descriptionEn || p.description || "") : (p.description || "");
      const catStr = isEn ? (p.categoryEn || p.category) : p.category;

      const matchesCat =
        selectedCategory === "all" ||
        catStr.toLowerCase() === selectedCategory ||
        p.category.toLowerCase() === selectedCategory;

      const matchesQuery =
        !q ||
        nameStr.toLowerCase().includes(q) ||
        descStr.toLowerCase().includes(q) ||
        catStr.toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    });
  }, [partners, selectedCategory, searchQuery, isEn]);

  return (
    <PageBackground id="paydaslarimiz-root" className="select-none px-0 py-0">
      {/* -------------------------------------------------------------
          1. HERO HEADER SECTION
      ------------------------------------------------------------- */}
      <Section
        padding="none"
        background="transparent"
        className="relative pt-16 sm:pt-24 pb-8 border-b border-[#EEF0F2] overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#0A5C3A]/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeInUp as any}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <Badge
              variant="brand"
              size="md"
              className="!bg-[#0A5C3A]/10 !text-[#0A5C3A] !border-[#0A5C3A]/20 shadow-xs"
            >
              <Handshake className="w-3.5 h-3.5 mr-1.5 text-[#0A5C3A]" />
              {isEn ? "Collaboration & Ecosystem" : "İş Birliği ve Ekosistem"}
            </Badge>

            <h1 className="font-headings text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F1115] leading-tight">
              {isEn ? "Partners & Supporters" : "Paydaşlarımız ve Destekçilerimiz"}
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-base sm:text-lg font-medium leading-relaxed text-[#5F6773] font-sans">
              {isEn
                ? "Institutions, organizations, and networks that share our vision, empower our youth initiatives, and produce value together with N'apsak?"
                : "N'apsak? Gençlik Topluluğu olarak vizyonumuzu paylaşan, gençlik projelerimizi destekleyen ve birlikte değer ürettiğimiz kurum, kuruluş ve topluluklar."}
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          2. SEARCH & CATEGORY FILTER BAR
      ------------------------------------------------------------- */}
      <Section padding="none" background="transparent" className="py-6 sm:py-8 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-[20px] border border-[#EEF0F2] shadow-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F6773]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn ? "Search by institution name or keyword..." : "Kurum adı veya kelime ara..."
                }
                className="h-10 w-full rounded-xl border border-[#EEF0F2] bg-[#F8FAFC] pl-10 pr-4 text-xs sm:text-sm font-medium text-[#0F1115] outline-none transition placeholder:text-[#9FA6B2] focus:border-[#0A5C3A] focus:bg-white focus:ring-4 focus:ring-[#0A5C3A]/10"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <Filter className="h-4 w-4 shrink-0 text-[#0A5C3A] hidden sm:block mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-semibold font-sans transition-all cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20 ${
                    selectedCategory === cat.id
                      ? "border-[#0A5C3A] bg-[#0A5C3A] text-white shadow-xs font-bold"
                      : "border-[#EEF0F2] bg-[#F8FAFC] text-[#5F6773] hover:border-[#0A5C3A]/30 hover:bg-white hover:text-[#0F1115]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* -------------------------------------------------------------
          3. PARTNERS LOGO & CARD GRID
      ------------------------------------------------------------- */}
      <Section padding="none" background="subtle" className="py-10 sm:py-16">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          {loading ? (
            <div className="text-center py-16 text-[#5F6773] font-medium text-sm">
              {isEn ? "Loading partners..." : "Paydaşlar yükleniyor..."}
            </div>
          ) : filteredPartners.length === 0 ? (
            /* EMPTY STATE */
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeInUp as any}
              className="text-center bg-white rounded-[24px] border border-[#EEF0F2] p-10 sm:p-16 max-w-2xl mx-auto shadow-xs space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-8 h-8 stroke-[1.75]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-headings text-[#0F1115]">
                {isEn
                  ? "No partners or supporters found matching your filter."
                  : "Kriterlerinize uygun paydaş kaydı bulunamadı."}
              </h3>
              <p className="text-sm sm:text-base text-[#5F6773] font-medium max-w-md mx-auto leading-relaxed">
                {isEn
                  ? "Reach out to us to explore collaboration opportunities."
                  : "N'apsak? ile iş birliği yapmak veya destekçimiz olmak için bizimle iletişime geçebilirsiniz."}
              </p>
              <div className="pt-2 flex justify-center">
                <Button
                  href={ROUTES.ILETISIM}
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-bold"
                >
                  {isEn ? "Contact Us for Partnership" : "İş Birliği İçin İletişime Geç"}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* PARTNER GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner, idx) => {
                const nameText = isEn ? (partner.nameEn || partner.name) : partner.name;
                const descText = isEn
                  ? (partner.descriptionEn || partner.description || "")
                  : (partner.description || "");
                const catText = isEn ? (partner.categoryEn || partner.category) : partner.category;

                return (
                  <motion.div
                    key={partner.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    custom={idx * 0.05}
                    variants={fadeInUp as any}
                    className="flex flex-col"
                  >
                    <Card
                      variant="default"
                      animate={false}
                      className="h-full rounded-[24px] p-6 border-[#EEF0F2] bg-white shadow-xs hover:border-[#0A5C3A]/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Logo Preview Container */}
                        <div className="w-full h-36 rounded-2xl bg-[#F8FAFC] border border-[#EEF0F2] p-4 flex items-center justify-center mb-5 overflow-hidden group">
                          {partner.logo ? (
                            <img
                              src={partner.logo}
                              alt={`${nameText} Logo`}
                              className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                              onError={(e) => {
                                // Fallback icon on error
                                e.currentTarget.style.display = "none";
                                const fallbackEl = e.currentTarget.nextElementSibling;
                                if (fallbackEl) (fallbackEl as HTMLElement).style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="flex flex-col items-center justify-center text-[#9FA6B2]"
                            style={{ display: partner.logo ? "none" : "flex" }}
                          >
                            <Building2 className="w-10 h-10 stroke-[1.5]" />
                            <span className="text-[11px] font-semibold mt-1">{nameText}</span>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="mb-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#0A5C3A]/10 text-[#0A5C3A]">
                            {catText}
                          </span>
                        </div>

                        {/* Name */}
                        <h2 className="text-lg sm:text-xl font-bold font-headings text-[#0F1115] mb-2 leading-snug">
                          {nameText}
                        </h2>

                        {/* Description */}
                        {descText && (
                          <p className="text-xs sm:text-sm text-[#5F6773] font-sans font-medium leading-relaxed mb-4">
                            {descText}
                          </p>
                        )}
                      </div>

                      {/* Footer Website Action Link */}
                      {partner.websiteUrl && (
                        <div className="pt-4 border-t border-[#EEF0F2] flex items-center justify-between">
                          <a
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A5C3A] hover:text-[#0D7449] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-md px-1 py-0.5"
                            aria-label={`${nameText} web sitesini ziyaret et (Yeni sekmede açılır)`}
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>{isEn ? "Visit Website" : "Web Sitesini Ziyaret Et"}</span>
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                          </a>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* -------------------------------------------------------------
              4. PARTNERSHIP CTA BANNER
          ------------------------------------------------------------- */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.2}
            variants={fadeInUp as any}
            className="rounded-[24px] bg-[#0A5C3A] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 select-none shadow-[0_20px_50px_rgba(10,92,58,0.20)] relative overflow-hidden mt-12 md:mt-16"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-md mb-3 inline-block">
                {isEn ? "Partnership Opportunities" : "İş Birliği Fırsatları"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-headings tracking-tight mb-2">
                {isEn
                  ? "Would you like to become a partner of N'apsak?"
                  : "N'apsak? ile paydaş veya destekçi olmak ister misiniz?"}
              </h3>
              <p className="text-sm sm:text-base text-white/85 font-sans font-medium max-w-xl leading-relaxed">
                {isEn
                  ? "Join our youth ecosystem to support innovative projects, share experience, and create lasting impact together."
                  : "Gençlik ekosistemimize katılarak yenilikçi projelerimizi destekleyebilir, deneyim paylaşımında bulunabilir ve birlikte etki yaratabilirsiniz."}
              </p>
            </div>
            <Button
              href={ROUTES.ILETISIM}
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
              className="!bg-white !text-[#0A5C3A] hover:!bg-[#F8F9FA] font-bold shrink-0 shadow-lg text-base px-6 h-12 relative z-10"
            >
              {isEn ? "Become a Partner" : "Paydaşımız Olun"}
            </Button>
          </motion.div>
        </PageContainer>
      </Section>
    </PageBackground>
  );
}
