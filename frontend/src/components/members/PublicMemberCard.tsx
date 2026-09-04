"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { PublicMember, getInitials, slugifyMemberName } from "../../data/members";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { useLanguage } from "../../context/LanguageContext";


export interface PublicMemberCardProps {
  member: PublicMember;
  activeFilter?: string;
  variant?: "featured" | "compact";
  index?: number;
  onSelect?: (member: PublicMember) => void;
}

export function PublicMemberCard({
  member,
  activeFilter,
  variant = "compact",
  index = 0,
  onSelect,
}: PublicMemberCardProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isEn = language === "en";
  const initials = useMemo(() => getInitials(member.name), [member.name]);

  const isBoardMember = useMemo(() => {
    return Boolean(
      member.isPresident ||
      member.primaryTeam?.toLowerCase().includes("yönetim") ||
      member.primaryTeam?.toLowerCase().includes("danışma") ||
      member.memberships?.some((m) =>
        m.team.toLowerCase().includes("yönetim") || m.team.toLowerCase().includes("danışma")
      )
    );
  }, [member]);

  const handleCardClick = () => {
    if (isBoardMember) {
      const memberSlug = member.slug || slugifyMemberName(member.name);
      router.push(`/ekipler/${memberSlug}`);
    } else if (onSelect) {
      onSelect(member);
    }
  };


  // Compute active role and team tag text based on current context/filter
  const { roleText, teamTagText, isLeaderRole } = useMemo(() => {
    if (member.isPresident) {
      return {
        roleText: isEn ? "Community Co-President" : "Topluluk Eş Başkanı",
        teamTagText: isEn ? "COMMUNITY CO-PRESIDENTS" : "TOPLULUK EŞ BAŞKANLARI",
        isLeaderRole: true,
      };
    }

    if (activeFilter && activeFilter !== "Tümü" && activeFilter !== "Topluluk Eş Başkanları") {
      const matched = member.memberships?.find((m) =>
        m.team.toLowerCase().includes(activeFilter.toLowerCase())
      );
      if (matched) {
        let tag = matched.team.toUpperCase();
        if (matched.subRole) {
          const cleanTeamName = matched.team
            .replace(" Ekibi", "")
            .replace(" Çalışma Grubu", "")
            .replace(" Departmanı", "")
            .trim()
            .toUpperCase();
          tag = `${cleanTeamName} • ${matched.subRole.toUpperCase()}`;
        } else if (matched.isLeader) {
          tag = `${matched.team.toUpperCase()} • ${isEn ? "TEAM LEADER" : "EKİP SORUMLUSU"}`;
        }
        const isLd = Boolean(matched.isLeader || (matched.subRole && matched.subRole.toLowerCase().includes("sorumlus")));
        return {
          roleText: matched.role,
          teamTagText: tag,
          isLeaderRole: isLd,
        };
      }
    }

    const primaryMembership = member.memberships?.[0];
    let tag = primaryMembership
      ? primaryMembership.team.toUpperCase()
      : (member.primaryTeam || "N'APSAK TOPLULUĞU").toUpperCase();

    if (primaryMembership?.subRole) {
      const cleanTeamName = primaryMembership.team
        .replace(" Ekibi", "")
        .replace(" Çalışma Grubu", "")
        .replace(" Departmanı", "")
        .trim()
        .toUpperCase();
      tag = `${cleanTeamName} • ${primaryMembership.subRole.toUpperCase()}`;
    } else if (primaryMembership?.isLeader) {
      tag = `${primaryMembership.team.toUpperCase()} • ${isEn ? "TEAM LEADER" : "EKİP SORUMLUSU"}`;
    }

    const fullRole = primaryMembership?.role || member.primaryRole;
    const isLd = Boolean(
      primaryMembership?.isLeader ||
        (primaryMembership?.subRole && primaryMembership.subRole.toLowerCase().includes("sorumlus"))
    );

    return {
      roleText: fullRole,
      teamTagText: tag,
      isLeaderRole: isLd,
    };
  }, [member, activeFilter, isEn]);

  // FEATURED CARD (Explicitly requested)
  if (variant === "featured") {
    return (
      <div
        onClick={handleCardClick}

        className="group relative flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-[#EEF0F2] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0A5C3A] to-[#07452C] text-white flex items-center justify-center font-headings font-extrabold text-xl tracking-wider mb-4 border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
          {member.avatar ? (
            <ImageWithFallback
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-extrabold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-tight">
          {member.name}
        </h3>
        <p className="text-xs font-semibold text-[#0A5C3A] font-sans mt-1">
          {roleText}
        </p>
        {teamTagText && (
          <span className="mt-3 px-3 py-1 rounded-full bg-[#EEF7F3] text-[10px] font-extrabold text-[#0A5C3A] uppercase tracking-wider">
            {teamTagText}
          </span>
        )}
      </div>
    );
  }

  // COMPACT CARD (Standard Member Card Layout)
  return (
    <div
      onClick={handleCardClick}

      className="group relative flex items-center gap-3.5 rounded-2xl p-3.5 sm:p-4 bg-white border border-[#EEF0F2] hover:border-[#0A5C3A]/40 hover:shadow-sm transition-all duration-300 cursor-pointer select-none min-w-0 w-full text-left"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#07452C] text-white flex items-center justify-center font-headings font-bold text-xs sm:text-sm tracking-wider border-2 border-white shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
        {member.avatar ? (
          <ImageWithFallback
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
        <h4 className="text-sm sm:text-base font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors leading-tight truncate">
          {member.name}
        </h4>

        {roleText ? (
          <p className="text-xs font-semibold text-[#0A5C3A] font-sans truncate">
            {roleText}
          </p>
        ) : null}
        {teamTagText ? (
          <p className="text-[10px] font-extrabold text-[#5F6773] uppercase tracking-wider font-sans truncate">
            {teamTagText}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function PublicMemberPlaceholderCard() {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="relative flex items-center gap-3.5 rounded-2xl p-3.5 sm:p-4 bg-slate-50/60 border-2 border-dashed border-[#DDE7E1] hover:border-[#0A5C3A]/40 transition-all duration-300 select-none min-w-0 w-full text-left">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center border-2 border-white shadow-xs shrink-0">
        <UserPlus className="w-5 h-5 opacity-70" />
      </div>
      <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
        <h4 className="text-sm sm:text-base font-bold font-headings text-slate-700 leading-tight truncate">
          {isEn ? "Board Member" : "Yönetim Kurulu Üyesi"}
        </h4>
        <p className="text-xs font-semibold text-[#0A5C3A]/80 font-sans truncate">
          {isEn ? "Open Position" : "Pozisyon Açık"}
        </p>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-sans truncate">
          {isEn ? "BOARD OF DIRECTORS" : "YÖNETİM KURULU"}
        </p>
      </div>
    </div>
  );
}
