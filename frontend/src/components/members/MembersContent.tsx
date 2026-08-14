"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Layers, Award, Sparkles, Filter, X } from "lucide-react";
import {
  PUBLIC_MEMBERS,
  MEMBER_TEAMS,
  MemberTeamFilter,
  PublicMember,
} from "../../data/members";
import { PublicMemberCard } from "./PublicMemberCard";
import { PublicMemberModal } from "./PublicMemberModal";
import { Badge, Button, PageContainer, Section } from "../ui";
import { PageBackground } from "../common/PageBackground";

export function MembersContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<MemberTeamFilter>("Topluluk Başkanları");
  const [selectedMember, setSelectedMember] = useState<PublicMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered members calculation
  const filteredMembers = useMemo(() => {
    return PUBLIC_MEMBERS.filter((member) => {
      // 1. Team filter
      let matchesTeam = false;
      if (selectedTeamFilter === "Topluluk Başkanları") {
        matchesTeam = !!member.isPresident;
      } else {
        matchesTeam = member.memberships.some((m) =>
          m.team.toLowerCase().includes(selectedTeamFilter.toLowerCase())
        );
      }

      // 2. Search query (Name, Team, Role)
      const q = searchQuery.toLowerCase().trim();
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
  }, [searchQuery, selectedTeamFilter]);

  // Statistics counters (Dynamic unique members & roles count)
  const totalMembers = useMemo(() => new Set(PUBLIC_MEMBERS.map((m) => m.id)).size, []);
  const totalRoles = useMemo(
    () => PUBLIC_MEMBERS.reduce((acc, curr) => acc + curr.memberships.length, 0),
    []
  );

  return (
    <PageBackground id="uyeler-index-root" className="select-none px-0 py-0 min-h-screen flex flex-col">
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
              N'apsak? Topluluk Kadrosu
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight">
              Üyelerimiz
            </h1>

            <p className="text-base sm:text-lg text-[#5F6773] leading-relaxed font-sans font-medium max-w-3xl mx-auto">
              N'apsak? topluluğuna değer katan, farklı alanlarda üreten ve birlikte öğrenen üyelerimiz.
            </p>

            {/* COMMUNITY STATS STRIP */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#EEF0F2] shadow-xs">
                <Users className="w-4 h-4 text-[#0A5C3A]" />
                <span className="text-xs sm:text-sm font-bold text-[#0F1115]">
                  {totalMembers} Topluluk Üyesi
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#EEF0F2] shadow-xs">
                <Layers className="w-4 h-4 text-[#0A5C3A]" />
                <span className="text-xs sm:text-sm font-bold text-[#0F1115]">
                  3 Çalışma Grubu
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#EEF0F2] shadow-xs">
                <Award className="w-4 h-4 text-[#0A5C3A]" />
                <span className="text-xs sm:text-sm font-bold text-[#0F1115]">
                  {totalRoles}+ Görev & Sorumluluk
                </span>
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </Section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <Section padding="none" background="transparent" className="py-8 border-b border-[#EEF0F2]">
        <PageContainer className="max-w-6xl sm:max-w-7xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* TEAM FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none snap-x select-none">
              {MEMBER_TEAMS.map((teamFilter) => {
                const isSelected = selectedTeamFilter === teamFilter;
                return (
                  <button
                    key={teamFilter}
                    onClick={() => setSelectedTeamFilter(teamFilter)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-md shadow-[#0A5C3A]/20"
                        : "bg-white text-[#5F6773] border-[#EEF0F2] hover:border-[#0A5C3A]/40 hover:text-[#0F1115]"
                    }`}
                  >
                    {teamFilter}
                  </button>
                );
              })}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#5F6773] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Üye ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-[#EEF0F2] text-xs sm:text-sm font-medium text-[#0F1115] placeholder-[#5F6773] focus:outline-none focus:border-[#0A5C3A] transition-colors shadow-xs"
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

      {/* 3. MEMBERS GRID SECTION */}
      <Section padding="none" background="transparent" className="py-12 flex-1">
        <PageContainer className="max-w-6xl sm:max-w-7xl space-y-8">
          
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 sm:gap-x-10">
              {filteredMembers.map((member, idx) => (
                <PublicMemberCard
                  key={member.id}
                  member={member}
                  activeFilter={selectedTeamFilter}
                  index={idx}
                  onSelect={(m) => {
                    setSelectedMember(m);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white rounded-[28px] border border-[#EEF0F2] p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-headings text-[#0F1115]">
                Üye Bulunamadı
              </h3>
              <p className="text-xs sm:text-sm text-[#5F6773]">
                Aradığınız kriterlere veya seçili filtreye uygun üyemiz bulunamadı.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTeamFilter("Topluluk Başkanları");
                }}
                className="px-4 py-2 rounded-xl bg-[#0A5C3A] text-white text-xs font-bold hover:bg-[#084A2F] transition-colors inline-block cursor-pointer"
              >
                Filtreleri Temizle
              </button>
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
