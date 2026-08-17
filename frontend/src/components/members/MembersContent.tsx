"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, X, Filter, Users } from "lucide-react";
import {
  PUBLIC_MEMBERS,
  MEMBER_TEAMS,
  MemberTeamFilter,
  PublicMember,
} from "../../data/members";
import { PublicMemberCard } from "./PublicMemberCard";
import { PublicMemberModal } from "./PublicMemberModal";
import { PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";

function getRoleIcon(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("başkan yardımcısı")) return "👤";
  if (r === "başkan") return "👑";
  if (r.includes("raportör")) return "✍️";
  if (r.includes("tiyatro")) return "🎭";
  if (r.includes("moderasyon") || r.includes("sohbet")) return "🎙️";
  if (r.includes("kí uzm") || r.includes("kurumsal")) return "💬";
  if (r.includes("sm uzm")) return "📢";
  if (r.includes("sdm uzm")) return "🛡️";
  if (r.includes("çevre") || r.includes("sağlık")) return "🌿";
  if (r.includes("yazılım") || r.includes("kod")) return "💻";
  return "👥";
}

function getTeamIcon(team: string): string {
  const t = team.toLowerCase();
  if (t.includes("teknoloji")) return "💻";
  if (t.includes("sanat")) return "🎨";
  if (t.includes("kurumsal") || t.includes("iletişim")) return "📢";
  if (t.includes("program")) return "🚀";
  if (t.includes("sağlık") || t.includes("çevre")) return "🌿";
  return "✨";
}

export function MembersContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<MemberTeamFilter | null>(null);
  const [selectedMember, setSelectedMember] = useState<PublicMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Separate Co-Chairs from Working Group members
  const coChairs = useMemo(() => PUBLIC_MEMBERS.filter((m) => m.isPresident), []);
  const workingGroupMembers = useMemo(() => PUBLIC_MEMBERS.filter((m) => !m.isPresident), []);

  // Filtered co-chairs matching search
  const filteredCoChairs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return coChairs;
    return coChairs.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.primaryRole.toLowerCase().includes(q) ||
        m.memberships.some(
          (mem) => mem.team.toLowerCase().includes(q) || mem.role.toLowerCase().includes(q)
        )
    );
  }, [coChairs, searchQuery]);

  // Active team members matching filter and search
  const activeTeamMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!selectedTeamFilter && !q) {
      return [];
    }

    return workingGroupMembers.filter((member) => {
      const matchesTeam = selectedTeamFilter
        ? member.memberships.some((m) =>
            m.team.toLowerCase().includes(selectedTeamFilter.toLowerCase())
          )
        : true;

      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.primaryRole.toLowerCase().includes(q) ||
        member.memberships.some(
          (m) =>
            m.team.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
        );

      return matchesTeam && matchesSearch;
    });
  }, [workingGroupMembers, selectedTeamFilter, searchQuery]);

  // Group active team members by their specific role in THIS team
  const groupedRoles = useMemo(() => {
    if (!selectedTeamFilter && !searchQuery) return [];

    const roleMap = new Map<string, PublicMember[]>();

    activeTeamMembers.forEach((member) => {
      const targetTeam = selectedTeamFilter || member.primaryTeam;
      const matchedMembership = member.memberships.find((m) =>
        m.team.toLowerCase().includes(targetTeam.toLowerCase())
      );
      const role = matchedMembership ? matchedMembership.role : member.primaryRole;

      const existing = roleMap.get(role) || [];
      roleMap.set(role, [...existing, member]);
    });

    const rolePriority = (role: string) => {
      if (role === "Başkan") return 1;
      if (role === "Başkan Yardımcısı") return 2;
      if (role.includes("Uzman-Raportör")) return 3;
      if (role.includes("Kİ Uzman")) return 4;
      if (role.includes("SM Uzman")) return 5;
      if (role.includes("Sohbet Düzeni")) return 6;
      if (role.includes("SDM Uzman")) return 7;
      if (role === "Uzman") return 8;
      return 9;
    };

    return Array.from(roleMap.entries()).sort(
      ([roleA], [roleB]) => rolePriority(roleA) - rolePriority(roleB)
    );
  }, [activeTeamMembers, selectedTeamFilter, searchQuery]);

  const handleTeamClick = (team: MemberTeamFilter) => {
    if (selectedTeamFilter === team) {
      setSelectedTeamFilter(null);
    } else {
      setSelectedTeamFilter(team);
    }
  };

  return (
    <PageBackground id="uyeler-index-root" className="select-none px-0 py-0 min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* 1. HEADER TITLE SECTION */}
      <Section padding="none" background="transparent" className="pt-16 sm:pt-20 pb-8 border-b border-[#EEF0F2] relative">
        <PageContainer className="max-w-6xl sm:max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0F1115] font-headings">
                Topluluk Eş Başkanları
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6773] leading-relaxed font-sans font-medium">
              N'apsak? topluluğunun genel vizyon ve koordinasyon liderleri
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
              {MEMBER_TEAMS.map((teamFilter) => {
                const isSelected = selectedTeamFilter === teamFilter;
                return (
                  <button
                    key={teamFilter}
                    onClick={() => handleTeamClick(teamFilter)}
                    className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer border ${
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

            {/* SEARCH INPUT (NO OVERLAP) */}
            <div className="relative w-full xl:w-64 shrink-0">
              <Search className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Üye ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-full border border-[#EEF0F2] text-xs sm:text-sm font-medium text-[#0F1115] placeholder-[#5F6773] focus:outline-none focus:border-[#0A5C3A] transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
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

      {/* 3. TOPLULUK EŞ BAŞKANLARI SECTION */}
      {filteredCoChairs.length > 0 && (
        <Section padding="none" background="transparent" className="py-10 border-b border-[#EEF0F2]">
          <PageContainer className="max-w-6xl sm:max-w-7xl space-y-6">
            {/* SECTION DIVIDER HEADER */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-gradient-to-r from-transparent via-[#EEF0F2] to-[#EEF0F2] flex-1" />
              <span className="text-xs sm:text-sm font-bold text-[#0F1115] font-headings flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#F8FBF9] border border-[#EEF0F2]">
                🌱 Topluluk Eş Başkanları 🌱
              </span>
              <div className="h-px bg-gradient-to-l from-transparent via-[#EEF0F2] to-[#EEF0F2] flex-1" />
            </div>

            {/* 2 CO-CHAIR CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {filteredCoChairs.map((president, idx) => (
                <PublicMemberCard
                  key={president.id}
                  member={president}
                  variant="featured"
                  activeFilter="Topluluk Eş Başkanları"
                  index={idx}
                  onSelect={(m) => {
                    setSelectedMember(m);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </PageContainer>
        </Section>
      )}

      {/* 4. ACTIVE WORKING GROUP CATEGORIZED MEMBERS SECTION */}
      <Section padding="none" background="transparent" className="py-10 flex-1">
        <PageContainer className="max-w-6xl sm:max-w-7xl space-y-10">
          
          {selectedTeamFilter || searchQuery ? (
            groupedRoles.length > 0 ? (
              <div className="space-y-10">
                {/* GROUP HEADER DIVIDER */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#EEF0F2] to-[#EEF0F2] flex-1" />
                  <h2 className="text-lg sm:text-xl font-extrabold font-headings text-[#0F1115] flex items-center gap-2 px-6 py-2 rounded-full bg-[#F8FBF9] border border-[#EEF0F2] shadow-xs">
                    <span>{getTeamIcon(selectedTeamFilter || "Arama")}</span>
                    <span>
                      {selectedTeamFilter
                        ? `${selectedTeamFilter} ${selectedTeamFilter.includes("Departmanı") || selectedTeamFilter.includes("Ekibi") ? "" : "Çalışma Grubu"}`
                        : "Arama Sonuçları"}
                    </span>
                  </h2>
                  <div className="h-px bg-gradient-to-l from-transparent via-[#EEF0F2] to-[#EEF0F2] flex-1" />
                </div>

                {/* ROLE CATEGORIES */}
                {groupedRoles.map(([roleName, members]) => {
                  const icon = getRoleIcon(roleName);
                  const isUzmanGroup = roleName === "Uzman" || roleName.includes("Uzman");
                  const isSingleOrPair = members.length <= 2 && !isUzmanGroup;

                  return (
                    <div key={roleName} className="space-y-4">
                      {/* ROLE SUBSECTION HEADER */}
                      <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold font-headings text-[#0F1115]">
                        <span>{icon}</span>
                        <span>{roleName}</span>
                        <span className="text-xs font-semibold text-[#5F6773] bg-[#F8F9FA] px-2 py-0.5 rounded-full border border-[#EEF0F2]">
                          {members.length}
                        </span>
                      </div>

                      {/* ROLE CARDS GRID */}
                      <div
                        className={`grid gap-4 ${
                          isSingleOrPair
                            ? "grid-cols-1 sm:grid-cols-2 max-w-3xl"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                        }`}
                      >
                        {members.map((member, idx) => (
                          <PublicMemberCard
                            key={member.id}
                            member={member}
                            variant="compact"
                            activeFilter={selectedTeamFilter || undefined}
                            index={idx}
                            onSelect={(m) => {
                              setSelectedMember(m);
                              setIsModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* EMPTY SEARCH/FILTER RESULT */
              <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white rounded-[28px] border border-[#EEF0F2] p-8 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-headings text-[#0F1115]">
                  Üye Bulunamadı
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6773]">
                  Aradığınız kriterlere veya seçili ekibe uygun üye bulunamadı.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTeamFilter(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-colors inline-block cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )
          ) : (
            /* SELECTION PROMPT WHEN NO GROUP IS SELECTED YET */
            <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white rounded-[28px] border border-[#EEF0F2] p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-headings text-[#0F1115]">
                Ekip seçerek üyeleri görüntüleyin.
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6773] leading-relaxed">
                Üyelerimizi görüntülemek için yukarıdaki butonlardan ilgilendiğiniz çalışma grubunu veya ekibi seçebilirsiniz.
              </p>
            </div>
          )}

        </PageContainer>
      </Section>

      {/* MEMBER PROFILE MODAL */}
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
