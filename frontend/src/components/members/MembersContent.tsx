"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShieldCheck,
  X,
  Filter,
  Users,
  Cpu,
  Palette,
  HeartPulse,
  BookOpen,
  Share2,
  Award,
} from "lucide-react";
import {
  PUBLIC_MEMBERS,
  MEMBER_TEAMS,
  PublicMember,
  sortMembersAlphabetically,
} from "../../data/members";
import { PublicMemberCard } from "./PublicMemberCard";
import { PublicMemberModal } from "./PublicMemberModal";
import { PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";
import { MembersRepository } from "../../lib/membersStore";
import { useLanguage } from "../../context/LanguageContext";

function getTeamIconComponent(team: string) {
  const t = team.toLowerCase();
  if (t.includes("teknoloji")) return Cpu;
  if (t.includes("sanat")) return Palette;
  if (t.includes("sağlık") || t.includes("çevre")) return HeartPulse;
  if (t.includes("program")) return BookOpen;
  if (t.includes("kurumsal") || t.includes("iletişim")) return Share2;
  if (t.includes("yönetim")) return ShieldCheck;
  if (t.includes("danışma")) return Award;
  return Users;
}

export function MembersContent() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [membersList, setMembersList] = useState<PublicMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("Tümü");
  const [selectedMember, setSelectedMember] = useState<PublicMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    MembersRepository.fetchMembersFromDB().then((data) => {
      if (Array.isArray(data)) {
        setMembersList(data);
      }
      setHasLoaded(true);
    });
  }, []);

  const activeMembers = hasLoaded ? membersList : (membersList.length > 0 ? membersList : PUBLIC_MEMBERS);

  // Filter and sort members based on selected filter and search query
  const displayedMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = activeMembers.filter((member) => {
      // Team filter check
      let matchesTeam = true;
      if (selectedTeamFilter && selectedTeamFilter !== "Tümü") {
        const filterLower = selectedTeamFilter.toLowerCase();
        const inPrimary = member.primaryTeam.toLowerCase().includes(filterLower);
        const inMemberships = member.memberships?.some((m) =>
          m.team.toLowerCase().includes(filterLower)
        );
        matchesTeam = Boolean(inPrimary || inMemberships);
      }

      // Search query check
      let matchesSearch = true;
      if (q) {
        matchesSearch =
          member.name.toLowerCase().includes(q) ||
          member.primaryRole.toLowerCase().includes(q) ||
          member.primaryTeam.toLowerCase().includes(q) ||
          Boolean(
            member.memberships?.some(
              (m) =>
                m.team.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
            )
          );
      }

      return matchesTeam && matchesSearch;
    });

    // Turkish alphabetical A-Z sorting
    return sortMembersAlphabetically(filtered);
  }, [activeMembers, selectedTeamFilter, searchQuery]);

  const handleTeamClick = (filterName: string) => {
    setSelectedTeamFilter(filterName);
  };

  const IconComponent = getTeamIconComponent(selectedTeamFilter);

  return (
    <PageBackground id="uyeler-index-root" className="select-none px-0 py-0 min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* 1. HEADER TITLE SECTION */}
      <Section
        padding="none"
        background="transparent"
        className="pt-16 sm:pt-20 pb-8 border-b border-[#EEF0F2] relative"
      >
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F1115] font-headings">
                {isEn ? "Our Team" : "Ekibimiz"}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6773] leading-relaxed font-sans font-medium">
              {isEn
                ? "All working teams, executive board, and advisory board members driving N'apsak? Youth Community."
                : "N'apsak? Gençlik Topluluğu'na değer katan tüm çalışma ekiplerimiz, yönetim kurulu ve danışma kurulu üyelerimiz."}
            </p>
          </motion.div>
        </PageContainer>
      </Section>

      {/* 2. FILTER PILLS BAR & SEARCH */}
      <Section padding="none" background="transparent" className="py-6 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl space-y-4">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 w-full">
            {/* FILTER PILLS (NO OVERLAP) */}
            <div className="flex items-center justify-center xl:justify-start gap-2 flex-wrap sm:flex-nowrap overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 scrollbar-none snap-x select-none">
              {/* "Tümü" TAB */}
              <button
                type="button"
                onClick={() => handleTeamClick("Tümü")}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer border ${
                  selectedTeamFilter === "Tümü"
                    ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-md shadow-[#0A5C3A]/20"
                    : "bg-white text-[#0A5C3A] border-[#EEF0F2] hover:border-[#0A5C3A]/40 hover:bg-[#F8FBF9]"
                }`}
              >
                {isEn ? "All" : "Tümü"}
              </button>

              {/* TEAM & BOARD TABS */}
              {MEMBER_TEAMS.map((teamFilter) => {
                const isSelected = selectedTeamFilter === teamFilter;
                return (
                  <button
                    key={teamFilter}
                    type="button"
                    onClick={() => handleTeamClick(teamFilter)}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-md shadow-[#0A5C3A]/20"
                        : "bg-white text-[#0A5C3A] border-[#EEF0F2] hover:border-[#0A5C3A]/40 hover:bg-[#F8FBF9]"
                    }`}
                  >
                    {teamFilter}
                  </button>
                );
              })}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full xl:w-64 shrink-0">
              <Search className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isEn ? "Search person or role..." : "Kişi veya görev ara..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-full border border-[#EEF0F2] text-xs sm:text-sm font-medium text-[#0F1115] placeholder-[#5F6773] focus:outline-none focus:border-[#0A5C3A] transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5F6773] hover:text-[#0F1115]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 3. MEMBERS LISTING SECTION */}
      <Section padding="none" background="transparent" className="py-10 flex-1">
        <PageContainer className="max-w-6xl sm:max-w-7xl space-y-8">
          {/* SECTION HEADER DIVIDER */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px bg-gradient-to-r from-transparent via-[#EEF0F2] to-[#EEF0F2] flex-1" />
            <h2 className="text-base sm:text-lg font-extrabold font-headings text-[#0F1115] flex items-center gap-2 px-6 py-2 rounded-full bg-[#F8FBF9] border border-[#EEF0F2] shadow-xs">
              <IconComponent className="w-4 h-4 text-[#0A5C3A]" />
              <span>
                {selectedTeamFilter === "Tümü"
                  ? isEn
                    ? "Our Team"
                    : "Ekibimiz"
                  : selectedTeamFilter}
              </span>
              <span className="text-xs font-semibold text-[#5F6773] bg-white px-2 py-0.5 rounded-full border border-[#EEF0F2]">
                {displayedMembers.length}
              </span>
            </h2>
            <div className="h-px bg-gradient-to-l from-transparent via-[#EEF0F2] to-[#EEF0F2] flex-1" />
          </div>

          {/* MEMBERS CARDS GRID */}
          {displayedMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayedMembers.map((member, idx) => (
                <PublicMemberCard
                  key={member.id}
                  member={member}
                  variant="compact"
                  activeFilter={selectedTeamFilter !== "Tümü" ? selectedTeamFilter : undefined}
                  index={idx}
                  onSelect={(m) => {
                    setSelectedMember(m);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            /* EMPTY RESULT */
            <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white rounded-[28px] border border-[#EEF0F2] p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-headings text-[#0F1115]">
                {isEn ? "No Members Found" : "Kişi Bulunamadı"}
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6773]">
                {isEn
                  ? "No team members found matching your search criteria."
                  : "Aradığınız kriterlere uygun ekip üyesi bulunamadı."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTeamFilter("Tümü");
                }}
                className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-colors inline-block cursor-pointer"
              >
                {isEn ? "Clear Filters" : "Filtreleri Temizle"}
              </button>
            </div>
          )}
        </PageContainer>
      </Section>

      {/* MEMBER PROFILE DETAIL MODAL */}
      <PublicMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
      />
    </PageBackground>
  );
}
